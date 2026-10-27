import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Eye,
  X,
  Send,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { Complaint, ComplaintStatus, RiskLevel } from '../types/ripple';

export const ComplaintManagementPage: React.FC = () => {
  const { complaints, updateComplaintStatus, currentUser } = useRipple();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');

  // Selected complaint for details drawer/modal
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Status update form state inside drawer
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('Under Review');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const cities = ['All', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR'];
  const categories = ['All', 'Drainage', 'Roads', 'Water Supply', 'Waste Management', 'Streetlights', 'Parking', 'Public Infrastructure'];
  const allStatuses: ComplaintStatus[] = [
    'Submitted',
    'Under Review',
    'Action Recommended',
    'In Progress',
    'Needs Inspection',
    'Resolved',
    'Rejected'
  ];
  const risks: ('All' | RiskLevel)[] = ['All', 'Critical', 'High', 'Medium', 'Low'];

  const filteredComplaints = complaints.filter((c) => {
    if (selectedCity !== 'All' && c.city !== selectedCity) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (selectedRisk !== 'All' && c.riskLevel !== selectedRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.refId.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenDetails = (c: Complaint) => {
    setSelectedComplaint(c);
    setNewStatus(c.status);
    setStatusNote('');
  };

  const handleApplyStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setIsUpdating(true);
    updateComplaintStatus(selectedComplaint.id, newStatus, statusNote.trim() || undefined);
    // Update local drawer complaint
    setSelectedComplaint((prev) =>
      prev
        ? {
            ...prev,
            status: newStatus,
            timeline: [
              ...prev.timeline,
              {
                status: newStatus,
                timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
                note: statusNote.trim() || `Status updated to ${newStatus}.`,
                updatedBy: currentUser.name
              }
            ]
          }
        : null
    );
    setStatusNote('');
    setIsUpdating(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL TRIAGE & WORKFLOW DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Complaint Management & Triage
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Review reported urban issues, assign maintenance priorities, and execute demonstration status transitions.
          </p>
        </div>

        <div className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-3 py-1.5 rounded-xl border border-cyan-800/40">
          Total in System: {complaints.length} Records
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Status Modification"
        message="Status changes applied in this interface update the reactive demonstration store and simulate automated citizen timeline updates. No permanent changes are committed to a remote database."
      />

      {/* Filter Controls Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ref ID, title, area..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* City filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>City: {city}</option>
              ))}
            </select>
          </div>

          {/* Category filter */}
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

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Statuses</option>
              {allStatuses.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Risk Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold uppercase text-[11px] mr-1">Risk Filter:</span>
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

          <div className="text-slate-400 font-mono text-[11px]">
            Filtered Results: {filteredComplaints.length}
          </div>
        </div>
      </div>

      {/* Complaint Table */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-3">Ref ID</th>
              <th className="py-3 px-3">Complaint Title</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">City & Area</th>
              <th className="py-3 px-3">Risk Level</th>
              <th className="py-3 px-3">Current Status</th>
              <th className="py-3 px-3">Reported By</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {filteredComplaints.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">{c.refId}</td>

                <td className="py-3.5 px-3 max-w-xs">
                  <div className="font-bold text-slate-100 line-clamp-1">{c.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.landmark || c.locationAddress}</div>
                </td>

                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {c.category}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <div className="font-medium text-slate-200">{c.area}</div>
                  <div className="text-[10px] text-slate-400">{c.city}</div>
                </td>

                <td className="py-3.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                      c.riskLevel === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : c.riskLevel === 'High'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {c.riskLevel}
                  </span>
                </td>

                <td className="py-3.5 px-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                        : c.status === 'In Progress'
                        ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
                        : c.status === 'Action Recommended'
                        ? 'bg-purple-950/80 text-purple-300 border-purple-700/60'
                        : c.status === 'Rejected'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-slate-300">
                  <div className="font-medium">{c.reportedByName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{c.reportedDate.split(' ')[0]}</div>
                </td>

                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => handleOpenDetails(c)}
                    className="px-3 py-1 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 font-semibold text-xs transition-all inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Complaint Details & Status Update Modal/Drawer */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-3xl w-full space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {selectedComplaint.refId}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {selectedComplaint.category}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      selectedComplaint.riskLevel === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {selectedComplaint.riskLevel} Risk
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100 mt-2">
                  {selectedComplaint.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedComplaint.locationAddress}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Priority Score</span>
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {selectedComplaint.priorityScore}/100
                </span>
              </div>
            </div>

            {/* Description & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Reported Observation
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedComplaint.description}</p>
                <div className="text-[10px] text-slate-400 pt-2 font-mono">
                  Reported by: {selectedComplaint.reportedByName} on {selectedComplaint.reportedDate}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-400 block">
                  Predicted Downstream Threat
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedComplaint.potentialDownstreamImpact}</p>
                <div className="text-[10px] text-emerald-400 pt-2 font-semibold">
                  Action: {selectedComplaint.recommendedAction}
                </div>
              </div>
            </div>

            {/* Vertical Status Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Status History & Dispatch Audit Timeline</span>
              </h3>

              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {selectedComplaint.timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-1 shrink-0 ring-4 ring-cyan-950" />
                    <div className="flex-1 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-300">{item.status}</span>
                        <span className="font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px]">{item.note}</p>
                      <div className="text-[10px] text-slate-400 mt-0.5">By: {item.updatedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status Interface */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-cyan-400" />
                  <span>Update Demonstration Complaint Status</span>
                </span>
                <span className="text-[10px] text-amber-400 font-mono">Frontend State Only</span>
              </div>

              <form onSubmit={handleApplyStatusUpdate} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">New Status</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-400 font-medium mb-1">Status Note / Dispatch Remarks</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="e.g. Field crew deployed to inspect culvert."
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan shrink-0 transition-all"
                    >
                      Apply Update
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close Details Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
