import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  BarChart3,
  Award,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Brain,
  Zap,
} from 'lucide-react';
import { dashboardApi, interviewApi } from '../../services/api';
import { DashboardStats, InterviewSession } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';

export const ProgressPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardApi.getStudentStats(), interviewApi.getHistory()])
      .then(([dashData, historyData]) => {
        setStats(dashData);
        setSessions(historyData);
      })
      .catch((err) => console.error('Failed to load progress analytics', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-2xl bg-slate-900 border border-slate-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
          <div className="h-64 rounded-2xl bg-slate-900 border border-slate-800" />
        </div>
      </div>
    );
  }

  // Calculate role-wise averages
  const roleWiseMap = new Map<string, { total: number; count: number; icon: string }>();
  sessions.forEach((s) => {
    if (s.status === 'COMPLETED' && s.overallScore) {
      const existing = roleWiseMap.get(s.roleName) || { total: 0, count: 0, icon: s.roleIcon };
      existing.total += s.overallScore;
      existing.count += 1;
      roleWiseMap.set(s.roleName, existing);
    }
  });

  const completedSessionsAsc = [...sessions]
    .filter((s) => s.status === 'COMPLETED' && s.overallScore)
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Longitudinal Performance Analytics</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Skill Progress & Mastery</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Track score improvements across practice rounds, review technical proficiency, and identify focal areas before real company placement drives.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Overall Average Score
          </span>
          <div className="text-4xl font-extrabold text-indigo-400">
            {stats?.averageScore ? `${stats.averageScore}%` : '0%'}
          </div>
          <p className="text-xs text-slate-400">Calculated across all completed mock sessions</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Completed Sessions
          </span>
          <div className="text-4xl font-extrabold text-emerald-400">
            {stats?.completedSessions || 0}
          </div>
          <p className="text-xs text-slate-400">Full interviews submitted to AI engine</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Highest Score Achieved
          </span>
          <div className="text-4xl font-extrabold text-cyan-400">
            {stats?.bestScore ? `${stats.bestScore}%` : '0%'}
          </div>
          <p className="text-xs text-slate-400">Top-tier benchmark performance</p>
        </div>
      </div>

      {/* Average Score Over Time Chart Simulation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Score Trajectory Over Time</span>
            </h3>
            <p className="text-xs text-slate-400">Chronological score history for completed sessions</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 w-max">
            Trend: Upward Ready
          </span>
        </div>

        {completedSessionsAsc.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 space-y-2">
            <p>No completed interviews found yet.</p>
            <Link to="/start-interview" className="text-indigo-400 font-semibold hover:underline">
              Start practicing to build your score curve →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end space-x-3 sm:space-x-6 h-48 pt-6 pb-2 border-b border-slate-800 overflow-x-auto">
              {completedSessionsAsc.map((s, idx) => {
                const score = s.overallScore || 0;
                const heightPercent = Math.max(15, Math.min(100, score));
                return (
                  <div key={s.id} className="flex-1 min-w-[50px] flex flex-col items-center justify-end h-full group">
                    <span className="text-[11px] font-mono font-bold text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1">
                      {Math.round(score)}%
                    </span>
                    <div
                      className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-indigo-600 via-indigo-500 to-cyan-400 group-hover:brightness-125 transition-all shadow-lg shadow-indigo-600/20"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-500 mt-2 truncate w-full text-center">
                      Round {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Initial Attempt</span>
              <span>Latest Milestone</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid: Role-wise Performance & Dimensional Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Role-wise Performance */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Role-wise Performance</span>
            </h3>
            <p className="text-xs text-slate-400">Averaged scores segmented by interview track</p>
          </div>

          {roleWiseMap.size === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              Complete mock sessions in various roles to compare proficiency.
            </p>
          ) : (
            <div className="space-y-4">
              {Array.from(roleWiseMap.entries()).map(([roleName, data]) => {
                const avg = Math.round(data.total / data.count);
                return (
                  <div key={roleName} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 font-medium text-slate-200">
                        <RoleIcon name={data.icon} className="w-4 h-4 text-indigo-400" />
                        <span>{roleName}</span>
                      </div>
                      <span className="font-bold text-emerald-400 font-mono">{avg}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block text-right">
                      {data.count} session{data.count > 1 ? 's' : ''} completed
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill Dimensions (Technical vs Communication vs Completeness) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <span>Evaluator Competency Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">Evaluation breakdown across key dimensions</p>
          </div>

          <div className="space-y-5">
            {Object.entries(stats?.skillsBreakdown || {}).map(([skill, val]) => (
              <div key={skill} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{skill}</span>
                  <span className="font-bold text-indigo-400 font-mono">{Math.round(val)}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strongest Skills & Improvement Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>Strongest Skills</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {stats?.strengths?.map((str, i) => (
              <li key={i} className="flex items-start space-x-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Target Improvement Focus</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {stats?.areasToImprove?.map((area, i) => (
              <li key={i} className="flex items-start space-x-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-amber-400 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
