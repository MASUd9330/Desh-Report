import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { BreakingNewsItem } from '../../types';
import { toBengaliNumber } from '../../utils/helpers';
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Link,
  MoveUp,
  MoveDown,
  Sparkles
} from 'lucide-react';

export const AdminBreakingNews: React.FC = () => {
  const {
    breakingNews,
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    articles
  } = useNews();

  const [newTitle, setNewTitle] = useState('');
  const [newArticleId, setNewArticleId] = useState('');
  const [newPriority, setNewPriority] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addBreakingNews({
      title: newTitle.trim(),
      articleId: newArticleId || undefined,
      priority: Number(newPriority) || 1,
      isActive: true,
      displayLocation: ['homepage', 'category', 'article']
    });

    setNewTitle('');
    setNewArticleId('');
    setNewPriority(1);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" />
            <span>ব্রেকিং নিউজ ব্যবস্থাপনা (Breaking News Manager)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            সাইটের শীর্ষে চলমান জরুরি ফ্ল্যাশ নিউজ টিকার নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্রেকিং নিউজ যোগ করুন</span>
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>জরুরি খবরের তথ্য দিন</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ব্রেকিং নিউজ শিরোনাম *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="উদাঃ ঢাকার সাভারে গ্যাস লিকেজ বিস্ফোরণে আহত ৭..."
              className="w-full text-sm px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                সম্পর্কিত প্রকাশিত প্রতিবেদন লিংক (ঐচ্ছিক)
              </label>
              <select
                value={newArticleId}
                onChange={e => setNewArticleId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              >
                <option value="">কোনো আর্টিকেল লিংক নেই</option>
                {articles.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                অগ্রাধিকার ক্রম (Priority - 1 সর্বোচ্চ)
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={newPriority}
                onChange={e => setNewPriority(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
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
              সংরক্ষণ ও সক্রিয় করুন
            </button>
          </div>
        </form>
      )}

      {/* Breaking Items Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 font-semibold uppercase">
            <tr>
              <th className="py-3 px-4">অগ্রাধিকার</th>
              <th className="py-3 px-4">ব্রেকিং শিরোনাম</th>
              <th className="py-3 px-3">লিংক কৃত সংবাদ</th>
              <th className="py-3 px-3">অবস্থা (Status)</th>
              <th className="py-3 px-3">যোগের সময়</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {breakingNews.map((item) => {
              const linkedArt = articles.find(a => a.id === item.articleId);
              return (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-gray-700 dark:text-gray-300">
                    #{toBengaliNumber(item.priority)}
                  </td>
                  <td className="py-3 px-4 font-bold font-serif-bn text-gray-900 dark:text-white max-w-md">
                    {item.title}
                  </td>
                  <td className="py-3 px-3 text-gray-500">
                    {linkedArt ? (
                      <span className="text-red-600 truncate block max-w-xs">
                        {linkedArt.title}
                      </span>
                    ) : (
                      <span className="text-gray-400">সরাসরি টেক্সট</span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() =>
                        updateBreakingNews(item.id, { isActive: !item.isActive })
                      }
                      className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        item.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-gray-100 text-gray-500 dark:bg-slate-800'
                      }`}
                    >
                      {item.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>সক্রিয় (Active)</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>বন্ধ (Inactive)</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                    {item.createdAt}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm('এই ব্রেকিং নিউজটি মুছে ফেলতে চান?')) {
                          deleteBreakingNews(item.id);
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
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
