import React, { useState, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { Article, NewsStatus } from '../../types';
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  FileEdit,
  Flame,
  Star,
  Check,
  X,
  Send,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';

export const AdminNewsList: React.FC = () => {
  const {
    articles = [],
    categories = [],
    deleteArticle,
    changeArticleStatus,
    setAdminSection,
    navigateToArticle,
    autoPostDraftsEnabled,
    nextAutoPostSeconds,
    toggleAutoPostDrafts,
    triggerAutoPostDraftsNow,
    autoPostIntervalMinutes,
    autoPostBatchSize
  } = useNews();

  const [filterStatus, setFilterStatus] = useState<NewsStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const formatCountdown = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchStatus = filterStatus === 'all' || art.status === filterStatus;
      const matchCat = filterCategory === 'all' || art.categoryId === filterCategory;
      const matchSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCat && matchSearch;
    });
  }, [articles, filterStatus, filterCategory, searchQuery]);

  const draftArticles = useMemo(() => {
    return articles.filter(a => a.status === 'draft');
  }, [articles]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.nameEn || cat.nameBn) : 'General';
  };

  const handleEdit = (articleId: string) => {
    localStorage.setItem('deshreport_editing_id', articleId);
    setAdminSection('news', 'add');
  };

  const handleCreateNew = () => {
    try {
      localStorage.removeItem('deshreport_editing_id');
    } catch (_) {}
    setAdminSection('news', 'add');
  };

  const handleDelete = (articleId: string) => {
    deleteArticle(articleId);
    setConfirmDeleteId(null);
  };

  // Publish all drafts at once
  const handlePublishAllDrafts = () => {
    if (draftArticles.length === 0) return;
    const count = draftArticles.length;
    draftArticles.forEach(draft => {
      changeArticleStatus(draft.id, 'published');
    });
    setBatchNotice(`সফল! ${count}টি ড্রাফট সংবাদ একসাথে সাইটে প্রকাশিত (Published) করা হয়েছে!`);
    setTimeout(() => setBatchNotice(null), 4000);
  };

  // Publish selected
  const handlePublishSelected = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      changeArticleStatus(id, 'published');
    });
    const count = selectedIds.length;
    setSelectedIds([]);
    setBatchNotice(`সফল! নির্বাচিত ${count}টি সংবাদ প্রকাশিত করা হয়েছে!`);
    setTimeout(() => setBatchNotice(null), 4000);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredArticles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredArticles.map(a => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-5">
      {/* Header & New Article Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Article Management & Directory
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage all published articles, editorial drafts, and scheduled news reports
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Write New Article</span>
        </button>
      </div>

      {/* Batch Notification Alert */}
      {batchNotice && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{batchNotice}</span>
        </div>
      )}

      {/* Quick Drafts Banner with 15-Minute Auto-Post Engine */}
      {draftArticles.length > 0 && (
        <div className="bg-linear-to-r from-amber-50 via-orange-50 to-emerald-50 dark:from-slate-900 dark:via-amber-950/30 dark:to-emerald-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 shadow-xs">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  আপনার {draftArticles.length}টি সংবাদ বর্তমানে ড্রাফট (Draft) কিউতে রয়েছে
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {autoPostDraftsEnabled ? `১৫ মিনিট অটো-পোস্ট সক্রিয় (পরবর্তী: ${formatCountdown(nextAutoPostSeconds)})` : 'অটো-পোস্ট পজ করা'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                প্রতি {autoPostIntervalMinutes} মিনিট পর পর স্বয়ংক্রিয়ভাবে ড্রাফট থেকে {autoPostBatchSize}টি করে সংবাদ পোস্ট হচ্ছে। আপনি চাইলে এখনই সবগুলো বা নির্দিষ্ট কয়েকটি পোস্ট করতে পারেন।
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {selectedIds.length > 0 && (
              <button
                onClick={handlePublishSelected}
                className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>নির্বাচিত {selectedIds.length}টি প্রকাশ করুন</span>
              </button>
            )}

            <button
              onClick={() => {
                const count = triggerAutoPostDraftsNow();
                if (count > 0) {
                  setBatchNotice(`সফল! পরবর্তী ড্রাফট সংবাদটি সাইটে প্রকাশিত করা হয়েছে!`);
                  setTimeout(() => setBatchNotice(null), 4000);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap"
              title="কিউ থেকে পরবর্তী ১টি সংবাদ এখনই প্রকাশ করুন"
            >
              <Send className="w-3.5 h-3.5" />
              <span>পরবর্তী ড্রাফট পোস্ট করুন</span>
            </button>

            <button
              onClick={handlePublishAllDrafts}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>এক ক্লিকে সব {draftArticles.length}টি প্রকাশ করুন</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            All Articles ({articles.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'published'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            Published ({articles.filter(a => a.status === 'published').length})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'draft'
                ? 'bg-amber-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            Drafts ({articles.filter(a => a.status === 'draft').length})
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              filterStatus === 'scheduled'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            Scheduled ({articles.filter(a => a.status === 'scheduled').length})
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.nameEn || c.nameBn}
              </option>
            ))}
          </select>

          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-white"
                    title="Select all"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredArticles.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-3">Article Details</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Author</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Published Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => (
                  <tr
                    key={art.id}
                    className={`hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                      selectedIds.includes(art.id) ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleSelectOne(art.id)}
                        className="cursor-pointer text-gray-400 hover:text-indigo-600"
                      >
                        {selectedIds.includes(art.id) ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>

                    {/* Article Details with Thumbnail */}
                    <td className="py-3 px-3 max-w-sm">
                      <div className="flex items-center gap-3">
                        <img
                          src={art.featuredImage}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <h4
                            onClick={() => handleEdit(art.id)}
                            className="font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                            title={art.title}
                          >
                            {art.title}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {art.isFeaturedHero && (
                              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <Star className="w-2.5 h-2.5" /> Featured Hero
                              </span>
                            )}
                            {art.isBreaking && (
                              <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                                <Flame className="w-2.5 h-2.5" /> Breaking
                              </span>
                            )}
                            {art.isEditorsChoice && (
                              <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold">
                                Editor's Choice
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded text-[11px] font-medium">
                        {getCategoryName(art.categoryId)}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium">
                      {art.authorName}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-gray-600 dark:text-gray-300">
                      {(art.viewCount || 0).toLocaleString()}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={art.status}
                        onChange={e => changeArticleStatus(art.id, e.target.value as NewsStatus)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border cursor-pointer ${
                          art.status === 'published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : art.status === 'draft'
                            ? 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border-yellow-300'
                            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-400 text-[11px]">
                      {new Date(art.publishedAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      {confirmDeleteId === art.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/80 p-1 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="text-[10px] text-red-600 font-semibold px-1">Delete?</span>
                          <button
                            onClick={() => handleDelete(art.id)}
                            className="p-1 text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                            title="Confirm delete"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white rounded cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => navigateToArticle(art.id)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="View on public site"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(art.id)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Edit article"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(art.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
