import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { getDhakaHeaderDate } from '../../utils/helpers';
import {
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  Facebook,
  Youtube,
  Send,
  Globe,
  Lock,
  Heart,
  Flame,
  Radio,
  TrendingUp,
  Twitter
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    categories,
    siteSettings,
    isDarkMode,
    toggleDarkMode,
    navigateToHome,
    navigateToCategory,
    navigateToAdmin,
    setSearchOpen,
    setSearchQuery,
    activeCategorySlug,
    isAdminAuthenticated
  } = useNews();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);

  const mainCategories = categories.slice(0, 10);
  const moreCategories = categories.slice(10);

  const todayDateBn = getDhakaHeaderDate();

  return (
    <header className="w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors">
      {/* 1. Top Utility Bar (Desktop) */}
      <div className="border-b border-gray-100 dark:border-slate-800/80 bg-gray-50/70 dark:bg-slate-950/60 text-xs text-gray-600 dark:text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          {/* Left: Date & Time */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              📅 {todayDateBn}
            </span>
            <span className="hidden md:inline text-gray-300 dark:text-gray-700">|</span>
            <span className="hidden md:inline text-gray-500 dark:text-gray-400">
              ঢাকা সংস্করণ (GMT+6)
            </span>
          </div>

          {/* Center: Topic Spotlight / Iran-US War Tag & Tagline */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Pinned Iran-US War Focus Chip */}
            <button
              onClick={() => {
                setSearchQuery('ইরান-যুক্তরাষ্ট্র যুদ্ধ');
                setSearchOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/10 hover:bg-red-600/20 text-red-700 dark:text-red-400 border border-red-300/80 dark:border-red-900/60 text-[11px] font-bold tracking-tight transition-all cursor-pointer shadow-2xs group"
              title="ইরান-যুক্তরাষ্ট্র যুদ্ধ সংক্রান্ত সকল সংবাদ ও বিশ্লেষণ"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              <Flame className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
              <span>মূল ফোকাস: ইরান-যুক্তরাষ্ট্র যুদ্ধ</span>
              <span className="text-[10px] bg-red-600 text-white rounded px-1 py-0.2 font-medium">লাইভ</span>
            </button>

            <span className="text-gray-300 dark:text-gray-700">|</span>

            <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <span className="font-semibold">
                {siteSettings.taglineBn}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-[11px]">
                ({siteSettings.taglineEn})
              </span>
            </div>
          </div>

          {/* Right: Social Media, Theme Toggle & Admin Switcher */}
          <div className="flex items-center gap-3">
            {/* Social Icons */}
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-gray-200 dark:border-slate-700">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href={siteSettings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-sky-500 transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-3.5 h-3.5" />
              </a>
              {siteSettings.xUrl && (
                <a
                  href={siteSettings.xUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  aria-label="X (Twitter)"
                >
                  <Twitter className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Reader Revenue Contribution Button */}
            <button
              onClick={() => window.triggerReaderRevenueContribution?.()}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-[11px] font-bold border border-red-200 dark:border-red-900/70 transition-all cursor-pointer shadow-2xs"
              title="দেশরিপোর্টের সাংবাদিকতায় সহায়তা করুন"
            >
              <Heart className="w-3 h-3 fill-red-600 text-red-600 dark:fill-red-400 dark:text-red-400" />
              <span>সহায়তা করুন</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              title={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Only visible to logged-in administrator, completely hidden from general readers */}
            {isAdminAuthenticated && (
              <button
                onClick={() => navigateToAdmin()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-xs shadow-xs transition-all cursor-pointer bg-red-600 hover:bg-red-700 text-white"
                title="অ্যাডমিন প্যানেল"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-white" />
                <span>CMS ড্যাশবোর্ড</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Branding & Action Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-1.5 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md"
          aria-label="মেনু খুলুন"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* DeshReport Wordmark Logo */}
        <div 
          onClick={navigateToHome} 
          className="cursor-pointer flex flex-col items-start select-none group"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans text-gray-950 dark:text-white">
              Desh<span className="text-red-600">Report</span>
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>
          </div>
          <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wide">
            {siteSettings.taglineBn}
          </span>
        </div>

        {/* Search & Reader Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs transition-colors cursor-pointer"
            title="সংবাদ খুঁজুন"
          >
            <Search className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">অনুসন্ধান করুন...</span>
          </button>
        </div>
      </div>

      {/* 3. Primary Category Navigation (Desktop) */}
      <nav className="hidden lg:block border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 py-1 text-sm font-medium overflow-x-auto no-scrollbar">
            <li>
              <button
                onClick={navigateToHome}
                className={`px-3 py-2 rounded-md transition-colors ${
                  !activeCategorySlug
                    ? 'text-red-600 font-bold bg-red-50 dark:bg-red-950/40'
                    : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400'
                }`}
              >
                হোম
              </button>
            </li>

            {mainCategories.map(cat => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className={`px-3 py-2 rounded-md whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-red-600 font-bold bg-red-50 dark:bg-red-950/40'
                        : 'text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                  >
                    {cat.nameBn}
                  </button>
                </li>
              );
            })}

            {/* More Dropdown */}
            {moreCategories.length > 0 && (
              <li className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <span>আরও</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {moreDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-44 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-xl rounded-md py-1.5 z-50 animate-fade-in"
                    onMouseLeave={() => setMoreDropdownOpen(false)}
                  >
                    {moreCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          navigateToCategory(cat.slug);
                          setMoreDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-slate-700 hover:text-red-600"
                      >
                        {cat.nameBn}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            )}

            {/* Persistent Right-Side Spotlight: Iran-US War */}
            <li className="ml-auto shrink-0 pl-2">
              <button
                onClick={() => {
                  setSearchQuery('ইরান-যুক্তরাষ্ট্র যুদ্ধ');
                  setSearchOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-linear-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="ইরান-যুক্তরাষ্ট্র যুদ্ধ সংক্রান্ত সকল সংবাদ"
              >
                <Flame className="w-3.5 h-3.5 fill-white text-white" />
                <span>ইরান-যুক্তরাষ্ট্র যুদ্ধ</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold font-sans text-gray-950 dark:text-white">
                  Desh<span className="text-red-600">Report</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {/* Spotlight focus button in mobile */}
              <button
                onClick={() => {
                  setSearchQuery('ইরান-যুক্তরাষ্ট্র যুদ্ধ');
                  setSearchOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg bg-red-600 text-white font-bold text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 fill-white" />
                  <span>ইরান-যুক্তরাষ্ট্র যুদ্ধ</span>
                </div>
                <span className="text-[10px] bg-white/25 px-1.5 py-0.5 rounded font-medium">লাইভ আপডেট</span>
              </button>

              <button
                onClick={() => {
                  navigateToHome();
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${
                  !activeCategorySlug
                    ? 'bg-gray-100 dark:bg-slate-800 text-red-600 font-bold'
                    : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                হোম (Home)
              </button>

              <div className="py-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                সংবাদ বিভাগসমূহ
              </div>

              {categories.map(cat => {
                const isActive = activeCategorySlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      navigateToCategory(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.nameBn} ({cat.nameEn})
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950">
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    navigateToAdmin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 mb-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>অ্যাডমিন ড্যাশবোর্ড (CMS)</span>
                </button>
              )}
              <div className="text-center text-[11px] text-gray-400">
                {todayDateBn}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
