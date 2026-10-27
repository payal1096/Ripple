import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trendPct?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  status?: 'normal' | 'warning' | 'danger' | 'success';
  description?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  trendPct,
  trendDirection = 'neutral',
  status = 'normal',
  description,
  onClick
}) => {
  const statusStyles = {
    normal: 'border-slate-800 hover:border-slate-700 bg-slate-900/70',
    warning: 'border-amber-500/30 hover:border-amber-500/50 bg-slate-900/80 shadow-glow-amber/10',
    danger: 'border-rose-500/30 hover:border-rose-500/50 bg-slate-900/80 shadow-glow-red/10',
    success: 'border-emerald-500/30 hover:border-emerald-500/50 bg-slate-900/80'
  };

  const iconColors = {
    normal: 'text-cyan-400 bg-cyan-950/40 border-cyan-800/40',
    warning: 'text-amber-400 bg-amber-950/40 border-amber-800/40',
    danger: 'text-rose-400 bg-rose-950/40 border-rose-800/40',
    success: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 border transition-all duration-300 backdrop-blur-md relative overflow-hidden group ${
        statusStyles[status]
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      {/* Background ambient gradient glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-slate-400">{unit}</span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl border shrink-0 ${iconColors[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trendPct !== undefined || description) && (
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
          {description && (
            <span className="text-slate-400 truncate max-w-[200px]" title={description}>
              {description}
            </span>
          )}

          {trendPct !== undefined && (
            <div
              className={`flex items-center gap-1 font-semibold ml-auto ${
                trendDirection === 'up'
                  ? 'text-rose-400'
                  : trendDirection === 'down'
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            >
              {trendDirection === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendDirection === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trendDirection === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              <span>{Math.abs(trendPct)}% vs prior</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
