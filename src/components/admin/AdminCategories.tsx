import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { FolderTree, Plus, Trash2, Check, X } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories = [], addCategory, deleteCategory, articles = [] } = useNews();

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !slug.trim()) return;

    addCategory({
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || slug.trim(),
      slug: slug.trim().toLowerCase(),
      color: color || '#4f46e5',
      order: categories.length + 1
    });

    setNameBn('');
    setNameEn('');
    setSlug('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-indigo-600" />
            <span>Categories & Taxonomy Management</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Organize editorial categories, visual accent colors, and top navigation sections
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : '+ Add New Category'}</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">New Category Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Bengali Label *
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="e.g. অর্থনীতি"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                English Name (Display Name)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. Economy"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="e.g. economy"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Badge Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-8 h-8 rounded border-0 cursor-pointer p-0"
                />
                <span className="text-xs font-mono">{color}</span>
              </div>
            </div>

            <div className="ml-auto flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs cursor-pointer"
              >
                Create Category
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Categories List */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-3">English Label</th>
              <th className="py-3 px-3">URL Slug</th>
              <th className="py-3 px-3">Color Accent</th>
              <th className="py-3 px-3">Articles</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {categories.map((cat, idx) => {
              const articleCount = articles.filter(a => a.categoryId === cat.id).length;
              return (
                <tr key={cat.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-gray-400">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span>{cat.nameBn}</span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                    {cat.nameEn}
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-400">
                    /{cat.slug}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-slate-800">
                      {cat.color}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-800 dark:text-gray-200">
                    {articleCount} articles
                  </td>
                  <td className="py-3 px-4 text-right">
                    {confirmDeleteId === cat.id ? (
                      <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/80 p-1 rounded-lg border border-red-200 dark:border-red-800">
                        <span className="text-[10px] text-red-600 font-semibold px-1">Delete?</span>
                        <button
                          onClick={() => {
                            deleteCategory(cat.id);
                            setConfirmDeleteId(null);
                          }}
                          className="p-1 text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white rounded cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
