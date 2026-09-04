import React, { useState, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { Article, NewsStatus } from '../../types';
import { toBengaliNumber, formatRelativeBanglaTime } from '../../utils/helpers';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  CheckCircle,
  Clock,
  FileEdit,
  Flame,
  Star
} from 'lucide-react';

export const AdminNewsList: React.FC = () => {
  const {
    articles,
    categories,
    deleteArticle,
    changeArticleStatus,
    setAdminSection,
    navigateToArticle
  } = useNews();

  const [filterStatus, setFilterStatus] = useState<NewsStatus | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const matchStatus = filterStatus === 'all' || art.status === filterStatus;
      const matchCat = filterCategory === 'all' || art.categoryId === filterCategory;
      const matchSearch = !searchQuery.trim() || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.authorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchCat && matchSearch;
    });
  }, [articles, filterStatus, filterCategory, searchQuery]);

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.nameBn : 'সাধারণ';
  };

  return (
    <div className="space-y-5">
      {/* Header & New Article Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            সংবাদ তালিকা ও সম্পাদনা (News Management)
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            সকল প্রকাশিত, খসড়া ও শিডিউলড প্রতিবেদন নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={() => setAdminSection('news', 'add')}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>নতুন সংবাদ যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === 'all'
                ? 'bg-red-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            সব ({toBengaliNumber(articles.length)})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === 'published'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            প্রকাশিত ({toBengaliNumber(articles.filter(a => a.status === 'published').length)})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === 'draft'
                ? 'bg-yellow-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            খসড়া ({toBengaliNumber(articles.filter(a => a.status === 'draft').length)})
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === 'scheduled'
                ? 'bg-sky-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            শিডিউলড ({toBengaliNumber(articles.filter(a => a.status === 'scheduled').length)})
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
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.nameBn}
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
              placeholder="শিরোনাম খুঁজুন..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">প্রতিবেদন শিরোনাম</th>
                <th className="py-3 px-3">বিভাগ</th>
                <th className="py-3 px-3">লেখক</th>
                <th className="py-3 px-3">ভিউ</th>
                <th className="py-3 px-3">স্ট্যাটাস</th>
                <th className="py-3 px-3">তারিখ</th>
                <th className="py-3 px-4 text-right">অ্যাকশন</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    কোনো সংবাদ প্রতিবেদন পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Title & Thumbnail */}
                    <td className="py-3 px-4 min-w-[280px]">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-11 rounded overflow-hidden bg-gray-100 dark:bg-slate-800 shrink-0">
                          <img
                            src={art.featuredImage}
                            alt={art.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span 
                            onClick={() => navigateToArticle(art.id)}
                            className="font-bold font-serif-bn text-gray-900 dark:text-white hover:text-red-600 cursor-pointer line-clamp-2 leading-snug"
                          >
                            {art.title}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1">
                            {art.isFeaturedHero && (
                              <span className="text-[10px] bg-red-100 dark:bg-red-950/60 text-red-600 px-1.5 py-0.5 rounded font-bold">
                                প্রধান হিরো
                              </span>
                            )}
                            {art.isBreaking && (
                              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">
                                ব্রেকিং
                              </span>
                            )}
                            {art.isEditorsChoice && (
                              <span className="text-[10px] bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded font-bold">
                                সম্পাদকের পছন্দ
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
                    <td className="py-3 px-3 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {art.authorName}
                    </td>

                    {/* Views */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-gray-600 dark:text-gray-300">
                      {toBengaliNumber(art.viewCount)}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={art.status}
                        onChange={(e) => changeArticleStatus(art.id, e.target.value as NewsStatus)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-md border ${
                          art.status === 'published'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                            : art.status === 'draft'
                            ? 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300 border-yellow-300'
                            : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300'
                        }`}
                      >
                        <option value="published">প্রকাশিত</option>
                        <option value="draft">খসড়া</option>
                        <option value="scheduled">শিডিউলড</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 whitespace-nowrap text-gray-400 text-[11px]">
                      {formatRelativeBanglaTime(art.publishedAt)}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => navigateToArticle(art.id)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="ওয়েবসাইটে দেখুন"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          // Trigger edit mode
                          localStorage.setItem('deshreport_editing_id', art.id);
                          setAdminSection('news', 'add');
                        }}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="সম্পাদনা করুন"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`"${art.title}" মুছে ফেলতে চান?`)) {
                            deleteArticle(art.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
