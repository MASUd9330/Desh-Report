import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Smartphone,
  Laptop,
  Globe2,
  MapPin,
  Calendar
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/helpers';

export const AdminAnalytics: React.FC = () => {
  const { articles } = useNews();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('7d');

  const totalViews = articles.reduce((acc, a) => acc + a.viewCount, 0);
  const uniqueVisitors = Math.round(totalViews * 0.72);
  const avgDuration = '৩ মি. ২৪ সে.';
  const bounceRate = '৩৪.২%';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            <span>পাঠক অ্যানালিটিক্স ও ট্রাফিক মেট্রিক্স (Traffic Analytics)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ভিজিটর এনগেজমেন্ট, ভৌগোলিক অবস্থান, ডিভাইস ও রিয়েল-টাইম পাঠক বিশ্লেষণ
          </p>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          <button
            onClick={() => setRange('7d')}
            className={`px-3 py-1.5 rounded-md ${
              range === '7d' ? 'bg-white dark:bg-slate-700 font-bold text-red-600' : 'text-gray-500'
            }`}
          >
            গত ৭ দিন
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`px-3 py-1.5 rounded-md ${
              range === '30d' ? 'bg-white dark:bg-slate-700 font-bold text-red-600' : 'text-gray-500'
            }`}
          >
            গত ৩০ দিন
          </button>
          <button
            onClick={() => setRange('90d')}
            className={`px-3 py-1.5 rounded-md ${
              range === '90d' ? 'bg-white dark:bg-slate-700 font-bold text-red-600' : 'text-gray-500'
            }`}
          >
            ৩ মাস
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>মোট পেজ ভিউ</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            {toBengaliNumber(totalViews)}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↑ ১২.৪% গত সপ্তাহের চেয়ে</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>অনন্য পাঠক (Unique Users)</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            {toBengaliNumber(uniqueVisitors)}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↑ ৯.১% নতুন পাঠক</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>গড় পড়ার সময়কাল</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            {avgDuration}
          </div>
          <span className="text-[11px] text-purple-600 mt-1 block">উচ্চ এনগেজমেন্ট রেট</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-gray-400 mb-1 text-xs">
            <span>বাউন্স রেট (Bounce Rate)</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
            {bounceRate}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block">↓ ৪.২% বাউন্স কমেছে</span>
        </div>
      </div>

      {/* Breakdown: Geographic & Top Search Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution in Bangladesh */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-600" />
            <span>ভৌগোলিক পাঠক বিন্যাস (Geographic Breakdown)</span>
          </h3>

          <div className="space-y-3 text-xs">
            {[
              { region: 'ঢাকা বিভাগ (Dhaka Metro & Suburbs)', pct: '৫২.৬%', views: 45200 },
              { region: 'চট্টগ্রাম বিভাগ (Chittagong)', pct: '১৮.৪%', views: 15800 },
              { region: 'সিলেট বিভাগ (Sylhet)', pct: '৯.২%', views: 7900 },
              { region: 'রাজশাহী ও রংপুর', pct: '৮.১%', views: 6950 },
              { region: 'প্রবাসী বাংলাদেশি (USA, UK, Middle East)', pct: '১১.৭%', views: 10050 }
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 mb-1">
                  <span>{item.region}</span>
                  <span className="font-bold">{item.pct} ({toBengaliNumber(item.views)} ভিউ)</span>
                </div>
                <div className="w-full h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: item.pct }}
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
            <span>শীর্ষ গুগল সার্চ কি-ওয়ার্ড (Search Queries)</span>
          </h3>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
            {[
              { keyword: 'ঢাকা মেট্রোরেল নতুন সময়সূচি', clicks: '৮,৫২০', ctr: '১২.৪%' },
              { keyword: 'বাংলাদেশ জাতীয় নির্বাচন ২০২৬', clicks: '৬,৩৪০', ctr: '১৪.১%' },
              { keyword: 'পদ্মা সেতু এক্সপ্রেসওয়ে টোল রেট', clicks: '৫,১১০', ctr: '৯.৮%' },
              { keyword: 'দেশরিপোর্ট আজকের তাজা খবর', clicks: '৪,৯০০', ctr: '২২.৩%' },
              { keyword: 'রমজান ২০২৬ সেহরি ও ইফতার সূচি', clicks: '৪,২০০', ctr: '১৬.৫%' }
            ].map((kw, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between">
                <span className="font-bold text-gray-800 dark:text-gray-200">
                  {kw.keyword}
                </span>
                <div className="flex items-center gap-4 text-gray-500 font-mono text-[11px]">
                  <span>{kw.clicks} ক্লিক</span>
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
