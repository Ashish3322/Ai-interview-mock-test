import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { History, Search, FileText, CheckCircle2, Clock } from 'lucide-react';
import { adminApi } from '../../services/api';
import { InterviewSession } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';

export const AdminInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    adminApi
      .getAllInterviews()
      .then((data) => setInterviews(data))
      .catch((err) => console.error('Failed to load all interviews', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = interviews.filter(
    (s) =>
      s.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <History className="w-7 h-7 text-amber-400" />
          <span>All Platform Interview Sessions</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Global log of all candidate interview attempts and evaluations.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by track, status..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Session ID</th>
                <th className="py-3.5 px-4 font-semibold">Role Track</th>
                <th className="py-3.5 px-4 font-semibold">Questions</th>
                <th className="py-3.5 px-4 font-semibold">Score</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Initiated At</th>
                <th className="py-3.5 px-4 font-semibold text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-mono text-slate-400">#{s.id}</td>
                  <td className="py-4 px-4 font-medium text-slate-200">
                    <div className="flex items-center space-x-2">
                      <RoleIcon name={s.roleIcon} className="w-4 h-4 text-indigo-400" />
                      <span>{s.roleName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    {s.responses ? s.responses.length : s.totalQuestions} Questions
                  </td>
                  <td className="py-4 px-4 font-bold">
                    {s.status === 'COMPLETED' ? (
                      <span className="text-emerald-400 font-mono">
                        {s.overallScore ? `${Math.round(s.overallScore)}%` : '0%'}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">In Progress</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        s.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(s.startedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/report/${s.id}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-all font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
