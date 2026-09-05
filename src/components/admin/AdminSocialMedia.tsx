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
  Bot,
  Layers,
  History,
  Info,
  RefreshCw,
  Eye,
  EyeOff,
  Pin,
  Linkedin,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import {
  getStoredSocialConfig,
  saveSocialConfig,
  postToTelegram,
  postToFacebook,
  postToPinterest,
  postToLinkedIn,
  postToWebhook,
  getSocialLogs,
  SocialConfig,
  SocialLog,
  SocialPlatform
} from '../../services/socialPublisher';

export const AdminSocialMedia: React.FC = () => {
  const { siteSettings, updateSiteSettings, articles = [] } = useNews();

  const [activeTab, setActiveTab] = useState<
    'telegram' | 'facebook' | 'pinterest' | 'linkedin' | 'twitter' | 'whatsapp' | 'links' | 'history'
  >('telegram');

  // General Social Links
  const [fbUrl, setFbUrl] = useState(siteSettings?.facebookUrl || 'https://facebook.com/deshreport');
  const [tgUrl, setTgUrl] = useState(siteSettings?.telegramUrl || 'https://t.me/deshreport');
  const [ytUrl, setYtUrl] = useState(siteSettings?.youtubeUrl || 'https://youtube.com/@deshreport');
  const [xUrl, setXUrl] = useState(siteSettings?.xUrl || 'https://x.com/deshreport');
  const [waNumber, setWaNumber] = useState(siteSettings?.whatsappNumber || '01581226134');
  const [pinUrl, setPinUrl] = useState('https://pinterest.com/deshreport');
  const [inUrl, setInUrl] = useState('https://linkedin.com/company/deshreport');

  // Auto-Post Config
  const [socialConfig, setSocialConfig] = useState<SocialConfig>(getStoredSocialConfig);
  const [showTokens, setShowTokens] = useState<Record<string, boolean>>({});

  const toggleTokenVisibility = (key: string) => {
    setShowTokens(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Statuses & Feedback
  const [savedNotice, setSavedNotice] = useState<string | null>(null);
  const [testState, setTestState] = useState<{
    loading: boolean;
    platform: SocialPlatform | null;
    result: { success: boolean; message: string } | null;
  }>({
    loading: false,
    platform: null,
    result: null
  });

  // Logs
  const [logs, setLogs] = useState<SocialLog[]>([]);

  useEffect(() => {
    setLogs(getSocialLogs());
  }, [activeTab, testState]);

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
    setSavedNotice('সোশ্যাল মিডিয়া ও ১৫ মিনিট অটো-পোস্ট কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const getSampleArticle = () => {
    return articles[0] || {
      title: 'দেশরিপোর্ট পরীক্ষামূলক সংবাদ বুলেটিন',
      summary: 'এটি দেশরিপোর্ট নিউজ পোর্টালের অটো-পোস্ট টেস্ট বার্তা। ছবি ও লিংকসহ সফল সোশ্যাল সম্প্রচার নিশ্চিত করা হলো।',
      slug: 'test-bulletin',
      featuredImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
    };
  };

  // Test Handlers
  const handleTestPost = async (platform: SocialPlatform) => {
    setTestState({ loading: true, platform, result: null });
    const sample = getSampleArticle();

    try {
      let res: { success: boolean; message: string } = { success: false, message: 'ত্রুটি ঘটেছে' };

      if (platform === 'telegram') {
        res = await postToTelegram(sample, socialConfig.telegramBotToken, socialConfig.telegramChatId);
      } else if (platform === 'facebook') {
        res = await postToFacebook(sample, socialConfig.facebookPageId, socialConfig.facebookAccessToken);
      } else if (platform === 'pinterest') {
        res = await postToPinterest(sample, socialConfig.pinterestBoardId, socialConfig.pinterestAccessToken);
      } else if (platform === 'linkedin') {
        res = await postToLinkedIn(sample, socialConfig.linkedinAccessToken, socialConfig.linkedinAuthorUrn);
      } else if (platform === 'twitter') {
        res = await postToWebhook('twitter', socialConfig.twitterWebhookUrl, sample);
      } else if (platform === 'whatsapp') {
        res = await postToWebhook('whatsapp', socialConfig.whatsappWebhookUrl, sample);
      }

      setTestState({ loading: false, platform, result: res });
      setLogs(getSocialLogs());
    } catch (err: any) {
      setTestState({
        loading: false,
        platform,
        result: { success: false, message: err?.message || 'টেস্ট বার্তা পাঠাতে সমস্যা হয়েছে।' }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              SOCIAL NEWSROOM SYNDICATION
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Share2 className="w-6 h-6 text-indigo-600" />
            <span>সোশ্যাল মিডিয়া ও ১৫-মিনিট অটো-পোস্ট পাইপলাইন</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            নিউজ পাবলিশ বা RSS ফিড থেকে স্বয়ংক্রিয়ভাবে Telegram, Facebook, Pinterest, LinkedIn ও WhatsApp এ ছবিসহ পোস্ট করুন
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>সকল সেটিংস সংরক্ষণ করুন</span>
        </button>
      </div>

      {savedNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* Auto-Sync Interval Banner */}
      <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <span>১৫ মিনিট স্বয়ংক্রিয় সিঙ্ক ও সোশ্যাল ব্রডকাস্ট (Auto-Syndication)</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.2 rounded-full font-mono">
                সক্রিয় (Active)
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              আরএসএস ফিড বা নতুন সংবাদ পাবলিশ হওয়ার সাথে সাথে টিক দেওয়া সমস্ত সক্রিয় চ্যানেলে ছবিসহ পুশ হবে।
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl text-xs">
          <span className="text-slate-300">সিঙ্ক বিরতি:</span>
          <select
            value={socialConfig.autoPublishIntervalMinutes || 15}
            onChange={e => setSocialConfig(prev => ({ ...prev, autoPublishIntervalMinutes: Number(e.target.value) }))}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-indigo-400"
          >
            <option value={5}>প্রতি ৫ মিনিট পর পর</option>
            <option value={10}>প্রতি ১০ মিনিট পর পর</option>
            <option value={15}>প্রতি ১৫ মিনিট পর পর (সুপারিশকৃত)</option>
            <option value={30}>প্রতি ৩০ মিনিট পর পর</option>
            <option value={60}>প্রতি ১ ঘণ্টা পর পর</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'telegram'
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>টেলিগ্রাম (Telegram Bot)</span>
        </button>

        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'facebook'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Facebook className="w-3.5 h-3.5" />
          <span>ফেসবুক (Facebook Page)</span>
        </button>

        <button
          onClick={() => setActiveTab('pinterest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'pinterest'
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Pin className="w-3.5 h-3.5" />
          <span>পিন্টারেস্ট (Pinterest Pins)</span>
        </button>

        <button
          onClick={() => setActiveTab('linkedin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'linkedin'
              ? 'bg-blue-700 text-white shadow-sm shadow-blue-700/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>লিঙ্কডইন (LinkedIn)</span>
        </button>

        <button
          onClick={() => setActiveTab('twitter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'twitter'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Twitter className="w-3.5 h-3.5" />
          <span>X / Twitter</span>
        </button>

        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp চ্যানেল</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'links'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>পোর্টাল সোশ্যাল লিংক</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'history'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>পোস্ট হিস্ট্রি ও লগ ({logs.length})</span>
        </button>
      </div>

      {/* TAB 1: TELEGRAM */}
      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">টেলিগ্রাম বট ও চ্যানেল কনফিগারেশন</h3>
                    <p className="text-[11px] text-gray-500">নিউজ পাবলিশ হওয়া মাত্রই আপনার চ্যানেলে ছবিসহ পুশ হবে</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.telegramEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, telegramEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-sky-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  টেলিগ্রাম বট টোকেন (Telegram Bot Token)
                </label>
                <div className="relative">
                  <input
                    type={showTokens['tg'] ? 'text' : 'password'}
                    value={socialConfig.telegramBotToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, telegramBotToken: e.target.value }))}
                    placeholder="8310652206:AAH1PUj10qq4RGsc1Oy_vNk0P_gp860neAc"
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleTokenVisibility('tg')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showTokens['tg'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">টেলিগ্রামের @BotFather থেকে পাওয়া গোপন বট API টোকেন।</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  চ্যানেল ইউজারনেম অথবা চ্যাট আইডি (Channel Username / Chat ID)
                </label>
                <input
                  type="text"
                  value={socialConfig.telegramChatId}
                  onChange={e => setSocialConfig(prev => ({ ...prev, telegramChatId: e.target.value }))}
                  placeholder="@deshreport বা @আপনার_চ্যানেল"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-sky-500"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  পাবলিক চ্যানেল হলে @ দিয়ে নাম লিখুন (যেমন: @deshreport)। বটকে ঐ চ্যানেলে Admin বানান।
                </span>
              </div>

              {testState.platform === 'telegram' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="whitespace-pre-line">{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  টেলিগ্রাম সেটিংস সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  disabled={testState.loading}
                  onClick={() => handleTestPost('telegram')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'telegram' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>ছবিসহ টেস্ট পোস্ট পাঠান</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 rounded-2xl p-5 text-xs text-sky-900 dark:text-sky-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-sky-800 dark:text-sky-300">
                <Bot className="w-4 h-4 text-sky-600" />
                <span>টেলিগ্রাম চ্যানেল সেটআপ নির্দেশিকা:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-2 text-[11px] leading-relaxed">
                <li>টেলিগ্রাম অ্যাপে সার্চ করুন <b>@BotFather</b> এবং <b>/newbot</b> লিখে বট তৈরি করে API Token নিন।</li>
                <li>আপনার চ্যানেলের <b>Settings &gt; Administrators</b> এ যান।</li>
                <li><b>Add Administrator</b> এ চাপুন এবং আপনার তৈরি করা বটের ইউজারনেম দিয়ে তাকে Admin হিসেবে যুক্ত করুন।</li>
                <li><b>"Post Messages"</b> অনুমতি অন রাখুন।</li>
                <li>এখানে চ্যানেলের ইউজারনেম <b>@</b> সহ লিখুন (যেমন: <code className="font-mono bg-sky-100 dark:bg-sky-900 px-1 py-0.5 rounded">@deshreport</code>)।</li>
                <li><b>"ছবিসহ টেস্ট পোস্ট পাঠান"</b> বাটনে চাপ দিন।</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACEBOOK */}
      {activeTab === 'facebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">ফেসবুক পেজ অটো-পোস্ট কনফিগারেশন</h3>
                    <p className="text-[11px] text-gray-500">Facebook Graph API v19.0 দিয়ে ছবি ও ক্যাপশনসহ পোস্ট</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.facebookEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, facebookEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ফেসবুক পেজ আইডি (Facebook Page ID)
                </label>
                <input
                  type="text"
                  value={socialConfig.facebookPageId}
                  onChange={e => setSocialConfig(prev => ({ ...prev, facebookPageId: e.target.value }))}
                  placeholder="যেমন: 102938475610293"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">আপনার ফেসবুক পেজের About সেকশন থেকে নেওয়া সংখ্যাসূচক আইডি।</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  পেজ এক্সেস টোকেন (Page Access Token)
                </label>
                <div className="relative">
                  <input
                    type={showTokens['fb'] ? 'text' : 'password'}
                    value={socialConfig.facebookAccessToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, facebookAccessToken: e.target.value }))}
                    placeholder="EAA..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleTokenVisibility('fb')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showTokens['fb'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">developers.facebook.com থেকে তৈরি করা দীর্ঘমেয়াদী পেজ টোকেন।</span>
              </div>

              {testState.platform === 'facebook' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="whitespace-pre-line">{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  ফেসবুক সেটিংস সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  disabled={testState.loading}
                  onClick={() => handleTestPost('facebook')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'facebook' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Facebook className="w-3.5 h-3.5" />
                  )}
                  <span>ফেসবুকে টেস্ট পোস্ট পাঠান</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 text-xs text-blue-900 dark:text-blue-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-800 dark:text-blue-300">
                <Info className="w-4 h-4 text-blue-600" />
                <span>ফেসবুক টোকেন পাওয়ার নিয়ম:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-2 text-[11px] leading-relaxed">
                <li><b>developers.facebook.com</b> এ গিয়ে একটি App তৈরি করুন (Type: Business)।</li>
                <li>Graph API Explorer ওপেন করে আপনার পেজটি নির্বাচন করুন।</li>
                <li>পারমিশনে <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">pages_manage_posts</code> এবং <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded font-mono">pages_read_engagement</code> যুক্ত করুন।</li>
                <li>Page Access Token কপি করে এখানে পেস্ট করুন।</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PINTEREST */}
      {activeTab === 'pinterest' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-600/10 text-rose-600 flex items-center justify-center">
                    <Pin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">পিন্টারেস্ট পিন অটো-পোস্ট (Pinterest Pins)</h3>
                    <p className="text-[11px] text-gray-500">Pinterest API v5 দিয়ে স্বয়ংক্রিয়ভাবে ছবি ও লিংকসহ পিন তৈরি</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.pinterestEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, pinterestEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  পিন্টারেস্ট বোর্ড আইডি (Pinterest Board ID)
                </label>
                <input
                  type="text"
                  value={socialConfig.pinterestBoardId}
                  onChange={e => setSocialConfig(prev => ({ ...prev, pinterestBoardId: e.target.value }))}
                  placeholder="যেমন: 112233445566778899"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">যে Pinterest Board-এ সংবাদগুলোর পিন জমা হবে তার আইডি।</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  পিন্টারেস্ট এক্সেস টোকেন (Pinterest Access Token)
                </label>
                <div className="relative">
                  <input
                    type={showTokens['pin'] ? 'text' : 'password'}
                    value={socialConfig.pinterestAccessToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, pinterestAccessToken: e.target.value }))}
                    placeholder="pina_..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => toggleTokenVisibility('pin')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showTokens['pin'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">developers.pinterest.com থেকে পাওয়া টোকেন (Scope: pins:write, boards:read)।</span>
              </div>

              {testState.platform === 'pinterest' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="whitespace-pre-line">{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  পিন্টারেস্ট সেটিংস সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  disabled={testState.loading}
                  onClick={() => handleTestPost('pinterest')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'pinterest' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Pin className="w-3.5 h-3.5" />
                  )}
                  <span>পিন্টারেস্টে টেস্ট পিন পাঠান</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl p-5 text-xs text-rose-900 dark:text-rose-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-rose-800 dark:text-rose-300">
                <Pin className="w-4 h-4 text-rose-600" />
                <span>পিন্টারেস্ট ইন্টিগ্রেশনের ধাপসমূহ:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-2 text-[11px] leading-relaxed">
                <li><b>developers.pinterest.com</b>-এ গিয়ে আপনার বিজনেস অ্যাকাউন্ট দিয়ে লগইন করুন।</li>
                <li>একটি নতুন App তৈরি করুন এবং Access Token জেনারেট করুন।</li>
                <li>আপনার Pinterest প্রোফাইলে একটি Board তৈরি করুন (যেমন: <i>DeshReport News</i>)।</li>
                <li>বোর্ডের URL থেকে Board ID টি নিয়ে এখানে বসান।</li>
                <li>সংবাদ পাবলিশ বা আরএসএস সিঙ্ক হওয়ার সাথে সাথে হাই-কোয়ালিটি থাম্বনেইল সহ পিন অটো-জেনারেট হবে!</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LINKEDIN */}
      {activeTab === 'linkedin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-700/10 text-blue-700 flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">লিঙ্কডইন শেয়ার কনফিগারেশন</h3>
                    <p className="text-[11px] text-gray-500">LinkedIn v2 UGC Post API দিয়ে প্রফেশনাল নিউজ শেয়ারিং</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.linkedinEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, linkedinEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-blue-700 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  লিঙ্কডইন এক্সেস টোকেন (LinkedIn OAuth Token)
                </label>
                <div className="relative">
                  <input
                    type={showTokens['in'] ? 'text' : 'password'}
                    value={socialConfig.linkedinAccessToken}
                    onChange={e => setSocialConfig(prev => ({ ...prev, linkedinAccessToken: e.target.value }))}
                    placeholder="AQV..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => toggleTokenVisibility('in')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                  >
                    {showTokens['in'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  লিঙ্কডইন Author URN বা পেজ URN
                </label>
                <input
                  type="text"
                  value={socialConfig.linkedinAuthorUrn}
                  onChange={e => setSocialConfig(prev => ({ ...prev, linkedinAuthorUrn: e.target.value }))}
                  placeholder="urn:li:organization:12345678 অথবা urn:li:person:abcdef"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              {testState.platform === 'linkedin' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  লিঙ্কডইন সেটিংস সংরক্ষণ
                </button>
                <button
                  type="button"
                  disabled={testState.loading}
                  onClick={() => handleTestPost('linkedin')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'linkedin' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Linkedin className="w-3.5 h-3.5" />
                  )}
                  <span>লিঙ্কডইনে টেস্ট শেয়ার</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-5 text-xs text-blue-900 dark:text-blue-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-800 dark:text-blue-300">
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>লিঙ্কডইন ব্যবহারের সুবিধা:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                অর্থনীতি, বাণিজ্য ও আন্তর্জাতিক খবর লিঙ্কডইনে পোস্ট করলে উচ্চমানের রিচ ও প্রফেশনাল ভিজিটর পাওয়া যায়।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TWITTER / X */}
      {activeTab === 'twitter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <Twitter className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">X (Twitter) ব্রডকাস্ট ও Webhook</h3>
                    <p className="text-[11px] text-gray-500">স্বয়ংক্রিয় টুইট অথবা Make/Zapier/Pabbly Webhook সিঙ্ক</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.twitterEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, twitterEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-slate-900 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  X (Twitter) Webhook URL (Zapier / Make / IFTTT / Direct)
                </label>
                <input
                  type="text"
                  value={socialConfig.twitterWebhookUrl}
                  onChange={e => setSocialConfig(prev => ({ ...prev, twitterWebhookUrl: e.target.value }))}
                  placeholder="https://hooks.zapier.com/hooks/catch/... বা https://hook.eu1.make.com/..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-slate-500"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  সরাসরি কোনো জটিল API ছাড়াই ফ্রি Zapier/Make Webhook দিয়ে X-এ অটো-পোস্ট করা যায়।
                </span>
              </div>

              {testState.platform === 'twitter' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  X সেটিংস সংরক্ষণ
                </button>
                <button
                  type="button"
                  disabled={testState.loading}
                  onClick={() => handleTestPost('twitter')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'twitter' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Twitter className="w-3.5 h-3.5" />
                  )}
                  <span>X Webhook টেস্ট করুন</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xs text-slate-800 dark:text-slate-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>সহজ Webhook ইন্টিগ্রেশন:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Make.com অথবা Zapier এ "Catch Webhook" ট্রিগার বানিয়ে এই URL টি বসিয়ে দিন। এটি থেকে খুব সহজে সাথে সাথে X (Twitter), Discord বা অন্যান্য জায়গায় রি-পোস্ট হবে।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: WHATSAPP */}
      {activeTab === 'whatsapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">WhatsApp চ্যানেল ও ব্রডকাস্ট</h3>
                    <p className="text-[11px] text-gray-500">হোয়াটসঅ্যাপ চ্যানেল বা গ্রুপের মাধ্যমে দ্রুততম ব্রেকিং নিউজ পুশ</p>
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">অটো-পোস্ট সক্রিয়:</span>
                  <input
                    type="checkbox"
                    checked={socialConfig.whatsappEnabled}
                    onChange={e => setSocialConfig(prev => ({ ...prev, whatsappEnabled: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp চ্যানেল ইনভাইট লিংক (Channel Link)
                </label>
                <input
                  type="text"
                  value={socialConfig.whatsappChannelLink}
                  onChange={e => setSocialConfig(prev => ({ ...prev, whatsappChannelLink: e.target.value }))}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  WhatsApp Bot / Webhook URL (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={socialConfig.whatsappWebhookUrl}
                  onChange={e => setSocialConfig(prev => ({ ...prev, whatsappWebhookUrl: e.target.value }))}
                  placeholder="https://api.whatsapp-gateway.com/send/..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {testState.platform === 'whatsapp' && testState.result && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testState.result.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testState.result.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>{testState.result.message}</div>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  WhatsApp সেটিংস সংরক্ষণ
                </button>
                <button
                  type="button"
                  disabled={testState.loading || !socialConfig.whatsappWebhookUrl}
                  onClick={() => handleTestPost('whatsapp')}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {testState.loading && testState.platform === 'whatsapp' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <MessageCircle className="w-3.5 h-3.5" />
                  )}
                  <span>WhatsApp টেস্ট পাঠান</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl p-5 text-xs text-emerald-900 dark:text-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800 dark:text-emerald-300">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp চ্যানেল ফিচার:</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                পাঠকদের WhatsApp চ্যানেলে যুক্ত হতে উৎসাহিত করতে ওয়েবসাইটের হেডার ও সংবাদে স্বয়ংক্রিয় "WhatsApp এ খবর পেতে যুক্ত হোন" বাটন দেখাবে।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PORTAL SOCIAL LINKS */}
      {activeTab === 'links' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs max-w-3xl space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800">
            ওয়েবসাইট হেডার ও ফুটারে প্রদর্শিত সোশ্যাল লিঙ্ক
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>ফেসবুক পেজ লিংক</span>
              </label>
              <input
                type="url"
                value={fbUrl}
                onChange={e => setFbUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>টেলিগ্রাম চ্যানেল লিংক</span>
              </label>
              <input
                type="url"
                value={tgUrl}
                onChange={e => setTgUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Pin className="w-3.5 h-3.5 text-rose-600" />
                <span>পিন্টারেস্ট প্রোফাইল লিংক</span>
              </label>
              <input
                type="url"
                value={pinUrl}
                onChange={e => setPinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-700" />
                <span>লিঙ্কডইন কোম্পানি পেজ লিংক</span>
              </label>
              <input
                type="url"
                value={inUrl}
                onChange={e => setInUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-600" />
                <span>ইউটিউব চ্যানেল লিংক</span>
              </label>
              <input
                type="url"
                value={ytUrl}
                onChange={e => setYtUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Twitter className="w-3.5 h-3.5 text-gray-900 dark:text-white" />
                <span>X / Twitter প্রোফাইল</span>
              </label>
              <input
                type="url"
                value={xUrl}
                onChange={e => setXUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            পোর্টাল সোশ্যাল লিংক সেভ করুন
          </button>
        </div>
      )}

      {/* TAB 8: LOGS & HISTORY */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <span>রিয়েল-টাইম সোশ্যাল পোস্ট হিস্ট্রি ({logs.length})</span>
            </h3>
            <button
              onClick={() => {
                localStorage.removeItem('deshreport_social_logs');
                setLogs([]);
              }}
              className="text-xs text-rose-500 hover:underline cursor-pointer"
            >
              লগ ক্লিয়ার করুন
            </button>
          </div>

          {logs.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs">
              এখনও কোনো সোশ্যাল পোস্ট লগ তৈরি হয়নি। টেস্ট পোস্ট পাঠিয়ে যাচাই করুন।
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {logs.map(log => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 mt-0.5 ${
                        log.platform === 'telegram'
                          ? 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                          : log.platform === 'facebook'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : log.platform === 'pinterest'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : log.platform === 'linkedin'
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'
                      }`}
                    >
                      {log.platform}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 dark:text-white truncate">{log.articleTitle}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{log.message}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        log.status === 'success'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-400'
                      }`}
                    >
                      {log.status === 'success' ? 'সফল (Success)' : 'ব্যর্থ (Failed)'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
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
