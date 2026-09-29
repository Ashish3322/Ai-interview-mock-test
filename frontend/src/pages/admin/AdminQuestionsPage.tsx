import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Filter,
  Save,
} from 'lucide-react';
import { adminApi, rolesApi } from '../../services/api';
import { Question, Role } from '../../types';
import { useToast } from '../../context/ToastContext';

export const AdminQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [roleId, setRoleId] = useState<number>(1);
  const [category, setCategory] = useState('Technical');
  const [questionText, setQuestionText] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [expectedTopics, setExpectedTopics] = useState('');
  const [modelAnswer, setModelAnswer] = useState('');
  const [active, setActive] = useState(true);

  const { success, error } = useToast();

  const loadData = () => {
    Promise.all([adminApi.getQuestions(), rolesApi.getAll(false)])
      .then(([qData, rData]) => {
        setQuestions(qData);
        setRoles(rData);
        if (rData.length > 0 && !editingQuestion) {
          setRoleId(rData[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load questions/roles', err);
        error('Could not load question repository.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingQuestion(null);
    setRoleId(roles[0]?.id || 1);
    setCategory('Technical');
    setQuestionText('');
    setDifficulty('Medium');
    setExpectedTopics('');
    setModelAnswer('');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (q: Question) => {
    setEditingQuestion(q);
    setRoleId(q.roleId);
    setCategory(q.category);
    setQuestionText(q.questionText);
    setDifficulty(q.difficulty);
    setExpectedTopics(q.expectedTopics || '');
    setModelAnswer(q.modelAnswer || '');
    setActive(q.active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) {
      error('Question text is required.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Question> = {
        roleId,
        category,
        questionText: questionText.trim(),
        difficulty,
        expectedTopics: expectedTopics.trim(),
        modelAnswer: modelAnswer.trim(),
        active,
      };

      if (editingQuestion) {
        const updated = await adminApi.updateQuestion(editingQuestion.id, payload);
        success('Question updated successfully!');
        setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      } else {
        const created = await adminApi.createQuestion(payload);
        success('New question created!');
        setQuestions((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      await adminApi.deleteQuestion(id);
      success('Question deleted successfully.');
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err: any) {
      error('Failed to delete question.');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await adminApi.toggleQuestion(id);
      setQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
      success(`Question ${updated.active ? 'enabled' : 'disabled'}.`);
    } catch (err: any) {
      error('Failed to toggle question status.');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRoleFilter === 'ALL' || q.roleId === Number(selectedRoleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <HelpCircle className="w-7 h-7 text-indigo-400" />
            <span>Question Bank Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Curate questions, expected keywords, model answers, and difficulty levels across tracks.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search questions or categories..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="w-full sm:w-auto py-2 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="ALL">All Roles ({questions.length})</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Questions Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-slate-900/30 border border-slate-800 space-y-3">
          <p className="text-sm font-semibold text-slate-300">No questions match criteria</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Create First Question
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">Track / Role</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Question Prompt</th>
                <th className="py-3.5 px-4 font-semibold">Difficulty</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuestions.map((q) => (
                <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-200 whitespace-nowrap">
                    {q.roleName || roles.find((r) => r.id === q.roleId)?.name || 'Role'}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold">
                      {q.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-300 max-w-md">
                    <p className="line-clamp-2 leading-relaxed font-medium">{q.questionText}</p>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        q.difficulty === 'Hard'
                          ? 'bg-rose-500/15 text-rose-300'
                          : q.difficulty === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggle(q.id)}
                      className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                        q.active
                          ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {q.active ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-500" />}
                      <span>{q.active ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openEditModal(q)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete Question"
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

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative max-w-2xl w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h3>
              <p className="text-xs text-slate-400">
                Define the question prompt, expected topics for AI evaluation, and model response.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Target Role</label>
                  <select
                    value={roleId}
                    onChange={(e) => setRoleId(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['Technical', 'Coding', 'Database', 'System Design', 'Behavioral', 'HR'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    {['Easy', 'Medium', 'Hard'].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Status</label>
                  <div className="flex items-center space-x-4 pt-2">
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={(e) => setActive(e.target.checked)}
                        className="rounded border-slate-700 text-amber-500 focus:ring-0"
                      />
                      <span>Active in Question Pool</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Question Text</label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={3}
                  required
                  placeholder="e.g. Explain how the Virtual DOM works in React."
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Expected Topics / Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={expectedTopics}
                  onChange={(e) => setExpectedTopics(e.target.value)}
                  placeholder="diffing algorithm, reconciliation, state updates, render cycle"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Model Answer</label>
                <textarea
                  value={modelAnswer}
                  onChange={(e) => setModelAnswer(e.target.value)}
                  rows={4}
                  placeholder="Comprehensive reference explanation against which candidate answers are graded..."
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Question'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
