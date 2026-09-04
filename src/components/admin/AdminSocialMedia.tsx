import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Share2,
  Facebook,
  Send,
  Youtube,
  Twitter,
  MessageCircle,
  Save,
  Check,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Bot,
  Layers,
  History,
  Info,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  getStoredSocialConfig,
  saveSocialConfig,
  postToTelegram,
  postToFacebook,
  getSocialLogs,
  SocialConfig,
  SocialLog
} from '../../services/socialPublisher';

export const AdminSocialMedia: React.FC = () => {
  const { siteSettings, updateSiteSettings, articles = [] } = useNews();

  const [activeTab, setActiveTab] = useState<'telegram' | 'facebook' | 'links' | 'history'>('telegram');

  // General Social Links
  const [fbUrl, setFbUrl] = useState(siteSettings?.facebookUrl || 'https://facebook.com/deshreport');
  const [tgUrl, setTgUrl] = useState(siteSettings?.telegramUrl || 'https://t.me/deshreport');
  const [ytUrl, setYtUrl] = useState(siteSettings?.youtubeUrl || 'https://youtube.com/@deshreport');
  const [xUrl, setXUrl] = useState(siteSettings?.xUrl || 'https://x.com/deshreport');
  const [waNumber, setWaNumber] = useState(siteSettings?.whatsappNumber || '01581226134');

  // Auto-Post Config
  const [socialConfig, setSocialConfig] = useState<SocialConfig>(getStoredSocialConfig);
  const [showBotToken, setShowBotToken] = useState(false);
  const [showFbToken, setShowFbToken] = useState(false);

  // Statuses & Feedback
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testingFacebook, setTestingFacebook] = useState(false);
  const [facebookTestResult, setFacebookTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Logs
  const [logs, setLogs] = useState<SocialLog[]>([]);

  useEffect(() => {
    setLogs(getSocialLogs());
  }, [activeTab]);

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveSocialConfig(socialConfig);
    updateSiteSettings({
      facebookUrl: fbUrl,
      telegramUrl: tgUrl,
      youtubeUrl: ytUrl,
      xUrl: xUrl,
      whatsappNumber: waNumber
    });
    setSavedNotice('সোশ্যাল মিডিয়া ও অটো-পোস্ট কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  // Test Telegram Auto-Post with sample news & image
  const handleTestTelegram = async () => {
    setTestingTelegram(true);
    setTelegramTestResult(null);

    const sample = articles[0] || {
      title: 'দেশরিপোর্ট পরীক্ষামূলক সংবাদ বুলেটিন',
      summary: 'এটি দেশরিপোর্ট নিউজ পোর্টালের টেলিগ্রাম অটো-পোস্ট টেস্ট বার্তা। ছবি ও লিংকসহ সফল সম্প্রচার নিশ্চিত করা হলো।',
      slug: 'test-bulletin',
      featuredImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
    };

    try {
      const res = await postToTelegram(
        {
          title: `[পরীক্ষামূলক টেস্ট] ${sample.title}`,
          summary: sample.summary,
          slug: sample.slug,
          featuredImage: sample.featuredImage
        },
        socialConfig.telegramBotToken,
        socialConfig.telegramChatId
      );

      setTelegramTestResult({
        success: res.success,
        message: res.message
      });
      setLogs(getSocialLogs());
    } catch (err: any) {
      setTelegramTestResult({
        success: false,
        message: err?.message || 'টেলিগ্রাম সংযোগে সমস্যা হয়েছে।'
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  // Test Facebook Auto-Post
  const handleTestFacebook = async () => {
    setTestingFacebook(true);
    setFacebookTestResult(null);

    const sample = articles[0] || {
      title: 'দেশরিপোর্ট ফেসবুক টেস্ট বুলেটিন',
      summary: 'দেশরিপোর্ট পোর্টালের ফেসবুক পেজ অটো-পোস্ট ইন্টিগ্রেশন সফলভাবে কার্যকর হয়েছে।',
      slug: 'facebook-test',
      featuredImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
    };

    try {
      const res = await postToFacebook(
        {
          title: `[পরীক্ষামূলক টেস্ট] ${sample.title}`,
          summary: sample.summary,
          slug: sample.slug,
          featuredImage: sample.featuredImage
        },
        socialConfig.facebookPageId,
        socialConfig.facebookAccessToken
      );

      setFacebookTestResult({
        success: res.success,
        message: res.message
      });
      setLogs(getSocialLogs());
    } catch (err: any) {
      setFacebookTestResult({
        success: false,
        message: err?.message || 'ফেসবুক সংযোগে সমস্যা হয়েছে।'
      });
    } finally {
      setTestingFacebook(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-indigo-600" />
          <span>টেলিগ্রাম ও ফেসবুক অটো-পোস্ট এবং সোশ্যাল মিডিয়া</span>
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          নতুন সংবাদ প্রকাশের সাথে সাথে স্বয়ংক্রিয়ভাবে টেলিগ্রাম চ্যানেল এবং ফেসবুক পেজে ছবি ও লিংকসহ তাৎক্ষণিক সম্প্রচার।
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'telegram'
              ? 'bg-sky-500 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>টেলিগ্রাম অটো-পোস্ট (Telegram Bot)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('facebook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'facebook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>ফেসবুক অটো-পোস্ট (Facebook Page)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'links'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>পোর্টাল সোশ্যাল লিংক</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'history'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <History className="w-4 h-4" />
          <span>পোস্ট হিস্ট্রি ও লগ ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: TELEGRAM BOT CONFIG */}
      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      টেলিগ্রাম বট ও চ্যানেল কনফিগারেশন
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      নিউজ পাবলিশ হওয়া মাত্রই আপনার চ্যানেলে ছবিসহ পুশ হবে
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.telegramEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, telegramEnabled: e.target.checked }))}
                    className="w-4 h-4 text-sky-500 rounded focus:ring-sky-400"
                  />
                </label>
              </div>

              {/* Bot Token */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  টেলিগ্রাম বট টোকেন (Telegram Bot Token)
                </label>
                <div className="relative">
                  <input
                    type={showBotToken ? 'text' : 'password'}
                    value={socialConfig.telegramBotToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                    placeholder="e.g. 7123456789:AAFlM_abcdef1234567890..."
                    className="w-full text-xs font-mono px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowBotToken(!showBotToken)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showBotToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  টেলিগ্রামের @BotFather থেকে পাওয়া গোপন বট API টোকেন।
                </span>
              </div>

              {/* Chat ID / Channel */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  চ্যানেল ইউজারনেম অথবা চ্যাট আইডি (Channel Username / Chat ID)
                </label>
                <input
                  type="text"
                  value={socialConfig.telegramChatId}
                  onChange={e => setSocialConfig(prev => ({ ...prev, telegramChatId: e.target.value }))}
                  placeholder="@deshreport_news অথবা -1001234567890"
                  className="w-full text-xs font-mono px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  পাবলিক চ্যানেল হলে @ দিয়ে নাম লিখুন (যেমন: @deshreport)। প্রাইভেট চ্যানেল হলে -100 দিয়ে শুরু আইডি দিন।
                </span>
              </div>

              {/* Test Result Message */}
              {telegramTestResult && (
                <div
                  className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                    telegramTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-800 dark:text-red-200'
                  }`}
                >
                  {telegramTestResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {telegramTestResult.success ? 'টেস্ট সফল হয়েছে!' : 'ত্রুটি পরিলক্ষিত হয়েছে:'}
                    </span>
                    <span>{telegramTestResult.message}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAll()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>টেলিগ্রাম সেটিংস সংরক্ষণ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestTelegram}
                  disabled={testingTelegram || !socialConfig.telegramBotToken || !socialConfig.telegramChatId}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  {testingTelegram ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>{testingTelegram ? 'ছবিসহ পাঠানো হচ্ছে...' : 'ছবিসহ টেস্ট পোস্ট পাঠান'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guide Card */}
          <div className="space-y-4">
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-xl p-5 text-xs text-sky-900 dark:text-sky-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-800 dark:text-sky-300">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>টেলিগ্রাম বট তৈরির সহজ নির্দেশিকা:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-2 text-[11px] leading-relaxed">
                <li>টেলিগ্রাম অ্যাপে গিয়ে সার্চ করুন <b>@BotFather</b>।</li>
                <li>মেসেজ পাঠান <b>/newbot</b> এবং আপনার পছন্দমতো নাম দিন (যেমন: DeshReport Bot)।</li>
                <li>বটটি একটি <b>HTTP API Token</b> দিবে (যেমন: 712345...)। সেটি কপি করে উপরের বক্সে পেস্ট করুন।</li>
                <li>আপনার টেলিগ্রাম চ্যানেলের <b>Channel Info</b> এ যান &gt; <b>Administrators</b> এ ক্লিক করুন &gt; আপনার বটটিকে <b>Admin</b> হিসেবে যোগ করুন।</li>
                <li>"Post Messages" অনুমতি সক্রিয় রাখুন।</li>
                <li>উপরের <b>"ছবিসহ টেস্ট পোস্ট পাঠান"</b> বাটনে চাপ দিয়ে যাচাই করুন!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACEBOOK AUTO-POST */}
      {activeTab === 'facebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      ফেসবুক পেজ অটো-পোস্ট কনফিগারেশন
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      নিউজ পাবলিশ হলে সরাসরি আপনার ফেসবুক পেজে ছবি ও লিংকসহ পোস্ট হবে
                    </p>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.facebookEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, facebookEnabled: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Page ID */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  ফেসবুক পেজ আইডি (Facebook Page ID)
                </label>
                <input
                  type="text"
                  value={socialConfig.facebookPageId}
                  onChange={e => setSocialConfig(prev => ({ ...prev, facebookPageId: e.target.value }))}
                  placeholder="e.g. 102938475612345"
                  className="w-full text-xs font-mono px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
                />
                <span className="text-[10px] text-gray-500 mt-1 block">
                  আপনার ফেসবুক পেজের About সেকশন থেকে Page ID কপি করুন।
                </span>
              </div>

              {/* Page Access Token */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  পেজ এক্সেস টোকেন (Permanent Page Access Token)
                </label>
                <div className="relative">
                  <input
                    type={showFbToken ? 'text' : 'password'}
                    value={socialConfig.facebookAccessToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, facebookAccessToken: e.target.value }))}
                    placeholder="EAA..."
                    className="w-full text-xs font-mono px-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFbToken(!showFbToken)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showFbToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  Meta Graph API Explorer অথবা Meta Business Suite থেকে প্রস্তুতকৃত পেজ এক্সেস টোকেন।
                </span>
              </div>

              {/* Test Result Message */}
              {facebookTestResult && (
                <div
                  className={`p-3 rounded-lg border text-xs font-medium flex items-start gap-2 ${
                    facebookTestResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-800 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-800 dark:text-red-200'
                  }`}
                >
                  {facebookTestResult.success ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">
                      {facebookTestResult.success ? 'টেস্ট সফল হয়েছে!' : 'ত্রুটি:'}
                    </span>
                    <span>{facebookTestResult.message}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSaveAll()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ফেসবুক সেটিংস সংরক্ষণ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestFacebook}
                  disabled={testingFacebook || !socialConfig.facebookPageId || !socialConfig.facebookAccessToken}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  {testingFacebook ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Facebook className="w-4 h-4" />}
                  <span>{testingFacebook ? 'ছবিসহ পাঠানো হচ্ছে...' : 'ছবিসহ ফেসবুক টেস্ট পোস্ট পাঠান'}</span>
                </button>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://deshreport.netlify.app')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ওয়ান-ক্লিক ডায়ালগ প্রিভিউ</span>
                </a>
              </div>
            </div>
          </div>

          {/* Facebook Guide */}
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-5 text-xs text-blue-900 dark:text-blue-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-800 dark:text-blue-300">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>ফেসবুক পেজ টোকেন নির্দেশিকা:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                স্বয়ংক্রিয়ভাবে সরাসরি পেজে পোস্ট করতে Meta Graph API প্রয়োজন:
              </p>
              <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
                <li><b>developers.facebook.com</b> এ গিয়ে একটি App তৈরি করুন।</li>
                <li>Graph API Explorer থেকে আপনার পেজের জন্য <code>pages_manage_posts</code> এবং <code>pages_read_engagement</code> অনুমতি সহ Page Access Token তৈরি করুন।</li>
                <li>টোকেনটি উপরের বক্সে দিন এবং পেজ আইডি যুক্ত করুন।</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GENERAL PUBLIC SOCIAL LINKS */}
      {activeTab === 'links' && (
        <form onSubmit={handleSaveAll} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            পাবলিক পোর্টাল ও ফুটারে প্রদর্শিত সোশ্যাল প্রোফাইল লিংক
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>অফিসিয়াল ফেসবুক পেজ URL</span>
            </label>
            <input
              type="url"
              value={fbUrl}
              onChange={e => setFbUrl(e.target.value)}
              placeholder="https://facebook.com/deshreport"
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Send className="w-4 h-4 text-sky-500" />
              <span>টেলিগ্রাম চ্যানেল URL</span>
            </label>
            <input
              type="url"
              value={tgUrl}
              onChange={e => setTgUrl(e.target.value)}
              placeholder="https://t.me/deshreport"
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-600" />
              <span>ইউটিউব চ্যানেল URL</span>
            </label>
            <input
              type="url"
              value={ytUrl}
              onChange={e => setYtUrl(e.target.value)}
              placeholder="https://youtube.com/@deshreport"
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <Twitter className="w-4 h-4 text-gray-900 dark:text-gray-200" />
              <span>এক্স (X / Twitter) প্রোফাইল URL</span>
            </label>
            <input
              type="url"
              value={xUrl}
              onChange={e => setXUrl(e.target.value)}
              placeholder="https://x.com/deshreport"
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-500" />
              <span>হোয়াটসঅ্যাপ নম্বর / কমিউনিটি লিংক</span>
            </label>
            <input
              type="text"
              value={waNumber}
              onChange={e => setWaNumber(e.target.value)}
              placeholder="01581226134 অথবা https://chat.whatsapp.com/..."
              className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>প্রোফাইল লিংক সংরক্ষণ করুন</span>
          </button>
        </form>
      )}

      {/* TAB 4: AUTO-POST HISTORY & LOGS */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                সোশ্যাল অটো-পোস্ট লগ ও হিস্ট্রি
              </h3>
              <p className="text-xs text-gray-500">
                টেলিগ্রাম ও ফেসবুক চ্যানেলে প্রেরিত সাম্প্রতিক পোস্টের সার্বিক বিবরণ
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem('deshreport_social_logs');
                setLogs([]);
              }}
              className="text-[11px] text-gray-400 hover:text-red-600 font-semibold cursor-pointer"
            >
              লগ মুছে ফেলুন
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              এখনো কোনো সোশ্যাল পোস্ট রেকর্ড জমা হয়নি। নতুন নিউজ প্রকাশ করলে অথবা টেস্ট পোস্ট পাঠালে এখানে বিস্তারিত দেখা যাবে।
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {logs.map(log => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {log.imageUrl && (
                      <img
                        src={log.imageUrl}
                        alt="Thumbnail"
                        className="w-12 h-12 object-cover rounded-lg shrink-0 border border-gray-200 dark:border-slate-700"
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            log.platform === 'telegram'
                              ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {log.platform}
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          {log.articleTitle}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-0.5">{log.message}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      {log.status === 'success' ? 'সফল' : 'ব্যর্থ'}
                    </span>
                    <span className="block text-[10px] text-gray-400 mt-1 font-mono">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
