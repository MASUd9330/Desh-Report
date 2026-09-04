import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  LayoutDashboard,
  Newspaper,
  Flame,
  Star,
  TrendingUp,
  FolderTree,
  Image as ImageIcon,
  Bot,
  Megaphone,
  Share2,
  Search,
  BarChart3,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  FileEdit
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const {
    adminSection,
    adminSubSection,
    setAdminSection,
    navigateToHome,
    articles = [],
    breakingNews = [],
    advertisements = [],
    currentUser
  } = useNews();

  const [newsOpen, setNewsOpen] = useState(true);
  const [automationOpen, setAutomationOpen] = useState(true);
  const [adsOpen, setAdsOpen] = useState(false);

  // Statistics counts
  const publishedCount = articles.filter(a => a.status === 'published').length;
  const draftCount = articles.filter(a => a.status === 'draft').length;
  const scheduledCount = articles.filter(a => a.status === 'scheduled').length;
  const breakingCount = breakingNews.filter(b => b.isActive).length;
  const activeAdsCount = advertisements.filter(a => a.status === 'active').length;

  return (
    <aside className="w-64 bg-[#0f172a] text-slate-200 h-screen sticky top-0 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div 
          onClick={navigateToHome} 
          className="cursor-pointer flex items-center gap-2.5 group"
          title="Return to Public Live Portal"
        >
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-500/20">
            DR
          </div>
          <div>
            <span className="text-lg font-black font-sans text-white tracking-tight">
              Desh<span className="text-indigo-400">Report</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                NEWSROOM CMS
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={navigateToHome}
          className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open Live Public Website"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1 text-xs font-medium no-scrollbar">
        {/* Dashboard */}
        <button
          onClick={() => setAdminSection('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'dashboard'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span>Dashboard Overview</span>
        </button>

        {/* 📰 News Management Group */}
        <div className="pt-1">
          <button
            onClick={() => {
              setNewsOpen(!newsOpen);
              if (adminSection !== 'news') {
                setAdminSection('news', 'all');
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              adminSection === 'news'
                ? 'bg-slate-800/90 text-white font-bold border border-slate-700/60'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Newspaper className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Articles & News</span>
            </div>
            {newsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {newsOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800 ml-4 mt-1">
              <button
                onClick={() => setAdminSection('news', 'all')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'news' && adminSubSection === 'all'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>All Articles</span>
                <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded-md font-mono">
                  {articles.length}
                </span>
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('deshreport_editing_id');
                  } catch (_) {}
                  setAdminSection('news', 'add');
                }}
                className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'news' && adminSubSection === 'add'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <PlusCircle className="w-3 h-3 text-indigo-400" />
                <span>Write New Article</span>
              </button>

              <button
                onClick={() => setAdminSection('news', 'draft')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'news' && adminSubSection === 'draft'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <FileEdit className="w-3 h-3 text-yellow-400" />
                  <span>Drafts</span>
                </span>
                <span className="text-[10px] bg-yellow-950/60 text-yellow-300 border border-yellow-800/40 px-1.5 py-0.5 rounded-md font-mono">
                  {draftCount}
                </span>
              </button>

              <button
                onClick={() => setAdminSection('news', 'scheduled')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'news' && adminSubSection === 'scheduled'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-sky-400" />
                  <span>Scheduled</span>
                </span>
                <span className="text-[10px] bg-sky-950/60 text-sky-300 border border-sky-800/40 px-1.5 py-0.5 rounded-md font-mono">
                  {scheduledCount}
                </span>
              </button>

              <button
                onClick={() => setAdminSection('news', 'published')}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'news' && adminSubSection === 'published'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Published</span>
                </span>
                <span className="text-[10px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 px-1.5 py-0.5 rounded-md font-mono">
                  {publishedCount}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 🚨 Breaking News */}
        <button
          onClick={() => setAdminSection('breaking')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'breaking'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <Flame className="w-4 h-4 shrink-0 text-red-400" />
            <span>Breaking Ticker</span>
          </div>
          <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/60 px-1.5 py-0.5 rounded-md font-mono">
            {breakingCount}
          </span>
        </button>

        {/* ⭐ Featured Stories */}
        <button
          onClick={() => setAdminSection('featured')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'featured'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <Star className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Featured & Hero Stories</span>
        </button>

        {/* 🔥 Most Read */}
        <button
          onClick={() => setAdminSection('most_read')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'most_read'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4 shrink-0 text-orange-400" />
          <span>Most Read Rankings</span>
        </button>

        {/* 📂 Categories */}
        <button
          onClick={() => setAdminSection('categories')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'categories'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <FolderTree className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Categories & Tags</span>
        </button>

        {/* 🖼 Media Library */}
        <button
          onClick={() => setAdminSection('media')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'media'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <ImageIcon className="w-4 h-4 shrink-0 text-purple-400" />
          <span>Media Vault</span>
        </button>

        {/* 🤖 Automation & Feeds */}
        <div>
          <button
            onClick={() => {
              setAutomationOpen(!automationOpen);
              setAdminSection('automation', 'sources');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              adminSection === 'automation'
                ? 'bg-slate-800/90 text-white font-bold border border-slate-700/60'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Automation & RSS</span>
            </div>
            {automationOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {automationOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800 ml-4 mt-1">
              <button
                onClick={() => setAdminSection('automation', 'sources')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'automation' && adminSubSection === 'sources'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                RSS & Wire Feeds
              </button>
              <button
                onClick={() => setAdminSection('automation', 'duplicate')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'automation' && adminSubSection === 'duplicate'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Duplicate Detection
              </button>
              <button
                onClick={() => setAdminSection('automation', 'publish')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'automation' && adminSubSection === 'publish'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Scheduler & Cron
              </button>
            </div>
          )}
        </div>

        {/* 📢 Advertisements */}
        <div>
          <button
            onClick={() => {
              setAdsOpen(!adsOpen);
              setAdminSection('ads', 'all');
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
              adminSection === 'ads'
                ? 'bg-slate-800/90 text-white font-bold border border-slate-700/60'
                : 'hover:bg-slate-800/60 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Megaphone className="w-4 h-4 shrink-0 text-pink-400" />
              <span>Ad Manager</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded-md font-mono">
                {activeAdsCount}
              </span>
              {adsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {adsOpen && (
            <div className="pl-6 pr-1 py-1 space-y-0.5 border-l border-slate-800 ml-4 mt-1">
              <button
                onClick={() => setAdminSection('ads', 'all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'all'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                All Ad Units
              </button>
              <button
                onClick={() => setAdminSection('ads', 'adsterra')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'adsterra'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Adsterra Partner
              </button>
              <button
                onClick={() => setAdminSection('ads', 'banner')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'banner'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Display Banners
              </button>
              <button
                onClick={() => setAdminSection('ads', 'social_bar')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'social_bar'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Social Bar Ads
              </button>
              <button
                onClick={() => setAdminSection('ads', 'popunder')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'popunder'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Popunder Units
              </button>
              <button
                onClick={() => setAdminSection('ads', 'placements')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  adminSection === 'ads' && adminSubSection === 'placements'
                    ? 'bg-indigo-600/20 text-indigo-300 font-bold border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Placement Map
              </button>
            </div>
          )}
        </div>

        {/* 📱 Social Media */}
        <button
          onClick={() => setAdminSection('social')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'social'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0 text-blue-400" />
          <span>Social Media Links</span>
        </button>

        {/* 🔍 SEO & Sitemap */}
        <button
          onClick={() => setAdminSection('seo')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'seo'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <Search className="w-4 h-4 shrink-0 text-teal-400" />
          <span>SEO & Sitemap Meta</span>
        </button>

        {/* 📊 Analytics */}
        <button
          onClick={() => setAdminSection('analytics')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'analytics'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Analytics & Traffic</span>
        </button>

        {/* 📄 Pages */}
        <button
          onClick={() => setAdminSection('pages')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'pages'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0 text-indigo-400" />
          <span>Static Pages</span>
        </button>

        {/* 👥 Users */}
        <button
          onClick={() => setAdminSection('users')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'users'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <Users className="w-4 h-4 shrink-0 text-rose-400" />
          <span>Staff & Editorial Roles</span>
        </button>

        {/* ⚙ Settings */}
        <button
          onClick={() => setAdminSection('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            adminSection === 'settings'
              ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25'
              : 'hover:bg-slate-800/80 text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4 shrink-0 text-gray-400" />
          <span>Settings & Backup</span>
        </button>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-9 h-9 rounded-xl object-cover border border-slate-700/80 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-white truncate block">
            {currentUser.name}
          </span>
          <span className="text-[10px] text-indigo-400 truncate block">
            {currentUser.title || currentUser.role}
          </span>
        </div>
      </div>
    </aside>
  );
};
