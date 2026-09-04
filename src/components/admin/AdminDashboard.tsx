import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { toBengaliNumber, formatRelativeBanglaTime } from '../../utils/helpers';
import {
  FileText,
  CheckCircle,
  Clock,
  Flame,
  FolderTree,
  Eye,
  TrendingUp,
  PlusCircle,
  Share2,
  ExternalLink,
  Bot,
  Megaphone,
  Smartphone,
  Laptop,
  Tablet,
  Search,
  Activity
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    articles,
    breakingNews,
    categories,
    advertisements,
    automationSources,
    activityLogs,
    setAdminSection,
    navigateToArticle,
    navigateToHome
  } = useNews();

  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  // Metrics
  const totalArticles = articles.length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const scheduledCount = articles.filter(a => a.status === 'scheduled').length;
  const activeBreakingCount = breakingNews.filter(b => b.isActive).length;
  const activeAdsCount = advertisements.filter(a => a.status === 'active').length;

  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const todayViews = Math.floor(totalViews * 0.28);

  const mostViewed = [...articles].sort((a, b) => b.viewCount - a.viewCount)[0];

  // Chart data simulator based on selected time range
  const chartData = {
    daily: [
      { label: '০০:০০', views: 1200 },
      { label: '০৪:০০', views: 800 },
      { label: '০৮:০০', views: 4500 },
      { label: '১২:০০', views: 6800 },
      { label: '১৬:০০', views: 5900 },
      { label: '২০:০০', views: 8400 },
      { label: '২৩:৫৯', views: 3600 }
    ],
    weekly: [
      { label: 'শনিবার', views: 24500 },
      { label: 'রবিবার', views: 28900 },
      { label: 'সোমবার', views: 31200 },
      { label: 'মঙ্গলবার', views: 29800 },
      { label: 'বুধবার', views: 33400 },
      { label: 'বৃহস্পতিবার', views: 36500 },
      { label: 'শুক্রবার', views: 42100 }
    ],
    monthly: [
      { label: 'সপ্তাহ ১', views: 185000 },
      { label: 'সপ্তাহ ২', views: 210000 },
      { label: 'সপ্তাহ ৩', views: 198000 },
      { label: 'সপ্তাহ ৪', views: 245000 }
    ]
  }[timeRange];

  const maxChartVal = Math.max(...chartData.map(d => d.views));

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              BENTO GRID DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl font-bold font-serif-bn text-slate-900 dark:text-white">
            অ্যাডমিন ড্যাশবোর্ড (Editorial CMS)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            দেশরিপোর্ট ডিজিটাল নিউজরুম ও সম্পাদকীয় নিয়ন্ত্রণ কেন্দ্র
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminSection('news', 'add')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>নতুন সংবাদ তৈরি করুন</span>
          </button>
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-transparent dark:border-slate-700/60"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>লাইভ সাইট দেখুন</span>
          </button>
        </div>
      </div>

      {/* Primary Modular Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Bento Lead Tile: Real-time Audience & Editorial Hub (Spans 2 cols) */}
        <div className="col-span-1 md:col-span-2 bg-linear-to-br from-indigo-950/70 via-slate-900 to-[#0f172a] border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-indigo-950/20 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  লাইভ সিস্টেম মনিটরিং
                </span>
              </div>
              <h2 className="text-lg font-bold font-serif-bn text-white">
                আজকের পাঠক ট্রাফিক ও অপারেশনাল নিয়ন্ত্রণ
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                রিয়েল-টাইম পাঠক বৃদ্ধি, স্বয়ংক্রিয় এডিটিং পাইপলাইন ও বিজ্ঞাপন কার্যকারিতা সারসংক্ষেপ
              </p>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[11px] text-indigo-300 font-medium">আজকের অ্যাক্টিভ রিডার্স</span>
              <span className="text-2xl font-black text-white font-mono">
                {toBengaliNumber(todayViews)}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">+১২.৪% বৃদ্ধি</span>
            </div>
          </div>

          {/* Quick Action Bento Pills */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAdminSection('breaking')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              <span>ব্রেকিং অ্যালার্ট ({toBengaliNumber(activeBreakingCount)})</span>
            </button>

            <button
              onClick={() => setAdminSection('automation')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>অটোমেশন সিঙ্ক ({toBengaliNumber(automationSources.length)})</span>
            </button>

            <button
              onClick={() => setAdminSection('analytics')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-colors"
            >
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              <span>মোট ভিউ: {toBengaliNumber(totalViews)}</span>
            </button>
          </div>
        </div>

        {/* Bento Tile 2: Total Articles */}
        <div 
          onClick={() => setAdminSection('news', 'all')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-indigo-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট সংবাদ</span>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white font-serif-bn">
              {toBengaliNumber(totalArticles)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">সকল ক্যাটাগরি মিলিয়ে ডাটাবেস</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '85%' }} />
          </div>
        </div>

        {/* Bento Tile 3: Published */}
        <div 
          onClick={() => setAdminSection('news', 'published')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">প্রকাশিত লাইভ</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-serif-bn">
              {toBengaliNumber(publishedCount)}
            </div>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 block">
              অনলাইনে পাঠকদের জন্য দৃশ্যমান
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Bento Tile 4: Drafts & Pending */}
        <div 
          onClick={() => setAdminSection('news', 'draft')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">খসড়া পাইপলাইন</span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 font-serif-bn">
              {toBengaliNumber(draftCount)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">রিভিউ ও এডিটিং প্রক্রিয়াধীন</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        {/* Bento Tile 5: Breaking News */}
        <div 
          onClick={() => setAdminSection('breaking')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-pink-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ব্রেকিং নিউজ</span>
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 font-serif-bn">
              {toBengaliNumber(activeBreakingCount)}
            </div>
            <span className="text-[11px] text-pink-500/80 mt-1 block">সক্রিয় লাল স্ক্রলবার টিকারে লাইভ</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-pink-500 h-full rounded-full" style={{ width: '70%' }} />
          </div>
        </div>

        {/* Bento Tile 6: Ads & Monetization */}
        <div 
          onClick={() => setAdminSection('ads')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">বিজ্ঞাপন ও Adsterra</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Megaphone className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 font-serif-bn">
              {toBengaliNumber(activeAdsCount)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">সক্রিয় অ্যাড ব্যানার ও পপআন্ডার</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '80%' }} />
          </div>
        </div>

        {/* Bento Tile 7: Automation & RSS */}
        <div 
          onClick={() => setAdminSection('automation')}
          className="cursor-pointer bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-5 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">অটোমেশন সিঙ্ক</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                <Bot className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 font-serif-bn">
              {toBengaliNumber(automationSources.length)}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">সক্রিয় RSS / API ফিড সোর্স</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-cyan-500 h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </div>

      {/* Interactive Traffic Chart & Real-Time Stats Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Traffic Chart Bento Box (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" />
                  <span>পাঠক ট্রাফিক ট্রেন্ডস (Audience Analytics)</span>
                </h2>
                <span className="text-xs text-slate-400">প্রতিবেদনের পাঠক ভিউ ও এনগেজমেন্ট সময়ের বিশ্লেষণ</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-xl text-xs border border-transparent dark:border-slate-700/60">
                <button
                  onClick={() => setTimeRange('daily')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeRange === 'daily'
                      ? 'bg-white dark:bg-slate-700 font-bold shadow-xs text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  আজকে (Daily)
                </button>
                <button
                  onClick={() => setTimeRange('weekly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeRange === 'weekly'
                      ? 'bg-white dark:bg-slate-700 font-bold shadow-xs text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  এ সপ্তাহ (Weekly)
                </button>
                <button
                  onClick={() => setTimeRange('monthly')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    timeRange === 'monthly'
                      ? 'bg-white dark:bg-slate-700 font-bold shadow-xs text-indigo-600 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  এ মাস (Monthly)
                </button>
              </div>
            </div>

            {/* Bar Visualizer */}
            <div className="h-56 flex items-end justify-between gap-2.5 pt-6 px-2">
              {chartData.map((bar, i) => {
                const heightPercent = Math.round((bar.views / maxChartVal) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-900 dark:bg-slate-800 text-white px-1.5 py-0.5 rounded">
                      {toBengaliNumber(bar.views)}
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-full flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-linear-to-t from-indigo-600 to-indigo-400 rounded-t-lg group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-300"
                      />
                    </div>
                    <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate w-full text-center">
                      {bar.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bento Summary Strip */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block mb-0.5">গড় পাঠকাল</span>
              <strong className="text-slate-800 dark:text-slate-200">৩ মি. ৪৫ সে.</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block mb-0.5">বাউন্স রেট</span>
              <strong className="text-emerald-600 dark:text-emerald-400">২৩.৮%</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[10px] text-slate-400 block mb-0.5">পিক ট্রাফিক সময়</span>
              <strong className="text-indigo-600 dark:text-indigo-400">রাত ৮:০০ - ১০:০০</strong>
            </div>
          </div>
        </div>

        {/* Right: Device Breakdown & Top Referrers Bento Box (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          {/* Device Distribution */}
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              ডিভাইস ট্রাফিক বিন্যাস
            </h3>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>মোবাইল ব্রাউজার</span>
                  </span>
                  <span className="font-bold">৬৮.৪%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '68.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ডেস্কটপ / ল্যাপটপ</span>
                  </span>
                  <span className="font-bold">২৫.৮%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Tablet className="w-3.5 h-3.5 text-amber-400" />
                    <span>ট্যাবলেট ও অন্যান্য</span>
                  </span>
                  <span className="font-bold">৫.৮%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '5.8%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">
              শীর্ষ ট্রাফিক উৎস (Referrers)
            </h3>
            <div className="space-y-2 text-xs">
              {[
                { source: 'Facebook (সামাজিক যোগাযোগ)', pct: '৪৬.২%', color: 'bg-indigo-500' },
                { source: 'Google Search (অর্গানিক)', pct: '৩১.৫%', color: 'bg-emerald-500' },
                { source: 'Direct (সরাসরি ব্রাউজ)', pct: '১৫.১%', color: 'bg-purple-500' },
                { source: 'Telegram & Newsletters', pct: '৭.২%', color: 'bg-cyan-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
                  <span className="text-slate-600 dark:text-slate-400">{item.source}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px]">
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Articles Table & Recent Activity Logs Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top 5 Articles Bento Box (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                সর্বাধিক পঠিত খবর (Top Performing Articles)
              </h3>
            </div>
            <button
              onClick={() => setAdminSection('news', 'all')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              সবগুলো দেখুন
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {articles.slice(0, 5).map((art, idx) => (
              <div key={art.id} className="py-3 flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 font-mono text-[11px] group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 
                      onClick={() => navigateToArticle(art.id)}
                      className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate cursor-pointer"
                    >
                      {art.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {art.authorName} • {formatRelativeBanglaTime(art.publishedAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {toBengaliNumber(art.viewCount)} ভিউ
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    art.status === 'published'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    {art.status === 'published' ? 'লাইভ' : 'খসড়া'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Admin Activity Logs Bento Box (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/90 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>সাম্প্রতিক অ্যাক্টিভিটি (Newsroom Logs)</span>
            </h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              রিয়েল-টাইম
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 dark:text-slate-200 leading-snug">
                    <strong className="text-slate-950 dark:text-white font-semibold">{log.userName}</strong>{' '}
                    <span>{log.action} করেছেন:</span>{' '}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">"{log.entityTitle}"</span>
                  </p>
                  <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
