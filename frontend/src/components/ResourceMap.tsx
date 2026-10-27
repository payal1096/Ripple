import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Filter,
  Search,
  Layers,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Zap,
  DollarSign,
  Activity
} from 'lucide-react';
import { UrbanAsset, UrbanIssue, AssetType, AssetCondition } from '../types';

interface ResourceMapProps {
  assets: UrbanAsset[];
  issues?: UrbanIssue[];
  onSelectIssue?: (issueId: string) => void;
  selectedAssetId?: string;
  onAssetClick?: (asset: UrbanAsset) => void;
  height?: string;
}

// Center view controller
const ChangeMapView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const ResourceMap: React.FC<ResourceMapProps> = ({
  assets,
  issues = [],
  onSelectIssue,
  selectedAssetId,
  onAssetClick,
  height = '600px'
}) => {
  const [selectedAsset, setSelectedAsset] = useState<UrbanAsset | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Default Mumbai Coordinates
  const defaultCenter: [number, number] = [19.055, 72.855];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultCenter);
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  // Set selected asset if provided from parent
  useEffect(() => {
    if (selectedAssetId) {
      const found = assets.find((a) => a.asset_id === selectedAssetId);
      if (found) {
        setSelectedAsset(found);
        if (found.location?.coordinates) {
          setMapCenter([found.location.coordinates[1], found.location.coordinates[0]]);
        }
      }
    }
  }, [selectedAssetId, assets]);

  // Color mapping by condition
  const getSeverityColor = (condition: AssetCondition, severity: number): string => {
    if (condition === 'critical' || severity >= 5) return '#EF4444'; // Red
    if (condition === 'high_priority' || severity === 4) return '#F97316'; // Orange
    if (condition === 'warning' || severity >= 3) return '#F59E0B'; // Yellow/Amber
    return '#10B981'; // Emerald Green (Healthy)
  };

  // Create custom neon divIcon
  const createAssetMarkerIcon = (asset: UrbanAsset, isSelected: boolean) => {
    const color = getSeverityColor(asset.condition, asset.severity);
    const pulseRing = isSelected || asset.severity >= 4 ? `box-shadow: 0 0 16px ${color};` : '';

    const iconHtml = `
      <div style="
        position: relative;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(15, 23, 42, 0.95);
        border: 2px solid ${color};
        border-radius: 9999px;
        ${pulseRing}
        transform: translate(-50%, -50%);
        transition: all 0.2s ease;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: ${color};
        "></div>
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: 'custom-asset-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Filter assets
  const filteredAssets = assets.filter((asset) => {
    if (typeFilter !== 'all' && asset.asset_type !== typeFilter) return false;
    if (severityFilter !== 'all') {
      const sevNum = parseInt(severityFilter);
      if (asset.severity !== sevNum) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(q);
      const matchId = asset.asset_id.toLowerCase().includes(q);
      const matchWard = asset.ward_id.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchWard) return false;
    }
    return true;
  });

  // Calculate connection polylines for currently selected asset
  const connectionLines: [number, number][][] = [];
  if (selectedAsset && selectedAsset.connected_assets?.length) {
    const startCoord: [number, number] = [
      selectedAsset.location.coordinates[1],
      selectedAsset.location.coordinates[0],
    ];
    for (const targetId of selectedAsset.connected_assets) {
      const targetAsset = assets.find((a) => a.asset_id === targetId);
      if (targetAsset && targetAsset.location?.coordinates) {
        const endCoord: [number, number] = [
          targetAsset.location.coordinates[1],
          targetAsset.location.coordinates[0],
        ];
        connectionLines.push([startCoord, endCoord]);
      }
    }
  }

  // Active issue for selected asset
  const activeIssue = selectedAsset
    ? issues.find((i) => i.asset_id === selectedAsset.asset_id)
    : null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#080E1A] shadow-xl">
      {/* Top Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Search & Filters (Interactive) */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-800 shadow-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search asset, ID, or ward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-slate-700/60 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Asset Types</option>
            <option value="road">Roads</option>
            <option value="drain">Drains</option>
            <option value="waste_point">Waste Catchments</option>
            <option value="water_pipeline">Water Pipelines</option>
            <option value="parking">Parking Reserves</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severity</option>
            <option value="1">Level 1 - Healthy</option>
            <option value="2">Level 2 - Mild</option>
            <option value="3">Level 3 - Warning</option>
            <option value="4">Level 4 - High Priority</option>
            <option value="5">Level 5 - Critical</option>
          </select>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg pointer-events-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
            <span className="text-slate-300">High Priority</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-slate-300">Critical</span>
          </div>
        </div>
      </div>

      {/* React Leaflet Map */}
      <div style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <ChangeMapView center={mapCenter} zoom={zoomLevel} />

          {/* CartoDB Dark Matter Tiles (OpenStreetMap data) */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & CartoDB'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* Connected Asset Dependency Polylines */}
          {connectionLines.map((line, idx) => (
            <Polyline
              key={`conn-${idx}`}
              positions={line}
              pathOptions={{
                color: '#06B6D4',
                weight: 3,
                dashArray: '6, 8',
                opacity: 0.85,
              }}
            />
          ))}

          {/* Asset Markers */}
          {filteredAssets.map((asset) => {
            const isSelected = selectedAsset?.asset_id === asset.asset_id;
            const coord: [number, number] = [
              asset.location.coordinates[1],
              asset.location.coordinates[0],
            ];

            return (
              <Marker
                key={asset.asset_id}
                position={coord}
                icon={createAssetMarkerIcon(asset, isSelected)}
                eventHandlers={{
                  click: () => {
                    setSelectedAsset(asset);
                    if (onAssetClick) onAssetClick(asset);
                  },
                }}
              >
                <Popup className="dark-popup">
                  <div className="p-1 space-y-1.5 text-xs">
                    <div className="font-bold text-slate-100 flex items-center justify-between gap-2">
                      <span>{asset.name}</span>
                      <span className="text-[10px] font-mono px-1 rounded bg-slate-800 text-cyan-300">
                        {asset.asset_id}
                      </span>
                    </div>
                    <p className="text-slate-400 capitalize">{asset.asset_type.replace('_', ' ')}</p>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${getSeverityColor(asset.condition, asset.severity)}20`,
                          color: getSeverityColor(asset.condition, asset.severity),
                        }}
                      >
                        {asset.condition.toUpperCase()} (Lvl {asset.severity})
                      </span>
                      <span className="text-slate-400 text-[11px]">{asset.ward_id}</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Selected Asset Slide-out Drawer */}
      {selectedAsset && (
        <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-5 shadow-2xl z-[1001] space-y-4 max-h-[80%] overflow-y-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                {selectedAsset.asset_id}
              </span>
              <h3 className="font-bold text-slate-100 text-base mt-1">
                {selectedAsset.name}
              </h3>
              <p className="text-xs text-slate-400 capitalize">
                {selectedAsset.asset_type.replace('_', ' ')} • {selectedAsset.ward_id}
              </p>
            </div>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-slate-400 hover:text-slate-200 p-1"
            >
              ✕
            </button>
          </div>

          {/* Condition & Severity Status */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Condition</span>
              <span
                className="font-bold capitalize text-sm"
                style={{ color: getSeverityColor(selectedAsset.condition, selectedAsset.severity) }}
              >
                {selectedAsset.condition}
              </span>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Severity Score</span>
              <span className="font-bold text-sm text-slate-200">
                Level {selectedAsset.severity} / 5
              </span>
            </div>
          </div>

          {/* Active Issue */}
          {activeIssue ? (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-600/40 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Active Threat: {activeIssue.title}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeIssue.description}
              </p>
              {onSelectIssue && (
                <button
                  onClick={() => onSelectIssue(activeIssue.issue_id)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Simulate Cascade Consequence</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>No critical active tickets logged for this asset.</span>
            </div>
          )}

          {/* Connected Assets */}
          {selectedAsset.connected_assets?.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">
                Coupled Infrastructure Assets ({selectedAsset.connected_assets.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedAsset.connected_assets.map((cid) => (
                  <span
                    key={cid}
                    className="text-xs px-2 py-1 rounded bg-slate-800/80 text-cyan-300 border border-slate-700 font-mono"
                  >
                    {cid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
