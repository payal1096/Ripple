import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lightbulb,
  GitFork,
  Zap,
  Shovel,
  SearchAlert,
  Building2,
  Check,
  X,
  Eye,
  Filter,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { ComplaintStatus, IdeaStatus } from '../types/ripple';

export const AdminDashboardPage: React.FC = () => {
  const {
    complaints,
    updateComplaintStatus,
    communityIdeas,
    updateIdeaStatus,
    resources,
    digOnceConflicts,
    silentWards,
    rippleAnalyses,
    currentUser,
    isAdmin,
    toggleAdminDemo
  } = useRipple();

  const [activeAdminTab, setActiveAdminTab] = useState<'complaints' | 'ideas' | 'resources' | 'dig_once' | 'silent_ward'>('complaints');

  // KPI Calculations
  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Rejected').length;
  const highRiskIssues = complaints.filter((c) => c.riskLevel === 'Critical' || c.riskLevel === 'High').length;
  const inProgressComplaints = complaints.filter((c) => c.status === 'In Progress').length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'Resolved').length;
  const pendingCommunityIdeas = communityIdeas.filter((i) => i.status === 'Pending Review').length;
  const potentialRippleRisks = rippleAnalyses.reduce((acc, curr) => acc + curr.possibleConsequences.length, 0);
  const recommendedPreventiveActions = rippleAnalyses.length;

  // Selected complaint for status change modal
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [targetStatus, setTargetStatus] = useState<ComplaintStatus>('In Progress');
  const [statusRemark, setStatusRemark] = useState('');

  // Selected idea for review modal
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [ideaFeedback, setIdeaFeedback] = useState('');

  const handleUpdateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaintId) return;
    updateComplaintStatus(selectedComplaintId, targetStatus, statusRemark.trim() || undefined);
    setSelectedComplaintId(null);
    setStatusRemark('');
  };

  const handleIdeaDecision = (ideaId: string, decision: IdeaStatus, feedback?: string) => {
    updateIdeaStatus(ideaId, decision, feedback);
    setSelectedIdeaId(null);
    setIdeaFeedback('');
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-semibold mb-1">
            <Shield className="w-4 h-4 text-purple-400" />
            <span>MUNICIPAL ADMINISTRATIVE OPERATIONS CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Triage public complaints, moderate community engineering proposals, manage physical asset records, and resolve Dig-Once excavation overlaps.
          </p>
        </div>

        {/* Toggle to Citizen View */}
        <button
          onClick={toggleAdminDemo}
          className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-900/60 flex items-center gap-2 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Switch Back to Citizen View</span>
        </button>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Admin Mode Active"
        message="This console demonstrates municipal administrator triage workflows. Status modifications and idea approvals take effect in the browser's local state. Real backend authorization and authentication will be integrated in Phase 2."
      />

      {/* 8 Required Admin KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Issues</span>
          <span className="text-2xl font-black text-slate-100 font-mono mt-1 block">{totalComplaints}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Open Issues</span>
          <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{openComplaints}</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center">
          <span className="text-[10px] text-rose-300 uppercase font-semibold block">High Risk</span>
          <span className="text-2xl font-black text-rose-400 font-mono mt-1 block">{highRiskIssues}</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 text-center">
          <span className="text-[10px] text-blue-300 uppercase font-semibold block">In Progress</span>
          <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">{inProgressComplaints}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
          <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Resolved</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{resolvedComplaints}</span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-center">
          <span className="text-[10px] text-amber-300 uppercase font-semibold block">Pending Ideas</span>
          <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{pendingCommunityIdeas}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ripple Risks</span>
          <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">{potentialRippleRisks}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center">
          <span className="text-[10px] text-emerald-300 uppercase font-semibold block">Preventive Plans</span>
          <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{recommendedPreventiveActions}</span>
        </div>
      </div>

      {/* Admin Workflow Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <button
          onClick={() => setActiveAdminTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'complaints'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Complaint Triage & Status Dispatch ({complaints.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('ideas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'ideas'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Community Idea Moderation ({pendingCommunityIdeas} Pending)</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('dig_once')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'dig_once'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shovel className="w-3.5 h-3.5" />
          <span>Dig-Once Overlaps ({digOnceConflicts.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('silent_ward')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeAdminTab === 'silent_ward'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SearchAlert className="w-3.5 h-3.5" />
          <span>Inspection Gaps ({silentWards.length})</span>
        </button>
      </div>

      {/* SECTION 1: Complaint Review & Status Management */}
      {activeAdminTab === 'complaints' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Municipal Complaint Triage Queue</span>
              </h2>
              <p className="text-xs text-slate-400">
                Directly transition complaint workflows and update inspection timelines
              </p>
            </div>
            <Link to="/priority-queue" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
              Open Priority Queue →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Ref ID</th>
                  <th className="py-3 px-3">Problem Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Area & City</th>
                  <th className="py-3 px-3">Priority Score</th>
                  <th className="py-3 px-3">Current Status</th>
                  <th className="py-3 px-3 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-purple-300">{c.refId}</td>
                    <td className="py-3.5 px-3 max-w-xs">
                      <div className="font-bold text-slate-100 line-clamp-1">{c.title}</div>
                      <div className="text-[10px] text-slate-400">{c.assignedDepartment}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {c.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-200">
                      {c.area}, {c.city}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">
                      {c.priorityScore}/100
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedComplaintId(c.id);
                          setTargetStatus(c.status);
                        }}
                        className="px-3 py-1 rounded-xl bg-purple-950 text-purple-300 border border-purple-800/50 hover:bg-purple-900/60 font-semibold text-xs transition-all"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: Community Idea Review & Moderation */}
      {activeAdminTab === 'ideas' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Civic Idea Moderation Queue</span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluate community engineering proposals: Approve, Reject, or Select for Implementation
              </p>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
              {pendingCommunityIdeas} Pending Review
            </span>
          </div>

          <div className="space-y-4">
            {communityIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 shadow-md flex flex-wrap md:flex-nowrap items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {idea.problemCategory}
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Target: {idea.problemTitle}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      Status: {idea.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">{idea.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{idea.explanation}</p>

                  <div className="text-xs text-emerald-300 font-semibold pt-1">
                    Expected Benefit: {idea.expectedBenefit}
                  </div>

                  <div className="text-[10px] text-slate-400 font-mono">
                    Submitted by: {idea.submittedByName} ({idea.submittedBy}) on {idea.submittedDate} • {idea.upvotes} Upvotes
                  </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="flex flex-col gap-2 shrink-0 min-w-[170px]">
                  <button
                    onClick={() => handleIdeaDecision(idea.id, 'Approved', 'Approved by municipal engineering dispatch.')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Idea</span>
                  </button>

                  <button
                    onClick={() => handleIdeaDecision(idea.id, 'Selected for Implementation', 'Selected for smart city implementation allocation.')}
                    className="px-3 py-1.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Select for Build</span>
                  </button>

                  <button
                    onClick={() => handleIdeaDecision(idea.id, 'Needs Revision', 'Requires additional structural or budget specification.')}
                    className="px-3 py-1.5 rounded-xl bg-amber-950 text-amber-300 border border-amber-800/50 hover:bg-amber-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Needs Revision</span>
                  </button>

                  <button
                    onClick={() => handleIdeaDecision(idea.id, 'Rejected', 'Incompatible with current municipal code or feasibility.')}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject Idea</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Dig-Once Overlaps Monitor */}
      {activeAdminTab === 'dig_once' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shovel className="w-4 h-4 text-amber-400" />
                <span>Dig-Once Multi-Agency Conflicts Overview</span>
              </h2>
              <p className="text-xs text-slate-400">Active road-cutting collision alerts requiring unified trenching</p>
            </div>
            <Link to="/dig-once" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Open Full Dig-Once Portal →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digOnceConflicts.map((c) => (
              <div key={c.conflictId} className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-amber-400 font-bold">{c.conflictId}</span>
                  <span className="font-mono text-emerald-400 font-bold">Potential Savings: ${c.estimatedDuplicateCost.toLocaleString()}</span>
                </div>
                <div className="font-bold text-slate-100">{c.roadName} ({c.area})</div>
                <p className="text-slate-300 leading-relaxed">{c.recommendedCoordination}</p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Overlapping: {c.overlapStartDate} to {c.overlapEndDate} ({c.overlapDays} days)
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: Silent Ward Inspection Gaps */}
      {activeAdminTab === 'silent_ward' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <SearchAlert className="w-4 h-4 text-cyan-400" />
                <span>Inspection Gap Triage</span>
              </h2>
              <p className="text-xs text-slate-400">Zones requiring scheduled municipal field inspection patrol</p>
            </div>
            <Link to="/silent-ward" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              Open Full Silent Ward Portal →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {silentWards.slice(0, 4).map((w) => (
              <div key={w.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-cyan-400 font-bold">{w.wardCode}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/40">
                    {w.statusLabel}
                  </span>
                </div>
                <div className="font-bold text-slate-100">{w.areaName} ({w.city})</div>
                <p className="text-slate-300 leading-relaxed text-[11px]">{w.flagReason}</p>
                <div className="p-2 rounded-lg bg-cyan-950/20 text-cyan-300 text-[10px]">
                  Next Step: {w.suggestedNextStep}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaint Status Update Modal */}
      {selectedComplaintId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedComplaintId(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Change Demonstration Status</span>
            </h3>

            <form onSubmit={handleUpdateComplaint} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Status</label>
                <select
                  value={targetStatus}
                  onChange={(e: any) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Action Recommended">Action Recommended</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Needs Inspection">Needs Inspection</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Dispatch Note</label>
                <input
                  type="text"
                  value={statusRemark}
                  onChange={(e) => setStatusRemark(e.target.value)}
                  placeholder="e.g. Action crew dispatched with suction unit."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaintId(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
