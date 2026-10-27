import React from 'react';
import { AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface DemoNoticeProps {
  compact?: boolean;
  title?: string;
  message?: string;
  variant?: 'info' | 'warning' | 'alert';
}

export const DemoNotice: React.FC<DemoNoticeProps> = ({
  compact = false,
  title,
  message,
  variant = 'info'
}) => {
  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-medium">
        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          {message || 'Phase 1 Frontend Demonstration — Simulation data stored in local browser state'}
        </span>
      </div>
    );
  }

  const borderBg =
    variant === 'warning'
      ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
      : variant === 'alert'
      ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
      : 'bg-slate-900/80 border-slate-800 text-slate-300';

  const iconColor =
    variant === 'warning'
      ? 'text-amber-400 bg-amber-500/10'
      : variant === 'alert'
      ? 'text-rose-400 bg-rose-500/10'
      : 'text-cyan-400 bg-cyan-500/10';

  return (
    <div className={`rounded-xl p-3.5 border shadow-sm flex items-start gap-3 backdrop-blur-md ${borderBg}`}>
      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${iconColor}`}>
        {variant === 'warning' ? (
          <AlertCircle className="w-4 h-4" />
        ) : variant === 'alert' ? (
          <ShieldAlert className="w-4 h-4" />
        ) : (
          <Info className="w-4 h-4" />
        )}
      </div>
      <div className="text-xs leading-relaxed">
        <span className="font-semibold uppercase tracking-wider block mb-0.5 text-slate-200">
          {title || 'College Project Demonstration Environment'}
        </span>
        {message ||
          'All urban assets, failure cascades, and financial impact figures presented in this interface are generated from calibrated causal models for demonstration purposes. State mutations occur in client-side reactive store.'}
      </div>
    </div>
  );
};
