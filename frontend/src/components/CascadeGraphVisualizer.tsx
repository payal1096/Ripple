import React from 'react';
import {
  ArrowRight,
  Clock,
  Percent,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  TrendingUp,
  CloudRain,
  DollarSign
} from 'lucide-react';
import { CascadePrediction, DownstreamImpactNode, InterventionRecommendation } from '../types';

interface CascadeGraphVisualizerProps {
  prediction: CascadePrediction;
}

export const CascadeGraphVisualizer: React.FC<CascadeGraphVisualizerProps> = ({ prediction }) => {
  const getAssetBadgeColor = (type: string) => {
    switch (type) {
      case 'drain':
        return 'border-sky-500/40 text-sky-300 bg-sky-950/40';
      case 'road':
        return 'border-blue-500/40 text-blue-300 bg-blue-950/40';
      case 'waste_point':
        return 'border-amber-500/40 text-amber-300 bg-amber-950/40';
      case 'water_pipeline':
        return 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40';
      case 'parking':
        return 'border-purple-500/40 text-purple-300 bg-purple-950/40';
      default:
        return 'border-slate-500/40 text-slate-300 bg-slate-950/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Header Banner */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0B1528] border border-cyan-500/30 shadow-glow-cyan/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                CASCADE RUN #{prediction.prediction_id}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Weather Trigger:
              </span>
              <span className="text-xs font-bold text-amber-300 capitalize px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/40 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5" />
                {prediction.rainfall_scenario} Rainfall
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 mt-2">
              {prediction.root_title}
            </h2>
            <p className="text-xs text-slate-400">
              Root Origin: <span className="font-mono text-cyan-400">{prediction.root_asset_id}</span> • Graph Traversal Depth: {prediction.downstream_nodes.length} downstream assets coupled
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Cascade Risk Score</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {prediction.total_cascade_risk_score} / 100
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Preventable Damage</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ${prediction.potential_damage_prevented.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Cascade Chain Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Interconnected Consequence Propagation Chain
          </h3>
          <span className="text-xs text-slate-400">
            Noisy-OR Multi-path Propagation Model
          </span>
        </div>

        <div className="relative overflow-x-auto pb-4">
          <div className="flex items-stretch gap-4 min-w-[750px]">
            {/* 1. Root Issue Node */}
            <div className="w-72 shrink-0 rounded-2xl p-4 bg-slate-900 border-2 border-rose-500 shadow-glow-red/20 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    STAGE 0: ROOT ORIGIN
                  </span>
                  <span className="text-xs text-rose-400 font-bold">100% Active</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-100 mt-2">
                  {prediction.root_asset_id}
                </h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-3">
                  {prediction.root_title}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Immediate Threat</span>
                <span className="text-rose-400 font-bold font-mono">Delay: 0.0h</span>
              </div>
            </div>

            {/* Directed Chain Arrow */}
            <div className="flex flex-col items-center justify-center shrink-0 text-cyan-400">
              <ArrowRight className="w-6 h-6 animate-pulse" />
              <span className="text-[10px] text-slate-500 font-mono mt-1">Cascades</span>
            </div>

            {/* 2. Downstream Consequence Nodes */}
            {prediction.downstream_nodes.map((node, index) => {
              const probPct = Math.round(node.probability * 100);
              const isHighRisk = probPct >= 70;

              return (
                <React.Fragment key={node.asset_id}>
                  <div className={`w-72 shrink-0 rounded-2xl p-4 bg-slate-900 border ${
                    isHighRisk ? 'border-amber-500/60 shadow-glow-amber/10' : 'border-slate-800'
                  } space-y-3 flex flex-col justify-between transition-all hover:border-cyan-500/60`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${getAssetBadgeColor(node.asset_type)}`}>
                          Stage {index + 1}: {node.asset_type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-300">
                          <Percent className="w-3 h-3 text-cyan-400" />
                          <span>{probPct}% Prob</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm text-slate-100 mt-2">
                        {node.asset_name}
                      </h4>
                      <p className="text-xs text-amber-200/90 mt-1 leading-snug">
                        {node.predicted_issue}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Expected Delay
                        </span>
                        <span className="font-mono font-bold text-slate-200">
                          +{node.cumulative_delay_hours}h
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-400" />
                          Estimated Damage
                        </span>
                        <span className="font-mono font-bold text-rose-400">
                          ${node.preventable_damage_estimate.toLocaleString()}
                        </span>
                      </div>

                      {/* Trigger factors */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {node.trigger_factors.map((t, tidx) => (
                          <span key={tidx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {index < prediction.downstream_nodes.length - 1 && (
                    <div className="flex flex-col items-center justify-center shrink-0 text-cyan-500/60">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommended Interventions Panel */}
      <div className="rounded-2xl p-5 bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-emerald-400" />
            Recommended Preventive Actions & Leverage Points
          </h3>
          <span className="text-xs text-emerald-400 font-semibold">
            High Benefit-to-Cost Interventions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prediction.interventions.map((intv) => (
            <div
              key={intv.intervention_id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                    Priority #{intv.priority_rank} • {intv.urgency}
                  </span>
                  <h4 className="font-bold text-sm text-slate-100 mt-1">
                    {intv.action_name}
                  </h4>
                  <span className="text-xs text-cyan-400">{intv.department}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">BCR Ratio</span>
                  <span className="text-lg font-black text-emerald-400 font-mono">
                    {intv.benefit_cost_ratio}x
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {intv.rationale}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">Intervention Cost</span>
                  <span className="font-mono font-bold text-slate-200">
                    ${intv.estimated_cost.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">Downstream Damage Averted</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${intv.prevented_damage.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
