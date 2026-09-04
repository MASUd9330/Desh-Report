import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Category, Article } from '../../types';
import { formatRelativeBanglaTime } from '../../utils/helpers';
import { ChevronRight } from 'lucide-react';

interface CategoryBlockProps {
  category: Category;
  articles: Article[];
}

export const CategoryBlock: React.FC<CategoryBlockProps> = ({ category, articles }) => {
  const { navigateToArticle, navigateToCategory } = useNews();

  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const secondaries = articles.slice(1, 5);

  return (
    <section className="mb-10">
      {/* Category Section Header */}
      <div className="flex items-center justify-between border-b-2 border-gray-200 dark:border-slate-800 pb-2 mb-5">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-5 rounded-xs"
            style={{ backgroundColor: category.color || '#c00612' }}
          />
          <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            {category.nameBn}
          </h2>
          <span className="text-xs text-gray-400 font-sans hidden sm:inline">
            ({category.nameEn})
          </span>
        </div>

        <button
          onClick={() => navigateToCategory(category.slug)}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
        >
          <span>সব খবর</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid Layout: 1 Big Left, 4 Smaller Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Featured Left Card (5 cols) */}
        {featured && (
          <div
            onClick={() => navigateToArticle(featured.id)}
            className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                src={featured.featuredImage}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-serif-bn text-gray-950 dark:text-white leading-snug group-hover:text-red-600 transition-colors">
                  {featured.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {featured.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
                <span>{featured.authorName}</span>
                <span>{formatRelativeBanglaTime(featured.publishedAt)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Secondary Articles Right Grid (7 cols: 2x2 grid) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {secondaries.map((art) => (
            <div
              key={art.id}
              onClick={() => navigateToArticle(art.id)}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group cursor-pointer flex flex-col"
            >
              <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={art.featuredImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-semibold font-serif-bn text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2 leading-snug">
                  {art.title}
                </h4>

                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate">{art.authorName}</span>
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
