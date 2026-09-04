import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { UserRole, User } from '../../types';
import { Users, Plus, Shield, Check, Trash2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, addUser, updateUserRole, deleteUser } = useNews();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('সহকারী সম্পাদক');
  const [role, setRole] = useState<UserRole>('author');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name: name.trim(),
      email: email.trim(),
      title: title.trim(),
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isActive: true
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'editor':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'author':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'moderator':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-600" />
            <span>নিউজ টিম ও রোল পারমিশন (Editorial Team)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            সম্পাদক, সাংবাদিক ও মডারেটরদের একাউন্ট এবং রোল-ভিত্তিক অ্যাক্সেস নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন সদস্য যোগ করুন</span>
        </button>
      </div>

      {showAddModal && (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">নতুন সহকর্মীর তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="উদাঃ শায়লা আহমেদ"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ইমেইল ঠিকানা *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@deshreport.com"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                পদবী (Designation)
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="জ্যেষ্ঠ প্রতিবেদক"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                অ্যাডমিন রোল (Role)
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="super_admin">সুপার অ্যাডমিন (Super Admin - সম্পূর্ণ নিয়ন্ত্রণ)</option>
                <option value="editor">বার্তা সম্পাদক (Editor - সম্পাদনা ও প্রকাশনা)</option>
                <option value="author">প্রতিবেদক (Author - সংবাদ রচনা ও খসড়া জমা)</option>
                <option value="moderator">মডারেটর (Moderator - মন্তব্য ও পর্যালোচনা)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs text-gray-500"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
            >
              যোগ করুন
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">ব্যবহারকারী</th>
              <th className="py-3 px-3">ইমেইল</th>
              <th className="py-3 px-3">পদবী</th>
              <th className="py-3 px-3">রোল (Role)</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-slate-700"
                  />
                  <span className="font-bold font-serif-bn text-gray-900 dark:text-white">
                    {u.name}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-gray-500">
                  {u.email}
                </td>
                <td className="py-3 px-3 text-gray-700 dark:text-gray-300">
                  {u.title}
                </td>
                <td className="py-3 px-3">
                  <select
                    value={u.role}
                    onChange={e => updateUserRole(u.id, e.target.value as UserRole)}
                    className={`text-[11px] font-bold px-2 py-0.5 rounded border ${getRoleBadge(u.role)}`}
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="editor">Editor</option>
                    <option value="author">Author</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  {users.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`"${u.name}" কে টিম থেকে বাদ দিতে চান?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
