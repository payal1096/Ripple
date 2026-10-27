import React, { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Save,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';

export const SettingsPage: React.FC = () => {
  const { currentUser, updateProfile, isAdmin, toggleAdminDemo, resetToDefaultData } = useRipple();

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [city, setCity] = useState(currentUser.city);
  const [phone, setPhone] = useState(currentUser.phone || '');

  // Preferences State
  const [emailNotifications, setEmailNotifications] = useState(
    currentUser.preferences?.emailNotifications ?? true
  );
  const [smsAlerts, setSmsAlerts] = useState(
    currentUser.preferences?.smsAlerts ?? false
  );
  const [highRiskAlertsOnly, setHighRiskAlertsOnly] = useState(
    currentUser.preferences?.highRiskAlertsOnly ?? false
  );
  const [compactView, setCompactView] = useState(
    currentUser.preferences?.compactView ?? false
  );

  const [isSaved, setIsSaved] = useState(false);

  const cities = ['Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata'];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      city: city.trim(),
      phone: phone.trim() || undefined,
      preferences: {
        emailNotifications,
        smsAlerts,
        highRiskAlertsOnly,
        compactView
      }
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-4xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>PREFERENCES & LOCAL DEMONSTRATION IDENTITY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Settings & Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your active demonstration citizen profile, notification preferences, and municipal simulation parameters.
          </p>
        </div>

        <button
          onClick={toggleAdminDemo}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            isAdmin
              ? 'bg-purple-950 text-purple-300 border border-purple-800/50 hover:bg-purple-900/60'
              : 'bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Switch to {isAdmin ? 'Citizen View' : 'Municipal Admin Operations'}</span>
        </button>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Demonstration Profile Storage Notice"
        message="Profile details and preferences updated on this page are stored in your browser's local state for demonstration purposes. They are not persisted to a production authentication server."
      />

      {/* Profile Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white ${
              isAdmin ? 'bg-gradient-to-tr from-purple-600 to-indigo-600' : 'bg-gradient-to-tr from-cyan-600 to-sky-600'
            }`}>
              {name ? name.charAt(0) : 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">{name}</h2>
              <p className="text-xs text-slate-400 font-mono">{currentUser.role === 'admin' ? 'Municipal Operations Officer' : 'Resident Citizen'}</p>
            </div>
          </div>

          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
            isAdmin ? 'bg-purple-950 text-purple-300 border border-purple-800/50' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/50'
          }`}>
            {isAdmin ? 'ADMINISTRATOR' : 'CITIZEN'}
          </span>
        </div>

        {isSaved && (
          <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile and notification preferences updated in local demonstration store!</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Municipal City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Contact Number <span className="text-slate-400 text-[10px]">(Optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98201 00000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="font-bold text-slate-200 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Notification Preferences (Simulated)</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Email Dispatch Summaries</span>
                  <span className="text-[11px] text-slate-400">Receive status update digests for your submitted complaints</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Critical Ripple Alerts Only</span>
                  <span className="text-[11px] text-slate-400">Filter notifications to only critical downstream infrastructure warnings</span>
                </div>
                <input
                  type="checkbox"
                  checked={highRiskAlertsOnly}
                  onChange={(e) => setHighRiskAlertsOnly(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <div>
                  <span className="font-semibold text-slate-200 block">Compact Table View Mode</span>
                  <span className="text-[11px] text-slate-400">Display high-density rows on priority queues and management portals</span>
                </div>
                <input
                  type="checkbox"
                  checked={compactView}
                  onChange={(e) => setCompactView(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={resetToDefaultData}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo State</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
