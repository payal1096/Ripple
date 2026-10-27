import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  ThumbsUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  X,
  Filter,
  Layers,
  Sparkles,
  Info,
  Tag,
  ShieldCheck
} from 'lucide-react';
import { useRipple } from '../context/RippleContext';
import { DemoNotice } from '../components/DemoNotice';
import { CommunityIdea, IdeaStatus } from '../types/ripple';

export const CommunityIdeasPage: React.FC = () => {
  const { communityIdeas, addCommunityIdea, upvoteIdea, complaints, currentUser } = useRipple();

  const [activeTab, setActiveTab] = useState<'public' | 'my_ideas' | 'all'>('public');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Form State
  const [problemId, setProblemId] = useState(complaints[0]?.id || '');
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [expectedBenefit, setExpectedBenefit] = useState('');
  const [tags, setTags] = useState('Drainage, Smart Sanitation');

  // Filter ideas
  const displayedIdeas = communityIdeas.filter((idea) => {
    if (activeTab === 'public') {
      // By default only approved or selected ideas appear in public view
      const isApprovedOrSelected =
        idea.status === 'Approved' ||
        idea.status === 'Selected for Implementation' ||
        idea.status === 'Under Consideration';
      if (!isApprovedOrSelected) return false;
    } else if (activeTab === 'my_ideas') {
      if (idea.submittedBy.toLowerCase() !== currentUser.email.toLowerCase()) return false;
    }

    if (selectedCategory !== 'All' && idea.problemCategory !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleSubmitIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !explanation.trim() || !expectedBenefit.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addCommunityIdea({
      problemId,
      title,
      explanation,
      expectedBenefit,
      tags: tagList.length > 0 ? tagList : ['Community Suggestion']
    });

    // Reset & close
    setTitle('');
    setExplanation('');
    setExpectedBenefit('');
    setIsSubmitModalOpen(false);
    setActiveTab('my_ideas');
  };

  const getStatusBadge = (status: IdeaStatus) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
      case 'Selected for Implementation':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800/50 shadow-glow-cyan/20';
      case 'Under Consideration':
        return 'bg-blue-950 text-blue-300 border-blue-800/50';
      case 'Pending Review':
        return 'bg-amber-950 text-amber-300 border-amber-800/50';
      case 'Needs Revision':
        return 'bg-orange-950 text-orange-300 border-orange-800/50';
      case 'Rejected':
        return 'bg-rose-950 text-rose-300 border-rose-800/50';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold mb-1">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span>CIVIC INNOVATION & PEER-PROPOSED SOLUTIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Community Solutions & Ideas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Propose low-cost engineering solutions, IoT monitoring concepts, and community interventions to mitigate urban resource failures.
          </p>
        </div>

        <button
          onClick={() => setIsSubmitModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Suggest Solution Idea</span>
        </button>
      </div>

      {/* Demo Notice */}
      <DemoNotice
        compact={false}
        title="Civic Proposal Disclaimer"
        message="Community suggestions are crowdsourced engineering recommendations undergoing peer and municipal review. They do not constitute officially approved municipal policy or certified construction work orders until selected."
      />

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        {/* View Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('public')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'public'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Public Approved Solutions
          </button>

          <button
            onClick={() => setActiveTab('my_ideas')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'my_ideas'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Submitted Ideas ({communityIdeas.filter((i) => i.submittedBy.toLowerCase() === currentUser.email.toLowerCase()).length})
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Ideas Queue ({communityIdeas.length})
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Categories</option>
            <option value="Drainage">Drainage</option>
            <option value="Roads">Roads</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Streetlights">Streetlights</option>
            <option value="Waste Management">Waste Management</option>
          </select>
        </div>
      </div>

      {/* Ideas List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {displayedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Linked Problem Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="text-xs">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Target Urban Problem:
                  </span>
                  <span className="font-semibold text-slate-200 line-clamp-1">
                    {idea.problemTitle}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                    idea.status
                  )}`}
                >
                  {idea.status}
                </span>
              </div>

              {/* Solution Title */}
              <h3 className="text-base font-bold text-slate-100 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{idea.title}</span>
              </h3>

              {/* Detailed Explanation */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Detailed Explanation:
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                  {idea.explanation}
                </p>
              </div>

              {/* Expected Benefit */}
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  Expected Impact / Benefit:
                </span>
                <p className="text-emerald-200 font-medium leading-relaxed">
                  {idea.expectedBenefit}
                </p>
              </div>

              {/* Admin Feedback if present */}
              {idea.adminFeedback && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-800/40 text-xs space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                    Municipal Engineering Review Note:
                  </span>
                  <p className="text-slate-300 italic">{idea.adminFeedback}</p>
                </div>
              )}

              {/* Tags */}
              {idea.tags && idea.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {idea.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom: Reporter & Upvote button */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="text-slate-400 text-[11px] font-mono">
                Proposed by: <span className="text-slate-200 font-semibold">{idea.submittedByName}</span>
                <span className="text-slate-600 mx-1">•</span>
                <span>{idea.submittedDate.split(' ')[0]}</span>
              </div>

              <button
                onClick={() => upvoteIdea(idea.id)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
                title="Upvote solution idea"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono font-bold">{idea.upvotes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Idea Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl relative my-8">
            <button
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                COMMUNITY PROPOSAL
              </span>
              <h2 className="text-lg font-bold text-slate-100 mt-1">
                Suggest an Urban Solution
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Propose a practical, preventive engineering intervention for an active municipal issue.
              </p>
            </div>

            <form onSubmit={handleSubmitIdea} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Urban Problem *
                </label>
                <select
                  value={problemId}
                  onChange={(e) => setProblemId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                >
                  {complaints.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.refId}] {c.title} ({c.area})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Proposed Solution Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Install Removable Catch-Baskets Under Grating"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Detailed Explanation of Intervention *
                </label>
                <textarea
                  rows={3}
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explain materials, deployment mechanism, maintenance frequency..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Expected Benefit / Downstream Prevention *
                </label>
                <input
                  type="text"
                  value={expectedBenefit}
                  onChange={(e) => setExpectedBenefit(e.target.value)}
                  placeholder="e.g. Prevents 80% of road waterlogging and stops plastic outflow into river basin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. Low Cost, IoT, Drainage"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:bg-slate-800 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan"
                >
                  Submit for Municipal Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
