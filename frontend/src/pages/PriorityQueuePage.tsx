import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpDown,
  Search,
  Filter,
  AlertTriangle,
  ArrowRight,
  Info,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  Zap,
  HelpCircle,
  Eye,
  X
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { Complaint } from '../types/ripple';

export const PriorityQueuePage: React.FC = () => {
  const { complaints, currentScenario } = useRipple();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'severity' | 'date'>('score_desc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedComplaintForModal, setSelectedComplaintForModal] = useState<Complaint | null>(null);

  const categories = ['All', 'Drainage', 'Roads', 'Water Supply', 'Waste Management', 'Streetlights', 'Parking', 'Public Infrastructure'];
  const statuses = ['All', 'Submitted', 'Under Review', 'Action Recommended', 'In Progress', 'Needs Inspection', 'Resolved'];
  const risks = ['All', 'Critical', 'High', 'Medium', 'Low'];

  // Filter & Sort
  const filteredComplaints = complaints.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (selectedRisk !== 'All' && c.riskLevel !== selectedRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.refId.toLowerCase().includes(q) ||
        c.locationAddress.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  filteredComplaints.sort((a, b) => {
    if (sortBy === 'score_desc') return b.priorityScore - a.priorityScore;
    if (sortBy === 'score_asc') return a.priorityScore - b.priorityScore;
    if (sortBy === 'severity') return b.severity - a.severity;
    if (sortBy === 'date') return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
    return 0;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <ArrowUpDown className="w-4 h-4 text-cyan-400" />
            <span>PREDICTIVE DISPATCH & RESOURCE OPTIMIZATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Municipal Priority Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Prioritize urban interventions by potential downstream failure risks rather than mere chronological filing order.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'cards' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Card Cards
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Priority Scoring Engine"
        message="The predictive priority score (1-100) integrates reported severity with predicted downstream consequences, weather forecast intensity, and citizen density. Click any score badge to view the formula breakdown."
      />

      {/* Search & Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, reference ID..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Sort By Dropdown */}
          <div>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="score_desc">Sort: Priority Score (High → Low)</option>
              <option value="score_asc">Sort: Priority Score (Low → High)</option>
              <option value="severity">Sort: Raw Severity</option>
              <option value="date">Sort: Most Recently Reported</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Filter Chips: Status & Risk */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Risk Level:</span>
            {risks.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRisk === r
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold text-[11px] uppercase">Status:</span>
            {['All', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            Showing {filteredComplaints.length} prioritized records
          </div>
        </div>
      </div>

      {/* Main Content: Table or Cards View */}
      {viewMode === 'table' ? (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Ref ID & Title</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Potential Downstream Impact</th>
                <th className="py-3 px-3">Recommended Next Action</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredComplaints.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Priority Score with click to view explanation */}
                  <td className="py-3.5 px-3">
                    <button
                      onClick={() => setSelectedComplaintForModal(c)}
                      className={`px-2.5 py-1 rounded-xl font-mono font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        c.priorityScore >= 90
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40 hover:bg-rose-900/50'
                          : c.priorityScore >= 75
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/40 hover:bg-amber-900/50'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/50'
                      }`}
                      title="Click to view scoring algorithm calculation"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{c.priorityScore}</span>
                    </button>
                  </td>

                  {/* Ref ID & Title */}
                  <td className="py-3.5 px-3">
                    <div className="font-mono text-[10px] text-cyan-400">{c.refId}</div>
                    <div className="font-bold text-slate-100 max-w-xs line-clamp-1">{c.title}</div>
                  </td>

                  {/* Location */}
                  <td className="py-3.5 px-3">
                    <div className="font-medium text-slate-200">{c.area}</div>
                    <div className="text-[10px] text-slate-400">{c.city}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {c.category}
                    </span>
                  </td>

                  {/* Potential Downstream Impact */}
                  <td className="py-3.5 px-3 max-w-sm">
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {c.potentialDownstreamImpact}
                    </p>
                  </td>

                  {/* Recommended Action */}
                  <td className="py-3.5 px-3 max-w-xs">
                    <div className="text-[11px] text-emerald-300 font-semibold line-clamp-2">
                      {c.recommendedAction}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                      {c.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedComplaintForModal(c)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>Score</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">{c.refId}</span>
                    <h3 className="text-sm font-bold text-slate-100 mt-1 line-clamp-2">{c.title}</h3>
                  </div>
                  <button
                    onClick={() => setSelectedComplaintForModal(c)}
                    className={`px-2.5 py-1 rounded-xl font-mono font-black text-xs shrink-0 flex items-center gap-1 ${
                      c.priorityScore >= 90
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                        : c.priorityScore >= 75
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>{c.priorityScore}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {c.category}
                  </span>
                  <span className="text-slate-400 text-[11px] font-medium">
                    {c.area}, {c.city}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Downstream Cascade Threat:
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {c.potentialDownstreamImpact}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                    Recommended Next Action:
                  </span>
                  <p className="text-xs text-emerald-200 font-medium leading-relaxed">
                    {c.recommendedAction}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
                  {c.status}
                </span>
                <button
                  onClick={() => setSelectedComplaintForModal(c)}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>Scoring Explanation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accessible Priority Scoring Explanation Modal */}
      {selectedComplaintForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedComplaintForModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {selectedComplaintForModal.refId}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedComplaintForModal.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-1">
                {selectedComplaintForModal.title}
              </h2>
            </div>

            {/* Score Highlight Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Predictive Priority Score
                </span>
                <p className="text-xs text-slate-300 mt-0.5">
                  Calculated using causal propagation weighting
                </p>
              </div>
              <div className="text-3xl font-black font-mono text-cyan-400">
                {selectedComplaintForModal.priorityScore} / 100
              </div>
            </div>

            {/* Accessible Explanation Breakdown */}
            <div className="space-y-3 text-xs">
              <h3 className="font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-cyan-400" />
                Score Calculation Rationale:
              </h3>
              <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedComplaintForModal.priorityExplanation}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Reported Severity</span>
                  <span className="text-slate-200 font-bold">{selectedComplaintForModal.severity} / 5</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Weather Trigger Weight</span>
                  <span className="text-cyan-300 font-bold capitalize">{currentScenario} Scenario</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Assigned Department</span>
                  <span className="text-slate-200 font-bold">{selectedComplaintForModal.assignedDepartment}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Community Suggestions</span>
                  <span className="text-emerald-300 font-bold">{selectedComplaintForModal.communityIdeasCount} Ideas Submitted</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedComplaintForModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
