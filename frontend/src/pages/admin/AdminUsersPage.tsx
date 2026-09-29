import React, { useState, useEffect } from 'react';
import { Users, Search, Target, Calendar, ShieldCheck, User } from 'lucide-react';
import { adminApi } from '../../services/api';
import { User as UserType } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    adminApi
      .getUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load users', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.targetRole && u.targetRole.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center space-x-3">
          <Users className="w-7 h-7 text-amber-400" />
          <span>Registered Platform Users</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Directory of student candidates and platform administrators.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, target role..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="py-3.5 px-4 font-semibold">User Details</th>
                <th className="py-3.5 px-4 font-semibold">Role / Permissions</th>
                <th className="py-3.5 px-4 font-semibold">Target Career Track</th>
                <th className="py-3.5 px-4 font-semibold">Enrolled On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.role === 'ROLE_ADMIN'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {u.role === 'ROLE_ADMIN' ? 'Platform Admin' : 'Candidate'}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{u.targetRole || 'Software Engineer'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-slate-400">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Initial Seed'}
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
