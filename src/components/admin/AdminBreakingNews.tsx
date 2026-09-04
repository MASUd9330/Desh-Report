import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Link,
  Sparkles,
  Check,
  X
} from 'lucide-react';

export const AdminBreakingNews: React.FC = () => {
  const {
    breakingNews = [],
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    articles = []
  } = useNews();

  const [newTitle, setNewTitle] = useState('');
  const [newArticleId, setNewArticleId] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal'>('urgent');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleArticleSelect = (artId: string) => {
    setNewArticleId(artId);
    if (artId) {
      const art = articles.find(a => a.id === artId);
      if (art && !newTitle) {
        setNewTitle(art.title);
      }
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedArt = articles.find(a => a.id === newArticleId);

    addBreakingNews({
      title: newTitle.trim(),
      articleId: newArticleId || undefined,
      link: selectedArt ? `/article/${selectedArt.slug}` : undefined,
      priority: newPriority,
      isActive: true,
      displayLocations: ['homepage', 'category', 'article']
    });

    setNewTitle('');
    setNewArticleId('');
    setNewPriority('urgent');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" />
            <span>Breaking News Ticker Manager</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage real-time flashing breaking headlines displayed at the top of the portal
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cancel' : '+ Add Breaking Alert'}</span>
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
            <span>New Breaking Alert Details</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Breaking Headline *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Special Cabinet meeting underway to discuss new national policy..."
              className="w-full text-xs px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Link to Existing Article (Optional)
              </label>
              <select
                value={newArticleId}
                onChange={e => handleArticleSelect(e.target.value)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="">No link (Text only)</option>
                {articles.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Display Priority
              </label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as 'urgent' | 'high' | 'normal')}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="urgent">জরুরি (Urgent - Flashing Red)</option>
                <option value="high">উচ্চ অগ্রাধিকার (High)</option>
                <option value="normal">সাধারণ (Normal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              Publish Breaking Alert
            </button>
          </div>
        </form>
      )}

      {/* Breaking List Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Headline</th>
              <th className="py-3 px-3">Linked Article</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Created Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {breakingNews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No active breaking news ticker alerts.
                </td>
              </tr>
            ) : (
              breakingNews.map(item => {
                const linkedArt = articles.find(a => a.id === item.articleId);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white max-w-md">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                      {linkedArt ? (
                        <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                          <Link className="w-3 h-3" />
                          <span className="truncate max-w-xs">{linkedArt.title}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() =>
                          updateBreakingNews(item.id, { isActive: !item.isActive })
                        }
                        className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-slate-800'
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                      {item.createdAt}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {confirmDeleteId === item.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/80 p-1 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="text-[10px] text-red-600 font-semibold px-1">Delete?</span>
                          <button
                            onClick={() => {
                              deleteBreakingNews(item.id);
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
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                          title="Delete breaking alert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
