'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Alert } from '@/lib/supabase';
import { NearbyPlace } from '@/lib/nearbyPlaces';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icons for different alert statuses
const sentAlertIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDI4IDE2IDhDMTYgOCAwIDI4IDE2IDQ4WiIgZmlsbD0iI0VGNDQ0NCIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNFRjQ0NDQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj4hPC90ZXh0Pgo8L3N2Zz4=',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const acknowledgedAlertIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDI4IDE2IDhDMTYgOCAwIDI4IDE2IDQ4WiIgZmlsbD0iIzEwYjk4MSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMGI5ODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj7inJM8L3RleHQ+Cjwvc3ZnPg==',
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

const hospitalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDI4IDE2IDhDMTYgOCAwIDI4IDE2IDQ4WiIgZmlsbD0iIzEwYjk4MSIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMxMGI5ODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj4rPC90ZXh0Pgo8L3N2Zz4=',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

const policeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDI4IDE2IDhDMTYgOCAwIDI4IDE2IDQ4WiIgZmlsbD0iIzM4NjNmZiIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzODYzZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5QPC90ZXh0Pgo8L3N2Zz4=',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

const fireIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDI4IDE2IDhDMTYgOCAwIDI4IDE2IDQ4WiIgZmlsbD0iI2Y5NzMxNiIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSIxNiIgeT0iMjAiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiNmOTczMTYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5GPC90ZXh0Pgo8L3N2Zz4=',
  iconSize: [28, 42],
  iconAnchor: [14, 42],
  popupAnchor: [0, -42],
});

interface MapViewProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  nearbyPlaces: NearbyPlace[];
  showNearbyPlaces: boolean;
}

function MapController({ selectedAlert }: { selectedAlert: Alert | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedAlert && selectedAlert.latitude && selectedAlert.longitude) {
      map.setView([selectedAlert.latitude, selectedAlert.longitude], 14, {
        animate: true,
      });
    }
  }, [selectedAlert, map]);

  return null;
}

export default function MapView({ alerts, selectedAlert, nearbyPlaces, showNearbyPlaces }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-lighter">
        <div className="text-gray-400">Loading map...</div>
      </div>
    );
  }

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;

  // Get valid alerts with coordinates
  const validAlerts = alerts.filter(
    (alert) => alert.latitude !== null && alert.longitude !== null
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      
      <MapController selectedAlert={selectedAlert} />

      {/* Render alert markers */}
      {validAlerts.map((alert) => {
        // Choose icon based on status: red for sent, green for acknowledged/resolved
        const alertIcon = alert.status === 'sent' ? sentAlertIcon : acknowledgedAlertIcon;
        
        return (
        <Marker
          key={alert.id}
          position={[alert.latitude!, alert.longitude!]}
          icon={alertIcon}
        >
          <Popup maxWidth={400}>
            <div className="p-2 min-w-[250px] max-w-[400px]">
              <h3 className="font-bold text-lg mb-3 text-red-400">
                🚨 Emergency Alert
              </h3>
              
              {/* User Details */}
              <div className="space-y-1 text-sm mb-3">
                <p><strong>Name:</strong> {alert.user_name}</p>
                <p><strong>Phone:</strong> {alert.user_phone}</p>
                <p><strong>Email:</strong> {alert.user_email}</p>
                <p><strong>Type:</strong> {alert.alert_type}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                    alert.status === 'sent' ? 'bg-red-500' :
                    alert.status === 'acknowledged' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}>
                    {alert.status}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>

              {/* Photos */}
              {(alert.front_photo_url || alert.back_photo_url) && (
                <div className="mt-3 border-t border-gray-600 pt-3">
                  <p className="text-xs font-semibold mb-2 text-gray-300">📸 PHOTOS:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {alert.front_photo_url && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Front Camera</p>
                        <img 
                          src={alert.front_photo_url} 
                          alt="Front camera" 
                          className="w-full h-24 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(alert.front_photo_url!, '_blank')}
                        />
                      </div>
                    )}
                    {alert.back_photo_url && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Back Camera</p>
                        <img 
                          src={alert.back_photo_url} 
                          alt="Back camera" 
                          className="w-full h-24 object-cover rounded border border-gray-600 cursor-pointer hover:opacity-80"
                          onClick={() => window.open(alert.back_photo_url!, '_blank')}
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">Click image to view full size</p>
                </div>
              )}
            </div>
          </Popup>
        </Marker>
        );
      })}

      {/* Render nearby places if enabled */}
      {showNearbyPlaces && nearbyPlaces.map((place) => {
        let icon = hospitalIcon;
        if (place.type === 'police') icon = policeIcon;
        if (place.type === 'fire_station') icon = fireIcon;

        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lon]}
            icon={icon}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold mb-1">{place.name}</h3>
                <p className="text-sm capitalize">{place.type.replace('_', ' ')}</p>
                {place.distance && (
                  <p className="text-xs text-gray-400 mt-1">
                    {place.distance.toFixed(2)} km away
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
