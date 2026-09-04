import React from 'react';
import { useNews } from '../../context/NewsContext';
import { TrendingUp, ArrowUp } from 'lucide-react';

export const AdminMostRead: React.FC = () => {
  const { articles = [], updateArticle, navigateToArticle } = useNews();

  const sortedArticles = [...articles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

  const adjustViews = (articleId: string, delta: number) => {
    const art = articles.find(a => a.id === articleId);
    if (!art) return;
    const newCount = Math.max(0, (art.viewCount || 0) + delta);
    updateArticle(articleId, { viewCount: newCount });
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <span>Most Read News Rankings</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Audience readership tracking and position control for sidebar 'Most Read' widget
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Article Headline</th>
              <th className="py-3 px-3">Recorded Views</th>
              <th className="py-3 px-3">Daily Growth</th>
              <th className="py-3 px-4 text-right">View Count Calibration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {sortedArticles.map((art, idx) => (
              <tr key={art.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-mono font-bold text-gray-400 text-sm">
                  #{idx + 1}
                </td>
                <td className="py-3 px-4">
                  <span
                    onClick={() => navigateToArticle(art.id)}
                    className="font-bold text-gray-900 dark:text-white hover:text-indigo-600 cursor-pointer block max-w-md truncate"
                    title={art.title}
                  >
                    {art.title}
                  </span>
                  <span className="text-[11px] text-gray-400">{art.authorName}</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {(art.viewCount || 0).toLocaleString()}
                </td>
                <td className="py-3 px-3">
                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" /> +{Math.floor((art.viewCount || 0) * 0.15).toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => adjustViews(art.id, 500)}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded text-[11px] font-semibold hover:bg-emerald-100 cursor-pointer"
                    title="Add 500 views"
                  >
                    +500 Views
                  </button>
                  <button
                    onClick={() => adjustViews(art.id, -500)}
                    className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded text-[11px] hover:bg-gray-200 cursor-pointer"
                    title="Deduct 500 views"
                  >
                    -500
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
