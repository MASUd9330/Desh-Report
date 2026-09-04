import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Globe2,
  MapPin
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const { articles = [] } = useNews();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalViews = articles.reduce((acc, a) => acc + (a.viewCount || 0), 0);
  const uniqueVisitors = Math.round(totalViews * 0.72);
  const avgDuration = '3m 24s';
  const bounceRate = '34.2%';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>Audience Analytics & Traffic Metrics</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time reader engagement, geographic distribution, bounce rates, and organic keywords
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setRange('7d')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              range === '7d' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600' : 'text-gray-500'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              range === '30d' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600' : 'text-gray-500'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setRange('90d')}
            className={`px-3 py-1.5 rounded-md cursor-pointer ${
              range === '90d' ? 'bg-white dark:bg-slate-700 font-bold text-indigo-600' : 'text-gray-500'
            }`}
          >
            Last 3 Months
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Total Pageviews</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↑ 12.4% vs last period</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Unique Readers</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {uniqueVisitors.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↑ 9.1% new visitors</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Avg Session Duration</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {avgDuration}
          </div>
          <span className="text-[11px] text-purple-600 mt-1 block">High engagement cohort</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>Bounce Rate</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white font-mono">
            {bounceRate}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↓ 4.2% bounce reduction</span>
        </div>
      </div>

      {/* Breakdown: Geographic & Top Search Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span>Geographic Reader Breakdown</span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { region: 'Dhaka Metro & Divisions', pctVal: 52.6, pctStr: '52.6%', views: 45200 },
              { region: 'Chittagong Division', pctVal: 18.4, pctStr: '18.4%', views: 15800 },
              { region: 'Sylhet Division', pctVal: 9.2, pctStr: '9.2%', views: 7900 },
              { region: 'Rajshahi & Rangpur', pctVal: 8.1, pctStr: '8.1%', views: 6950 },
              { region: 'Diaspora (USA, UK, Middle East)', pctVal: 11.7, pctStr: '11.7%', views: 10050 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 mb-1">
                  <span>{item.region}</span>
                  <span className="font-bold font-mono">{item.pctStr} ({item.views.toLocaleString()} views)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.pctVal}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Organic Search Queries */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800 mb-4 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-blue-600" />
            <span>Top Organic Search Queries</span>
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
            {[
              { keyword: 'Dhaka Metro Rail Schedule & Fares', clicks: '8,520', ctr: '12.4%' },
              { keyword: 'Bangladesh Election News 2026', clicks: '6,340', ctr: '14.1%' },
              { keyword: 'Padma Bridge Toll Rate & Traffic', clicks: '5,110', ctr: '9.8%' },
              { keyword: 'DeshReport breaking news updates', clicks: '4,900', ctr: '22.3%' },
              { keyword: 'Bangladesh Economy GDP Forecast', clicks: '4,200', ctr: '16.5%' }
            ].map((kw, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {kw.keyword}
                </span>
                <div className="flex items-center gap-4 text-gray-500 font-mono text-[11px]">
                  <span>{kw.clicks} clicks</span>
                  <span className="text-emerald-600 font-bold">{kw.ctr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
