import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Star, Sparkles } from 'lucide-react';

export const AdminFeaturedNews: React.FC = () => {
  const { articles = [], updateArticle, navigateToArticle } = useNews();

  const currentHero = articles.find(a => a.isFeaturedHero);

  const setHeroArticle = (articleId: string) => {
    articles.forEach(a => {
      if (a.isFeaturedHero && a.id !== articleId) {
        updateArticle(a.id, { isFeaturedHero: false });
      }
    });
    updateArticle(articleId, { isFeaturedHero: true });
  };

  const toggleSecondaryHero = (articleId: string, currentVal: boolean) => {
    updateArticle(articleId, { isSecondaryHero: !currentVal });
  };

  const toggleEditorsChoice = (articleId: string, currentVal: boolean) => {
    updateArticle(articleId, { isEditorsChoice: !currentVal });
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500" />
          <span>Featured & Hero News Curator</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Select primary homepage lead article, secondary hero grid placements, and Editor's Choice stories
        </p>
      </div>

      {/* Current Main Hero Preview */}
      <div className="bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-4">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Active Homepage Lead Article</span>
          </span>
          <span className="text-xs text-gray-400">Highest prominence on public portal</span>
        </div>

        {currentHero ? (
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="w-full sm:w-52 aspect-16/10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <img
                src={currentHero.featuredImage}
                alt={currentHero.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 
                onClick={() => navigateToArticle(currentHero.id)}
                className="text-lg font-bold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer"
              >
                {currentHero.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                {currentHero.summary}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span>Reporter: {currentHero.authorName}</span>
                <span>Views: {(currentHero.viewCount || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No primary lead story selected. Select one from the list below.</p>
        )}
      </div>

      {/* Selector Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Editorial Priority Placement Table
          </h3>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Article Title</th>
              <th className="py-3 px-3 text-center">Primary Hero (Lead)</th>
              <th className="py-3 px-3 text-center">Secondary Grid</th>
              <th className="py-3 px-3 text-center">Editor's Choice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {articles.map(art => (
              <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4">
                  <span className="font-bold text-gray-900 dark:text-white block max-w-md truncate">
                    {art.title}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {art.authorName} • {(art.viewCount || 0).toLocaleString()} views
                  </span>
                </td>

                {/* Hero Radio */}
                <td className="py-3 px-3 text-center">
                  <input
                    type="radio"
                    name="main_hero"
                    checked={art.isFeaturedHero}
                    onChange={() => setHeroArticle(art.id)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </td>

                {/* Secondary Checkbox */}
                <td className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={art.isSecondaryHero}
                    onChange={() => toggleSecondaryHero(art.id, art.isSecondaryHero)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
                  />
                </td>

                {/* Editors Choice Checkbox */}
                <td className="py-3 px-3 text-center">
                  <input
                    type="checkbox"
                    checked={art.isEditorsChoice}
                    onChange={() => toggleEditorsChoice(art.id, art.isEditorsChoice)}
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
