import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Filter,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Building2,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';

export const AnalyticsPage: React.FC = () => {
  const { complaints, resources, rippleAnalyses, currentUser, currentScenario } = useRipple();

  const [selectedCity, setSelectedCity] = useState('All');
  const [timeRange, setTimeRange] = useState('6m');

  const filteredComplaints = complaints.filter(
    (c) => selectedCity === 'All' || c.city === selectedCity
  );

  // 1. Complaints by Category
  const categoryCounts: Record<string, number> = {};
  filteredComplaints.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });
  const complaintsByCategoryData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat,
    complaints: count
  }));

  // 2. Complaints by Status
  const statusCounts: Record<string, number> = {};
  filteredComplaints.forEach((c) => {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  });
  const complaintsByStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  }));

  const statusColors = ['#0EA5E9', '#06B6D4', '#8B5CF6', '#F59E0B', '#F97316', '#10B981', '#EF4444'];

  // 3. Complaints Over Time
  const complaintsOverTimeData = [
    { period: 'May 2026', total: 14, resolved: 10, cascadesPrevented: 6 },
    { period: 'Jun 2026', total: 22, resolved: 18, cascadesPrevented: 11 },
    { period: 'Jul 2026', total: 38, resolved: 28, cascadesPrevented: 24 },
    { period: 'Aug 2026', total: 49, resolved: 39, cascadesPrevented: 31 },
    { period: 'Sep 2026', total: 31, resolved: 29, cascadesPrevented: 18 },
    { period: 'Oct 2026 (Active)', total: filteredComplaints.length + 15, resolved: 16, cascadesPrevented: 21 }
  ];

  // 4. Risk Level Distribution
  const riskCounts = {
    Critical: filteredComplaints.filter((c) => c.riskLevel === 'Critical').length,
    High: filteredComplaints.filter((c) => c.riskLevel === 'High').length,
    Medium: filteredComplaints.filter((c) => c.riskLevel === 'Medium').length,
    Low: filteredComplaints.filter((c) => c.riskLevel === 'Low').length
  };
  const riskData = [
    { level: 'Critical', count: riskCounts.Critical, fill: '#EF4444' },
    { level: 'High', count: riskCounts.High, fill: '#F97316' },
    { level: 'Medium', count: riskCounts.Medium, fill: '#F59E0B' },
    { level: 'Low', count: riskCounts.Low || 1, fill: '#10B981' }
  ];

  // 5. Resolved vs Unresolved
  const resolvedCount = filteredComplaints.filter((c) => c.status === 'Resolved').length;
  const unresolvedCount = filteredComplaints.length - resolvedCount;
  const resolutionData = [
    { name: 'Resolved', value: resolvedCount, color: '#10B981' },
    { name: 'Unresolved / In Progress', value: unresolvedCount, color: '#0EA5E9' }
  ];

  // 6. Frequently Reported Areas
  const areaCounts: Record<string, number> = {};
  filteredComplaints.forEach((c) => {
    areaCounts[c.area] = (areaCounts[c.area] || 0) + 1;
  });
  const topAreasData = Object.entries(areaCounts)
    .map(([area, count]) => ({ area, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 7. Preventive Actions by Category
  const preventiveByCategory = [
    { category: 'Drainage', actionsCount: 4, costSavingsThousands: 145 },
    { category: 'Water Supply', actionsCount: 2, costSavingsThousands: 95 },
    { category: 'Roads', actionsCount: 3, costSavingsThousands: 68 },
    { category: 'Streetlights', actionsCount: 2, costSavingsThousands: 28 },
    { category: 'Solid Waste', actionsCount: 2, costSavingsThousands: 75 }
  ];

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>MUNICIPAL PERFORMANCE & PREDICTIVE METRICS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            System Analytics & Predictive Trends
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Evaluate civic reporting velocities, resolution rates, geographic risk concentrations, and cross-department cost savings.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Municipal Basins</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Pune">Pune</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi NCR">Delhi NCR</option>
          </select>

          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="1m">Last 30 Days</option>
            <option value="3m">Last 90 Days</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last 1 Year</option>
          </select>
        </div>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Analytics Engine"
        message="Charts are powered by demonstration datasets and real-time reactive mutations in the local browser state. When connected to production municipal APIs in subsequent phases, live telemetry feeds will replace these demonstration records."
      />

      {/* Row 1: Complaints Over Time & Complaints by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints Over Time Area Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Complaints Over Time & Cascades Prevented</span>
              </h2>
              <p className="text-xs text-slate-400">Monthly reporting vs downstream failures arrested</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
              Trend Analysis
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintsOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anlReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="anlPrevented" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="period" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="total" name="Total Issues Reported" stroke="#0EA5E9" fill="url(#anlReported)" strokeWidth={2} />
                <Area type="monotone" dataKey="cascadesPrevented" name="Cascades Averted" stroke="#10B981" fill="url(#anlPrevented)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaints by Category Bar Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Complaints by Resource Category</span>
              </h2>
              <p className="text-xs text-slate-400">Distribution across municipal infrastructure domains</p>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/40">
              Domain Breakdown
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complaintsByCategoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="complaints" name="Complaints" fill="#0EA5E9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Status Breakdown, Risk Level Distribution & Resolution Ratio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Complaints by Status Pie */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Complaints by Status</span>
            </h2>
            <p className="text-[11px] text-slate-400">Operational workflow stages</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={complaintsByStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {complaintsByStatusData.map((entry, index) => (
                    <Cell key={`status-cell-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 max-h-24 overflow-y-auto text-xs pr-1">
            {complaintsByStatusData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: statusColors[idx % statusColors.length] }} />
                  <span className="text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="font-mono text-slate-400 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Level Distribution Bar */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Risk-Level Distribution</span>
            </h2>
            <p className="text-[11px] text-slate-400">Impact tier categorization</p>
          </div>

          <div className="h-48 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="level" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Count" radius={[6, 6, 0, 0]}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1 font-mono">
            <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300">
              Critical: {riskCounts.Critical}
            </div>
            <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300">
              High: {riskCounts.High}
            </div>
          </div>
        </div>

        {/* Resolved vs Unresolved Ratio */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Resolved vs Unresolved</span>
            </h2>
            <p className="text-[11px] text-slate-400">Remediation clearance ratio</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {resolutionData.map((entry, index) => (
                    <Cell key={`res-cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-emerald-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Resolved:
              </span>
              <span className="font-mono font-bold">{resolvedCount} ({((resolvedCount / (filteredComplaints.length || 1)) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center justify-between text-cyan-300 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                In Triage / Action:
              </span>
              <span className="font-mono font-bold">{unresolvedCount} ({((unresolvedCount / (filteredComplaints.length || 1)) * 100).toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Frequently Reported Areas & Preventive Actions by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Areas Horizontal Bar Chart */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Frequently Reported Urban Localities</span>
            </h2>
            <p className="text-xs text-slate-400">Geographic incident concentration</p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={topAreasData} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis dataKey="area" type="category" stroke="#64748B" fontSize={11} tickLine={false} width={120} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" name="Reported Incidents" fill="#0EA5E9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preventive Actions & Savings by Category */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Preventive Interventions & Avoidable Cost ($k)</span>
            </h2>
            <p className="text-xs text-slate-400">Financial damage averted by timely domain clearance</p>
          </div>

          <div className="h-60 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={preventiveByCategory} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
                <Bar dataKey="costSavingsThousands" name="Avoided Damage ($k)" fill="#10B981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="actionsCount" name="Preventive Plans" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
