import React, { useState } from 'react';
import {
  GitFork,
  AlertTriangle,
  ArrowRight,
  Shield,
  Zap,
  DollarSign,
  CloudRain,
  Sun,
  CloudLightning,
  CheckCircle2,
  Filter,
  Info,
  Clock,
  Building2,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { RiskLevel, RainfallScenario } from '../types/ripple';

export const RippleAnalysisPage: React.FC = () => {
  const { rippleAnalyses, currentScenario, setCurrentScenario } = useRipple();

  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>(rippleAnalyses[0]?.id || '');

  // Filter analyses
  const filteredAnalyses = rippleAnalyses.filter((item) => {
    if (selectedRisk !== 'All' && item.riskLevel !== selectedRisk) {
      return false;
    }
    return true;
  });

  const selectedItem =
    rippleAnalyses.find((a) => a.id === selectedAnalysisId) || filteredAnalyses[0] || rippleAnalyses[0];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <GitFork className="w-4 h-4 text-cyan-400" />
            <span>CAUSAL DOWNSTREAM RISK PROPAGATION ENGINE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Ripple Analysis & Consequence Forecaster
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Examine how a single unresolved urban problem cascades across interdependent municipal systems, and evaluate how timely preventive action halts downstream damage.
          </p>
        </div>

        {/* Weather Scenario Sensitivity Controller */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Weather Trigger:
          </span>
          <button
            onClick={() => setCurrentScenario('low')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              currentScenario === 'low'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3 h-3 text-emerald-400" />
            Dry
          </button>
          <button
            onClick={() => setCurrentScenario('moderate')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              currentScenario === 'moderate'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3 h-3 text-amber-400" />
            Moderate Rain
          </button>
          <button
            onClick={() => setCurrentScenario('heavy')}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              currentScenario === 'heavy'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-glow-red'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudLightning className="w-3 h-3 text-rose-400" />
            Heavy Monsoon
          </button>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Predictive Causal Methodology"
        message="Steps marked as [Confirmed Event] reflect observed field reports. Subsequent steps represent simulated possible downstream consequences estimated by urban infrastructure coupling models under the active weather trigger."
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Filter by Risk Level:</span>
          {['All', 'Critical', 'High', 'Medium'].map((risk) => (
            <button
              key={risk}
              onClick={() => setSelectedRisk(risk)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                selectedRisk === risk
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {risk}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing {filteredAnalyses.length} of {rippleAnalyses.length} ripple models
        </div>
      </div>

      {/* Main Analysis Cards Grid */}
      <div className="space-y-6">
        {filteredAnalyses.map((analysis) => {
          const isSelected = selectedItem?.id === analysis.id;

          // Adjust risk multiplier based on current weather scenario
          const scenarioMultiplier =
            currentScenario === 'heavy' ? 1.4 : currentScenario === 'low' ? 0.7 : 1.0;
          const adjustedAvoidableCost = Math.round(
            analysis.estimatedAvoidableCost * scenarioMultiplier
          );

          return (
            <div
              key={analysis.id}
              onClick={() => setSelectedAnalysisId(analysis.id)}
              className={`p-6 rounded-2xl bg-slate-900/90 border transition-all duration-200 shadow-xl space-y-6 cursor-pointer ${
                isSelected
                  ? 'border-cyan-500/50 shadow-glow-cyan/10 ring-1 ring-cyan-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Card Header: Problem & Resources */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                      RIPPLE MODEL #{analysis.id}
                    </span>
                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        analysis.riskLevel === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                          : analysis.riskLevel === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {analysis.riskLevel} Risk
                    </span>
                    {currentScenario === 'heavy' && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800/40 flex items-center gap-1">
                        <CloudLightning className="w-3 h-3 text-rose-400" />
                        Monsoon Amplified
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-100">
                    <span className="text-slate-400 font-semibold text-xs uppercase tracking-wider block mb-0.5">
                      Reported Problem:
                    </span>
                    {analysis.reportedProblem}
                  </h2>

                  {/* Primary & Related Resources */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Affected Primary Resource
                      </span>
                      <span className="font-mono text-cyan-300 font-semibold mt-0.5 block">
                        {analysis.affectedResource}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Related Coupled Resources ({analysis.relatedResources.length})
                      </span>
                      <div className="text-slate-300 font-medium mt-0.5 space-y-0.5">
                        {analysis.relatedResources.map((res, i) => (
                          <div key={i} className="truncate">• {res}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial KPI */}
                <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-xl text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Estimated Avoidable Cost
                  </span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ${adjustedAvoidableCost.toLocaleString()}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Intervention Urgency: <span className="text-amber-400 font-bold">{analysis.actionUrgency}</span>
                  </div>
                </div>
              </div>

              {/* Horizontal Connected Step Sequence */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                    Causal Downstream Sequence (Problem → Consequences)
                  </span>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500" />
                      Confirmed Origin
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                      Possible Consequence
                    </span>
                  </div>
                </div>

                {/* Horizontal connected cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {analysis.steps.map((step, idx) => (
                    <div
                      key={step.step}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 relative transition-all ${
                        step.isConfirmed
                          ? 'bg-rose-950/30 border-rose-500/40 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800">
                            STEP {step.step}
                          </span>
                          <span
                            className={`text-[9px] font-bold font-mono px-1.5 py-0.2 rounded ${
                              step.isConfirmed
                                ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                                : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                            }`}
                          >
                            {step.isConfirmed ? 'Confirmed' : 'Possible'}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-100">{step.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span className="text-cyan-400/90">{step.affectedDomain}</span>
                        <span>{step.estimatedDelay}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Possible Consequences Breakdown Bullet Points */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Identified Downstream Consequences:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  {analysis.possibleConsequences.map((consequence, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 mt-0.5">•</span>
                      <span>{consequence}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Preventive Action & Explanation Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-950 border border-emerald-500/30 flex flex-wrap lg:flex-nowrap items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Recommended Preventive Action:
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100">
                    {analysis.recommendedPreventiveAction}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    <span className="text-slate-300 font-semibold">Explanation: </span>
                    {analysis.explanationOfRecommendation}
                  </p>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl shrink-0 text-xs space-y-1 min-w-[200px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Coordinating Departments
                  </span>
                  {analysis.coordinatingDepartments.map((dept, i) => (
                    <div key={i} className="text-cyan-300 font-mono text-[11px]">
                      • {dept}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
