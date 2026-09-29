import React from 'react';
import {
  Sparkles,
  Users,
  Target,
  Layers,
  BookOpen,
  Award,
  CheckCircle2,
  Code2,
  Cpu,
  GraduationCap,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Academic Project & Placement Initiative</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About AI Interview Prep
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Bridging the gap between conceptual preparation and high-stakes interview performance through role-based simulation and automated feedback.
        </p>
      </div>

      {/* Abstract & Background Card */}
      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>The Problem & Placement Reality</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Technical interviews remain one of the most stressful and unpredictable stages of a student's placement journey. Most learners prepare in isolation — solving coding problems on one platform, reading interview question lists on another, and rarely getting realistic, structured practice under timed conditions or actionable feedback.
        </p>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Unlike written exams, interviews test not only raw conceptual knowledge but how clearly, concisely, and confidently a candidate can structure thoughts under time pressure. Peer mock interviews are hard to schedule and vary widely in quality.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-indigo-400 font-bold text-sm block mb-1">01. Active Practice</span>
            <span className="text-xs text-slate-400">Shift from passive memorization to authentic response articulation.</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-cyan-400 font-bold text-sm block mb-1">02. Objective Feedback</span>
            <span className="text-xs text-slate-400">Granular metric breakdown of correctness, relevance, completeness, and clarity.</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-emerald-400 font-bold text-sm block mb-1">03. Longitudinal Tracking</span>
            <span className="text-xs text-slate-400">Persistent analytics measuring improvement across multiple sessions.</span>
          </div>
        </div>
      </div>

      {/* Team Recognition */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Users className="w-6 h-6 text-indigo-400" />
          <span>Project Team • Coffee and Code</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              SG
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Shubhamji Gupta</h3>
              <p className="text-xs text-slate-400 font-mono">Roll: 11242572</p>
            </div>
            <p className="text-xs text-slate-400">B.Tech Computer Science & Engineering, MMEC, MMDU-Mullana.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              PK
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Pawan Kumar</h3>
              <p className="text-xs text-slate-400 font-mono">Roll: 11242658</p>
            </div>
            <p className="text-xs text-slate-400">B.Tech Computer Science & Engineering, MMEC, MMDU-Mullana.</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 border-indigo-500/30 bg-indigo-950/10">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold">
              AS
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ashish Kumar Sharma</h3>
              <p className="text-xs text-indigo-300 font-mono">Roll: 11242644</p>
            </div>
            <p className="text-xs text-slate-400">B.Tech Computer Science & Engineering, MMEC, MMDU-Mullana.</p>
          </div>
        </div>
      </div>

      {/* Tech Architecture Overview */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
          <Layers className="w-6 h-6 text-cyan-400" />
          <span>Three-Tier System Architecture</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-sm">
              <Cpu className="w-4 h-4" />
              <span>Presentation Layer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              React 19 single-page application built with TypeScript, Tailwind CSS, Lucide icons, and React Router delivering responsive, chat-like interview simulations.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-purple-400 font-semibold text-sm">
              <Code2 className="w-4 h-4" />
              <span>Application Layer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Spring Boot 3.3 REST service orchestrated with Spring Security, JWT stateless tokens, modular AI evaluation engine, and question management services.
            </p>
          </div>

          <div className="space-y-3 p-5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Layers className="w-4 h-4" />
              <span>Database Layer</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              MySQL / MariaDB persistent relational storage with foreign key constraints, indexes on user sessions, categorized question bank, and evaluative feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
