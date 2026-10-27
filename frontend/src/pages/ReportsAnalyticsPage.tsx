import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsSummary } from '../types';
import { DemoNotice } from '../components/DemoNotice';

export const ReportsAnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAnalyticsSummary();
      setSummary(data);
    } catch (e) {
      console.error('Failed to load analytics', e);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!summary) return;
    const rows = [
      ['Category', 'Total Assets', 'Healthy', 'Warning', 'High Priority', 'Critical'],
      ...summary.resource_health.map((r) => [
        r.category,
        r.total,
        r.healthy,
        r.warning,
        r.high_priority,
        r.critical
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ripple_urban_health_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const COLORS = ['#10B981', '#F59E0B', '#F97316', '#EF4444', '#06B6D4', '#8B5CF6'];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto print:p-0 print:bg-white print:text-black">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL AUDIT & ANALYTICS REPORTING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Urban Analytics & Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Systemic health metrics, cascade prediction trajectories, and infrastructure cost avoidance reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoNotice compact />
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Print View</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-bold">Total Monitored Assets</span>
            <div className="text-2xl font-black text-slate-100 font-mono">{summary.total_assets_tracked}</div>
            <p className="text-[11px] text-slate-400">Across 5 municipal asset classes</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-bold">Active Urban Tickets</span>
            <div className="text-2xl font-black text-amber-400 font-mono">{summary.active_issues_count}</div>
            <p className="text-[11px] text-slate-400">Currently queued in municipal system</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-bold">Preventable Damage Avoidable</span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${summary.estimated_preventable_costs.toLocaleString()}
            </div>
            <p className="text-[11px] text-slate-400">Downstream failure costs prevented</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-xs uppercase text-slate-400 font-bold">Dig-Once Savings Identified</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              ${summary.coordination_savings_summary?.potential_savings?.toLocaleString() || '88,000'}
            </div>
            <p className="text-[11px] text-slate-400">Repeated asphalt cuts avoided</p>
          </div>
        </div>
      )}

      {/* Recharts Analytics Charts */}
      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Resource Condition Breakdown */}
          <div className="rounded-2xl p-5 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">
                Resource Condition Distribution by Category
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Demonstration Data</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.resource_health} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 8 }}
                  />
                  <Legend />
                  <Bar dataKey="healthy" name="Healthy" fill="#10B981" stackId="a" />
                  <Bar dataKey="warning" name="Warning" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="high_priority" name="High Priority" fill="#F97316" stackId="a" />
                  <Bar dataKey="critical" name="Critical" fill="#EF4444" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Issues by Severity Distribution */}
          <div className="rounded-2xl p-5 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">
                Active Issues by Severity Level
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Demonstration Data</span>
            </div>

            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.issues_by_severity}
                    dataKey="count"
                    nameKey="severity"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry: any) => `${entry.severity || entry.name}: ${entry.count || entry.value}`}
                  >
                    {summary.issues_by_severity.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Issues by Ward Distribution */}
          <div className="rounded-2xl p-5 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">
                Issue Concentration by Municipal Ward
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Demonstration Data</span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.issues_by_ward} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="ward" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#1E293B', borderRadius: 8 }}
                  />
                  <Bar dataKey="count" name="Active Tickets" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Cascade Prediction Log */}
          <div className="rounded-2xl p-5 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-200">
                Recent Cascade Simulation History
              </h3>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Demonstration Log</span>
            </div>

            <div className="overflow-y-auto max-h-60 space-y-2">
              {summary.cascade_prediction_history.map((pred, pidx) => (
                <div
                  key={pidx}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-mono text-cyan-400 font-bold">{pred.prediction_id}</span>
                    <h4 className="font-semibold text-slate-200 text-xs mt-0.5">{pred.root_issue}</h4>
                    <span className="text-[10px] text-slate-500 capitalize">Trigger: {pred.scenario} rainfall</span>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-400 font-bold block">{pred.risk_score} Risk</span>
                    <span className="text-emerald-400 font-mono text-[11px]">
                      +${pred.preventable_damage?.toLocaleString()} Saved
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
