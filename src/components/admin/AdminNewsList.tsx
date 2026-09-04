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
  X
} from 'lucide-react';

export const AdminNewsList: React.FC = () => {
  const {
    articles = [],
    categories = [],
    deleteArticle,
    changeArticleStatus,
    setAdminSection,
    navigateToArticle
  } = useNews();

  const [filterStatus, setFilterStatus] = useState<NewsStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

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
                <th className="py-3 px-4">Article Details</th>
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
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No articles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => (
                  <tr
                    key={art.id}
                    className="hover:bg-gray-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Article Details with Thumbnail */}
                    <td className="py-3 px-4 max-w-sm">
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
