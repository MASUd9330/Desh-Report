import React, { useEffect, useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { Heart, X, Sparkles, CheckCircle2, ShieldCheck, CreditCard } from 'lucide-react';

declare global {
  interface Window {
    SWG_BASIC?: any[];
    triggerReaderRevenueContribution?: () => void;
  }
}

export const ReaderRevenueManager: React.FC = () => {
  const { siteSettings } = useNews();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState('');
  const [donationSuccess, setDonationSuccess] = useState(false);

  const isEnabled = siteSettings?.readerRevenueManagerEnabled !== false;
  const pubId = (siteSettings?.readerRevenuePublicationId || '').trim();
  const customSnippet = (siteSettings?.readerRevenueCustomSnippet || '').trim();
  const promptType = siteSettings?.readerRevenuePromptType || 'contributions';

  // Inject Google Reader Revenue Manager (SwG Basic) script when pubId or snippet is provided
  useEffect(() => {
    if (!isEnabled) return;

    // If custom snippet provided by Google Publisher Center exists
    if (customSnippet) {
      const scriptId = 'google-rrm-custom-snippet';
      let existing = document.getElementById(scriptId);
      if (!existing) {
        existing = document.createElement('div');
        existing.id = scriptId;
        existing.style.display = 'none';
        document.body.appendChild(existing);

        // Execute any script tags inside snippet
        const temp = document.createElement('div');
        temp.innerHTML = customSnippet;
        const scripts = temp.querySelectorAll('script');
        scripts.forEach(s => {
          const newScript = document.createElement('script');
          if (s.src) {
            newScript.src = s.src;
            newScript.async = true;
          } else {
            newScript.textContent = s.textContent;
          }
          document.head.appendChild(newScript);
        });
      }
      return;
    }

    // If Publication ID is provided
    if (pubId) {
      const swgScriptId = 'google-swg-basic-script';
      if (!document.getElementById(swgScriptId)) {
        const swgScript = document.createElement('script');
        swgScript.id = swgScriptId;
        swgScript.async = true;
        swgScript.type = 'application/javascript';
        swgScript.src = 'https://news.google.com/swg/js/v1/swg-basic.js';
        document.head.appendChild(swgScript);

        window.SWG_BASIC = window.SWG_BASIC || [];
        window.SWG_BASIC.push((basicSubscriptions: any) => {
          try {
            basicSubscriptions.init({
              type: promptType === 'subscriptions' ? 'Subscriptions' : 'Contributions',
              isAccessibleForFree: true,
              isPartOfType: ['Product'],
              isPartOfProductId: pubId,
              autoPromptType: promptType === 'newsletter' ? 'newsletter' : promptType === 'subscriptions' ? 'subscription' : 'contribution',
              clientOptions: { lang: 'bn' }
            });
          } catch (err) {
            console.warn('Google Reader Revenue Manager init notice:', err);
          }
        });
      }
    }
  }, [isEnabled, pubId, customSnippet, promptType]);

  // Expose global contribution trigger
  useEffect(() => {
    window.triggerReaderRevenueContribution = () => {
      if (window.SWG_BASIC && Array.isArray(window.SWG_BASIC)) {
        // Try calling native Google SwG offer
        try {
          window.SWG_BASIC.push((basicSubscriptions: any) => {
            if (basicSubscriptions && typeof basicSubscriptions.showOffersToast === 'function') {
              basicSubscriptions.showOffersToast();
              return;
            }
          });
        } catch (_) {}
      }
      // Fallback/direct interactive contribution modal for reader support
      setShowSupportModal(true);
    };

    return () => {
      delete window.triggerReaderRevenueContribution;
    };
  }, []);

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount ? parseInt(customAmount, 10) : selectedAmount;
    if (!amount || isNaN(amount)) return;

    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setShowSupportModal(false);
      setCustomAmount('');
    }, 3500);
  };

  return (
    <>
      {/* Reader Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-rose-700 p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-3">
                <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold font-serif-bn">
                দেশরিপোর্টের স্বাধীন সাংবাদিকতায় পাশে থাকুন
              </h3>
              <p className="text-xs text-red-100 mt-1 max-w-md mx-auto">
                গুগল কর্তৃক অনুমোদিত নির্ভরযোগ্য সংবাদ মাধ্যম দেশরিপোর্টকে এগিয়ে নিতে আপনার ছোট্ট অনুদান আমাদের অনুপ্রাণিত করে।
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {donationSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                    অসংখ্য ধন্যবাদ আপনার সমর্থনের জন্য!
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                    আপনার অনুদান দেশরিপোর্টের সাহসী ও অনুসন্ধানী সাংবাদিকতাকে শক্তিশালী করবে।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContribute} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      অনুদানের পরিমাণ নির্বাচন করুন (টাকায়):
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[50, 100, 250, 500].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2.5 rounded-lg font-bold text-sm border transition-all cursor-pointer ${
                            selectedAmount === amt && !customAmount
                              ? 'bg-red-600 text-white border-red-600 shadow-xs'
                              : 'bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-slate-700 hover:border-red-400'
                          }`}
                        >
                          ৳{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                      অথবা নিজের পছন্দমতো পরিমাণ (টাকা):
                    </label>
                    <input
                      type="number"
                      min="10"
                      placeholder="যেমন: ৩০০"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-hidden focus:border-red-500"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700/80 flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold block text-gray-800 dark:text-gray-200">
                        গুগল ভেরিফায়েড ও নিরাপদ পেমেন্ট
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Google Pay / কার্ড / মোবাইল ব্যাংকিংয়ের মাধ্যমে সম্পূর্ণ নিরাপদে পরিশোধ করুন।
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSupportModal(false)}
                      className="w-1/3 py-2.5 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg text-xs cursor-pointer"
                    >
                      পরে করব
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>
                        ৳{customAmount || selectedAmount} দিয়ে সমর্থন করুন
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
