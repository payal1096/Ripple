import React, { useState, useEffect } from 'react';
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Zap,
  Lock,
  User,
  Key
} from 'lucide-react';
import { api } from '../services/api';
import { PublicReport } from '../types';
import { DemoNotice } from '../components/DemoNotice';

interface AdminPortalPageProps {
  onSelectIssueForCascade: (issueId: string) => void;
  onNavigate: (page: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onSelectIssueForCascade,
  onNavigate
}) => {
  const [reports, setReports] = useState<PublicReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<PublicReport | null>(null);

  // Status update state
  const [newStatus, setNewStatus] = useState<string>('Under Review');
  const [assignedDept, setAssignedDept] = useState<string>('Stormwater Drainage');
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    Boolean(localStorage.getItem('ripple_auth_token'))
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('ripple@2026');
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminReports();
      setReports(data);
    } catch (e) {
      console.error('Failed to load admin reports', e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await api.loginAdmin(username, password);
      localStorage.setItem('ripple_auth_token', res.access_token);
      setIsAuthenticated(true);
      await loadReports();
    } catch (err: any) {
      setLoginError(err?.response?.data?.detail || 'Invalid login credentials');
    }
  };

  const handleUpdateStatus = async (reportId: string) => {
    try {
      const updated = await api.updateAdminReportStatus(reportId, {
        status: newStatus,
        assigned_department: assignedDept,
        admin_notes: adminNotes
      });
      setSelectedReport(null);
      await loadReports();
    } catch (e) {
      console.error('Error updating status', e);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL OPERATIONS TRIAGE & REPORT DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Citizen Ticket Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review incoming public complaints, evaluate cascade leverage, assign field crews, and update citizen tracking timelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoNotice compact />
          {!isAuthenticated ? (
            <span className="text-xs text-amber-400 font-mono bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
              Demo Admin (admin / ripple@2026)
            </span>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem('ripple_auth_token');
                setIsAuthenticated(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Box if not authenticated */}
      {!isAuthenticated && (
        <div className="rounded-3xl p-6 bg-slate-900/90 border border-cyan-500/30 max-w-md mx-auto space-y-4 shadow-glow-cyan/10">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Command Admin Login</span>
          </div>
          <p className="text-xs text-slate-400">
            Default demonstration credentials are prefilled. Click authenticate to enable full admin permissions.
          </p>

          {loginError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan"
            >
              Authenticate Command Session
            </button>
          </form>
        </div>
      )}

      {/* Reports Table */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200">
            Active Citizen Infrastructure Tickets ({reports.length})
          </h3>
          <span className="text-xs text-slate-400">Click any ticket to triage, assign department, or update status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-3 px-3">Tracking Code</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Title & Location</th>
                <th className="py-3 px-3">Ward</th>
                <th className="py-3 px-3">Assigned Dept</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reports.map((rep) => (
                <tr
                  key={rep.report_id}
                  className="hover:bg-slate-800/30 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedReport(rep);
                    setNewStatus(rep.status);
                    setAssignedDept(rep.assigned_department || 'Stormwater Drainage');
                    setAdminNotes(rep.admin_notes || '');
                  }}
                >
                  <td className="py-3 px-3 font-mono text-cyan-400 font-bold">{rep.tracking_code}</td>
                  <td className="py-3 px-3 font-semibold text-slate-300">{rep.issue_category}</td>
                  <td className="py-3 px-3 max-w-xs">
                    <span className="font-bold text-slate-100 block truncate">{rep.title}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{rep.location_address}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400">{rep.ward_id}</td>
                  <td className="py-3 px-3 text-slate-300">{rep.assigned_department || 'Unassigned'}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      rep.status === 'Resolved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : rep.status === 'In Progress'
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-[11px]">
                      Triage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Triage Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-cyan-400 font-bold">{selectedReport.tracking_code}</span>
                <h3 className="font-bold text-base text-slate-100 mt-1">{selectedReport.title}</h3>
                <p className="text-slate-400 text-xs">{selectedReport.location_address} • {selectedReport.ward_id}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 font-bold">Citizen Description:</span>
              <p className="text-slate-300 leading-relaxed">{selectedReport.description}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-medium"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Assign Responsible Department</label>
                <select
                  value={assignedDept}
                  onChange={(e) => setAssignedDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 font-medium"
                >
                  <option value="Stormwater Drainage">Stormwater Drainage</option>
                  <option value="Roads & Traffic Engineering">Roads & Traffic Engineering</option>
                  <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
                  <option value="Solid Waste Management">Solid Waste Management</option>
                  <option value="Traffic Police & Urban Transit">Traffic Police & Urban Transit</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Internal Operational Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes for field crews (not shown to public citizens)..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => handleUpdateStatus(selectedReport.report_id)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan"
              >
                Save Triage & Update Timeline
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
