'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase, Alert } from '@/lib/supabase';
import { getNearbyPlaces, NearbyPlace } from '@/lib/nearbyPlaces';
import { getGeminiNearbyPlaces, GeminiPlace } from '@/lib/geminiPlaces';
import Sidebar from '@/components/Sidebar';

// Dynamic import for MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-dark-lighter">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

export default function Home() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [geminiPlaces, setGeminiPlaces] = useState<GeminiPlace[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  // Fetch initial alerts
  useEffect(() => {
    fetchAlerts();
  }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('alert_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alert_history',
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newAlert = payload.new as Alert;
            // Only add if within last hour
            const oneHourAgo = new Date();
            oneHourAgo.setHours(oneHourAgo.getHours() - 1);
            if (new Date(newAlert.created_at) >= oneHourAgo) {
              setAlerts((prev) => {
                // Remove any existing alert from the same user (keep only latest)
                const filtered = prev.filter((alert) => alert.user_id !== newAlert.user_id);
                return [newAlert, ...filtered];
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedAlert = payload.new as Alert;
            setAlerts((prev) =>
              prev.map((alert) =>
                alert.id === updatedAlert.id ? updatedAlert : alert
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedAlert = payload.old as Alert;
            setAlerts((prev) =>
              prev.filter((alert) => alert.id !== deletedAlert.id)
            );
          }
        }
      )
      .subscribe();

    // Auto-remove alerts older than 1 hour every minute
    const cleanupInterval = setInterval(() => {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      setAlerts((prev) =>
        prev.filter((alert) => new Date(alert.created_at) >= oneHourAgo)
      );
    }, 60000); // Check every minute

    return () => {
      supabase.removeChannel(channel);
      clearInterval(cleanupInterval);
    };
  }, []);

  async function fetchAlerts() {
    try {
      setLoading(true);
      
      // Calculate timestamp for 1 hour ago
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      
      // Fetch only alerts from the last 1 hour (fresh alerts only)
      const { data, error } = await supabase
        .from('alert_history')
        .select('*')
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        // Filter to show only the latest alert per user within the last hour
        const latestAlerts = data.reduce((acc: Alert[], alert: Alert) => {
          const existingAlert = acc.find((a) => a.user_id === alert.user_id);
          if (!existingAlert) {
            acc.push(alert);
          }
          return acc;
        }, []);

        setAlerts(latestAlerts);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFindNearbyPlaces(alert: Alert) {
    if (!alert.latitude || !alert.longitude) {
      window.alert('No location data available for this alert');
      return;
    }

    setSelectedAlert(alert);
    setShowNearbyPlaces(true);
    setLoadingPlaces(true);
    setGeminiPlaces([]);
    setNearbyPlaces([]); // Clear previous results

    try {
      // Try Gemini AI first
      const geminiResults = await getGeminiNearbyPlaces(alert.latitude, alert.longitude);
      
      if (geminiResults.length > 0) {
        setGeminiPlaces(geminiResults);
        
        // IMPORTANT: Convert GeminiPlace to NearbyPlace for map display
        const placesForMap: NearbyPlace[] = geminiResults.map((p, i) => {
          // A simple regex to extract coordinates if they are in the address
          const coordMatch = p.address.match(/(\-?\d+\.\d+),\s*(\-?\d+\.\d+)/);
          let lat = alert.latitude!;
          let lon = alert.longitude!;

          // A simple way to parse distance
          const distanceMatch = p.distance.match(/(\d+\.?\d*)/);
          const distance = distanceMatch ? parseFloat(distanceMatch[1]) : undefined;

          return {
            id: `gemini-${i}`,
            name: p.name,
            type: p.type,
            lat: lat, // Placeholder, ideally the AI would return coords
            lon: lon, // Placeholder
            distance: distance,
          };
        });
        
        setNearbyPlaces(placesForMap);

      } else {
        // Fallback to Overpass API if Gemini fails or returns no results
        const places = await getNearbyPlaces(alert.latitude, alert.longitude);
        setNearbyPlaces(places);
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      // Fallback on error
      try {
        const places = await getNearbyPlaces(alert.latitude, alert.longitude);
        setNearbyPlaces(places);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    } finally {
      setLoadingPlaces(false);
    }
  }

  function handleSelectAlert(alert: Alert) {
    setSelectedAlert(alert);
    setShowNearbyPlaces(false);
    setNearbyPlaces([]);
    setGeminiPlaces([]);
  }

  const activeAlerts = alerts.filter((alert) => alert.status === 'sent').length;
  
  // Filter alerts based on status filter
  const filteredAlerts = alerts.filter((alert) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'sent') return alert.status === 'sent';
    if (statusFilter === 'received') return alert.status === 'acknowledged' || alert.status === 'resolved';
    return true;
  });

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading emergency alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        alerts={filteredAlerts}
        selectedAlert={selectedAlert}
        onSelectAlert={handleSelectAlert}
        onFindNearbyPlaces={handleFindNearbyPlaces}
        totalAlerts={alerts.length}
        activeAlerts={activeAlerts}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        geminiPlaces={geminiPlaces}
        loadingPlaces={loadingPlaces}
      />
      <div className="flex-1 relative">
        <MapView
          alerts={filteredAlerts}
          selectedAlert={selectedAlert}
          nearbyPlaces={nearbyPlaces}
          showNearbyPlaces={showNearbyPlaces}
        />
        
        {/* Map overlay info */}
        <div className="absolute top-4 right-4 bg-dark/90 backdrop-blur-sm rounded-lg p-4 border border-dark-lighter">
          <div className="text-sm text-gray-300 mb-2">
            <strong>Live Monitor</strong>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Real-time updates active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
