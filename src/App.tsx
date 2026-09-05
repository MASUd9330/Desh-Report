import React, { useState, useEffect } from 'react';
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
import { AdminLogin } from './components/admin/AdminLogin';
import { RegionalSection } from './components/portal/RegionalSection';
import { VideoSection } from './components/portal/VideoSection';
import { OpinionSection } from './components/portal/OpinionSection';
import { PhotoStorySection } from './components/portal/PhotoStorySection';
import { Mail, Clock, SunMedium, CloudSun, CheckCircle2, TrendingUp } from 'lucide-react';
import { SEOHelper } from './components/common/SEOHelper';

const PortalView: React.FC = () => {
  const {
    activeArticleId,
    activeCategorySlug,
    activePageSlug,
    categories
  } = useNews();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeArticleId, activeCategorySlug, activePageSlug]);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 4500);
  };

  // Group categories into thematic clusters for balanced editorial flow
  const firstBatchCategories = categories.slice(0, 2); // National, Politics
  const secondBatchCategories = categories.slice(2, 5); // Economy, International, Sports
  const thirdBatchCategories = categories.slice(5); // Entertainment, Tech, Lifestyle, etc.

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
            {/* 1. Hero Spotlight Section */}
            <HeroSection />

            {/* In-feed Billboard Banner */}
            <AdSlot placement="between_cards" />

            {/* 2. Main Portal Grid 1: Top Category Blocks & Regional District Desk */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main 8 Columns: Category Sections */}
              <div className="lg:col-span-8 space-y-8">
                {firstBatchCategories.map(cat => (
                  <CategoryBlock key={cat.id} category={cat} />
                ))}

                {/* NEW SECTION 1: Regional & District News (সারাদেশ ও ৬৪ জেলার সংবাদ) */}
                <RegionalSection />
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
                  {newsletterSubmitted ? (
                    <div className="p-3 bg-red-800/80 border border-red-400/40 rounded-lg text-xs flex items-center gap-2 text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                      <span>ধন্যবাদ! আপনি সফলভাবে দেশরিপোর্ট নিউজলেটারে যুক্ত হয়েছেন।</span>
                    </div>
                  ) : (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                      <input
                        type="email"
                        required
                        value={newsletterEmail}
                        onChange={e => setNewsletterEmail(e.target.value)}
                        placeholder="আপনার ইমেইল লিখুন..."
                        className="w-full px-3 py-2 text-xs bg-white text-gray-900 rounded-lg placeholder-gray-400 focus:outline-hidden"
                      />
                      <button
                        type="submit"
                        className="w-full py-2 bg-slate-950 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        সাবস্ক্রাইব করুন (ফ্রি)
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

            {/* NEW SECTION 2: Multimedia & Video Hub (ভিডিও ও মাল্টিমিডিয়া সংবাদ) */}
            <VideoSection />

            {/* In-feed Midpage Ad */}
            <div className="my-6">
              <AdSlot placement="in_article" />
            </div>

            {/* 3. Main Portal Grid 2: Economy, International, Sports Category Blocks */}
            <div className="space-y-8">
              {secondBatchCategories.map(cat => (
                <CategoryBlock key={cat.id} category={cat} />
              ))}
            </div>

            {/* NEW SECTION 3: Editorial & Opinion Desk (সম্পাদকীয় ও বিশিষ্ট মতামত) */}
            <OpinionSection />

            {/* 4. Main Portal Grid 3: Entertainment, Tech, Lifestyle */}
            {thirdBatchCategories.length > 0 && (
              <div className="space-y-8">
                {thirdBatchCategories.map(cat => (
                  <CategoryBlock key={cat.id} category={cat} />
                ))}
              </div>
            )}

            {/* NEW SECTION 4: Photojournalism Gallery (ছবিতে বাংলাদেশ) */}
            <PhotoStorySection />
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
  const { currentView, isAdminAuthenticated } = useNews();

  return (
    <>
      <SEOHelper />
      {currentView === 'admin' ? (
        isAdminAuthenticated ? <AdminLayout /> : <AdminLogin />
      ) : (
        <PortalView />
      )}
    </>
  );
};

export default function App() {
  return (
    <NewsProvider>
      <AppContent />
    </NewsProvider>
  );
}
