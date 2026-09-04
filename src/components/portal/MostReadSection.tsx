import React from 'react';
import { useNews } from '../../context/NewsContext';
import { toBengaliNumber, formatRelativeBanglaTime } from '../../utils/helpers';
import { Flame, Eye } from 'lucide-react';

export const MostReadSection: React.FC = () => {
  const { articles, navigateToArticle } = useNews();

  // Sort by viewCount descending
  const mostRead = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 10);

  if (mostRead.length === 0) return null;

  return (
    <section id="most-read-section" className="mb-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 pb-4 border-b border-gray-200 dark:border-slate-800 mb-6">
        <div className="p-1.5 bg-red-50 dark:bg-red-950/50 rounded text-red-600">
          <Flame className="w-5 h-5 fill-red-600" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            সর্বাধিক পঠিত (Most Read)
          </h2>
          <p className="text-xs text-gray-500">
            পাঠকদের সর্বাধিক পছন্দের শীর্ষ ১০ সংবাদ প্রতিবেদন
          </p>
        </div>
      </div>

      {/* 2-column list of 01 to 10 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {mostRead.map((item, index) => {
          const rankNumber = (index + 1).toString().padStart(2, '0');
          const isTop3 = index < 3;

          return (
            <div
              key={item.id}
              onClick={() => navigateToArticle(item.id)}
              className="group cursor-pointer flex items-center gap-4 py-2 border-b border-gray-100 dark:border-slate-800/80 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 px-2 rounded transition-colors"
            >
              {/* Rank Number */}
              <span
                className={`text-2xl sm:text-3xl font-black font-serif-bn w-8 text-center shrink-0 transition-colors ${
                  isTop3
                    ? 'text-red-600'
                    : 'text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-white'
                }`}
              >
                {toBengaliNumber(rankNumber)}
              </span>

              {/* Thumbnail */}
              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Headline & View Count */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-bold font-serif-bn text-gray-900 dark:text-gray-100 group-hover:text-red-600 line-clamp-2 leading-snug transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-gray-400" />
                    <span>{toBengaliNumber(item.viewCount)} বার পঠিত</span>
                  </span>
                  <span>•</span>
                  <span>{formatRelativeBanglaTime(item.publishedAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
