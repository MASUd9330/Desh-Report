import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdPlacement } from '../../types';
import { ExternalLink, X, Info } from 'lucide-react';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const { advertisements } = useNews();
  const [socialBarDismissed, setSocialBarDismissed] = useState(false);

  // Find active ad for this placement
  const ad = advertisements.find(a => a.placement === placement && a.status === 'active');

  if (!ad) {
    return null;
  }

  // Handle Social Bar
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
              বিজ্ঞাপন (Adsterra)
            </span>
            <button
              onClick={() => setSocialBarDismissed(true)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
              aria-label="বিজ্ঞাপন বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-100 mt-1 line-clamp-2">
            বাংলাদেশে দ্রুততম ক্লাউড হোস্টিং ও ডোমেইন রেজিস্ট্রেশনে বিশেষ ছাড়!
          </p>
          <a
            href={ad.targetUrl || 'https://deshreport.com/adsterra-partner'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-red-600 hover:text-red-700 mt-1.5"
          >
            অফারটি দেখুন <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Handle Popunder (Silent modal or frequency-capped trigger)
  if (ad.type === 'popunder') {
    return null; // Triggers programmatically or via script in background
  }

  // Handle Standard Banner Ad Sizes
  const sizeClasses = {
    '728x90': 'w-full max-w-[728px] h-[90px]',
    '970x90': 'w-full max-w-[970px] h-[90px]',
    '300x250': 'w-[300px] h-[250px]',
    '336x280': 'w-full max-w-[336px] h-[280px]',
    '320x50': 'w-[320px] h-[50px]',
    '300x600': 'w-[300px] h-[600px]'
  };

  const currentSizeClass = ad.bannerSize ? sizeClasses[ad.bannerSize] || 'w-full h-24' : 'w-full h-24';

  return (
    <div 
      id={`ad-slot-${placement}`}
      className={`my-4 flex flex-col items-center justify-center overflow-hidden ${className}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1 text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-medium">
        <span>বিজ্ঞাপন</span>
        <span className="text-gray-300 dark:text-gray-700">•</span>
        <span>{ad.provider}</span>
      </div>

      <a
        href={ad.targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative block group border border-dashed border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 rounded overflow-hidden transition-all hover:border-red-300 dark:hover:border-red-900/50 ${currentSizeClass}`}
      >
        {ad.imageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad.name}
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-linear-to-r from-red-500/5 via-gray-100 to-red-500/5 dark:from-slate-900 dark:to-slate-800">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {ad.name}
            </span>
            <span className="text-[11px] text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
              বিজ্ঞাপন দেখতে ক্লিক করুন <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        )}
      </a>
    </div>
  );
};
