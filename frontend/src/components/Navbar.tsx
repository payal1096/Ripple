import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  CloudRain,
  Sun,
  CloudLightning,
  Bell,
  Shield,
  Send,
  Activity,
  Layers,
  UserCheck,
  LogOut,
  LogIn,
  UserPlus,
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { RainfallScenario } from '../types/ripple';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentUser,
    isAdmin,
    toggleAdminDemo,
    logout,
    currentScenario,
    setCurrentScenario,
    unreadCount,
    resetToDefaultData
  } = useRipple();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleScenarioChange = (scenario: RainfallScenario) => {
    setCurrentScenario(scenario);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#080E1A]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none">
      {/* Left: Brand & City Basin */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center shadow-glow-cyan text-white font-black tracking-wider text-lg transition-transform group-hover:scale-105">
            R
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                RIPPLE
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                Urban Coord
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentUser.city} Municipal Basin</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400/90 font-mono text-[10px]">Frontend Demo</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Rainfall Scenario Selector (Dynamic risk trigger) */}
      <div className="hidden lg:flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-2 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Weather Scenario:</span>
        </span>

        <button
          onClick={() => handleScenarioChange('low')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentScenario === 'low'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Baseline dry weather - minimum cascade risk"
        >
          <Sun className="w-3 h-3 text-emerald-400" />
          <span>Dry (0mm)</span>
        </button>

        <button
          onClick={() => handleScenarioChange('moderate')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentScenario === 'moderate'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Moderate rain - standard predictive cascade threshold"
        >
          <CloudRain className="w-3 h-3 text-amber-400" />
          <span>Moderate (35mm/h)</span>
        </button>

        <button
          onClick={() => handleScenarioChange('heavy')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            currentScenario === 'heavy'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-glow-red'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Monsoon cloudburst - maximum downstream risk amplification"
        >
          <CloudLightning className="w-3 h-3 text-rose-400" />
          <span>Heavy Monsoon (90mm/h)</span>
        </button>
      </div>

      {/* Right Controls: Quick Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Report Problem Quick CTA */}
        <Link
          to="/report"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs shadow-glow-cyan hover:opacity-95 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Report Problem</span>
        </Link>

        {/* Demo Role Switcher Toggle */}
        <button
          onClick={toggleAdminDemo}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
            isAdmin
              ? 'bg-purple-950/70 border-purple-500/40 text-purple-300 hover:bg-purple-900/60'
              : 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:bg-slate-800/80'
          }`}
          title="Toggle between Citizen View and Admin Dispatcher View for presentation"
        >
          <Shield className={`w-3.5 h-3.5 ${isAdmin ? 'text-purple-400' : 'text-slate-400'}`} />
          <span className="hidden md:inline">{isAdmin ? 'Mode: Admin' : 'Mode: Citizen'}</span>
          <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 font-mono text-cyan-300">Toggle</span>
        </button>

        {/* Notifications Icon with Badge */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center ring-2 ring-[#080E1A]">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all text-left"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white ${
              isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-600 to-sky-600'
            }`}>
              {currentUser.name ? currentUser.name.charAt(0) : 'U'}
            </div>
            <div className="hidden sm:block text-xs leading-tight">
              <div className="font-semibold text-slate-200 truncate max-w-[110px]">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 capitalize">{currentUser.role}</div>
            </div>
          </button>

          {showUserDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs backdrop-blur-xl"
              onClick={() => setShowUserDropdown(false)}
            >
              <div className="px-3.5 py-2 border-b border-slate-800/80">
                <p className="font-semibold text-slate-200">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isAdmin ? 'bg-purple-950 text-purple-300 border border-purple-800/50' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
                }`}>
                  {isAdmin ? 'MUNICIPAL DISPATCH OFFICER' : 'RESIDENT CITIZEN'}
                </span>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white"
                >
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Profile & Preferences</span>
                </Link>

                <Link
                  to="/my-complaints"
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-300 hover:bg-slate-800/70 hover:text-white"
                >
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>My Reported Complaints</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3.5 py-2 text-purple-300 hover:bg-purple-950/50 hover:text-purple-200 font-semibold"
                  >
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>Admin Operations Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAdminDemo();
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-amber-300 hover:bg-amber-950/30"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Switch to {isAdmin ? 'Citizen View' : 'Admin Operations'}</span>
                </button>
              </div>

              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowResetConfirm(true);
                    setShowUserDropdown(false);
                  }}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-slate-400 hover:bg-slate-800/70 hover:text-rose-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Dataset</span>
                </button>

                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3.5 py-2 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Switch Demonstration Account</span>
                </Link>

                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-3.5 py-2 text-rose-400 hover:bg-rose-950/40"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Dataset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Reset Demonstration Dataset?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This will restore the local browser storage back to the initial set of 8 complaints, initial resource records, and demo community ideas. Useful for showing college examiners fresh demo runs.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-glow-amber"
              >
                Reset Data Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
