import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  GitFork,
  CheckCircle2,
  DollarSign,
  Shovel,
  SearchAlert,
  ArrowRight,
  Zap,
  Activity,
  Layers,
  Building2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldAlert,
  FileText,
  Send,
  CloudRain
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { StatCard } from '../components/StatCard';

export const OverviewDashboard: React.FC = () => {
  const {
    complaints,
    resources,
    rippleAnalyses,
    currentScenario,
    setCurrentScenario,
    digOnceConflicts,
    silentWards,
    currentUser
  } = useRipple();

  // Metrics calculation
  const totalResources = resources.length;
  const openComplaints = complaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Rejected'
  ).length;
  const criticalIssues = complaints.filter(
    (c) => c.riskLevel === 'Critical' && c.status !== 'Resolved'
  ).length;
  const predictedDownstreamRisks = rippleAnalyses.reduce(
    (acc, curr) => acc + curr.possibleConsequences.length,
    0
  );
  const preventiveActionsCount = rippleAnalyses.length;
  const totalAvoidableCost = rippleAnalyses.reduce(
    (acc, curr) => acc + curr.estimatedAvoidableCost,
    0
  );

  // Health summary by resource condition
  const healthyCount = resources.filter((r) => r.condition === 'healthy').length;
  const warningCount = resources.filter((r) => r.condition === 'warning').length;
  const highPriorityCount = resources.filter((r) => r.condition === 'high_priority').length;
  const criticalCount = resources.filter((r) => r.condition === 'critical').length;

  const resourceHealthData = [
    { name: 'Healthy', count: healthyCount, fill: '#10B981' },
    { name: 'Warning', count: warningCount, fill: '#F59E0B' },
    { name: 'High Priority', count: highPriorityCount, fill: '#F97316' },
    { name: 'Critical', count: criticalCount, fill: '#EF4444' }
  ];

  // Complaint trends over recent months
  const complaintTrendsData = [
    { month: 'Jun', reported: 18, resolved: 14, preventedCascades: 8 },
    { month: 'Jul', reported: 32, resolved: 24, preventedCascades: 19 },
    { month: 'Aug', reported: 45, resolved: 36, preventedCascades: 28 },
    { month: 'Sep', reported: 29, resolved: 27, preventedCascades: 17 },
    { month: 'Oct (Current)', reported: complaints.length + 12, resolved: 15, preventedCascades: 22 }
  ];

  // Risk distribution data
  const riskCounts = {
    Critical: complaints.filter((c) => c.riskLevel === 'Critical').length,
    High: complaints.filter((c) => c.riskLevel === 'High').length,
    Medium: complaints.filter((c) => c.riskLevel === 'Medium').length,
    Low: complaints.filter((c) => c.riskLevel === 'Low').length
  };

  const riskDistributionData = [
    { name: 'Critical Risk', value: riskCounts.Critical, color: '#EF4444' },
    { name: 'High Risk', value: riskCounts.High, color: '#F97316' },
    { name: 'Medium Risk', value: riskCounts.Medium, color: '#F59E0B' },
    { name: 'Low Risk', value: riskCounts.Low || 1, color: '#10B981' }
  ];

  // Recent Complaints list
  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Top Banner & Welcome */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>MUNICIPAL OPERATIONS COMMAND CENTER</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-bold">DEMO ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Urban Resource Coordination & Predictive Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Simulating interconnected urban failures and demonstrating how targeted preventive maintenance arrests cascading infrastructure disruptions across {currentUser.city}.
          </p>
        </div>

        {/* Weather Sensitivity Banner */}
        <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl shadow-lg">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <CloudRain className="w-5 h-5" />
          </div>
          <div className="text-xs pr-2">
            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Simulation Sensitivity
            </div>
            <div className="font-bold text-slate-200 capitalize">
              {currentScenario} Weather Scenario
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice Banner */}
      <DemoNotice
        compact={false}
        title="College Engineering Project Demonstration"
        message="This dashboard observes municipal resource usage and demonstrates proactive cascade prevention. All figures reflect simulated causal graph analytics stored in local frontend state."
      />

      {/* 6 Required KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Resources"
          value={totalResources}
          unit="Assets"
          trendDirection="neutral"
          status="normal"
          description="Drains, roads, water, lights & utilities in registry"
          icon={Building2}
        />

        <StatCard
          label="Open Complaints"
          value={openComplaints}
          unit="Active"
          trendDirection="up"
          status={openComplaints > 5 ? "warning" : "normal"}
          description="Citizen reports awaiting or undergoing action"
          icon={Layers}
        />

        <StatCard
          label="Critical Issues"
          value={criticalIssues}
          unit="Severe"
          trendDirection="up"
          status="danger"
          description="Issues posing imminent secondary failure risks"
          icon={AlertTriangle}
        />

        <StatCard
          label="Downstream Risks"
          value={predictedDownstreamRisks}
          unit="Nodes"
          trendDirection="up"
          status="warning"
          description="Secondary impacts predicted if left unaddressed"
          icon={GitFork}
        />

        <StatCard
          label="Preventive Actions"
          value={preventiveActionsCount}
          unit="Plans"
          trendDirection="up"
          status="success"
          description="Interventions stopping multi-agency disruptions"
          icon={Zap}
        />

        <StatCard
          label="Avoidable Damage"
          value={`$${(totalAvoidableCost / 1000).toFixed(0)}k`}
          unit="Projected"
          trendDirection="down"
          status="success"
          description="Estimated financial savings through early intervention"
          icon={DollarSign}
        />
      </div>

      {/* Charts Section: Complaint Trends & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Complaint Volume & Cascade Prevention Trends</span>
              </h2>
              <p className="text-xs text-slate-400">
                Monthly comparison between reported complaints and downstream cascade events averted
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/40">
              Demonstration Dataset
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complaintTrendsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorPrevented" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="reported"
                  name="Complaints Reported"
                  stroke="#0EA5E9"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorReported)"
                />
                <Area
                  type="monotone"
                  dataKey="preventedCascades"
                  name="Cascades Prevented"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorPrevented)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Level Distribution Pie Chart (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Risk Level Distribution</span>
            </h2>
            <p className="text-xs text-slate-400">
              Severity breakdown of registered municipal issues
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {riskDistributionData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-medium">{item.name}:</span>
                <span className="text-slate-400 font-mono font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resource Health Summary & Recent Alerts in 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resource Health Summary Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>Resource Health Status</span>
              </h2>
              <p className="text-xs text-slate-400">
                Operating status of registered drainage, roadway, and utility assets
              </p>
            </div>
            <Link
              to="/resources"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <span>View Registry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <span className="text-2xl font-black text-emerald-400 font-mono">{healthyCount}</span>
              <div className="text-xs font-semibold text-emerald-300 mt-1">Healthy</div>
              <div className="text-[10px] text-slate-400">Normal telemetry</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
              <span className="text-2xl font-black text-amber-400 font-mono">{warningCount}</span>
              <div className="text-xs font-semibold text-amber-300 mt-1">Warning</div>
              <div className="text-[10px] text-slate-400">Minor degradation</div>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/30 text-center">
              <span className="text-2xl font-black text-orange-400 font-mono">{highPriorityCount}</span>
              <div className="text-xs font-semibold text-orange-300 mt-1">High Priority</div>
              <div className="text-[10px] text-slate-400">Inspection scheduled</div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
              <span className="text-2xl font-black text-rose-400 font-mono">{criticalCount}</span>
              <div className="text-xs font-semibold text-rose-300 mt-1">Critical</div>
              <div className="text-[10px] text-slate-400">Requires triage</div>
            </div>
          </div>

          {/* Progress bar visual */}
          <div className="pt-2">
            <div className="h-3 rounded-full bg-slate-950 flex overflow-hidden p-0.5 border border-slate-800">
              <div
                style={{ width: `${(healthyCount / totalResources) * 100}%` }}
                className="bg-emerald-500 rounded-l-full"
                title={`Healthy: ${healthyCount}`}
              />
              <div
                style={{ width: `${(warningCount / totalResources) * 100}%` }}
                className="bg-amber-500"
                title={`Warning: ${warningCount}`}
              />
              <div
                style={{ width: `${(highPriorityCount / totalResources) * 100}%` }}
                className="bg-orange-500"
                title={`High Priority: ${highPriorityCount}`}
              />
              <div
                style={{ width: `${(criticalCount / totalResources) * 100}%` }}
                className="bg-rose-500 rounded-r-full"
                title={`Critical: ${criticalCount}`}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 font-mono">
              <span>Overall Infrastructure Integrity Score: 68%</span>
              <span>Total Assets: {totalResources}</span>
            </div>
          </div>
        </div>

        {/* Recent Urgent Alerts */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Active Operational Alerts</span>
              </h2>
              <p className="text-xs text-slate-400">
                Critical situations requiring multi-agency mitigation
              </p>
            </div>
            <span className="text-xs font-mono text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/40">
              Live Feed
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-rose-200">
                  BKC Storm Drain Grate Clogging (CMP-001)
                </div>
                <p className="text-slate-300 mt-0.5">
                  Solid waste blocking 60% intake. Inflow surcharge will inundate arterial road during forecasted rain.
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>SWD Crew En Route</span>
                  <span>•</span>
                  <span className="text-rose-400">Priority Score 94/100</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <Shovel className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-amber-200">
                  Dig-Once Coordination Overlap Detected
                </div>
                <p className="text-slate-300 mt-0.5">
                  Water main replacement and Telecom fiber trenching scheduled on BKC Central Avenue with 7-day overlap.
                </p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 font-mono">
                  <span>Potential Savings: $49,000</span>
                  <span>•</span>
                  <Link to="/dig-once" className="text-amber-400 underline">
                    View Coordination Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Ripple Events Displayed as Clean Cards */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitFork className="w-5 h-5 text-cyan-400" />
              <span>Critical Ripple Events & Preventive Forecasts</span>
            </h2>
            <p className="text-xs text-slate-400">
              Demonstrating the causal pathway: Problem → Potential Cascade → Timely Intervention
            </p>
          </div>
          <Link
            to="/ripple-analysis"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>Explore All Ripple Chains</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rippleAnalyses.slice(0, 2).map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                    {item.affectedResource}
                  </span>
                  <h3 className="text-sm font-bold text-slate-100 mt-2">
                    {item.reportedProblem}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-950 text-rose-300 border border-rose-800/40 shrink-0">
                  {item.riskLevel} Risk
                </span>
              </div>

              {/* Compact horizontal connected steps */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Causal Cascade Sequence:
                </p>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {item.steps.map((st, idx) => (
                    <React.Fragment key={st.step}>
                      <span
                        className={`px-2 py-1 rounded-lg text-[11px] font-medium ${
                          st.isConfirmed
                            ? 'bg-rose-950/80 border border-rose-800/50 text-rose-200'
                            : 'bg-slate-950 border border-slate-800 text-slate-300'
                        }`}
                        title={st.description}
                      >
                        {st.step}. {st.title}
                        {st.isConfirmed && (
                          <span className="ml-1 text-[9px] text-rose-400 font-bold font-mono">
                            [Confirmed]
                          </span>
                        )}
                      </span>
                      {idx < item.steps.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Recommended Action & Cost Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Recommended Preventive Action:
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium">
                    {item.recommendedPreventiveAction}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 uppercase block">Avoidable Cost</span>
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    ${item.estimatedAvoidableCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Complaint Activity */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Complaint Activity</span>
            </h2>
            <p className="text-xs text-slate-400">
              Latest municipal issues logged in the demonstration queue
            </p>
          </div>
          <Link
            to="/complaints"
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
          >
            <span>Manage All Complaints</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Ref ID</th>
                <th className="py-3 px-3">Title & Area</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Severity</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Reported</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {recentComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{c.refId}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200 line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-slate-400">{c.area}, {c.city}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold ${
                        c.riskLevel === 'Critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                          : c.riskLevel === 'High'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                      }`}
                    >
                      {c.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {c.reportedDate.split(' ')[0]}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Link
                      to="/complaints"
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 transition-colors font-medium text-[11px]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
