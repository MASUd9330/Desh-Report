import React from 'react';
import { useNews } from '../../context/NewsContext';
import { formatRelativeBanglaTime, toBengaliNumber } from '../../utils/helpers';
import { Clock, TrendingUp, Flame } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { articles, categories, navigateToArticle, navigateToCategory } = useNews();

  // Published articles only
  const publishedArticles = articles.filter(a => a.status === 'published');

  // Main Lead Hero
  const mainHero = publishedArticles.find(a => a.isFeaturedHero) || publishedArticles[0];

  // Secondary 2 stories
  const secondaryStories = publishedArticles
    .filter(a => a.id !== mainHero?.id && (a.isSecondaryHero || a.isEditorsChoice))
    .slice(0, 2);

  // Fallback if not enough
  const usedIds = new Set([mainHero?.id, ...secondaryStories.map(s => s.id)]);
  while (secondaryStories.length < 2) {
    const next = publishedArticles.find(a => !usedIds.has(a.id));
    if (!next) break;
    secondaryStories.push(next);
    usedIds.add(next.id);
  }

  // Right column: Top 5 trending / latest
  const rightColumnStories = publishedArticles
    .filter(a => !usedIds.has(a.id))
    .slice(0, 5);

  if (!mainHero) return null;

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.nameBn : 'জাতীয়';
  };

  return (
    <section id="homepage-hero-grid" className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Main Big Hero Article (6 Cols on Desktop) */}
        <div className="lg:col-span-6 flex flex-col group">
          <div
            onClick={() => navigateToArticle(mainHero.id)}
            className="cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full"
          >
            {/* Big Featured Image */}
            <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                src={mainHero.featuredImage}
                alt={mainHero.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-md">
                {getCategoryName(mainHero.categoryId)}
              </span>
              {mainHero.isBreaking && (
                <span className="absolute top-3 right-3 bg-amber-500 text-black font-extrabold text-[11px] px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-black" /> ব্রেকিং
                </span>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif-bn text-gray-950 dark:text-white leading-tight group-hover:text-red-600 transition-colors">
                  {mainHero.title}
                </h1>

                {mainHero.subtitle && (
                  <p className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                    {mainHero.subtitle}
                  </p>
                )}

                <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {mainHero.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {mainHero.authorName}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeBanglaTime(mainHero.publishedAt)}</span>
                  </div>
                </div>
                <span className="text-red-600 font-semibold text-xs">
                  {toBengaliNumber(mainHero.readingTimeMinutes)} মিনিট পড়া
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: 2 Stacked Important Stories (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
          {secondaryStories.map((story) => (
            <div
              key={story.id}
              onClick={() => navigateToArticle(story.id)}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group flex-1 flex flex-col"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={story.featuredImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 text-white font-medium text-[11px] px-2 py-0.5 rounded">
                  {getCategoryName(story.categoryId)}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-serif-bn text-gray-900 dark:text-white leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {story.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span>{story.authorName}</span>
                  <span>{formatRelativeBanglaTime(story.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Latest & Trending Fast Feed (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                সর্বশেষ সংবাদ
              </h3>
            </div>
            <span className="text-[11px] text-red-600 font-semibold cursor-pointer hover:underline">
              সব খবর
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 flex-1 flex flex-col justify-between">
            {rightColumnStories.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => navigateToArticle(item.id)}
                className="py-2.5 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-3"
              >
                <span className="text-xl font-black font-serif text-gray-300 dark:text-gray-600 group-hover:text-red-600 transition-colors shrink-0">
                  {toBengaliNumber(idx + 1)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 block mb-0.5">
                    {getCategoryName(item.categoryId)}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-red-600 leading-snug line-clamp-2">
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
    </section>
  );
};
