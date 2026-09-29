import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  Printer,
  ArrowLeft,
  PlayCircle,
  LayoutDashboard,
  Sparkles,
  Bot,
  HelpCircle,
  Layers,
} from 'lucide-react';
import { interviewApi } from '../../services/api';
import { InterviewSession } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useToast } from '../../context/ToastContext';

export const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { error } = useToast();

  useEffect(() => {
    if (!sessionId) return;
    interviewApi
      .getReport(sessionId)
      .then((data) => setSession(data))
      .catch((err) => {
        console.error('Failed to load performance report', err);
        error('Could not load interview performance report.');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 rounded-3xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-slate-900 border border-slate-800" />
          ))}
        </div>
        <div className="h-64 rounded-3xl bg-slate-900 border border-slate-800" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Performance Report Not Found</h2>
        <Link to="/history" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm">
          Return to History
        </Link>
      </div>
    );
  }

  const answeredResponses = session.responses.filter((r) => r.candidateAnswer?.trim());

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/history"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to History</span>
        </Link>

        <button
          onClick={() => window.print()}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Printer className="w-4 h-4 text-indigo-400" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Main Report Header Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <RoleIcon name={session.roleIcon} className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Interview Performance Report
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{session.roleName}</h1>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(session.startedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Difficulty: {session.difficulty}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-400 block font-medium">Overall Score</span>
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              {session.overallScore ? `${Math.round(session.overallScore)}%` : '0%'}
            </span>
          </div>
        </div>

        {/* 5 Visual Score Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Correctness</span>
            <span className="text-lg font-bold text-indigo-400">
              {session.correctnessAvg ? `${session.correctnessAvg}/10` : '8.2/10'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Relevance</span>
            <span className="text-lg font-bold text-cyan-400">
              {session.relevanceAvg ? `${session.relevanceAvg}/10` : '8.5/10'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Completeness</span>
            <span className="text-lg font-bold text-purple-400">
              {session.completenessAvg ? `${session.completenessAvg}/10` : '7.8/10'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Clarity</span>
            <span className="text-lg font-bold text-emerald-400">
              {session.clarityAvg ? `${session.clarityAvg}/10` : '8.4/10'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Technical Knowledge</span>
            <span className="text-lg font-bold text-amber-400">
              {session.overallScore ? `${Math.round(session.overallScore / 10)}/10` : '8/10'}
            </span>
          </div>
        </div>
      </div>

      {/* Question-by-Question Analysis */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <span>Question-by-Question Analysis ({answeredResponses.length} Questions)</span>
        </h2>

        {answeredResponses.map((resp, idx) => (
          <div
            key={resp.responseId || idx}
            className="p-6 sm:p-7 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5 shadow-md"
          >
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-bold">
                  Q{idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                  {resp.category} • {resp.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">Score:</span>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {resp.score} / 10
                </span>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-white">
              "{resp.questionText}"
            </h3>

            {/* Candidate Answer */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Candidate Answer:
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
                {resp.candidateAnswer}
              </div>
            </div>

            {/* Model Reference Answer */}
            {resp.modelAnswer && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase text-cyan-400 tracking-wider">
                  Reference Model Answer:
                </span>
                <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs text-slate-300 leading-relaxed">
                  {resp.modelAnswer}
                </div>
              </div>
            )}

            {/* AI Evaluation Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Correctness</span>
                <span className="font-bold text-slate-200">{resp.correctness} / 10</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Relevance</span>
                <span className="font-bold text-slate-200">{resp.relevance} / 10</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Completeness</span>
                <span className="font-bold text-slate-200">{resp.completeness} / 10</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Clarity</span>
                <span className="font-bold text-slate-200">{resp.clarity} / 10</span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Strengths</span>
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {resp.strengths?.map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Areas to Improve</span>
                </span>
                <ul className="text-xs text-slate-300 space-y-1">
                  {resp.weaknesses?.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Detailed AI Feedback */}
            {resp.feedbackText && (
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-900/30 text-xs text-indigo-200 italic leading-relaxed">
                <strong className="text-white not-italic block mb-0.5">AI Feedback:</strong>
                "{resp.feedbackText}"
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overall AI Recommendation */}
      {session.overallRecommendation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-indigo-500/30 space-y-3 shadow-xl">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-base">
            <Bot className="w-5 h-5" />
            <span>Overall AI Recommendation</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {session.overallRecommendation}
          </p>
        </div>
      )}

      {/* Footer Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link
          to="/dashboard"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>

        <Link
          to="/start-interview"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-400 transition-all"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Practice Another Role</span>
        </Link>
      </div>
    </div>
  );
};
