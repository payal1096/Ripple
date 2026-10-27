import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GitFork,
  ArrowUpDown,
  Shovel,
  SearchAlert,
  BarChart3,
  Settings,
  Send,
  Layers,
  Users,
  Lightbulb,
  Building2,
  ClipboardList,
  Shield,
  Bell,
  Cpu
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';

export const Sidebar: React.FC = () => {
  const { unreadCount, digOnceConflicts, communityIdeas, complaints, isAdmin } = useRipple();

  const pendingIdeasCount = communityIdeas.filter((i) => i.status === 'Pending Review').length;
  const criticalComplaintsCount = complaints.filter((c) => c.riskLevel === 'Critical' && c.status !== 'Resolved').length;

  const coreNav = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/ripple-analysis', label: 'Ripple Analysis', icon: GitFork, badge: 'Core AI' },
    { to: '/priority-queue', label: 'Priority Queue', icon: ArrowUpDown, badge: criticalComplaintsCount ? `${criticalComplaintsCount} Crit` : undefined, badgeColor: 'red' },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const coordinationNav = [
    { to: '/dig-once', label: 'Dig-Once Detector', icon: Shovel, badge: digOnceConflicts.length ? `${digOnceConflicts.length} Alert` : undefined, badgeColor: 'amber' },
    { to: '/silent-ward', label: 'Silent Ward Detector', icon: SearchAlert },
    { to: '/resources', label: 'Resource Registry', icon: Building2 },
    { to: '/complaints', label: 'Complaint Triage', icon: ClipboardList },
  ];

  const citizenNav = [
    { to: '/report', label: 'Report a Problem', icon: Send, highlight: true },
    { to: '/my-complaints', label: 'My Complaints', icon: Layers },
    { to: '/city-problems', label: 'City Problems', icon: Users },
    { to: '/community-ideas', label: 'Community Ideas', icon: Lightbulb, badge: pendingIdeasCount ? `${pendingIdeasCount} New` : undefined, badgeColor: 'cyan' },
  ];

  const systemNav = [
    { to: '/admin', label: 'Admin Command', icon: Shield, adminOnly: true },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount ? `${unreadCount}` : undefined, badgeColor: 'rose' },
    { to: '/settings', label: 'Settings & Profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#080E1A]/95 border-r border-slate-800/80 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none z-30">
      <div className="p-3.5 space-y-5 overflow-y-auto">
        {/* Core Operations Section */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Core Intelligence</span>
            <span className="text-[9px] font-mono text-cyan-400">P1-DEMO</span>
          </p>
          <nav className="space-y-0.5">
            {coreNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 transition-colors group-hover:text-cyan-400" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        item.badgeColor === 'red'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Municipal Coordination Section */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            Cross-Agency Coordination
          </p>
          <nav className="space-y-0.5">
            {coordinationNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 transition-colors group-hover:text-cyan-400" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        item.badgeColor === 'amber'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Citizen Engagement Section */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            Citizen Engagement
          </p>
          <nav className="space-y-0.5">
            {citizenNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      item.highlight && !isActive
                        ? 'text-cyan-300 bg-cyan-950/30 border border-cyan-900/40 hover:bg-cyan-950/60'
                        : isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/15 text-cyan-200 border border-cyan-500/40 shadow-sm font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${item.highlight ? 'text-cyan-400' : 'group-hover:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wide ${
                        item.badgeColor === 'cyan'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Admin & System */}
        <div>
          <p className="px-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            Command & Settings
          </p>
          <nav className="space-y-0.5">
            {systemNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? item.adminOnly
                          ? 'bg-gradient-to-r from-purple-500/20 to-indigo-500/15 text-purple-300 border border-purple-500/40 shadow-sm'
                          : 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${item.adminOnly ? 'text-purple-400' : 'group-hover:text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/50">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Municipal Telemetry Footer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan shrink-0" />
          <div className="text-xs overflow-hidden">
            <p className="font-semibold text-slate-200 truncate flex items-center gap-1">
              <span>Frontend Demo Store</span>
              <Cpu className="w-3 h-3 text-cyan-400 inline" />
            </p>
            <p className="text-[10px] text-slate-400 truncate">Phase 1 • Local Reactive State</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
