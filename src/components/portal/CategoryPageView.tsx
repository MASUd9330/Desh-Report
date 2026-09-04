import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { formatRelativeBanglaTime, toBengaliNumber } from '../../utils/helpers';
import { AdSlot } from '../ads/AdSlot';
import { ChevronRight, Filter } from 'lucide-react';

export const CategoryPageView: React.FC = () => {
  const {
    activeCategorySlug,
    categories,
    articles,
    navigateToHome,
    navigateToArticle
  } = useNews();

  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const category = categories.find(c => c.slug === activeCategorySlug) || categories[0];

  // Articles for this category
  let categoryArticles = articles.filter(
    a => a.categoryId === category?.id && a.status === 'published'
  );

  if (sortBy === 'popular') {
    categoryArticles = [...categoryArticles].sort((a, b) => b.viewCount - a.viewCount);
  } else {
    categoryArticles = [...categoryArticles].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  // Sidebar most read
  const mostRead = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const featured = categoryArticles[0];
  const remaining = categoryArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
        <button onClick={navigateToHome} className="hover:text-red-600 transition-colors">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-red-600">{category?.nameBn}</span>
      </nav>

      {/* Category Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b-2 border-red-600 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif-bn text-gray-950 dark:text-white">
            {category?.nameBn}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {category?.nameBn} বিভাগের সকল সর্বশেষ সংবাদ, বিশেষ প্রতিবেদন ও অনুসন্ধান
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-500">ক্রমানুসার:</span>
          <button
            onClick={() => setSortBy('latest')}
            className={`px-2.5 py-1 rounded ${
              sortBy === 'latest'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            সর্বশেষ
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-2.5 py-1 rounded ${
              sortBy === 'popular'
                ? 'bg-red-600 text-white font-semibold'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            জনপ্রিয়
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8">
          {categoryArticles.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg">
              <p className="text-gray-500">এই বিভাগে বর্তমানে কোনো প্রকাশিত সংবাদ নেই।</p>
            </div>
          ) : (
            <>
              {/* Featured Top Article */}
              {featured && (
                <div
                  onClick={() => navigateToArticle(featured.id)}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer mb-6"
                >
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={featured.featuredImage}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-950 dark:text-white group-hover:text-red-600 transition-colors leading-tight">
                      {featured.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                      {featured.summary}
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
                      <span>{featured.authorName}</span>
                      <span>{formatRelativeBanglaTime(featured.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* In-feed Ad Banner */}
              <AdSlot placement="between_cards" className="my-6" />

              {/* 2-Column Grid for Remaining Articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {remaining.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => navigateToArticle(art.id)}
                    className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
                  >
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold font-serif-bn text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2 leading-snug">
                          {art.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                        <span>{art.authorName}</span>
                        <span>{formatRelativeBanglaTime(art.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <AdSlot placement="sidebar" />

          {/* Most Read List */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-800 pb-2.5 mb-3 flex items-center justify-between">
              <span>সর্বাধিক পঠিত সংবাদ</span>
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
            </h3>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {mostRead.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => navigateToArticle(item.id)}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-3"
                >
                  <span className="text-2xl font-black font-serif-bn text-gray-300 dark:text-gray-600 group-hover:text-red-600 transition-colors shrink-0">
                    {toBengaliNumber(idx + 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold font-serif-bn text-gray-900 dark:text-gray-200 group-hover:text-red-600 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {formatRelativeBanglaTime(item.publishedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
