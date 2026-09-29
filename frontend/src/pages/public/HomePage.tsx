import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Brain,
  CheckCircle2,
  BarChart3,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Bot,
  Zap,
  Award,
  Terminal,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { rolesApi } from '../../services/api';
import { Role } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    rolesApi
      .getAll(true)
      .then((data) => setRoles(data))
      .catch((err) => console.error('Failed to load roles', err))
      .finally(() => setLoadingRoles(false));
  }, []);

  const handleRoleStart = (roleId: number) => {
    if (isAuthenticated) {
      navigate(`/start-interview?roleId=${roleId}`);
    } else {
      navigate(`/login?redirect=/start-interview?roleId=${roleId}`);
    }
  };

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Feedback',
      description:
        'Instant multi-metric evaluation of your technical answers assessing correctness, relevance, completeness, and communication clarity.',
      tag: 'LLM Evaluator',
    },
    {
      icon: Briefcase,
      title: 'Role-Based Interviews',
      description:
        'Tailored question sets for Java Developer, React Frontend, Backend Systems, Full Stack, Python, Data Analyst, and Behavioral HR tracks.',
      tag: '8+ Tracks',
    },
    {
      icon: Zap,
      title: 'Instant Performance Analysis',
      description:
        'Receive immediate structured breakdowns with explicit strengths, missed technical nuances, and areas to improve before the next question.',
      tag: 'Real-time',
    },
    {
      icon: Clock,
      title: 'Interview History',
      description:
        'Every practice session is persistently recorded with full question-by-question logs, answers, and evaluations for post-interview review.',
      tag: 'Persistent',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description:
        'Visual radar breakdowns and trend charts displaying your evolution in conceptual depth, communication, and technical readiness over time.',
      tag: 'Analytics',
    },
    {
      icon: HelpCircle,
      title: 'Technical + HR Questions',
      description:
        'Comprehensive balance of data structures, architecture, framework internals, SQL queries, and STAR behavioral scenarios.',
      tag: 'Balanced Bank',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Choose Your Role',
      description: 'Select your target engineering or analyst domain and desired difficulty level.',
    },
    {
      number: '02',
      title: 'Start Interview',
      description: 'Step into a distraction-free, timed mock session mimicking authentic tech interviews.',
    },
    {
      number: '03',
      title: 'Answer Questions',
      description: 'Articulate your solution, architecture choices, or STAR story in the response editor.',
    },
    {
      number: '04',
      title: 'Get AI Feedback',
      description: 'Unlock immediate scores, identified strengths, model answers, and improvement tips.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 lg:pt-28">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Heading and CTAs */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Next-Gen Campus Placement Preparation</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Practice Interviews.{' '}
                <span className="block bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Build Confidence.
                </span>{' '}
                Get AI-Powered Feedback.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Prepare for your next technical interview with realistic role-based interviews and instant AI feedback. Master technical depth, communication clarity, and situational judgment.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to={isAuthenticated ? '/start-interview' : '/login'}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-base shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-400 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span>Start Interview</span>
                </Link>
                <Link
                  to="/features"
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-base hover:bg-slate-800/80 hover:text-white transition-colors"
                >
                  <span>Explore Features</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Statistics Strip */}
              <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center lg:text-left">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">10K+</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Practice Sessions</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">50+</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Interview Topics</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">AI</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Instant Feedback</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">24/7</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Available On-Demand</p>
                </div>
              </div>
            </div>

            {/* Right Column: AI Interview Simulator Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-xl shadow-indigo-500/10">
                {/* Simulator Window Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex items-center space-x-2 px-2.5 py-1 rounded-md bg-slate-800/80 text-[11px] font-mono text-indigo-300">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Interviewer • Active</span>
                  </div>
                </div>

                {/* Question Bubble */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">
                        Java Developer • Question 3/10
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300">
                        Medium
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-100">
                      "Explain the difference between HashMap and Hashtable in Java."
                    </p>
                  </div>

                  {/* Candidate Answer Box */}
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Candidate Response</span>
                      <span className="font-mono text-emerald-400">01:45</span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">
                      "HashMap is non-synchronized and faster, allowing one null key. Hashtable is legacy, thread-safe, and does not allow null keys..."
                    </p>
                  </div>

                  {/* AI Evaluation Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white">AI Evaluation Score</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        8.5 / 10
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Correctness</span>
                        <span className="font-bold text-slate-200">8 / 10</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Clarity</span>
                        <span className="font-bold text-slate-200">9 / 10</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-emerald-400 flex items-center space-x-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Good distinction between thread safety and null handling.</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-800/50 text-indigo-400 text-xs font-medium">
            <span>Built For Placement Success</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Interview Engine
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Everything you need to transition from passive reading to active, realistic interview practice under interview conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:bg-slate-900 hover:-translate-y-1 duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2.5 py-1 rounded-md bg-slate-800/80">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-16 border-y border-slate-900 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Simulate an end-to-end technical interview in four intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {steps.map((st, i) => (
              <div key={i} className="relative space-y-4 p-5 rounded-xl bg-slate-900/40 border border-slate-800">
                <span className="text-3xl font-extrabold text-indigo-500/50 font-mono">{st.number}</span>
                <h3 className="text-lg font-bold text-white">{st.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Roles Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 text-xs font-medium">
              <span>Tailored Tracks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Supported Roles & Tracks
            </h2>
            <p className="text-sm text-slate-400 max-w-xl">
              Practice specialized technical questions and behavioral scenarios aligned with campus hiring tests.
            </p>
          </div>

          <Link
            to="/start-interview"
            className="flex items-center space-x-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View all tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingRoles ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                      <RoleIcon name={role.icon || role.slug} className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300">
                      {role.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{role.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                    {role.description}
                  </p>
                </div>

                <button
                  onClick={() => handleRoleStart(role.id)}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent text-xs font-semibold transition-all group-hover:shadow-lg group-hover:shadow-indigo-600/20"
                >
                  <span>Start Interview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 p-8 sm:p-12 lg:p-16 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Free Campus Student Edition</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to prepare for your next interview?
          </h2>

          <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Gain the confidence and technical precision demanded by top recruiters. Practice role-specific questions and unlock granular AI evaluation today.
          </p>

          <div className="pt-2">
            <Link
              to={isAuthenticated ? '/start-interview' : '/register'}
              className="inline-flex items-center space-x-2.5 px-9 py-4 rounded-xl bg-white text-slate-950 font-bold text-base shadow-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Practicing Now</span>
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
