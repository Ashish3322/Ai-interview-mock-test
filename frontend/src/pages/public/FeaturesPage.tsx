import React from 'react';
import { Link } from 'react-router-dom';
import {
  Brain,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FeaturesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const scoringPillars = [
    {
      title: 'Correctness',
      weight: '35%',
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      description: 'Evaluates conceptual accuracy, technical precision, correct keyword usage, and foundational validity against gold-standard model answers.',
    },
    {
      title: 'Relevance',
      weight: '25%',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      description: 'Checks whether the candidate directly addresses the core question prompt without drifting into tangential filler content.',
    },
    {
      title: 'Completeness',
      weight: '25%',
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      description: 'Identifies if essential nuances, edge cases, thread safety, time complexity, and practical tradeoffs were sufficiently elaborated.',
    },
    {
      title: 'Clarity & Communication',
      weight: '15%',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      description: 'Assesses the structural organization, grammatical flow, conciseness, and professional tone of the candidate response.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Core Platform Capabilities</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Engineered for Real Interview Mastery
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Discover how our intelligent interview engine simulates actual hiring rounds, delivers multi-dimensional analysis, and accelerates technical readiness.
        </p>
      </div>

      {/* AI Evaluation Framework */}
      <div className="space-y-8">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold text-white">The AI Evaluation Framework</h2>
          <p className="text-sm text-slate-400">
            Every answer is scrutinized across four objective dimensions to generate a calibrated score out of 10.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scoringPillars.map((p, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${p.color}`}>
                  {p.title}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">Weight: {p.weight}</span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Pillars */}
      <div className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-white">Interactive Conversational Simulator</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step into a focused environment that replicates real interview conditions. Features an interactive countdown timer, question sequence tracker, and clean answer editor with live character and word counters.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-question-at-a-time focus to eliminate cognitive overload.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant evaluative feedback received before proceeding to next question.</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Timer tracking measures response cadence and speed.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <span>Sample Evaluator Response</span>
              <span className="text-emerald-400 font-mono">Score: 8/10</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="text-emerald-400 font-semibold">Strengths Identified:</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Good conceptual understanding of thread-safety in HashMap vs Hashtable</li>
                <li>Accurately highlighted null key support behavior</li>
              </ul>
              <div className="text-amber-400 font-semibold pt-2">Areas to Improve:</div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Add practical code snippets or edge case handling</li>
                <li>Elaborate on internal bucket resizing and treeification</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center lg:flex-row-reverse">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white">Comprehensive Question Categories</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-semibold text-indigo-400 block mb-1">Technical Core</span>
                <span className="text-slate-400">Language syntax, OOP, concurrency & JVM/runtime architecture.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-semibold text-cyan-400 block mb-1">System Design</span>
                <span className="text-slate-400">URL shorteners, distributed caching, scaling & microservices.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-semibold text-purple-400 block mb-1">Database & SQL</span>
                <span className="text-slate-400">Window functions, B-tree indexes, ACID transactions & JPA.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="font-semibold text-emerald-400 block mb-1">HR & STAR</span>
                <span className="text-slate-400">Conflict management, leadership, teamwork & growth scenarios.</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-white">Performance Reports & Analytics</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every completed interview produces an extensive performance audit. Review your candidate answers side-by-side with gold-standard model answers and observe your skill trajectory over multiple practice sessions.
            </p>
            <div className="pt-2">
              <Link
                to={isAuthenticated ? '/start-interview' : '/login'}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
              >
                <span>Try an Interview Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
