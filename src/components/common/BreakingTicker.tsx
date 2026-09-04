import React, { useState, useEffect, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { toBengaliNumber } from '../../utils/helpers';
import { Zap, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface BreakingTickerProps {
  location?: 'homepage' | 'category' | 'article';
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ location = 'homepage' }) => {
  const { breakingNews, articles, navigateToArticle } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Combine explicit breaking alerts and articles marked as breaking
  const activeItems = useMemo(() => {
    const directItems = (breakingNews || []).filter(
      item =>
        item.isActive &&
        (!location ||
          !item.displayLocations ||
          item.displayLocations.length === 0 ||
          item.displayLocations.includes(location))
    );

    const existingTitles = new Set(directItems.map(d => d.title.trim()));
    const breakingArticles = (articles || [])
      .filter(a => a.status === 'published' && a.isBreaking && !existingTitles.has(a.title.trim()))
      .map(a => ({
        id: 'art-brk-' + a.id,
        title: a.title,
        link: `/article/${a.slug}`,
        articleId: a.id,
        priority: 'urgent' as const,
        isActive: true,
        createdAt: a.publishedAt,
        displayLocations: ['homepage', 'category', 'article'] as ('homepage' | 'category' | 'article')[]
      }));

    return [...directItems, ...breakingArticles];
  }, [breakingNews, articles, location]);

  // Safely bound currentIndex if activeItems changes
  useEffect(() => {
    if (currentIndex >= activeItems.length && activeItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [activeItems.length, currentIndex]);

  // Auto rotate every 4 seconds
  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeItems.length, isPaused]);

  if (activeItems.length === 0) {
    return null;
  }

  const currentItem = activeItems[currentIndex] || activeItems[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeItems.length) % activeItems.length);
  };

  const handleItemClick = () => {
    if (currentItem.articleId) {
      navigateToArticle(currentItem.articleId);
    } else if (currentItem.link) {
      if (currentItem.link.startsWith('/article/')) {
        const slug = currentItem.link.replace('/article/', '');
        navigateToArticle(slug);
      }
    }
  };

  return (
    <div
      id="breaking-news-ticker"
      className="w-full bg-linear-to-r from-red-600 via-red-700 to-red-600 text-white shadow-xs select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 overflow-hidden text-xs sm:text-sm">
        {/* Breaking Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-black/30 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider text-[11px] sm:text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse fill-amber-300" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Content Headline */}
        <div className="flex-1 mx-3 truncate">
          <div
            onClick={handleItemClick}
            className="cursor-pointer font-medium hover:underline inline-flex items-center gap-2 truncate max-w-full tracking-wide transition-all"
          >
            {currentItem.priority === 'urgent' && (
              <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-red-950 rounded">
                জরুরি
              </span>
            )}
            {currentItem.priority === 'high' && (
              <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold bg-white/20 text-white rounded">
                গুরুত্বপূর্ণ
              </span>
            )}
            <span className="truncate">{currentItem.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5 shrink-0 text-white/90">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            title={isPaused ? 'চালু করুন' : 'থামান'}
            aria-label="Ticker pause toggle"
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Previous headline"
            title="পূর্ববর্তী ব্রেকিং নিউজ"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-medium font-sans px-1 bg-black/20 rounded py-0.5">
            {toBengaliNumber(currentIndex + 1)}/{toBengaliNumber(activeItems.length)}
          </span>
          <button
            onClick={handleNext}
            className="p-1 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Next headline"
            title="পরবর্তী ব্রেকিং নিউজ"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
