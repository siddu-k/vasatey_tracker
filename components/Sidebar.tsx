'use client';

import { Alert } from '@/lib/supabase';
import { GeminiPlace } from '@/lib/geminiPlaces';
import { formatDistanceToNow } from 'date-fns';

interface SidebarProps {
  alerts: Alert[];
  selectedAlert: Alert | null;
  onSelectAlert: (alert: Alert) => void;
  onFindNearbyPlaces: (alert: Alert) => void;
  totalAlerts: number;
  activeAlerts: number;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  geminiPlaces: GeminiPlace[];
  loadingPlaces: boolean;
}

export default function Sidebar({
  alerts,
  selectedAlert,
  onSelectAlert,
  onFindNearbyPlaces,
  totalAlerts,
  activeAlerts,
  statusFilter,
  onStatusFilterChange,
  geminiPlaces,
  loadingPlaces,
}: SidebarProps) {
  return (
    <div className="w-80 bg-dark h-full flex flex-col border-r border-dark-lighter">
      {/* Header */}
      <div className="p-6 border-b border-dark-lighter">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">VASATEYSEC</h1>
            <p className="text-xs text-gray-400">Emergency Monitor</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-dark-lighter rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{totalAlerts}</div>
            <div className="text-xs text-gray-400">Total Alerts</div>
          </div>
          <div className="bg-dark-lighter rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">{activeAlerts}</div>
            <div className="text-xs text-gray-400">Active</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-dark-lighter">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-300">STATUS FILTER</span>
          <button 
            onClick={() => onStatusFilterChange('all')}
            className="text-xs text-primary hover:text-primary-dark"
          >
            RESET
          </button>
        </div>
        <div className="space-y-2">
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-dark-lighter border border-dark-lighter rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
          >
            <option value="all">All Alerts</option>
            <option value="sent">Sent (Red)</option>
            <option value="received">Received (Green)</option>
          </select>
        </div>
      </div>

      {/* Alert List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="text-sm font-semibold text-gray-300 mb-3">
            RECENT ALERTS ({alerts.length})
          </div>
          <div className="space-y-2">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-sm">No alerts yet</p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className={`bg-dark-lighter rounded-lg p-3 cursor-pointer transition-all hover:bg-dark-lighter/80 border-2 ${
                    selectedAlert?.id === alert.id
                      ? 'border-primary'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        alert.status === 'sent' ? 'bg-red-500 animate-pulse' :
                        alert.status === 'acknowledged' ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`} />
                      <span className="font-semibold text-sm text-white">
                        {alert.user_name}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      alert.status === 'sent' ? 'bg-red-500/20 text-red-400' :
                      alert.status === 'acknowledged' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-400 mb-2">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{alert.user_phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}</span>
                    </div>
                    {alert.latitude && alert.longitude && (
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                      </div>
                    )}
                  </div>

                  {alert.latitude && alert.longitude && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFindNearbyPlaces(alert);
                        }}
                        className="w-full mt-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 px-3 rounded transition-colors flex items-center justify-center gap-1"
                        disabled={loadingPlaces && selectedAlert?.id === alert.id}
                      >
                        {loadingPlaces && selectedAlert?.id === alert.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Find Nearby Places
                          </>
                        )}
                      </button>
                      
                      {/* Show nearby places if this alert is selected and places are loaded */}
                      {selectedAlert?.id === alert.id && geminiPlaces.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="text-xs font-semibold text-gray-300 mb-2">NEARBY PLACES:</div>
                          {geminiPlaces.map((place, index) => (
                            <div key={index} className="bg-dark rounded p-2 text-xs">
                              <div className="flex items-start gap-2">
                                <div className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 ${
                                  place.type === 'hospital' ? 'bg-green-500' :
                                  place.type === 'police' ? 'bg-blue-500' :
                                  'bg-orange-500'
                                }`}>
                                  {place.type === 'hospital' ? '🏥' :
                                   place.type === 'police' ? '🚓' : '🚒'}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold text-white">{place.name}</div>
                                  <div className="text-gray-400 mt-1">{place.address}</div>
                                  <div className="text-primary mt-1">📞 {place.phone}</div>
                                  <div className="text-gray-500 text-xs mt-1">📍 {place.distance}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="p-4 border-t border-dark-lighter">
        <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-4 rounded transition-colors">
          UPDATE
        </button>
      </div>
    </div>
  );
}
