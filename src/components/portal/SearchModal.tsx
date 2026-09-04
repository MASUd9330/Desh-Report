import React, { useState, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { Search, X, Calendar, Filter, ArrowRight } from 'lucide-react';
import { formatRelativeBanglaTime } from '../../utils/helpers';

export const SearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    searchQuery,
    setSearchQuery,
    articles,
    categories,
    navigateToArticle
  } = useNews();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase().trim();
    return articles.filter(art => {
      if (art.status !== 'published') return false;

      const matchesCategory = selectedCategory === 'all' || art.categoryId === selectedCategory;
      if (!matchesCategory) return false;

      const inTitle = art.title.toLowerCase().includes(query);
      const inSummary = art.summary.toLowerCase().includes(query);
      const inContent = art.content.toLowerCase().includes(query);
      const inTags = art.tags?.some(t => t.toLowerCase().includes(query));
      const inAuthor = art.authorName.toLowerCase().includes(query);

      return inTitle || inSummary || inContent || inTags || inAuthor;
    });
  }, [searchQuery, selectedCategory, articles]);

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-red-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="সংবাদ, বিষয়বস্তু, লেখক বা কি-ওয়ার্ড খুঁজুন..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 text-xs"
            >
              মুছে ফেলুন
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters Pill */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-gray-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> বিভাগ:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            সকল বিভাগ
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {cat.nameBn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100 dark:divide-slate-800">
          {!searchQuery.trim() ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>আপনার কাঙ্ক্ষিত খবরের শিরোনাম বা বিষয়বস্তু লিখে খুঁজুন</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <span className="text-gray-500">জনপ্রিয় সার্চ:</span>
                {['মেট্রোরেল', 'নির্বাচন', 'ক্রিকেট', 'রমজান', 'এআই'].map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => setSearchQuery(kw)}
                    className="text-red-600 underline font-medium hover:text-red-700"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                কোনো ফলাফল পাওয়া যায়নি
              </p>
              <p className="mt-1">
                "{searchQuery}" এর জন্য কোনো খবর খুঁজে পাওয়া যায়নি। বানান পরীক্ষা করুন অথবা অন্য শব্দ ব্যবহার করুন।
              </p>
            </div>
          ) : (
            filteredResults.map(art => (
              <div
                key={art.id}
                onClick={() => {
                  navigateToArticle(art.id);
                  setSearchOpen(false);
                }}
                className="py-3 group cursor-pointer flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
              >
                <div className="w-20 h-16 rounded overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={art.featuredImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold font-serif-bn text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">
                    {art.summary}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                    <span>{art.authorName}</span>
                    <span>•</span>
                    <span>{formatRelativeBanglaTime(art.publishedAt)}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-red-600 shrink-0 mt-2" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
