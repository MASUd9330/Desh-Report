import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Category } from '../../types';
import { FolderTree, Plus, Trash2, Edit2, Check, ArrowUpDown } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, articles } = useNews();

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#c00612');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim() || !slug.trim()) return;

    addCategory({
      nameBn: nameBn.trim(),
      nameEn: nameEn.trim() || slug.trim(),
      slug: slug.trim().toLowerCase(),
      color: color || '#c00612',
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
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <span>ক্যাটাগরি ও বিভাগ ব্যবস্থাপনা (Categories)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            সংবাদ পোর্টালের বিষয়ভিত্তিক ক্যাটাগরি, রঙ এবং ন্যাভিগেশন মেনু সাজান
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddCategory}
          className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">নতুন ক্যাটাগরির বিবরণ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                বাংলা নাম *
              </label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="উদাঃ সংস্কৃতি"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ইংরেজি নাম
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="Culture"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                স্লাগ (Slug) *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="culture"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ব্র্যান্ড অ্যাকসেন্ট রঙ
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
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
              >
                যোগ করুন
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
              <th className="py-3 px-4">ক্রম</th>
              <th className="py-3 px-4">ক্যাটাগরি নাম (বাংলা)</th>
              <th className="py-3 px-3">ইংরেজি নাম</th>
              <th className="py-3 px-3">স্লাগ (URL)</th>
              <th className="py-3 px-3">রঙ</th>
              <th className="py-3 px-3">সংবাদ সংখ্যা</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
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
                  <td className="py-3 px-4 font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
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
                    {articleCount} টি সংবাদ
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`"${cat.nameBn}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
