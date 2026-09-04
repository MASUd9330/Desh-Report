import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Category, Article } from '../../types';
import { formatRelativeBanglaTime, toBengaliNumber } from '../../utils/helpers';
import { ChevronRight, Clock, Sparkles } from 'lucide-react';

interface CategoryBlockProps {
  category: Category;
  articles?: Article[];
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({ category, articles: propArticles }) => {
  const { articles: allArticles, navigateToArticle, navigateToCategory } = useNews();

  // Find articles for this category strictly without mixing other categories
  const publishedArticles = allArticles.filter(a => a.status === 'published');
  
  const categoryArticles = (propArticles && propArticles.length > 0)
    ? propArticles
    : publishedArticles.filter(a => a.categoryId === category.id || a.categoryId === category.slug);

  if (categoryArticles.length === 0) return null;

  const featured = categoryArticles[0];
  const secondaries = categoryArticles.slice(1, 5);

  return (
    <section className="mb-8">
      {/* Category Section Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-slate-800 pb-2 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-5 rounded-xs"
            style={{ backgroundColor: category.color || '#c00612' }}
          />
          <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-950 dark:text-white">
            {category.nameBn}
          </h2>
          <span className="text-xs text-gray-400 font-sans hidden sm:inline">
            ({category.nameEn})
          </span>
        </div>

        <button
          onClick={() => navigateToCategory(category.slug)}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
        >
          <span>সব খবর</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Layout: 1 Big Left (5 cols), 4 Smaller Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Featured Left Card */}
        {featured && (
          <div
            onClick={() => navigateToArticle(featured.id)}
            className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <span
                className="absolute top-2.5 left-2.5 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-sm"
                style={{ backgroundColor: category.color || '#c00612' }}
              >
                {category.nameBn}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif-bn text-gray-950 dark:text-white leading-snug group-hover:text-red-600 transition-colors">
                  {featured.title}
                </h3>
                {featured.subtitle && (
                  <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium line-clamp-1">
                    {featured.subtitle}
                  </p>
                )}
                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-gray-400">
                <span className="font-medium text-gray-700 dark:text-gray-300">{featured.authorName}</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeBanglaTime(featured.publishedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Articles Right Grid (4 items in 2x2 grid) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaries.map(art => (
            <div
              key={art.id}
              onClick={() => navigateToArticle(art.id)}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <h4 className="text-xs sm:text-sm font-bold font-serif-bn text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2 leading-snug">
                  {art.title}
                </h4>

                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800/70 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate max-w-[120px]">{art.authorName}</span>
                  <span className="shrink-0">{formatRelativeBanglaTime(art.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
