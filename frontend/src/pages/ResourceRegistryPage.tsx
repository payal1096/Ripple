import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { ResourceItem, AssetType, AssetCondition } from '../types/ripple';

export const ResourceRegistryPage: React.FC = () => {
  const { resources, addResource, updateResource, deleteResource, currentUser } = useRipple();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetType>('drain');
  const [city, setCity] = useState(currentUser.city || 'Mumbai');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [condition, setCondition] = useState<AssetCondition>('healthy');
  const [lastInspection, setLastInspection] = useState('2026-10-15');
  const [nextInspectionDue, setNextInspectionDue] = useState('2026-11-20');
  const [responsibleDept, setResponsibleDept] = useState('Stormwater Drainage Department');
  const [operationalStatus, setOperationalStatus] = useState('Fully operational');
  const [notes, setNotes] = useState('');

  const categoryOptions: { label: string; value: AssetType }[] = [
    { label: 'Drains', value: 'drain' },
    { label: 'Roads', value: 'road' },
    { label: 'Waste Collection Points', value: 'waste_point' },
    { label: 'Water Pipelines', value: 'water_pipeline' },
    { label: 'Parking Areas', value: 'parking' },
    { label: 'Streetlights', value: 'streetlight' },
    { label: 'Public Infrastructure', value: 'public_infrastructure' }
  ];

  const handleOpenAddModal = () => {
    setEditingResource(null);
    setName('');
    setCategory('drain');
    setCity(currentUser.city || 'Mumbai');
    setArea('');
    setLandmark('');
    setCondition('healthy');
    setLastInspection(new Date().toISOString().split('T')[0]);
    setNextInspectionDue('2026-11-30');
    setResponsibleDept('Stormwater Drainage Department');
    setOperationalStatus('Operational under standard parameters');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (res: ResourceItem) => {
    setEditingResource(res);
    setName(res.name);
    setCategory(res.category);
    setCity(res.city);
    setArea(res.area);
    setLandmark(res.landmark || '');
    setCondition(res.condition);
    setLastInspection(res.lastInspection);
    setNextInspectionDue(res.nextInspectionDue);
    setResponsibleDept(res.responsibleDept);
    setOperationalStatus(res.operationalStatus);
    setNotes(res.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) return;

    if (editingResource) {
      updateResource(editingResource.id, {
        name,
        category,
        city,
        area,
        landmark,
        condition,
        lastInspection,
        nextInspectionDue,
        responsibleDept,
        operationalStatus,
        notes
      });
    } else {
      addResource({
        name,
        category,
        city,
        area,
        landmark,
        condition,
        lastInspection,
        nextInspectionDue,
        relatedComplaintsCount: 0,
        responsibleDept,
        operationalStatus,
        notes
      });
    }
    setIsModalOpen(false);
  };

  // Filtered list
  const filteredResources = resources.filter((res) => {
    if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
    if (selectedCondition !== 'All' && res.condition !== selectedCondition) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        res.name.toLowerCase().includes(q) ||
        res.resourceId.toLowerCase().includes(q) ||
        res.area.toLowerCase().includes(q) ||
        res.city.toLowerCase().includes(q) ||
        (res.landmark && res.landmark.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL ASSET INVENTORY & TELEMETRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Urban Resource Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Central registry of physical urban infrastructure tracked for condition, maintenance cycles, and coupled ripple vulnerability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Resource</span>
        </button>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Resource Registry"
        message="This registry indexes drains, roads, waste points, water mains, lighting pillars, and public assets. Adding or modifying records mutates local demonstration store."
      />

      {/* Search & Filter Controls */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource by name, code (e.g. RES-DRN-042), locality..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Health Conditions</option>
              <option value="healthy">Healthy</option>
              <option value="warning">Warning</option>
              <option value="high_priority">High Priority</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-slate-400 text-xs font-semibold uppercase mr-1">Categories:</span>
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Resources ({resources.length})
          </button>
          {categoryOptions.map((cat) => {
            const count = resources.filter((r) => r.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Resource Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Asset ID & Name</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Location & Landmark</th>
              <th className="py-3 px-3">Condition</th>
              <th className="py-3 px-3">Last Inspection</th>
              <th className="py-3 px-3">Linked Issues</th>
              <th className="py-3 px-3">Responsible Agency</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredResources.map((res) => (
              <tr key={res.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-mono text-[10px] text-cyan-400 font-bold">{res.resourceId}</div>
                  <div className="font-bold text-slate-100 max-w-xs">{res.name}</div>
                  {res.notes && (
                    <div className="text-[10px] text-slate-400 truncate max-w-xs">{res.notes}</div>
                  )}
                </td>

                <td className="py-3.5 px-3">
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {res.category.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <div className="font-medium text-slate-200">{res.area}</div>
                  <div className="text-[10px] text-slate-400">{res.city} {res.landmark ? `• ${res.landmark}` : ''}</div>
                </td>

                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold capitalize ${
                      res.condition === 'healthy'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                        : res.condition === 'warning'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : res.condition === 'high_priority'
                        ? 'bg-orange-950 text-orange-300 border border-orange-800/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-800/50'
                    }`}
                  >
                    {res.condition.replace('_', ' ')}
                  </span>
                </td>

                <td className="py-3.5 px-3 font-mono text-slate-300">
                  <div>{res.lastInspection}</div>
                  <div className="text-[10px] text-slate-400">Due: {res.nextInspectionDue}</div>
                </td>

                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono font-bold">
                    {res.relatedComplaintsCount} complaints
                  </span>
                </td>

                <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                  {res.responsibleDept}
                </td>

                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEditModal(res)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${res.name} from demonstration registry?`)) {
                          deleteResource(res.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors"
                      title="Delete Resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                {editingResource ? `EDIT ${editingResource.resourceId}` : 'NEW REGISTRY ENTRY'}
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                {editingResource ? 'Update Urban Resource Record' : 'Register New Urban Infrastructure Resource'}
              </h2>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Resource Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bandra Stormwater Culvert 4A"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Current Condition *</label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="healthy">Healthy (Nominal)</option>
                    <option value="warning">Warning (Supervision Required)</option>
                    <option value="high_priority">High Priority (Action Needed)</option>
                    <option value="critical">Critical (Immediate Hazard)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Area / Locality *</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Bandra West"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Landmark</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Station Gate"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Last Inspection Date</label>
                  <input
                    type="date"
                    value={lastInspection}
                    onChange={(e) => setLastInspection(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Responsible Department</label>
                  <input
                    type="text"
                    value={responsibleDept}
                    onChange={(e) => setResponsibleDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operational Description / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Structural condition, diameter, capacity specifications, etc."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan"
                >
                  {editingResource ? 'Save Modifications' : 'Add to Demonstration Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
