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

// Custom icons for different alert statuses with better visibility
const sentAlertIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: #FF0000; border: 2px solid white; border-radius: 50%;"></div>
      <div style="position: absolute; color: white; font-weight: bold; font-size: 16px; width: 24px; text-align: center; line-height: 24px;">!</div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const acknowledgedAlertIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: #00AA00; border: 2px solid white; border-radius: 50%;"></div>
      <div style="position: absolute; color: white; font-weight: bold; font-size: 14px; width: 24px; text-align: center; line-height: 24px;">✓</div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const hospitalIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: #FFA500; border: 2px solid white; border-radius: 50%;"></div>
      <div style="position: absolute; color: white; font-weight: bold; font-size: 14px; width: 24px; text-align: center; line-height: 24px;">H</div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const policeIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: #0000FF; border: 2px solid white; border-radius: 50%;"></div>
      <div style="position: absolute; color: white; font-weight: bold; font-size: 14px; width: 24px; text-align: center; line-height: 24px;">P</div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const fireIcon = new L.DivIcon({
  html: `
    <div style="position: relative; width: 24px; height: 24px;">
      <div style="position: absolute; width: 24px; height: 24px; background: #FF4500; border: 2px solid white; border-radius: 50%;"></div>
      <div style="position: absolute; color: white; font-weight: bold; font-size: 14px; width: 24px; text-align: center; line-height: 24px;">F</div>
    </div>
  `,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
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
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="text-yellow-600 animate-pulse">Loading map...</div>
      </div>
    );
  }

  // Default center (India)
  const defaultCenter: [number, number] = [20.5937, 78.9629];
  const defaultZoom = 5;
  
  // Satellite map configuration
  const satelliteLayerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  const satelliteAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  const satelliteOptions = {
    attribution: satelliteAttribution,
    maxNativeZoom: 19,
    maxZoom: 20,
    minZoom: 2
  };
  
  // Street map configuration (will show when zoomed in beyond satellite's maxNativeZoom)
  const streetMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const streetMapAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const streetMapOptions = {
    attribution: streetMapAttribution,
    maxZoom: 20,
    minZoom: 19, // Only show when zoomed in beyond satellite's maxNativeZoom
    zIndex: 1 // Ensure it renders below satellite layer
  };

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
      {/* Satellite Layer */}
      <TileLayer
        url={satelliteLayerUrl}
        {...satelliteOptions}
      />
      
      {/* Street Map Layer (only shows when zoomed in beyond satellite's maxNativeZoom) */}
      <TileLayer
        url={streetMapUrl}
        {...streetMapOptions}
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
          <Popup maxWidth={400} className="[&_.leaflet-popup-content-wrapper]:bg-transparent [&_.leaflet-popup-content]:m-0 [&_.leaflet-popup-tip]:hidden [&_.leaflet-popup-close-button]:text-white [&_.leaflet-popup-close-button]:hover:bg-yellow-400 [&_.leaflet-popup-close-button]:hover:text-black [&_.leaflet-popup-close-button]:transition-colors">
            <div className="p-4 min-w-[280px] max-w-[400px] bg-black/90 border-2 border-yellow-400 rounded-lg shadow-xl">
              <h3 className="font-bold text-lg mb-3 text-yellow-400 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                Emergency Alert
              </h3>
              
              {/* User Details */}
              <div className="space-y-2 text-sm text-white mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-400">Name</p>
                    <p className="font-medium">{alert.user_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="font-medium">{alert.user_phone}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="font-medium">{alert.user_email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Alert Type</p>
                  <p className="font-medium capitalize">{alert.alert_type?.toLowerCase()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    alert.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                    alert.status === 'acknowledged' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(alert.created_at).toLocaleString()}
                </p>
              </div>

              {/* Photos */}
              {(alert.front_photo_url || alert.back_photo_url) && (
                <div className="mt-3 pt-3 border-t-2 border-yellow-400/50">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-yellow-400">PHOTOS</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {alert.front_photo_url && (
                      <div className="group">
                        <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400/20 bg-black/50">
                          <img 
                            src={alert.front_photo_url} 
                            alt="Front camera" 
                            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(alert.front_photo_url!, '_blank');
                              }}
                              className="p-2 bg-yellow-500 rounded-full text-black hover:bg-yellow-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-yellow-400/80 mt-1 text-center">Front View</p>
                      </div>
                    )}
                    {alert.back_photo_url && (
                      <div className="group">
                        <div className="relative overflow-hidden rounded-lg border-2 border-yellow-400/20 bg-black/50">
                          <img 
                            src={alert.back_photo_url} 
                            alt="Back camera" 
                            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(alert.back_photo_url!, '_blank');
                              }}
                              className="p-2 bg-yellow-500 rounded-full text-black hover:bg-yellow-400 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-yellow-400/80 mt-1 text-center">Back View</p>
                      </div>
                    )}
                  </div>
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
              <div className="p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                <h3 className="font-bold text-yellow-400 text-sm">{place.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="text-xs text-gray-300 capitalize">{place.type.replace('_', ' ')}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
