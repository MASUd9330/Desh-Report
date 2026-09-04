import React, { useEffect } from 'react';
import { NewsProvider, useNews } from './context/NewsContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BreakingTicker } from './components/common/BreakingTicker';
import { HeroSection } from './components/portal/HeroSection';
import { CategoryBlock } from './components/portal/CategoryBlock';
import { MostReadSection } from './components/portal/MostReadSection';
import { ArticleView } from './components/portal/ArticleView';
import { CategoryPageView } from './components/portal/CategoryPageView';
import { StaticPageView } from './components/portal/StaticPageView';
import { SearchModal } from './components/portal/SearchModal';
import { AdSlot } from './components/ads/AdSlot';
import { AdminLayout } from './components/admin/AdminLayout';
import { Mail, Clock, SunMedium, CloudSun } from 'lucide-react';

const PortalView: React.FC = () => {
  const {
    activeArticleId,
    activeCategorySlug,
    activePageSlug,
    categories
  } = useNews();

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeArticleId, activeCategorySlug, activePageSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbfb] dark:bg-slate-950 text-gray-900 dark:text-gray-100 font-sans-bn transition-colors">
      {/* Header */}
      <Header />

      {/* Breaking News Ticker */}
      <BreakingTicker />

      {/* Header Billboard Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-3">
        <AdSlot placement="below_breaking" />
      </div>

      {/* Main Content Router */}
      <main className="flex-1">
        {activeArticleId ? (
          <ArticleView />
        ) : activeCategorySlug ? (
          <CategoryPageView />
        ) : activePageSlug ? (
          <StaticPageView />
        ) : (
          /* Homepage */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
            {/* Hero Section */}
            <HeroSection />

            {/* In-feed Billboard Banner */}
            <AdSlot placement="between_cards" />

            {/* Main Portal 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main 8 Columns: Category Sections */}
              <div className="lg:col-span-8 space-y-10">
                {categories.map((cat, idx) => (
                  <React.Fragment key={cat.id}>
                    <CategoryBlock category={cat} />
                    {/* Insert mid-feed banner after 2nd category */}
                    {idx === 1 && (
                      <div className="my-6">
                        <AdSlot placement="in_article" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Sidebar 4 Columns */}
              <div className="lg:col-span-4 space-y-6">
                {/* Primary Sidebar Ad */}
                <AdSlot placement="sidebar" />

                {/* Most Read Section */}
                <MostReadSection />

                {/* Secondary Sidebar Ad */}
                <AdSlot placement="sidebar" />

                {/* Daily Utility Widget (Weather & Prayer times) */}
                <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-slate-800 pb-2 mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <CloudSun className="w-4 h-4 text-amber-500" />
                      <span>আজকের আবহাওয়া ও সময়সূচি</span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">ঢাকা</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                      <span className="text-gray-500">তাপমাত্রা:</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">২৮° সেলসিয়াস (রৌদ্রোজ্জ্বল)</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-slate-800/60">
                      <span className="text-gray-500">সেহরি শেষ:</span>
                      <span className="font-bold font-mono text-emerald-600">০৪:৫২ মিনিট</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-500">ইফতারের সময়:</span>
                      <span className="font-bold font-mono text-red-600">০৬:০৮ মিনিট</span>
                    </div>
                  </div>
                </div>

                {/* Newsletter Subscription Card */}
                <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-red-200" />
                    <h4 className="font-bold text-sm font-serif-bn">
                      দৈনিক নিউজলেটার সাবস্ক্রিপশন
                    </h4>
                  </div>
                  <p className="text-xs text-red-100 mb-3 leading-relaxed">
                    সকালের শীর্ষ সংবাদ ও বিশেষ সম্পাদকীয় বিশ্লেষণ আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); alert('ধন্যবাদ! আপনি সফলভাবে দেশরিপোর্ট নিউজলেটারে যুক্ত হয়েছেন।'); }} className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="আপনার ইমেইল লিখুন..."
                      className="w-full px-3 py-2 text-xs bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-slate-950 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                    >
                      সাবস্ক্রাইব করুন (ফ্রি)
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Mobile Footer Ad */}
      <AdSlot placement="footer_sticky" />

      {/* Footer */}
      <Footer />

      {/* Global Search Modal */}
      <SearchModal />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentView } = useNews();

  return currentView === 'admin' ? <AdminLayout /> : <PortalView />;
};

export default function App() {
  return (
    <NewsProvider>
      <AppContent />
    </NewsProvider>
  );
}
