import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  HelpCircle,
  Clock,
  Layers,
  CheckCircle2,
  X,
  Sliders,
  Shield,
} from 'lucide-react';
import { rolesApi, interviewApi } from '../../services/api';
import { Role } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useToast } from '../../context/ToastContext';

export const StartInterviewPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Configuration Modal state
  const [difficulty, setDifficulty] = useState<string>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [starting, setStarting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { error, success } = useToast();

  useEffect(() => {
    rolesApi
      .getAll(true)
      .then((data) => {
        setRoles(data);

        // Check if roleId was passed via query params
        const params = new URLSearchParams(location.search);
        const preselectedId = params.get('roleId');
        if (preselectedId) {
          const match = data.find((r) => r.id === Number(preselectedId));
          if (match) {
            setSelectedRole(match);
            setDifficulty(match.difficulty || 'Medium');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load roles', err);
        error('Could not load interview tracks.');
      })
      .finally(() => setLoading(false));
  }, [location.search]);

  const handleOpenConfig = (role: Role) => {
    setSelectedRole(role);
    setDifficulty(role.difficulty || 'Medium');
  };

  const handleStart = async () => {
    if (!selectedRole) return;

    setStarting(true);
    try {
      const session = await interviewApi.start({
        roleId: selectedRole.id,
        difficulty,
        totalQuestions: questionCount,
      });
      success(`Started ${selectedRole.name} interview!`);
      navigate(`/interview/${session.id}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to start interview session. Please try again.';
      error(msg);
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Simulation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Choose Your Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
          Select the domain track you wish to prepare for. Configure your difficulty and session duration, then step into an AI-evaluated mock interview.
        </p>
      </div>

      {/* Role Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="group flex flex-col justify-between p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all duration-200 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <RoleIcon name={role.icon || role.slug} className="w-6 h-6" />
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      role.difficulty === 'Hard'
                        ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        : role.difficulty === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {role.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{role.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-6">
                  {role.description}
                </p>
              </div>

              <button
                onClick={() => handleOpenConfig(role)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-transparent text-xs font-semibold transition-all group-hover:shadow-lg group-hover:shadow-indigo-600/20"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Configure & Start</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Configuration Modal / Step */}
      {selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedRole(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <RoleIcon name={selectedRole.icon || selectedRole.slug} className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedRole.name}</h3>
                <p className="text-xs text-indigo-400 font-medium">Session Setup & Calibration</p>
              </div>
            </div>

            {/* Config Options */}
            <div className="space-y-4 pt-2">
              {/* Difficulty Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Easy', 'Medium', 'Hard'].map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => setDifficulty(diff)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        difficulty === diff
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Questions Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Number of Questions</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        questionCount === count
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {count} Questions
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Overview Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Duration</span>
                  <span className="font-semibold text-slate-200">{questionCount * 2} - {questionCount * 3} mins</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Evaluation Type</span>
                  <span className="font-semibold text-emerald-400">Structured AI Scoring</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStart}
              disabled={starting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
            >
              {starting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Configuring Session...</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-5 h-5" />
                  <span>Start Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
