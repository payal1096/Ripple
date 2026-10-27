import React, { useState } from 'react';
import {
  Send,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  FileText,
  Shield,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { PublicReport } from '../types';
import { DemoNotice } from '../components/DemoNotice';

export const CitizenPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'report' | 'track'>('report');

  // Report form state
  const [category, setCategory] = useState('Drainage');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [wardId, setWardId] = useState('WARD-01');
  const [locationAddress, setLocationAddress] = useState('');
  const [severity, setSeverity] = useState('2');
  const [latitude, setLatitude] = useState('19.0660');
  const [longitude, setLongitude] = useState('72.8672');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<PublicReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Tracking state
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedReport, setTrackedReport] = useState<PublicReport | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setSubmissionSuccess(null);

    try {
      const res = await api.submitPublicReport({
        issue_category: category,
        title: title.trim(),
        description: description.trim(),
        ward_id: wardId,
        location_address: locationAddress.trim() || 'BKC Main Junction, Mumbai',
        latitude: parseFloat(latitude) || 19.066,
        longitude: parseFloat(longitude) || 72.8672,
        severity: parseInt(severity) || 2
      });
      setSubmissionSuccess(res);
      // Reset form
      setTitle('');
      setDescription('');
      setLocationAddress('');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.detail || 'Failed to submit report. Please check input requirements.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;
    setTrackingLoading(true);
    setTrackingError(null);
    setTrackedReport(null);

    try {
      const rep = await api.trackReport(trackingInput.trim());
      setTrackedReport(rep);
    } catch (err: any) {
      setTrackingError(err?.response?.data?.detail || 'No report found with this reference code.');
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300 text-xs font-bold">
          <Send className="w-3.5 h-3.5 text-cyan-400" />
          <span>Citizen Municipal Engagement Portal</span>
        </div>
        <h1 className="text-3xl font-black text-slate-100 tracking-tight">
          Public Issue Reporting & Tracking
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          Report road damage, clogged drains, leaking water mains, or waste overflows directly to municipal command.
        </p>
      </div>

      <DemoNotice compact />

      {/* Tabs */}
      <div className="flex rounded-2xl bg-slate-900 border border-slate-800 p-1.5 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'report'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Submit New Report
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'track'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-glow-cyan'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Track Report Status
        </button>
      </div>

      {/* Tab 1: Submit Report */}
      {activeTab === 'report' && (
        <div className="rounded-3xl p-6 lg:p-8 bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl space-y-6">
          {submissionSuccess && (
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Report Successfully Logged in Urban Command Database!</span>
              </div>
              <p className="text-slate-300">
                Your report has been queued for field department triage and connected-resource cascade modeling.
              </p>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-slate-400">Your Tracking Reference Code:</span>
                <span className="text-base font-black text-cyan-400 tracking-wider">
                  {submissionSuccess.tracking_code}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Keep this code to track dispatch status and resolution progress.
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200"
                >
                  <option value="Drainage">Drainage (Clogging, Overflow)</option>
                  <option value="Road Damage">Road Damage (Potholes, Subsidence)</option>
                  <option value="Waste">Waste (Uncollected Bin, Garbage Accumulation)</option>
                  <option value="Water Leakage">Water Leakage (Pipe Burst, Sub-base Seepage)</option>
                  <option value="Parking">Parking (Illegal Parking, Obstruction)</option>
                  <option value="Traffic Obstruction">Traffic Obstruction</option>
                  <option value="Other">Other Urban Infrastructure Problem</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Municipal Ward</label>
                <select
                  value={wardId}
                  onChange={(e) => setWardId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200"
                >
                  <option value="WARD-01">WARD-01 (BKC Urban Complex)</option>
                  <option value="WARD-02">WARD-02 (Dadar Central)</option>
                  <option value="WARD-03">WARD-03 (Dharavi Transit)</option>
                  <option value="WARD-04">WARD-04 (Bandra West)</option>
                  <option value="WARD-05">WARD-05 (Kurla Sub-basin)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Issue Title</label>
              <input
                type="text"
                placeholder="e.g. Major drain blockage spilling onto roadway near BKC Gate 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Detailed Description</label>
              <textarea
                rows={3}
                placeholder="Describe what you observed, surrounding landmarks, and potential risks (e.g. water entering residential stalls)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Location Address</label>
                <input
                  type="text"
                  placeholder="Street / Junction name"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Longitude (approx)</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Latitude (approx)</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-bold block mb-1">Citizen Perceived Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-slate-200"
              >
                <option value="1">Level 1 - Minor cosmetic defect</option>
                <option value="2">Level 2 - Mild localized nuisance</option>
                <option value="3">Level 3 - Warning (May cause waterlogging or traffic bottleneck)</option>
                <option value="4">Level 4 - Severe infrastructure disruption</option>
                <option value="5">Level 5 - Critical safety hazard / imminent flooding</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-glow-cyan flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting to Municipal Command...' : 'Submit Citizen Report'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Track Report */}
      {activeTab === 'track' && (
        <div className="rounded-3xl p-6 lg:p-8 bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-2xl space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Enter Your Unique Report Tracking Code or ID:
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g. RPL-2026-K7M9Q or REP-2026-001"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                required
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 font-mono text-sm focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={trackingLoading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-cyan shrink-0"
              >
                <Search className="w-4 h-4" />
                <span>{trackingLoading ? 'Searching...' : 'Track Ticket'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Demo tracking codes available: <code className="text-cyan-400 font-mono">RPL-2026-K7M9Q</code>, <code className="text-cyan-400 font-mono">RPL-2026-B4T2W</code>
            </p>
          </form>

          {trackingError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs">
              {trackingError}
            </div>
          )}

          {trackedReport && (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5 text-xs">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-bold">{trackedReport.tracking_code}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{trackedReport.ward_id}</span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base mt-1">
                    {trackedReport.title}
                  </h3>
                  <p className="text-slate-400 mt-0.5">{trackedReport.location_address}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Status</span>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold font-mono">
                    {trackedReport.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-bold">Category & Details:</span>
                <p className="text-slate-300 leading-relaxed">
                  {trackedReport.description}
                </p>
              </div>

              {/* Resolution Timeline */}
              <div className="space-y-3 pt-2">
                <span className="text-slate-300 font-bold uppercase tracking-wider text-[11px] block">
                  Municipal Action Timeline
                </span>
                <div className="space-y-3 pl-2 border-l-2 border-cyan-500/40">
                  {trackedReport.timeline && trackedReport.timeline.map((item, idx) => (
                    <div key={idx} className="relative pl-4 space-y-0.5">
                      <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-950" />
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">{item.status}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
