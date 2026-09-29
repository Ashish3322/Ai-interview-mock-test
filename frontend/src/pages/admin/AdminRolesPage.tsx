import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { adminApi, rolesApi } from '../../services/api';
import { Role } from '../../types';
import { RoleIcon } from '../../components/common/RoleIcon';
import { useToast } from '../../context/ToastContext';

export const AdminRolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('coffee');
  const [difficulty, setDifficulty] = useState('Medium');
  const [active, setActive] = useState(true);

  const { success, error } = useToast();

  const loadRoles = () => {
    rolesApi
      .getAll(false)
      .then((data) => setRoles(data))
      .catch((err) => {
        console.error('Failed to load roles', err);
        error('Could not load roles.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const openAddModal = () => {
    setEditingRole(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('coffee');
    setDifficulty('Medium');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setName(role.name);
    setSlug(role.slug);
    setDescription(role.description || '');
    setIcon(role.icon || 'coffee');
    setDifficulty(role.difficulty || 'Medium');
    setActive(role.active);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingRole) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Role name is required.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<Role> = {
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        description: description.trim(),
        icon: icon.trim(),
        difficulty,
        active,
      };

      if (editingRole) {
        const updated = await adminApi.updateRole(editingRole.id, payload);
        success('Role updated successfully!');
        setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await adminApi.createRole(payload);
        success('New role added!');
        setRoles((prev) => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      error(err.response?.data?.message || 'Failed to save role.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Deleting this role will remove all associated interview questions and candidate sessions. Proceed?')) return;

    try {
      await adminApi.deleteRole(id);
      success('Role deleted successfully.');
      setRoles((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      error('Failed to delete role.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
            <Briefcase className="w-7 h-7 text-amber-400" />
            <span>Interview Roles & Tracks</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Define domain competencies, target interview personas, and default difficulty parameters.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <RoleIcon name={role.icon || role.slug} className="w-5 h-5" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        role.difficulty === 'Hard'
                          ? 'bg-rose-500/15 text-rose-300'
                          : role.difficulty === 'Medium'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-emerald-500/15 text-emerald-300'
                      }`}
                    >
                      {role.difficulty}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${role.active ? 'bg-emerald-400' : 'bg-slate-600'}`}
                      title={role.active ? 'Active' : 'Inactive'}
                    />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1">{role.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {role.description}
                </p>
                <span className="text-[11px] font-mono text-slate-500 block">
                  Slug: {role.slug}
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => openEditModal(role)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Edit Role"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete Role"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Role Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
          <div className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-white">
                {editingRole ? 'Edit Track' : 'Create New Track'}
              </h3>
              <p className="text-xs text-slate-400">Configure target title and track parameters.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Track Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="e.g. Cloud & DevOps Engineer"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="cloud-devops"
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Default Difficulty</label>
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
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Icon Keyword</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="coffee">Coffee (Java)</option>
                  <option value="layout">Layout (Frontend)</option>
                  <option value="server">Server (Backend)</option>
                  <option value="layers">Layers (Full Stack)</option>
                  <option value="code">Code (Python)</option>
                  <option value="bar-chart">Bar Chart (Data Analyst)</option>
                  <option value="cpu">CPU (Software Engineer)</option>
                  <option value="users">Users (HR / Behavioral)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Summary of skills and competencies tested in this track..."
                  className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="roleActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500"
                />
                <label htmlFor="roleActive" className="text-xs text-slate-300 cursor-pointer">
                  Track is Active & Visible to Candidates
                </label>
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
                  <span>{saving ? 'Saving...' : 'Save Track'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
