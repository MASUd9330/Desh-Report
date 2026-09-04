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
  Globe
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
    activeCategorySlug
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

          {/* Center: Slogan / Tagline */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {siteSettings.taglineBn}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-[11px]">
              ({siteSettings.taglineEn})
            </span>
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
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              title={isDarkMode ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Quick Link to Admin CMS */}
            <button
              onClick={() => navigateToAdmin()}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-xs shadow-xs transition-colors"
              title="অ্যাডমিন সিএমএস প্যানেল"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
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

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs transition-colors"
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
              <button
                onClick={() => {
                  navigateToHome();
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md font-medium text-sm ${
                  !activeCategorySlug
                    ? 'bg-red-600 text-white'
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
              <button
                onClick={() => {
                  navigateToAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium shadow-xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin CMS প্যানেল</span>
              </button>
              <div className="mt-3 text-center text-xs text-gray-500">
                {todayDateBn}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
