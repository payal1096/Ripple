import React from 'react';
import {
  ArrowRight,
  GitFork,
  Shovel,
  SearchAlert,
  ShieldAlert,
  Zap,
  Activity,
  CheckCircle,
  Network,
  Droplets,
  Truck,
  Building,
  Car
} from 'lucide-react';
import { DemoNotice } from '../components/DemoNotice';

interface LandingPageProps {
  onExplore: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080E1A] text-slate-100 selection:bg-cyan-500/30">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-slate-800/80 bg-[#080E1A]/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-600 flex items-center justify-center shadow-glow-cyan text-white font-black text-lg">
            R
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
              RIPPLE
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold block uppercase tracking-widest">
              Urban Intelligence
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <button onClick={() => scrollToSection('problem')} className="hover:text-cyan-400 transition-colors">
            The Problem
          </button>
          <button onClick={() => scrollToSection('approach')} className="hover:text-cyan-400 transition-colors">
            The Approach
          </button>
          <button onClick={() => scrollToSection('features')} className="hover:text-cyan-400 transition-colors">
            Core Engines
          </button>
          <button onClick={() => scrollToSection('workflow')} className="hover:text-cyan-400 transition-colors">
            How It Works
          </button>
        </div>

        <button
          onClick={onExplore}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all hover:scale-105"
        >
          <span>Launch Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 px-6 lg:px-12 max-w-7xl mx-auto relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide shadow-glow-cyan/20">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Next-Generation Urban Interdependency Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 leading-[1.15]">
            Predict Urban Problems{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
              Before They Cascade.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Connect city resources, uncover hidden dependencies, and prevent tomorrow's infrastructure failures through intelligent urban coordination.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-glow-blue flex items-center gap-2.5 transition-all hover:scale-105"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollToSection('workflow')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-sm transition-all"
            >
              How Ripple Works
            </button>
          </div>
        </div>

        {/* Animated Interconnected Infrastructure Illustration */}
        <div className="mt-16 p-6 lg:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative">
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Network className="w-4 h-4 text-cyan-400" />
              Interdependent Resource Topology
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/50">
              Live Directed Graph Model
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Waste Point */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 shadow-glow-amber/10 text-center space-y-2 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-100">Waste Points</h4>
              <p className="text-[11px] text-slate-400">Overfill & Grate Clogging</p>
            </div>

            {/* Drain */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-sky-500/30 shadow-glow-blue/10 text-center space-y-2 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Droplets className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-100">Storm Drains</h4>
              <p className="text-[11px] text-slate-400">Culvert Surcharge & Inflow</p>
            </div>

            {/* Road */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 shadow-glow-blue/10 text-center space-y-2 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-100">Road Corridors</h4>
              <p className="text-[11px] text-slate-400">Sub-base Inundation & Potholes</p>
            </div>

            {/* Water Pipelines */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 shadow-glow-cyan/10 text-center space-y-2 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-100">Water Mains</h4>
              <p className="text-[11px] text-slate-400">Subsurface Fissure Erosion</p>
            </div>

            {/* Parking */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 text-center space-y-2 hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 mx-auto rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Car className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-xs text-slate-100">Parking Stalls</h4>
              <p className="text-[11px] text-slate-400">Gridlock & Overflow Spill</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section A: The Problem */}
      <section id="problem" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-wider text-rose-400">
              The Urban Challenge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Cities Fail in Silos, Not Isolation.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Municipal departments traditionally manage drainage, solid waste, road resurfacing, water pipelines, and traffic control in isolated operational silos.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              When an uncollected waste heap migrates into an uncleaned storm drain, it triggers waterlogging during the next rainfall. Waterlogged asphalt weakens and fractures into potholes, which diverts arterial traffic and paralyses commercial transit. Reacting to the final symptom costs 10x more than preventing the first cause.
            </p>
          </div>

          <div className="rounded-2xl p-6 bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-200">The Cascading Failure Sequence</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 flex items-center gap-2">
                <span className="font-mono font-bold">01.</span> Commercial garbage accumulation
              </div>
              <div className="text-center text-slate-600">↓</div>
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-sky-300 flex items-center gap-2">
                <span className="font-mono font-bold">02.</span> Arterial drain culvert siltation & blockage
              </div>
              <div className="text-center text-slate-600">↓</div>
              <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-blue-300 flex items-center gap-2">
                <span className="font-mono font-bold">03.</span> Waterlogging under rainfall event
              </div>
              <div className="text-center text-slate-600">↓</div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 flex items-center gap-2">
                <span className="font-mono font-bold">04.</span> Road structural destruction & traffic gridlock ($45,000+ loss)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section B: The Ripple Approach */}
      <section id="approach" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
            The Solution
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Intelligent Dependency Graphs
          </h2>
          <p className="text-sm text-slate-300">
            Ripple models municipal assets as a dynamic, weighted directed graph, quantifying how stress propagates through the urban ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Topological Coupling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every asset is spatially and physically connected to its neighbors, modeling real drainage catchments, road corridors, and pipeline runs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Dynamic Trigger Scaling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Weather and seasonal factors dynamically adjust propagation probabilities. A blocked drain becomes 3x more hazardous under monsoon precipitation.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-100">Optimal Leverage Points</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Algorithms identify the single upstream bottleneck intervention that averts the largest downstream financial and structural disaster.
            </p>
          </div>
        </div>
      </section>

      {/* Section C: Three Core Engines */}
      <section id="features" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
            Core Modules
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            Three Predictive Engines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Cascade Prediction</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Traces downstream failure propagation using NetworkX. Calculates multi-path probabilities, expected time delays, and ranks high-BCR preventive interventions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shovel className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Dig-Once Detector</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Scans utility permits across Water, Telecom, Gas, and Roads. Detects overlapping road cuts on the same segment and unifies them into a single trenching window.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl p-6 bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <SearchAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">Silent Ward Detector</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identifies wards that receive very few citizen complaints but have low inspection coverage and aging assets, scheduling audits before silent failure.
            </p>
          </div>
        </div>
      </section>

      {/* Section D: How It Works */}
      <section id="workflow" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">
            Operational Blueprint
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
            How Ripple Coordinates the City
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
            <span className="font-mono text-cyan-400 font-extrabold text-sm block">01</span>
            <h4 className="font-bold text-xs text-slate-100">Ingest Data</h4>
            <p className="text-[11px] text-slate-400">Telemetry, public tickets, and utility permits in MongoDB.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
            <span className="font-mono text-cyan-400 font-extrabold text-sm block">02</span>
            <h4 className="font-bold text-xs text-slate-100">Connect Graph</h4>
            <p className="text-[11px] text-slate-400">Map assets and causal rules into a directed dependency graph.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
            <span className="font-mono text-cyan-400 font-extrabold text-sm block">03</span>
            <h4 className="font-bold text-xs text-slate-100">Predict Cascades</h4>
            <p className="text-[11px] text-slate-400">Simulate downstream consequence paths under weather triggers.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
            <span className="font-mono text-cyan-400 font-extrabold text-sm block">04</span>
            <h4 className="font-bold text-xs text-slate-100">Calculate Priority</h4>
            <p className="text-[11px] text-slate-400">Rank issues by preventable damage and cascade leverage.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
            <span className="font-mono text-cyan-400 font-extrabold text-sm block">05</span>
            <h4 className="font-bold text-xs text-slate-100">Coordinate Action</h4>
            <p className="text-[11px] text-slate-400">Dispatch field teams and consolidate road cuts before crises.</p>
          </div>
        </div>
      </section>

      {/* Section E: Demonstration Notice & CTA */}
      <section className="py-20 px-6 lg:px-12 max-w-4xl mx-auto text-center space-y-8">
        <DemoNotice />

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-100">
            Move From Reacting to Problems to Preventing Them.
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto">
            Experience the live smart-city coordination system in action with Mumbai demonstration telemetry.
          </p>

          <button
            onClick={onExplore}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-glow-cyan inline-flex items-center gap-2.5 transition-all hover:scale-105"
          >
            <span>Enter Operational Command</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-400">
        <p>Ripple — Urban Resource Coordination and Management System</p>
        <p className="text-[11px] text-slate-500 mt-1">Built with React, FastAPI, NetworkX, and MongoDB</p>
      </footer>
    </div>
  );
};
