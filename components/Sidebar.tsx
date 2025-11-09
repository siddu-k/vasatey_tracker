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
    <div className="w-80 bg-black/80 backdrop-blur-md h-full flex flex-col border-r border-gray-800/50">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15l-3-3m0 0l3-3m-3 3h6m-6 4h6a2 2 0 002-2V8a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-yellow-400">SATEY</h1>
            <p className="text-xs text-gray-300">Emergency Response System</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-300">Total Alerts</p>
            <p className="text-2xl font-bold text-white">{totalAlerts}</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm p-3 rounded-lg border border-gray-700/50">
            <p className="text-xs text-gray-300">Active Now</p>
            <p className="text-2xl font-bold text-white">{activeAlerts}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status Filter</span>
          <button 
            onClick={() => onStatusFilterChange('all')}
            className="text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            Reset
          </button>
        </div>
        <div className="space-y-2">
          <select 
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
          >
            <option value="all">All Alerts</option>
            <option value="sent">Active Alerts</option>
            <option value="received">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedAlert?.id === alert.id
                ? 'bg-yellow-500/20 border-l-4 border-yellow-500 backdrop-blur-sm'
                : 'bg-gray-800/30 hover:bg-gray-800/50 border-l-4 border-transparent hover:border-yellow-500/30 backdrop-blur-sm'
            }`}
            onClick={() => onSelectAlert(alert)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{alert.user_name}</h3>
                <p className="text-sm text-gray-300 mt-1">
                  {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  alert.status === 'sent'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : alert.status === 'acknowledged'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}
              >
                {alert.status}
              </span>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-200">
                {alert.alert_type && `${alert.alert_type} • `}
                {alert.user_phone}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFindNearbyPlaces(alert);
              }}
              className="mt-3 w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black text-sm font-medium rounded-lg transition-colors shadow-md hover:shadow-yellow-500/30"
            >
              Find Nearby Help
            </button>
          </div>
        ))}
      </div>

      {/* Update Button */}
      <div className="p-4 border-t border-dark-lighter">
        <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-4 rounded transition-colors">
          UPDATE
        </button>
      </div>
    </div>
  );
}
