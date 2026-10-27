import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Layers,
  Filter,
  RefreshCw,
  Search,
  ArrowRight
} from 'lucide-react';
import { ResourceMap } from '../components/ResourceMap';
import { api } from '../services/api';
import { UrbanAsset, UrbanIssue, AssetType, AssetCondition } from '../types';
import { DemoNotice } from '../components/DemoNotice';

interface MapExplorerPageProps {
  onSelectIssueForCascade: (issueId: string) => void;
  onNavigate: (page: string) => void;
}

export const MapExplorerPage: React.FC<MapExplorerPageProps> = ({
  onSelectIssueForCascade,
  onNavigate
}) => {
  const [assets, setAssets] = useState<UrbanAsset[]>([]);
  const [issues, setIssues] = useState<UrbanIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddAssetOpen, setIsAddAssetOpen] = useState<boolean>(false);

  // New asset form
  const [newAssetId, setNewAssetId] = useState('');
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<AssetType>('drain');
  const [newWardId, setNewWardId] = useState('WARD-01');
  const [newLng, setNewLng] = useState('72.8675');
  const [newLat, setNewLat] = useState('19.0665');
  const [newCondition, setNewCondition] = useState<AssetCondition>('healthy');
  const [newSeverity, setNewSeverity] = useState('1');

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    setLoading(true);
    try {
      const [assetData, issueData] = await Promise.all([
        api.getAssets({ limit: 200 }),
        api.getIssues({ limit: 100 })
      ]);
      setAssets(assetData);
      setIssues(issueData);
    } catch (e) {
      console.error('Failed to load map data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAsset({
        asset_id: newAssetId || `ASSET-${Date.now().toString().slice(-4)}`,
        name: newAssetName || `Demonstration ${newAssetType}`,
        asset_type: newAssetType,
        ward_id: newWardId,
        location: {
          type: 'Point',
          coordinates: [parseFloat(newLng) || 72.868, parseFloat(newLat) || 19.066]
        },
        condition: newCondition,
        severity: parseInt(newSeverity) || 1,
        connected_assets: ['DRAIN-001']
      });
      setIsAddAssetOpen(false);
      await loadMapData();
    } catch (e) {
      console.error('Failed to add asset', e);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>GEOSPATIAL INFRASTRUCTURE TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Interactive Urban Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Displaying physical urban assets across Roads, Storm Drains, Waste Catchments, Water Feeder Mains, and Parking Facilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoNotice compact />
          <button
            onClick={() => setIsAddAssetOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-cyan"
          >
            <Plus className="w-4 h-4" />
            <span>Register Asset</span>
          </button>
        </div>
      </div>

      {/* Main Full-Size Map */}
      <ResourceMap
        assets={assets}
        issues={issues}
        onSelectIssue={(issueId) => {
          onSelectIssueForCascade(issueId);
          onNavigate('cascade');
        }}
        height="720px"
      />

      {/* Asset Registration Modal */}
      {isAddAssetOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddAsset}
            className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-base">Register Urban Asset</h3>
              <button
                type="button"
                onClick={() => setIsAddAssetOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Asset ID</label>
                <input
                  type="text"
                  placeholder="e.g. DRAIN-005"
                  value={newAssetId}
                  onChange={(e) => setNewAssetId(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Asset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bandra North Cross Box Drain"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Resource Category</label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as AssetType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="drain">Storm Drain</option>
                    <option value="road">Road Corridor</option>
                    <option value="waste_point">Waste Catchment</option>
                    <option value="water_pipeline">Water Pipeline</option>
                    <option value="parking">Parking Reserve</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Ward</label>
                  <select
                    value={newWardId}
                    onChange={(e) => setNewWardId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="WARD-01">WARD-01 (BKC)</option>
                    <option value="WARD-02">WARD-02 (Dadar)</option>
                    <option value="WARD-03">WARD-03 (Dharavi)</option>
                    <option value="WARD-04">WARD-04 (Bandra W)</option>
                    <option value="WARD-05">WARD-05 (Kurla)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newLng}
                    onChange={(e) => setNewLng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newLat}
                    onChange={(e) => setNewLat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Condition</label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as AssetCondition)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="warning">Warning</option>
                    <option value="high_priority">High Priority</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Severity (1-5)</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  >
                    <option value="1">Level 1 (Healthy)</option>
                    <option value="2">Level 2 (Mild)</option>
                    <option value="3">Level 3 (Warning)</option>
                    <option value="4">Level 4 (Severe)</option>
                    <option value="5">Level 5 (Critical)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan"
              >
                Register & Save to MongoDB
              </button>
              <button
                type="button"
                onClick={() => setIsAddAssetOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
