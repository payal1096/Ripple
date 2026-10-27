import React, { useState, useEffect } from 'react';
import {
  GitFork,
  Zap,
  CloudRain,
  Sun,
  CloudLightning,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Info,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { UrbanIssue, CascadePrediction, RainfallScenario } from '../types';
import { CascadeGraphVisualizer } from '../components/CascadeGraphVisualizer';
import { DemoNotice } from '../components/DemoNotice';

interface CascadeExplorerPageProps {
  initialIssueId?: string;
  currentScenario: RainfallScenario;
  onScenarioChange: (scenario: RainfallScenario) => void;
}

export const CascadeExplorerPage: React.FC<CascadeExplorerPageProps> = ({
  initialIssueId,
  currentScenario,
  onScenarioChange
}) => {
  const [issues, setIssues] = useState<UrbanIssue[]>([]);
  const [selectedIssueId, setSelectedIssueId] = useState<string>(initialIssueId || 'ISSUE-001');
  const [prediction, setPrediction] = useState<CascadePrediction | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [maxDepth, setMaxDepth] = useState<number>(5);

  useEffect(() => {
    loadIssues();
  }, []);

  useEffect(() => {
    if (initialIssueId) {
      setSelectedIssueId(initialIssueId);
    }
  }, [initialIssueId]);

  useEffect(() => {
    if (selectedIssueId) {
      runCascadeAnalysis(selectedIssueId, currentScenario, maxDepth);
    }
  }, [selectedIssueId, currentScenario, maxDepth]);

  const loadIssues = async () => {
    try {
      const data = await api.getIssues();
      setIssues(data);
      if (!initialIssueId && data.length > 0) {
        setSelectedIssueId(data[0].issue_id);
      }
    } catch (e) {
      console.error('Failed to load issues', e);
    }
  };

  const runCascadeAnalysis = async (issueId: string, scenario: RainfallScenario, depth: number) => {
    setLoading(true);
    try {
      const pred = await api.analyzeCascade(issueId, scenario, depth);
      setPrediction(pred);
    } catch (e) {
      console.error('Cascade analysis error', e);
    } finally {
      setLoading(false);
    }
  };

  const selectedIssue = issues.find((i) => i.issue_id === selectedIssueId);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span>GRAPH REASONING & RISK PROPAGATION CORE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Cascade Prediction Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Model interconnected urban failure propagation across coupled drainage, roadways, and utility networks.
          </p>
        </div>

        <DemoNotice compact />
      </div>

      {/* Control Workspace Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              1. Select Root Urban Failure Point:
            </label>
            <select
              value={selectedIssueId}
              onChange={(e) => setSelectedIssueId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
            >
              {issues.map((i) => (
                <option key={i.issue_id} value={i.issue_id}>
                  [{i.issue_id}] {i.asset_id} — {i.title} (Severity {i.severity})
                </option>
              ))}
            </select>
            {selectedIssue && (
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {selectedIssue.description}
              </p>
            )}
          </div>

          {/* Trigger Condition Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              2. Atmospheric Trigger Condition:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onScenarioChange('low')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  currentScenario === 'low'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-emerald-400" />
                <span>Low</span>
                <span className="text-[10px] text-slate-500 font-normal">2 mm/h</span>
              </button>

              <button
                onClick={() => onScenarioChange('moderate')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  currentScenario === 'moderate'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 shadow-sm'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CloudRain className="w-4 h-4 text-sky-400" />
                <span>Moderate</span>
                <span className="text-[10px] text-slate-500 font-normal">20 mm/h</span>
              </button>

              <button
                onClick={() => onScenarioChange('heavy')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  currentScenario === 'heavy'
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 shadow-glow-red/20'
                    : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:bg-slate-800'
                }`}
              >
                <CloudLightning className="w-4 h-4 text-rose-400" />
                <span>Heavy</span>
                <span className="text-[10px] text-slate-500 font-normal">65 mm/h</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              {currentScenario === 'heavy'
                ? 'Monsoon cloudburst multiplies culvert surcharging and road sub-base erosion probability by 1.45x.'
                : currentScenario === 'low'
                ? 'Dry atmospheric window suppresses hydraulic runoff triggers.'
                : 'Steady rain maintains baseline hydrological inflow conditions.'}
            </p>
          </div>

          {/* Depth & Simulation Trigger */}
          <div className="space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                <span>Max Propagation Depth:</span>
                <span className="font-mono text-cyan-400">{maxDepth} Hops</span>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={maxDepth}
                onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 Hop (Direct)</span>
                <span>3 Hops (Sub-network)</span>
                <span>6 Hops (Deep Basin)</span>
              </div>
            </div>

            <button
              onClick={() => runCascadeAnalysis(selectedIssueId, currentScenario, maxDepth)}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Calculating Multi-Path Probabilities...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute Cascade Simulation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Cascade Visualization Output */}
      {prediction ? (
        <CascadeGraphVisualizer prediction={prediction} />
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          Select an issue and execute simulation to visualize the cascade path.
        </div>
      )}
    </div>
  );
};
