import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminNewsList } from './AdminNewsList';
import { AdminNewsEditor } from './AdminNewsEditor';
import { AdminBreakingNews } from './AdminBreakingNews';
import { AdminFeaturedNews } from './AdminFeaturedNews';
import { AdminMostRead } from './AdminMostRead';
import { AdminCategories } from './AdminCategories';
import { AdminMediaLibrary } from './AdminMediaLibrary';
import { AdminAutomation } from './AdminAutomation';
import { AdminAdvertisements } from './AdminAdvertisements';
import { AdminSocialMedia } from './AdminSocialMedia';
import { AdminSEO } from './AdminSEO';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminPages } from './AdminPages';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';
import {
  Bell,
  Search,
  ExternalLink,
  Moon,
  Sun,
  Menu,
  X,
  PlusCircle,
  LogOut
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    adminSection,
    adminSubSection,
    setAdminSection,
    navigateToHome,
    logoutAdmin,
    darkMode,
    toggleDarkMode,
    currentUser
  } = useNews();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Render appropriate view based on current admin section
  const renderContent = () => {
    switch (adminSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'news':
        if (adminSubSection === 'add') {
          return (
            <AdminNewsEditor
              key={`editor_${typeof window !== 'undefined' ? localStorage.getItem('deshreport_editing_id') || 'new' : 'new'}_${Date.now()}`}
            />
          );
        }
        return <AdminNewsList />;
      case 'breaking':
        return <AdminBreakingNews />;
      case 'featured':
        return <AdminFeaturedNews />;
      case 'most_read':
        return <AdminMostRead />;
      case 'categories':
        return <AdminCategories />;
      case 'media':
        return <AdminMediaLibrary />;
      case 'automation':
        return <AdminAutomation />;
      case 'ads':
        return <AdminAdvertisements />;
      case 'social':
        return <AdminSocialMedia />;
      case 'seo':
        return <AdminSEO />;
      case 'analytics':
        return <AdminAnalytics />;
      case 'pages':
        return <AdminPages />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex font-sans-bn transition-colors">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 max-w-xs shadow-2xl">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Breadcrumb/Context */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">DeshReport CMS</span>
              <span className="text-slate-400 dark:text-slate-600">/</span>
              <span className="capitalize text-indigo-600 dark:text-indigo-400 font-bold">{adminSection}</span>
              {adminSubSection && (
                <>
                  <span className="text-slate-400 dark:text-slate-600">/</span>
                  <span className="capitalize text-slate-500 dark:text-slate-400">{adminSubSection}</span>
                </>
              )}
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* System Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE CMS</span>
            </div>

            <button
              onClick={() => {
                try {
                  localStorage.removeItem('deshreport_editing_id');
                } catch (_) {}
                setAdminSection('news', 'add');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ New Article</span>
            </button>

            <button
              onClick={navigateToHome}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors border border-transparent dark:border-slate-700/50 cursor-pointer"
              title="View Public Live Website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Site</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle Dark / Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Mini */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-xl object-cover border border-slate-300 dark:border-indigo-500/40"
              />
              <span className="hidden md:inline text-xs font-bold text-slate-800 dark:text-slate-200">
                {currentUser.name.split(' ')[0]}
              </span>

              <button
                onClick={logoutAdmin}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
