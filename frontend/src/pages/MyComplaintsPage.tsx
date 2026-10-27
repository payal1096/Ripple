import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
  Send,
  ArrowRight,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { Complaint } from '../types/ripple';

export const MyComplaintsPage: React.FC = () => {
  const { complaints, currentUser } = useRipple();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showAllReports, setShowAllReports] = useState(false);

  // Filter complaints matching current user email or name
  const myComplaints = complaints.filter(
    (c) =>
      showAllReports ||
      c.reportedBy.toLowerCase() === currentUser.email.toLowerCase() ||
      c.reportedByName.toLowerCase() === currentUser.name.toLowerCase()
  );

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>CITIZEN SUBMISSION TRACKER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            My Submitted Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Track real-time progress, municipal inspection timestamps, and remediation updates for issues reported under your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAllReports(!showAllReports)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              showAllReports
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {showAllReports ? 'Showing All System Reports' : 'Showing My Submissions Only'}
          </button>

          <Link
            to="/report"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Citizen History"
        message={`Currently signed in as ${currentUser.name} (${currentUser.email}). Showing registered complaints. If you submit a new complaint via the report page, it will automatically appear here with a full status timeline.`}
      />

      {/* Complaints List Table / Empty State */}
      {myComplaints.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-200">No Complaints Logged Yet</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You haven't submitted any municipal complaints under this demonstration profile yet, or your filters are active.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/report"
              className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan"
            >
              Report an Issue Now
            </Link>
            <button
              onClick={() => setShowAllReports(true)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              View All Demonstration Reports
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Reference ID</th>
                <th className="py-3 px-3">Title & Summary</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3">Submission Date</th>
                <th className="py-3 px-3">Current Status</th>
                <th className="py-3 px-3 text-right">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {myComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-cyan-400">{c.refId}</td>

                  <td className="py-3.5 px-3 max-w-sm">
                    <div className="font-bold text-slate-100 line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{c.description}</div>
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

                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400">
                    {c.reportedDate}
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
                          : 'bg-slate-800 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>View Timeline</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Complaint Detail & Vertical Timeline Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-6 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {selectedComplaint.refId}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedComplaint.category}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                  {selectedComplaint.status}
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

            {/* Description & Impact */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Problem Description
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedComplaint.description}</p>
            </div>

            {/* Downstream Impact Alert */}
            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">
                Predicted Downstream Impact
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedComplaint.potentialDownstreamImpact}</p>
            </div>

            {/* Vertical Status Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Vertical Status Timeline & Municipal Updates</span>
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {selectedComplaint.timeline.map((entry, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-[#080E1A]" />
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300 text-xs">{entry.status}</span>
                        <span className="font-mono text-[10px] text-slate-400">{entry.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{entry.note}</p>
                      <div className="text-[10px] text-slate-400 font-mono">Updated by: {entry.updatedBy}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Tracking Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
