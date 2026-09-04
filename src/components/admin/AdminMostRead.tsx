import React from 'react';
import { useNews } from '../../context/NewsContext';
import { TrendingUp, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { toBengaliNumber } from '../../utils/helpers';

export const AdminMostRead: React.FC = () => {
  const { articles, updateArticle, navigateToArticle } = useNews();

  const sortedArticles = [...articles].sort((a, b) => b.viewCount - a.viewCount);

  const adjustViews = (articleId: string, delta: number) => {
    const art = articles.find(a => a.id === articleId);
    if (!art) return;
    const newCount = Math.max(0, art.viewCount + delta);
    updateArticle(articleId, { viewCount: newCount });
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          <span>সর্বাধিক পঠিত সংবাদ র‍্যাংকিং (Most Read Manager)</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          পাঠকের ভিউ সংখ্যা ট্র্যাকিং এবং সাইডবার 'সর্বাধিক পঠিত' সেকশনের পজিশন নিয়ন্ত্রণ
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">র‍্যাংক</th>
              <th className="py-3 px-4">সংবাদ শিরোনাম</th>
              <th className="py-3 px-3">বর্তমান ভিউ সংখ্যা</th>
              <th className="py-3 px-3">দৈনিক গ্রোথ</th>
              <th className="py-3 px-4 text-right">ভিউ অ্যাডজাস্টমেন্ট</th>
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
                    className="font-bold font-serif-bn text-gray-900 dark:text-white hover:text-red-600 cursor-pointer block max-w-md truncate"
                  >
                    {art.title}
                  </span>
                  <span className="text-[11px] text-gray-400">{art.authorName}</span>
                </td>
                <td className="py-3 px-3 font-mono font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {toBengaliNumber(art.viewCount)}
                </td>
                <td className="py-3 px-3">
                  <span className="text-emerald-600 font-semibold text-[11px] flex items-center gap-0.5">
                    <ArrowUp className="w-3 h-3" /> +{toBengaliNumber(Math.floor(art.viewCount * 0.15))}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-1">
                  <button
                    onClick={() => adjustViews(art.id, 500)}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded text-[11px] font-semibold hover:bg-emerald-100"
                    title="+৫০০ ভিউ যোগ করুন"
                  >
                    + ৫০০ ভিউ
                  </button>
                  <button
                    onClick={() => adjustViews(art.id, -500)}
                    className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded text-[11px] hover:bg-gray-200"
                    title="-৫০০ ভিউ কমান"
                  >
                    - ৫০০
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
