import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { StaticPage } from '../../types';
import { FileText, Edit, Eye, Save, Check } from 'lucide-react';

export const AdminPages: React.FC = () => {
  const { pages = [], updatePage, navigateToPage } = useNews();
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [titleBn, setTitleBn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [saved, setSaved] = useState(false);

  const startEdit = (page: StaticPage) => {
    setEditingPage(page);
    setTitleBn(page.titleBn);
    setContentBn(page.contentBn);
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    updatePage(editingPage.id, {
      titleBn,
      contentBn,
      updatedAt: new Date().toISOString().split('T')[0]
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setEditingPage(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-indigo-600" />
          <span>Static Pages & Editorial Policies</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Manage About Us, Editorial Policy, Fact-Checking, Correction Policy, Privacy, and Contact pages
        </p>
      </div>

      {editingPage ? (
        <form
          onSubmit={handleSave}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              Edit Page: {editingPage.titleBn} (/{editingPage.slug})
            </h3>
            <button
              type="button"
              onClick={() => setEditingPage(null)}
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          {saved && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Page content saved and updated successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Page Title
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={e => setTitleBn(e.target.value)}
              className="w-full text-sm font-bold px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Full Page Body Content
            </label>
            <textarea
              rows={12}
              required
              value={contentBn}
              onChange={e => setContentBn(e.target.value)}
              className="w-full text-sm leading-relaxed px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Page Changes</span>
          </button>
        </form>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Page Title</th>
                <th className="py-3 px-3">English Label</th>
                <th className="py-3 px-3">Slug URL</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {pages.map(page => (
                <tr key={page.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                    {page.titleBn}
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                    {page.titleEn}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-400">
                    /{page.slug}
                  </td>
                  <td className="py-3 px-3 text-gray-400 font-mono">
                    {page.updatedAt}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => navigateToPage(page.slug)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded cursor-pointer"
                      title="View on public site"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => startEdit(page)}
                      className="p-1.5 text-gray-400 hover:text-emerald-600 rounded cursor-pointer"
                      title="Edit page content"
                    >
                      <Edit className="w-3.5 h-3.5" />
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
