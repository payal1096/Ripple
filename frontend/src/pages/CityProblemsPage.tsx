import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  MapPin,
  Clock,
  Lightbulb,
  AlertTriangle,
  Eye,
  X,
  ArrowRight,
  ShieldAlert,
  Send
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { Complaint, RiskLevel, ComplaintStatus } from '../types/ripple';

export const CityProblemsPage: React.FC = () => {
  const { complaints, currentUser } = useRipple();

  // City defaults to demonstration user's profile city
  const [selectedCity, setSelectedCity] = useState<string>(currentUser.city || 'Mumbai');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedProblem, setSelectedProblem] = useState<Complaint | null>(null);

  const availableCities = ['All', 'Mumbai', 'Pune', 'Bengaluru', 'Delhi NCR'];

  // Dynamically extract areas based on selected city
  const areas = React.useMemo(() => {
    const list = complaints
      .filter((c) => selectedCity === 'All' || c.city === selectedCity)
      .map((c) => c.area);
    return ['All', ...Array.from(new Set(list))];
  }, [complaints, selectedCity]);

  const categories = [
    'All',
    'Drainage',
    'Roads',
    'Water Supply',
    'Waste Management',
    'Streetlights',
    'Parking',
    'Public Infrastructure'
  ];

  // Filter complaints
  const filteredProblems = complaints.filter((c) => {
    if (selectedCity !== 'All' && c.city !== selectedCity) return false;
    if (selectedArea !== 'All' && c.area !== selectedArea) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && c.status !== selectedStatus) return false;
    if (selectedRisk !== 'All' && c.riskLevel !== selectedRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.area.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>COMMUNITY URBAN ISSUE DISCOVERY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            City Problems & Civic Concerns
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explore reported urban challenges in your locality, evaluate community proposals, and contribute crowdsourced engineering ideas.
          </p>
        </div>

        <Link
          to="/report"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Privacy & Community Display Policy"
        message="Public problem cards display approximate localities only. In compliance with municipal privacy protocols, citizen personal email addresses, phone numbers, and pinpoint GPS coordinates are strictly redacted from public views."
      />

      {/* Search & Comprehensive Filters */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by title or description */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problem title or description..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* City Filter (Defaults to user city) */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedArea('All');
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-semibold"
            >
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  City: {city} {city === currentUser.city ? '(Your City)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {areas.map((area) => (
                <option key={area} value={area}>Area: {area}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>Category: {cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Secondary Risk & Status Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Risk:</span>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRisk(r)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedRisk === r
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-slate-400 font-semibold text-[11px] uppercase mr-1">Status:</span>
            {['All', 'Submitted', 'In Progress', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            {filteredProblems.length} Problems Visible
          </div>
        </div>
      </div>

      {/* Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProblems.map((problem) => (
          <div
            key={problem.id}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Category, Status & Risk header */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {problem.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      problem.riskLevel === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                        : problem.riskLevel === 'High'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                    }`}
                  >
                    {problem.riskLevel}
                  </span>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300">
                    {problem.status}
                  </span>
                </div>
              </div>

              {/* Problem Title & Description */}
              <div>
                <h3 className="text-base font-bold text-slate-100 line-clamp-2">
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                  {problem.description}
                </p>
              </div>

              {/* Approximate Location */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {problem.area}, {problem.city} {problem.landmark ? `(near ${problem.landmark})` : ''}
                </span>
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{problem.reportedDate.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-1 text-cyan-400 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{problem.communityIdeasCount} Ideas</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedProblem(problem)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Details</span>
                </button>

                <Link
                  to="/community-ideas"
                  className="py-2 px-3 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/60 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                  title="Suggest Solution"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Suggest</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedProblem(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                  {selectedProblem.refId}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedProblem.category}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/50">
                  {selectedProblem.riskLevel} Risk
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-100 mt-2">
                {selectedProblem.title}
              </h2>
            </div>

            {/* Approximate Location Notice */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="font-semibold text-slate-200">Approximate Location: </span>
                {selectedProblem.area}, {selectedProblem.city}
                {selectedProblem.landmark && ` • Landmark: ${selectedProblem.landmark}`}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
                Problem Description
              </span>
              <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80">
                {selectedProblem.description}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px] block">
                Potential Downstream Ripple Risk:
              </span>
              <p className="text-slate-200 leading-relaxed">
                {selectedProblem.potentialDownstreamImpact}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <div className="text-slate-400 font-mono">
                Reported on: {selectedProblem.reportedDate}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/community-ideas"
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Propose Solution Idea</span>
                </Link>
                <button
                  onClick={() => setSelectedProblem(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
