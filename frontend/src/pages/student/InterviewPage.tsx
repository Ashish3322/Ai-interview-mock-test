import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
  Bot,
  RefreshCw,
  LayoutDashboard,
  FileText,
  HelpCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { interviewApi } from '../../services/api';
import { InterviewSession, ResponseDetail } from '../../types';
import { useToast } from '../../context/ToastContext';

export const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const sessionId = Number(id);
  const navigate = useNavigate();
  const { error, success } = useToast();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [lastEvaluatedResponse, setLastEvaluatedResponse] = useState<ResponseDetail | null>(null);
  const [showTips, setShowTips] = useState(false);

  // Timer state
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Load session
  const loadSession = () => {
    if (!sessionId) return;
    interviewApi
      .getById(sessionId)
      .then((data) => {
        setSession(data);
        if (data.status === 'COMPLETED') {
          triggerConfetti();
        }
      })
      .catch((err) => {
        console.error('Failed to load interview session', err);
        error('Could not load interview session.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  // Stopwatch timer for current question
  useEffect(() => {
    if (!session || session.status === 'COMPLETED' || evaluating || lastEvaluatedResponse) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [session, evaluating, lastEvaluatedResponse]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if confetti not supported
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitAnswer = async () => {
    if (!session || !session.currentQuestion) return;
    if (!candidateAnswer.trim()) {
      error('Please write your answer before submitting.');
      return;
    }

    setEvaluating(true);
    try {
      const updated = await interviewApi.submitAnswer(session.id, {
        questionId: session.currentQuestion.id,
        answer: candidateAnswer,
        timeTakenSeconds: elapsedSeconds,
      });

      // Find the response that was just evaluated
      const justEvaluated = updated.responses.find(
        (r) => r.questionId === session.currentQuestion?.id
      );

      setSession(updated);
      setLastEvaluatedResponse(justEvaluated || null);
      success('Answer evaluated by AI!');

      if (updated.status === 'COMPLETED') {
        triggerConfetti();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Unable to submit answer. Please try again.';
      error(msg);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    setLastEvaluatedResponse(null);
    setCandidateAnswer('');
    setElapsedSeconds(0);
    loadSession();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Preparing interview session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Interview Session Not Found</h2>
        <Link to="/start-interview" className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm">
          Return to Interviews
        </Link>
      </div>
    );
  }

  // ==========================================
  // COMPLETION SCREEN
  // ==========================================
  if (session.status === 'COMPLETED' && !lastEvaluatedResponse) {
    const answeredCount = session.responses.filter((r) => r.candidateAnswer?.trim()).length;
    const allStrengths = Array.from(new Set(session.responses.flatMap((r) => r.strengths || []))).slice(0, 4);
    const allWeaknesses = Array.from(new Set(session.responses.flatMap((r) => r.weaknesses || []))).slice(0, 4);

    return (
      <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
        <div className="text-center space-y-3">
          <span className="text-5xl">🎉</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interview Completed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Great job! You finished the <strong className="text-indigo-300">{session.roleName}</strong> mock interview session.
          </p>
        </div>

        {/* Score Showcase Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-2xl text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">
              Overall Candidate Score
            </span>
            <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
              {session.overallScore ? `${Math.round(session.overallScore)}%` : '0%'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-4 border-t border-slate-800">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Questions Answered</span>
              <span className="text-lg font-bold text-white">
                {answeredCount} / {session.totalQuestions}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Average Rating</span>
              <span className="text-lg font-bold text-emerald-400">
                {session.overallScore ? `${Math.round(session.overallScore)}%` : '0%'}
              </span>
            </div>
          </div>

          {session.overallRecommendation && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left text-xs sm:text-sm text-indigo-200 leading-relaxed">
              <strong className="text-white block mb-1">AI Recommendation:</strong>
              {session.overallRecommendation}
            </div>
          )}
        </div>

        {/* Strengths & Areas to Improve Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allStrengths.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {allStrengths.map((str, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {allWeaknesses.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Areas to Improve</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {allWeaknesses.map((w, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={`/report/${session.id}`}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-400 transition-all hover:scale-105 active:scale-95"
          >
            <FileText className="w-4 h-4" />
            <span>View Full Report</span>
          </Link>

          <Link
            to="/start-interview"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-indigo-400" />
            <span>Try Again</span>
          </Link>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Go to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // ACTIVE INTERVIEW SCREEN
  // ==========================================
  const currentQNumber = session.currentQuestionIndex + 1;
  const progressPercent = Math.min(100, Math.round(((session.currentQuestionIndex) / session.totalQuestions) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold text-white">AI Interview</h2>
                <span className="text-slate-500">•</span>
                <span className="text-sm font-semibold text-indigo-400">{session.roleName}</span>
              </div>
              <p className="text-xs text-slate-400">
                Question {currentQNumber} / {session.totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Live Stopwatch Timer */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to finish the interview session early?')) {
                  interviewApi.finish(session.id).then(loadSession);
                }
              }}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              Finish Early
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Overall Progress</span>
            <span className="font-semibold text-indigo-400">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {session.currentQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between text-xs">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase text-[10px] tracking-wider">
              {session.currentQuestion.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-semibold ${
                session.currentQuestion.difficulty === 'Hard'
                  ? 'bg-rose-500/15 text-rose-300'
                  : session.currentQuestion.difficulty === 'Medium'
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'bg-emerald-500/15 text-emerald-300'
              }`}
            >
              {session.currentQuestion.difficulty}
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-white leading-snug">
            "{session.currentQuestion.questionText}"
          </h3>

          {/* Answer Tips Accordion */}
          <div className="pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowTips(!showTips)}
              className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Interview Tips & Guidance</span>
              {showTips ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {showTips && (
              <div className="mt-2.5 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1 leading-relaxed animate-in fade-in">
                <p>• Structure your answer: Define the core concept, elaborate the mechanism, and cite real-world usage or tradeoffs.</p>
                <p>• For coding or architecture questions, highlight complexity (time & space) or thread-safety.</p>
                <p>• For behavioral questions, strictly utilize the STAR format (Situation, Task, Action, Result).</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Answer Area or Evaluated Result Card */}
      {!lastEvaluatedResponse ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Your Response</span>
            <div className="flex items-center space-x-3">
              <span>{candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0} words</span>
              <span>{candidateAnswer.length} characters</span>
            </div>
          </div>

          <textarea
            value={candidateAnswer}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            disabled={evaluating}
            rows={7}
            placeholder="Type your structured answer here. Explain underlying principles, comparisons, tradeoffs, or code logic..."
            className="w-full p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm leading-relaxed focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-y disabled:opacity-50"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-[11px] text-slate-500 hidden sm:block">
              Take your time to articulate clearly. Responses are scored by the AI evaluator.
            </span>

            <button
              onClick={handleSubmitAnswer}
              disabled={evaluating || !candidateAnswer.trim()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            >
              {evaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI is evaluating your answer...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Display Evaluated Result */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base font-bold text-white">AI Evaluation Result</h4>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Question Score:</span>
              <span className="px-3 py-1 rounded-full text-sm font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Score: {lastEvaluatedResponse.score} / 10
              </span>
            </div>
          </div>

          {/* 4 Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Correctness</span>
              <span className="text-base font-bold text-indigo-400">
                {lastEvaluatedResponse.correctness} / 10
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Relevance</span>
              <span className="text-base font-bold text-cyan-400">
                {lastEvaluatedResponse.relevance} / 10
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Completeness</span>
              <span className="text-base font-bold text-purple-400">
                {lastEvaluatedResponse.completeness} / 10
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase font-semibold">Clarity</span>
              <span className="text-base font-bold text-emerald-400">
                {lastEvaluatedResponse.clarity} / 10
              </span>
            </div>
          </div>

          {/* Strengths & Areas to Improve */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Strengths</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lastEvaluatedResponse.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Areas to Improve</span>
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {lastEvaluatedResponse.weaknesses?.map((w, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Feedback Text */}
          {lastEvaluatedResponse.feedbackText && (
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5">
              <span className="text-xs font-bold text-indigo-300 block">AI Feedback:</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                "{lastEvaluatedResponse.feedbackText}"
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNextQuestion}
              className="flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 hover:from-indigo-500 hover:to-indigo-400 transition-all hover:scale-105 active:scale-95"
            >
              <span>
                {session.currentQuestionIndex >= session.totalQuestions - 1
                  ? 'Complete Interview'
                  : 'Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
