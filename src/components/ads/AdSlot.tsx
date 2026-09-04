import React, { useState, useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdPlacement, Advertisement } from '../../types';
import { ExternalLink, X } from 'lucide-react';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const { advertisements, updateAdvertisement } = useNews();
  const [socialBarDismissed, setSocialBarDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const impressionRecorded = useRef(false);

  // Flexible placement lookup
  const findMatchingAd = (): Advertisement | undefined => {
    // 1. Exact active match
    const exact = advertisements.find(a => a.placement === placement && a.status === 'active');
    if (exact) return exact;

    // 2. Flexible in-article fallbacks
    if (['after_first_paragraph', 'middle_article', 'after_article'].includes(placement)) {
      const articleAd = advertisements.find(
        a => (a.placement === 'in_article' || a.placement === 'after_first_paragraph' || a.placement === 'middle_article' || a.placement === 'after_article') && a.status === 'active'
      );
      if (articleAd) return articleAd;
    }

    // 3. Header fallbacks
    if (placement === 'below_header') {
      const headerAd = advertisements.find(
        a => (a.placement === 'header_top' || a.placement === 'below_header' || a.placement === 'below_breaking') && a.status === 'active'
      );
      if (headerAd) return headerAd;
    }

    // 4. Sidebar fallbacks
    if (placement === 'sidebar') {
      const sidebarAd = advertisements.find(
        a => (a.placement === 'sidebar' || a.placement === 'right_sidebar') && a.status === 'active'
      );
      if (sidebarAd) return sidebarAd;
    }

    return undefined;
  };

  const ad = findMatchingAd();

  // Track impressions
  useEffect(() => {
    if (ad && !impressionRecorded.current) {
      impressionRecorded.current = true;
      const currentImpressions = ad.impressions || 0;
      updateAdvertisement(ad.id, { impressions: currentImpressions + 1 });
    }
  }, [ad?.id]);

  if (!ad) {
    return null;
  }

  const adName = ad.name || (ad as any).title || 'বিজ্ঞাপন';
  const adProvider = ad.provider || 'Adsterra';
  const adSize = ad.bannerSize || (ad as any).size || '300x250';
  const adSnippet = ad.codeSnippet || (ad as any).code || '';
  const adImageUrl = ad.imageUrl || '';
  const adTargetUrl = ad.targetUrl || '#';

  const handleAdClick = () => {
    const currentClicks = ad.clicks || 0;
    updateAdvertisement(ad.id, { clicks: currentClicks + 1 });
  };

  // Handle Social Bar (Floating at bottom-right)
  if (ad.type === 'social_bar') {
    if (socialBarDismissed) return null;
    return (
      <div 
        id="adsterra-social-bar"
        className="fixed bottom-3 right-3 z-50 max-w-sm w-full bg-white dark:bg-slate-900 border border-red-200 dark:border-slate-700 shadow-2xl rounded-lg p-3.5 flex items-start gap-3 animate-slide-up transition-all"
      >
        <div className="w-10 h-10 rounded-md bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 font-bold text-lg">
          AD
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-red-600 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
              বিজ্ঞাপন ({adProvider})
            </span>
            <button
              onClick={() => setSocialBarDismissed(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
              aria-label="বিজ্ঞাপন বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 mt-1 line-clamp-2">
            {adName}
          </p>
          <a
            href={adTargetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAdClick}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700 mt-1.5"
          >
            বিস্তারিত দেখুন <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Handle Popunder
  if (ad.type === 'popunder') {
    return null;
  }

  // Handle standard sizing classes
  const sizeClasses: Record<string, string> = {
    '728x90': 'w-full max-w-[728px] h-[90px]',
    '970x90': 'w-full max-w-[970px] h-[90px]',
    '300x250': 'w-full max-w-[300px] h-[250px]',
    '336x280': 'w-full max-w-[336px] h-[280px]',
    '320x50': 'w-full max-w-[320px] h-[50px]',
    '300x600': 'w-full max-w-[300px] h-[600px]'
  };

  const currentSizeClass = sizeClasses[adSize] || 'w-full max-w-[728px] min-h-[90px]';

  return (
    <div 
      ref={containerRef}
      id={`ad-slot-${placement}`}
      className={`my-5 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1.5 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
        <span>বিজ্ঞাপন</span>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <span>{adProvider}</span>
      </div>

      {adImageUrl ? (
        <a
          href={adTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className={`relative block group border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 rounded-lg overflow-hidden transition-all hover:border-red-300 dark:hover:border-red-900/50 shadow-xs ${currentSizeClass}`}
        >
          <img
            src={adImageUrl}
            alt={adName}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        </a>
      ) : adSnippet && adSnippet.includes('<') && !adSnippet.startsWith('<!--') ? (
        <div 
          className={`relative border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 rounded-lg p-2 overflow-hidden ${currentSizeClass}`}
          dangerouslySetInnerHTML={{ __html: adSnippet }}
        />
      ) : (
        <a
          href={adTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAdClick}
          className={`relative flex flex-col items-center justify-center p-4 text-center border border-dashed border-red-200 dark:border-slate-700 bg-linear-to-r from-red-500/5 via-gray-50 to-red-500/5 dark:from-slate-900 dark:to-slate-800 rounded-lg transition-all hover:border-red-400 hover:shadow-xs ${currentSizeClass}`}
        >
          <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
            {adName}
          </span>
          <span className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
            বিজ্ঞাপন দেখতে ক্লিক করুন <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      )}
    </div>
  );
};
