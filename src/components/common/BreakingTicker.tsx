import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { Zap, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

interface BreakingTickerProps {
  location?: 'homepage' | 'category' | 'article';
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ location = 'homepage' }) => {
  const { breakingNews, navigateToArticle } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Filter active breaking news items matching location
  const activeItems = breakingNews.filter(
    item => item.isActive && (!location || item.displayLocations.includes(location))
  );

  useEffect(() => {
    if (activeItems.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeItems.length, isPaused]);

  if (activeItems.length === 0) {
    return null;
  }

  const currentItem = activeItems[currentIndex];

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
      className="w-full bg-linear-to-r from-red-600 via-red-700 to-red-600 text-white shadow-xs"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-10 overflow-hidden text-xs sm:text-sm">
        {/* Breaking Badge */}
        <div className="flex items-center gap-1.5 shrink-0 bg-black/25 px-2.5 py-1 rounded font-bold uppercase tracking-wider text-[11px] sm:text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse fill-amber-300" />
          <span>ব্রেকিং নিউজ</span>
        </div>

        {/* Content Headline */}
        <div className="flex-1 mx-3 truncate">
          <div
            onClick={handleItemClick}
            className="cursor-pointer font-medium hover:underline inline-block truncate max-w-full tracking-wide transition-all"
          >
            {currentItem.priority === 'urgent' && (
              <span className="inline-block mr-2 px-1.5 py-0.5 text-[10px] font-bold bg-amber-400 text-red-950 rounded">
                জরুরি
              </span>
            )}
            <span>{currentItem.title}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0 text-white/80">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:text-white rounded hover:bg-white/10"
            title={isPaused ? 'চালু করুন' : 'থামান'}
            aria-label="Ticker pause toggle"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1 hover:text-white rounded hover:bg-white/10"
            aria-label="Previous headline"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono px-0.5">
            {currentIndex + 1}/{activeItems.length}
          </span>
          <button
            onClick={handleNext}
            className="p-1 hover:text-white rounded hover:bg-white/10"
            aria-label="Next headline"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
