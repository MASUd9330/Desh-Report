import React, { useState, useEffect, useMemo } from 'react';
import { useNews } from '../../context/NewsContext';
import { formatRelativeBanglaTime, toBengaliNumber } from '../../utils/helpers';
import { Clock, TrendingUp, Flame, ChevronLeft, ChevronRight, Radio, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { articles, categories, navigateToArticle } = useNews();

  // Sort published articles strictly by date (newest first) so fresh news immediately leads
  const publishedArticles = useMemo(() => {
    return [...articles]
      .filter(a => a.status === 'published')
      .sort((a, b) => {
        const timeA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
        const timeB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });
  }, [articles]);

  // Lead candidates: If an article is explicitly pinned as hero, put it first; otherwise top 5 freshest published news
  const leadStories = useMemo(() => {
    if (publishedArticles.length === 0) return [];
    const pinnedHero = publishedArticles.find(a => a.isFeaturedHero);
    if (pinnedHero) {
      const rest = publishedArticles.filter(a => a.id !== pinnedHero.id).slice(0, 4);
      return [pinnedHero, ...rest];
    }
    return publishedArticles.slice(0, 5);
  }, [publishedArticles]);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automatically reset to newest lead (slide 0) whenever a new article arrives/updates
  const topStoryId = leadStories[0]?.id;
  useEffect(() => {
    setActiveSlide(0);
  }, [topStoryId]);

  // Auto-cycle through top lead stories every 6.5s unless hovered
  useEffect(() => {
    if (isHovered || leadStories.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % leadStories.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isHovered, leadStories.length]);

  if (leadStories.length === 0) return null;

  // Active Main Hero Story
  const currentHero = leadStories[activeSlide] || leadStories[0];

  // Secondary 2 stories (Next available stories that are not the current hero)
  const secondaryStories = publishedArticles
    .filter(a => a.id !== currentHero?.id)
    .slice(0, 2);

  // Fallback if not enough secondary stories
  const usedIds = new Set([currentHero?.id, ...secondaryStories.map(s => s.id)]);
  while (secondaryStories.length < 2) {
    const next = publishedArticles.find(a => !usedIds.has(a.id));
    if (!next) break;
    secondaryStories.push(next);
    usedIds.add(next.id);
  }

  // Right column: Top 5 trending / latest stories excluding hero and secondary
  const rightColumnStories = publishedArticles
    .filter(a => !usedIds.has(a.id))
    .slice(0, 5);

  const getCategoryName = (catId: string) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.nameBn : 'জাতীয়';
  };

  const handlePrevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(prev => (prev - 1 + leadStories.length) % leadStories.length);
  };

  const handleNextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(prev => (prev + 1) % leadStories.length);
  };

  return (
    <section id="homepage-hero-grid" className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Main Big Hero Article with Dynamic Live Rotation (6 Cols on Desktop) */}
        <div 
          className="lg:col-span-6 flex flex-col group relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            onClick={() => navigateToArticle(currentHero.id)}
            className="cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full relative"
          >
            {/* Big Featured Image */}
            <div className="relative aspect-16/9 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
              <img
                key={currentHero.id}
                src={currentHero.featuredImage}
                alt={currentHero.title}
                className="w-full h-full object-cover group-hover:scale-103 transition-all duration-700 ease-out"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay at Bottom of Image for Clean Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              {/* Top Badges: Category & Dynamic Live Update Indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap z-10">
                <span className="bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow-md">
                  {getCategoryName(currentHero.categoryId)}
                </span>
                <span className="bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded shadow-sm flex items-center gap-1.5 border border-white/15">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>সর্বশেষ আপডেট</span>
                </span>
              </div>

              {currentHero.isBreaking && (
                <span className="absolute top-3 right-3 bg-amber-500 text-black font-extrabold text-[11px] px-2.5 py-1 rounded shadow-md flex items-center gap-1 z-10 animate-bounce">
                  <Flame className="w-3.5 h-3.5 fill-black" /> ব্রেকিং
                </span>
              )}

              {/* Navigation Arrows for Lead Stories */}
              {leadStories.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs cursor-pointer pointer-events-auto transition-transform active:scale-95 shadow-md"
                    title="পূর্ববর্তী প্রধান সংবাদ"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="p-2 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs cursor-pointer pointer-events-auto transition-transform active:scale-95 shadow-md"
                    title="পরবর্তী প্রধান সংবাদ"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Slide Counter & Indicators along Bottom edge of Image */}
              {leadStories.length > 1 && (
                <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1.5 bg-black/65 backdrop-blur-xs px-2 py-1 rounded-full border border-white/20">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-gray-200 font-bold tracking-wider">
                    {toBengaliNumber(activeSlide + 1)}/{toBengaliNumber(leadStories.length)}
                  </span>
                  <div className="flex items-center gap-1 ml-1">
                    {leadStories.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveSlide(idx);
                        }}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === activeSlide ? 'w-4 bg-red-500' : 'w-1.5 bg-white/50 hover:bg-white'
                        }`}
                        title={`প্রধান সংবাদ ${toBengaliNumber(idx + 1)}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Details */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif-bn text-gray-950 dark:text-white leading-tight group-hover:text-red-600 transition-colors">
                  {currentHero.title}
                </h1>

                {currentHero.subtitle && (
                  <p className="mt-2 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 leading-snug line-clamp-2">
                    {currentHero.subtitle}
                  </p>
                )}

                <p className="mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
                  {currentHero.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {currentHero.authorName}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatRelativeBanglaTime(currentHero.publishedAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-600 font-semibold text-xs">
                    {toBengaliNumber(currentHero.readingTimeMinutes)} মিনিট পড়া
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: 2 Stacked Important Stories (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col gap-4 sm:gap-6">
          {secondaryStories.map((story) => (
            <div
              key={story.id}
              onClick={() => navigateToArticle(story.id)}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition-all group flex-1 flex flex-col"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={story.featuredImage}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-gray-900/80 text-white font-medium text-[11px] px-2 py-0.5 rounded">
                  {getCategoryName(story.categoryId)}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-serif-bn text-gray-900 dark:text-white leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
                    {story.title}
                  </h2>
                  <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {story.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
                  <span className="truncate max-w-[110px]">{story.authorName}</span>
                  <span>{formatRelativeBanglaTime(story.publishedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: Latest & Trending Fast Feed (3 Cols on Desktop) */}
        <div className="lg:col-span-3 flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                সর্বশেষ সংবাদ
              </h3>
            </div>
            <span className="text-[11px] text-red-600 font-semibold cursor-pointer hover:underline">
              তাজা খবর
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 flex-1 flex flex-col justify-between">
            {rightColumnStories.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => navigateToArticle(item.id)}
                className="py-2.5 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-3"
              >
                <span className="text-xl font-black font-serif text-gray-300 dark:text-gray-600 group-hover:text-red-600 transition-colors shrink-0">
                  {toBengaliNumber(idx + 1)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-semibold text-red-600 dark:text-red-400 block mb-0.5">
                    {getCategoryName(item.categoryId)}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-red-600 leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {formatRelativeBanglaTime(item.publishedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

