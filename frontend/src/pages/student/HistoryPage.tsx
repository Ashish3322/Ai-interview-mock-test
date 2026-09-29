import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Trash2,
  FileText,
  PlayCircle,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { interviewApi } from '../../services/api';
import { InterviewSession } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useToast } from '../../context/ToastContext';

export const HistoryPage: React.FC = () => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'IN_PROGRESS'>('ALL');

  const { success, error } = useToast();

  const loadHistory = () => {
    interviewApi
      .getHistory()
      .then((data) => setSessions(data))
      .catch((err) => {
        console.error('Failed to load history', err);
        error('Could not load interview history.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this interview session?')) return;

    try {
      await interviewApi.deleteSession(id);
      success('Interview session deleted.');
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      error('Failed to delete interview session.');
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch = s.roleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || s.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <History className="w-7 h-7 text-indigo-400" />
            <span>Interview History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review past mock sessions, examine detailed reports, or resume unfinished interviews.
          </p>
        </div>

        <Link
          to="/start-interview"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/20 hover:from-indigo-500 hover:to-indigo-400 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Interview</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by role (e.g. Java, React)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          {(['ALL', 'COMPLETED', 'IN_PROGRESS'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                statusFilter === filter
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {filter === 'ALL' ? 'All' : filter === 'COMPLETED' ? 'Completed' : 'In Progress'}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/30 border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No interview sessions found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your search criteria or filter tags.'
              : 'You have not practiced any mock interviews yet. Start your first session to track progress!'}
          </p>
          <Link
            to="/start-interview"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            <span>Start Practice</span>
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Questions</th>
                <th className="py-3.5 px-4 font-semibold">Score</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(session.startedAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-200 whitespace-nowrap">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <RoleIcon name={session.roleIcon} className="w-3.5 h-3.5" />
                      </div>
                      <span>{session.roleName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-300 whitespace-nowrap">
                    {session.totalQuestions} Questions
                  </td>
                  <td className="py-4 px-4 font-bold whitespace-nowrap">
                    {session.status === 'COMPLETED' ? (
                      <span className="text-emerald-400 font-mono">
                        {session.overallScore ? `${Math.round(session.overallScore)}%` : '0%'}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono">--</span>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        session.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                    {session.status === 'COMPLETED' ? (
                      <Link
                        to={`/report/${session.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all font-semibold"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Report</span>
                      </Link>
                    ) : (
                      <Link
                        to={`/interview/${session.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-all font-semibold"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </Link>
                    )}

                    <button
                      onClick={() => handleDelete(session.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
