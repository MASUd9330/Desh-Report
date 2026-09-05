import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Star, Sparkles, RefreshCw, CheckCircle2, Zap } from 'lucide-react';

export const AdminFeaturedNews: React.FC = () => {
  const { articles = [], updateArticle, navigateToArticle } = useNews();

  // Published articles sorted by date
  const publishedArticles = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

  const pinnedHero = articles.find(a => a.isFeaturedHero);
  // If no pinned hero, the freshest published article is the dynamic lead!
  const activeHero = pinnedHero || publishedArticles[0];

  const setHeroArticle = (articleId: string) => {
    articles.forEach(a => {
      if (a.isFeaturedHero && a.id !== articleId) {
        updateArticle(a.id, { isFeaturedHero: false });
      }
    });
    updateArticle(articleId, { isFeaturedHero: true });
  };

  const resetToDynamicHero = () => {
    articles.forEach(a => {
      if (a.isFeaturedHero) {
        updateArticle(a.id, { isFeaturedHero: false });
      }
    });
  };

  const toggleSecondaryHero = (articleId: string, currentVal: boolean) => {
    updateArticle(articleId, { isSecondaryHero: !currentVal });
  };

  const toggleEditorsChoice = (articleId: string, currentVal: boolean) => {
    updateArticle(articleId, { isEditorsChoice: !currentVal });
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-6 h-6 text-amber-500" />
            <span>Featured & Hero News Curator (হিরো ও লিড সংবাদ)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            হোমপেজের প্রধান লিড সংবাদ, সেকেন্ডারি গ্রিড ও সম্পাদকের পছন্দ নির্বাচন করুন
          </p>
        </div>

        {/* Dynamic Mode Switch / Reset Button */}
        <div>
          {pinnedHero ? (
            <button
              onClick={resetToDynamicHero}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-colors"
              title="নির্দিষ্ট পিন তুলে দিয়ে নতুন খবরের সাথে স্বয়ংক্রিয়ভাবে হিরো পরিবর্তন সক্রিয় করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>স্বয়ংক্রিয় ডায়নামিক মোডে ফিরুন (সর্বশেষ খবর লিড হবে)</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>🟢 অটো-ডায়নামিক মোড সক্রিয় (তাজা খবর স্বয়ংক্রিয় লিড হচ্ছে)</span>
            </span>
          )}
        </div>
      </div>

      {/* Current Main Hero Preview */}
      <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4 flex-wrap gap-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>হোমপেজে বর্তমানে প্রদর্শিত প্রধান লিড সংবাদ</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {pinnedHero ? '📌 ম্যানুয়ালি পিন করা' : '⚡ স্বয়ংক্রিয়ভাবে সর্বশেষ খবর থেকে নির্বাচিত'}
          </span>
        </div>

        {activeHero ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-52 aspect-16/10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img
                src={activeHero.featuredImage}
                alt={activeHero.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1">
              <h3 
                onClick={() => navigateToArticle(activeHero.id)}
                className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer"
              >
                {activeHero.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                {activeHero.summary}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <span>প্রতিবেদক: {activeHero.authorName}</span>
                <span>ভিউ: {(activeHero.viewCount || 0).toLocaleString()}</span>
                {pinnedHero && (
                  <button
                    onClick={resetToDynamicHero}
                    className="text-xs text-red-600 dark:text-red-400 hover:underline font-semibold cursor-pointer"
                  >
                    পিন প্রত্যাহার করুন
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">কোনো সংবাদ পাওয়া যায়নি।</p>
        )}
      </div>

      {/* Selector Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-gray-900 dark:text-white">
              নিউজ প্লেসমেন্ট তালিকা (Editorial Priority Table)
            </h3>
            <p className="text-[11px] text-gray-500 mt-0.5">
              যেকোনো সংবাদে ক্লিক করে নির্দিষ্ট লিড হিসেবে পিন করতে পারেন, অথবা অটো-ডায়নামিক রাখতে ফাঁকা রাখুন।
            </p>
          </div>
          {pinnedHero && (
            <button
              onClick={resetToDynamicHero}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              স্বয়ংক্রিয় মোড সক্রিয় করুন
            </button>
          )}
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">সংবাদের শিরোনাম</th>
              <th className="py-3 px-3 text-center">প্রধান হিরো (লিড)</th>
              <th className="py-3 px-3 text-center">সেকেন্ডারি গ্রিড</th>
              <th className="py-3 px-3 text-center">সম্পাদকের পছন্দ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {publishedArticles.map(art => (
              <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-900 dark:text-white block max-w-md truncate">
                    {art.title}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {art.authorName} • {(art.viewCount || 0).toLocaleString()} views
                  </span>
                </td>

                {/* Hero Radio or Toggle */}
                <td className="py-3 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (art.isFeaturedHero) {
                        resetToDynamicHero();
                      } else {
                        setHeroArticle(art.id);
                      }
                    }}
                    className={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                      art.isFeaturedHero
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {art.isFeaturedHero ? '✓ পিনড লিড' : 'পিন করুন'}
                  </button>
                </td>

                {/* Secondary Checkbox */}
                <td className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={art.isSecondaryHero}
                    onChange={() => toggleSecondaryHero(art.id, !!art.isSecondaryHero)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
                  />
                </td>

                {/* Editors Choice Checkbox */}
                <td className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={art.isEditorsChoice}
                    onChange={() => toggleEditorsChoice(art.id, !!art.isEditorsChoice)}
                    className="w-4 h-4 text-purple-600 focus:ring-purple-500 rounded cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

