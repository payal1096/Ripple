import React, { useState } from 'react';
import {
  SearchAlert,
  Info
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { SilentWardRecord } from '../types/ripple';

export const SilentWardPage: React.FC = () => {
  const { silentWards } = useRipple();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWards = silentWards.filter((w) => {
    if (selectedFilter !== 'All' && w.statusLabel !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        w.areaName.toLowerCase().includes(q) ||
        w.wardCode.toLowerCase().includes(q) ||
        w.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status: SilentWardRecord['statusLabel']) => {
    switch (status) {
      case 'Potential Inspection Gap':
        return 'bg-rose-950 text-rose-300 border-rose-800/50';
      case 'Insufficient Reporting Data':
        return 'bg-amber-950 text-amber-300 border-amber-800/50';
      case 'Further Assessment Recommended':
        return 'bg-orange-950 text-orange-300 border-orange-800/50';
      case 'Normal Coverage':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <SearchAlert className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL BLINDSPOT DETECTION & DATA COMPLETENESS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Silent Ward & Inspection Gap Detector
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Detect urban areas with uncharacteristically low reporting volumes where physical infrastructure decay may be accumulating undetected.
          </p>
        </div>

        <div className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          Analyzed: {silentWards.length} Municipal Zones
        </div>
      </div>

      {/* Demo Notice with Cautious Analysis Methodology */}
      <DemoNotice
        compact={false}
        title="Cautious Analytical Methodology"
        message="A low complaint volume alone does not prove municipal neglect. The Silent Ward algorithm correlates digital reporting frequency with population density, asset age, and time elapsed since on-site physical engineering inspections to flag areas warranting further assessment."
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold uppercase mr-1">Status Classification:</span>
          {['All', 'Potential Inspection Gap', 'Insufficient Reporting Data', 'Further Assessment Recommended', 'Normal Coverage'].map((label) => (
            <button
              key={label}
              onClick={() => setSelectedFilter(label)}
              className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                selectedFilter === label
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ward or locality..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Silent Ward Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWards.map((ward) => (
          <div
            key={ward.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-950 text-cyan-400 border border-slate-800">
                    {ward.wardCode}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 mt-1">
                    {ward.areaName}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {ward.city} • Population ~{(ward.populationEstimate / 1000).toFixed(0)}k
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border shrink-0 text-center ${getStatusBadge(
                    ward.statusLabel
                  )}`}
                >
                  {ward.statusLabel}
                </span>
              </div>

              {/* Data Completeness Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Data Completeness:</span>
                  <span className={`font-bold ${ward.dataCompleteness < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {ward.dataCompleteness}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${ward.dataCompleteness}%` }}
                    className={`h-full rounded-full ${
                      ward.dataCompleteness < 50 ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Complaints (90d)</span>
                  <span className="text-sm font-bold text-slate-100">{ward.complaintCount}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Inspections Logged</span>
                  <span className="text-sm font-bold text-slate-100">{ward.recordedInspections}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Last Inspected</span>
                  <span className="text-[11px] font-bold text-slate-200 truncate block">{ward.lastInspectionDate}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">Unresolved Issues</span>
                  <span className="text-sm font-bold text-amber-400">{ward.knownOutstandingProblems}</span>
                </div>
              </div>

              {/* Explanation Why Flagged */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-amber-400 block flex items-center gap-1">
                  <Info className="w-3 h-3 text-amber-400" />
                  Why This Area Is Flagged:
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {ward.flagReason}
                </p>
              </div>

              {/* Critical Assets at Risk */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Coupled Assets Under Scrutiny:
                </span>
                <div className="flex flex-wrap gap-1">
                  {ward.criticalAssetsAtRisk.map((asset, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                    >
                      {asset}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested Next Step Box */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                  Suggested Municipal Next Step:
                </span>
                <p className="text-slate-200 font-medium text-[11px] leading-relaxed">
                  {ward.suggestedNextStep}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
