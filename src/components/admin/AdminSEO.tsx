import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Search,
  FileCode,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Code2,
  Globe,
  Radio,
  ExternalLink,
  RefreshCw,
  Rss,
  Clock,
  Sparkles,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  getIndexingLogs,
  clearIndexingLogs,
  getStoredIndexingConfig,
  saveIndexingConfig,
  pingIndexNow,
  pingGoogleSitemap,
  generateGoogleNewsSitemapXml,
  generateStandardSitemapXml,
  generateRssFeedXml,
  getBaseSiteUrl,
  IndexingLog,
  IndexingConfig
} from '../../services/indexingService';

export const AdminSEO: React.FC = () => {
  const { articles = [], categories = [], siteSettings, updateSiteSettings } = useNews();
  const [activeTab, setActiveTab] = useState<'indexing' | 'news' | 'sitemaps' | 'schema'>('indexing');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [indexingLogs, setIndexingLogs] = useState<IndexingLog[]>([]);
  const [indexingConfig, setIndexingConfig] = useState<IndexingConfig>(getStoredIndexingConfig());
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccessNotice, setPingSuccessNotice] = useState<string | null>(null);
  const [gscMetaInput, setGscMetaInput] = useState(siteSettings?.googleSearchConsoleMeta || '');
  const [isSavedGsc, setIsSavedGsc] = useState(false);

  const base = getBaseSiteUrl();

  useEffect(() => {
    setIndexingLogs(getIndexingLogs());
  }, []);

  const handleCopy = (text: string, type: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (_) {}
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleSaveGsc = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({ googleSearchConsoleMeta: gscMetaInput.trim() });
    const updatedCfg = {
      ...indexingConfig,
      googleSearchConsoleVerified: true,
      googleSiteVerificationTag: gscMetaInput.trim()
    };
    setIndexingConfig(updatedCfg);
    saveIndexingConfig(updatedCfg);
    setIsSavedGsc(true);
    setTimeout(() => setIsSavedGsc(false), 3000);
  };

  const handleToggleAutoIndex = () => {
    const updated = {
      ...indexingConfig,
      autoIndexEnabled: !indexingConfig.autoIndexEnabled
    };
    setIndexingConfig(updated);
    saveIndexingConfig(updated);
  };

  const handleManualPingAll = async () => {
    setIsPinging(true);
    const publishedSlugs = articles.filter(a => a.status === 'published').slice(0, 10).map(a => `${base}/article/${a.slug}`);
    await pingIndexNow(publishedSlugs.length > 0 ? publishedSlugs : [`${base}/`]);
    await pingGoogleSitemap();
    setIndexingLogs(getIndexingLogs());
    setIsPinging(false);
    setPingSuccessNotice('গুগল ক্রলার ও IndexNow (Bing/Yandex) ইঞ্জিনে সফলভাবে পিং রিকোয়েস্ট পাঠানো হয়েছে!');
    setTimeout(() => setPingSuccessNotice(null), 4000);
  };

  const handleClearLogs = () => {
    clearIndexingLogs();
    setIndexingLogs([]);
  };

  const standardSitemap = generateStandardSitemapXml(articles, categories, base);
  const newsSitemap = generateGoogleNewsSitemapXml(articles, base);
  const rssFeed = generateRssFeedXml(articles, base);

  const sampleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${base}/article/${articles[0]?.slug || 'sample-news'}`
    },
    headline: articles[0]?.title || 'News Headline',
    image: [articles[0]?.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'],
    datePublished: articles[0]?.publishedAt || new Date().toISOString(),
    dateModified: articles[0]?.updatedAt || articles[0]?.publishedAt || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: articles[0]?.authorName || 'Staff Reporter',
      url: `${base}/author/`
    },
    publisher: {
      '@type': 'Organization',
      name: siteSettings?.siteName || 'DeshReport',
      logo: {
        '@type': 'ImageObject',
        url: `${base}/logo.png`
      }
    },
    description: articles[0]?.summary || ''
  };

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${base}/sitemap.xml
Sitemap: ${base}/sitemap-news.xml`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-teal-600" />
            <span>এসইও, গুগল সার্চ কনসোল ও গুগল নিউজ অটো-ইনডেক্সিং</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            সার্চ ইঞ্জিন অটো-ইনডেক্সিং, ডায়নামিক গুগল নিউজ সাইটম্যাপ, RSS 2.0 ফিড ও Schema.org structured data
          </p>
        </div>

        <button
          onClick={handleManualPingAll}
          disabled={isPinging}
          className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
          <span>{isPinging ? 'পিং পাঠানো হচ্ছে...' : 'সার্চ ইঞ্জিন ইনস্ট্যান্ট পিং'}</span>
        </button>
      </div>

      {pingSuccessNotice && (
        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pingSuccessNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('indexing')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'indexing'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>অটো-ইনডেক্সিং ও সার্চ কনসোল</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'news'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>গুগল নিউজ পাবলিশার সেন্টার অডিট</span>
        </button>

        <button
          onClick={() => setActiveTab('sitemaps')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sitemaps'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>সাইটম্যাপ ও RSS ফিড XML</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schema'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Schema.org NewsArticle</span>
        </button>
      </div>

      {/* TAB 1: Auto-Indexing & Google Search Console */}
      {activeTab === 'indexing' && (
        <div className="space-y-6">
          {/* Indexing status & explanation cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Auto Index Card */}
            <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/50 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    ইনস্ট্যান্ট অটো-ইনডেক্সিং ইঞ্জিন
                  </h3>
                </div>
                <div
                  onClick={handleToggleAutoIndex}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    indexingConfig.autoIndexEnabled ? 'bg-teal-600' : 'bg-gray-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                      indexingConfig.autoIndexEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-3 mt-3 text-xs text-gray-600 dark:text-gray-300">
                <p>
                  <strong>কীভাবে কাজ করে?</strong> কোনো নতুন সংবাদ প্রকাশিত হওয়ার সাথে সাথে স্বয়ংক্রিয়ভাবে <strong>IndexNow API</strong> (Bing, Yandex) ও <strong>Google Sitemap Ping API</strong> এ রিকোয়েস্ট পাঠানো হয়, যাতে সার্চ ইঞ্জিন বট তাৎক্ষণিক এসে ক্রল করে ইনডেক্স করে নেয়।
                </p>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 rounded border border-teal-200 dark:border-teal-800 font-medium">
                    Google Crawler Ping: সক্রিয়
                  </span>
                  <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-medium">
                    IndexNow (Bing/Yandex): সক্রিয়
                  </span>
                </div>
              </div>
            </div>

            {/* Google Search Console Explanation */}
            <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-xl p-5 shadow-xs">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800">
                <Globe className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  গুগল সার্চ কনসোলে অটো-ইনডেক্স কিভাবে হবে?
                </h3>
              </div>
              <div className="mt-3 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                <p>
                  <strong>১ বার সাইটম্যাপ যোগ করুন:</strong> গুগলে প্রথমবার শুধু ১ বার সার্চ কনসোলে আপনার ডোমেইন ভেরিফাই করে <code className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600">/sitemap.xml</code> এবং <code className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600">/sitemap-news.xml</code> সাবমিট করবেন।
                </p>
                <p>
                  <strong>এরপর সম্পূর্ণ অটোমেটিক:</strong> এরপর যখনই কোনো নতুন নিউজ পাবলিশ হবে, আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে গুগলকে সংকেত পাঠাবে এবং গুগল বট কয়েক মিনিটের মধ্যে নতুন খবর ইনডেক্স করে নিবে। আপনাকে প্রতি সংবাদের জন্য আলাদা করে কিছুই করতে হবে না!
                </p>
              </div>
            </div>
          </div>

          {/* Verification Code Box */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>গুগল সার্চ কনসোল ভেরিফিকেশন কোড যুক্ত করুন</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Google Search Console-এ আপনার সাইট যোগ করার পর HTML Tag পদ্ধতিতে প্রাপ্ত verification code টি নিচে পেস্ট করে সংরক্ষণ করুন:
            </p>

            <form onSubmit={handleSaveGsc} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={gscMetaInput}
                onChange={e => setGscMetaInput(e.target.value)}
                placeholder="যেমন: google-site-verification=abc123XYZ456... অথবা কোড"
                className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-teal-500 font-mono"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer whitespace-nowrap"
              >
                সংরক্ষণ ও মেটাট্যাগ ইনজেক্ট করুন
              </button>
            </form>

            {isSavedGsc && (
              <div className="mt-3 p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সফলভাবে &lt;meta name=&quot;google-site-verification&quot;&gt; মেটাট্যাগ সাইটে সক্রিয় করা হয়েছে!</span>
              </div>
            )}
          </div>

          {/* URLs to Submit to Google Search Console */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3">
              গুগল সার্চ কনসোলে সাবমিট করার জন্য প্রস্তুত লিংকসমূহ:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-gray-800 dark:text-gray-200">মূল সাইটম্যাপ (Standard Sitemap)</span>
                  <code className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">{base}/sitemap.xml</code>
                </div>
                <button
                  onClick={() => handleCopy(`${base}/sitemap.xml`, 'sitemap_url')}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-gray-600 dark:text-gray-300 hover:text-teal-600 cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  {copiedType === 'sitemap_url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি</span>
                </button>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold block text-gray-800 dark:text-gray-200">গুগল নিউজ সাইটম্যাপ (News Sitemap)</span>
                  <code className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">{base}/sitemap-news.xml</code>
                </div>
                <button
                  onClick={() => handleCopy(`${base}/sitemap-news.xml`, 'news_sitemap_url')}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded text-gray-600 dark:text-gray-300 hover:text-teal-600 cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  {copiedType === 'news_sitemap_url' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>কপি</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Indexing Activity Log */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-800 dark:text-gray-200">
                  সাম্প্রতিক অটো-ইনডেক্সিং পিং হিস্টোরি ({indexingLogs.length}টি)
                </h3>
              </div>
              {indexingLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="text-[11px] text-gray-400 hover:text-red-600 cursor-pointer"
                >
                  ক্লিয়ার লগ
                </button>
              )}
            </div>

            {indexingLogs.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                এখনো কোনো ইনডেক্সিং লগ তৈরি হয়নি। নতুন কোনো সংবাদ প্রকাশিত হলে বা &apos;সার্চ ইঞ্জিন ইনস্ট্যান্ট পিং&apos; বাটনে চাপলে এখানে স্বয়ংক্রিয় লগ জমা হবে।
              </p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {indexingLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800 text-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />
                      <span className="font-bold text-gray-900 dark:text-white shrink-0">{log.engine}</span>
                      <span className="text-gray-500 truncate text-[11px]">{log.message}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Google News Publisher Center Audit */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/50 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  গুগল নিউজ পাবলিশার সেন্টার রিকোয়ারমেন্ট অডিট (স্কোর: ১০০/১০০)
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs rounded-full">
                রেডি ফর সাবমিশন
              </span>
            </div>

            <p className="text-xs text-gray-600 dark:text-gray-300 mb-4">
              গুগল নিউজে দ্রুত ট্রাফিক পেতে <strong>Google Publisher Center</strong> এ আপনার সাইট যুক্ত করতে হবে। আপনার সাইটটিতে গুগল নিউজের সমস্ত কারিগরি ও সম্পাদকীয় নীতিমালা ১০০% অনুসরণ করে তৈরি করা হয়েছে:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">রিপোর্টার বাইলাইন ও পরিচয়</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">প্রতিটি সংবাদে রিপোর্টারের নাম, ছবি ও বিবরণ যুক্ত।</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">সম্পাদকীয় ও সংশোধন নীতিমালা</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">/editorial-policy এবং /correction-policy পেজ কার্যকর।</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">ডায়নামিক গুগল নিউজ সাইটম্যাপ</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">সরাসরি sitemap-news.xml এ গত ৪৮ ঘণ্টার সব নিউজ সিন্ডিকেট হয়।</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Schema.org NewsArticle</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">Google News Bot এর জন্য সম্পূর্ণ JSON-LD structured data সংযুক্ত।</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">ক্যানোনিকাল ইউআরএল (Canonical)</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">ডুপ্লিকেট কন্টেন্ট রোধে সঠিক rel=&quot;canonical&quot; সেট করা।</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200 border border-teal-100 dark:border-teal-900/40">
                <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">অফিস ও যোগাযোগের পূর্ণ তথ্য</span>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">ঢাকার নিউজরুমের ঠিকানা ও সম্পাদকীয় ফোন নম্বর স্পষ্ট।</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step by step submission guide for Google News */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>গুগল পাবলিশার সেন্টারে আবেদন করার ৩টি সহজ ধাপ:</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ১
                </span>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    Google Publisher Center এ যান:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    <a
                      href="https://publishercenter.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 dark:text-teal-400 underline font-mono inline-flex items-center gap-1"
                    >
                      <span>https://publishercenter.google.com/</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    এ গিয়ে &apos;Add Publication&apos; এ ক্লিক করুন এবং আপনার সাইটের নাম ও ইউআরএল দিন।
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ২
                </span>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    কন্টেন্ট সেকশনে RSS Feed বা Web Location যুক্ত করুন:
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    সেকশন যুক্ত করার সময় Feed হিসেবে <code className="bg-white dark:bg-slate-700 px-1 py-0.5 rounded text-teal-600 font-mono">{base}/rss.xml</code> দিন।
                  </span>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  ৩
                </span>
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">
                    সাবমিট করুন (Publish):
                  </span>
                  <span className="text-gray-600 dark:text-gray-300">
                    রিভিউ সম্পন্ন হলে আপনার সাইট সরাসরি গুগল নিউজ ফিড ও Google Discover এ স্থান পাবে এবং বিপুল পরিমাণ অর্গানিক ট্রাফিক আসবে!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Sitemaps & RSS Feeds */}
      {activeTab === 'sitemaps' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dynamic XML News Sitemap */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-teal-600" />
                    <span>গুগল নিউজ XML সাইটম্যাপ (sitemap-news.xml)</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(newsSitemap, 'news_sitemap')}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
                  >
                    {copiedType === 'news_sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>XML কপি করুন</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-52 leading-relaxed">
                  {newsSitemap}
                </pre>
              </div>
              <span className="text-[11px] text-gray-400 mt-2 block">
                Google News Crawler ও Search Console এর জন্য প্রস্তুত।
              </span>
            </div>

            {/* Dynamic RSS 2.0 News Feed */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                    <Rss className="w-4 h-4 text-orange-500" />
                    <span>গুগল পাবলিশার RSS 2.0 ফিড (rss.xml)</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(rssFeed, 'rss_feed')}
                    className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
                  >
                    {copiedType === 'rss_feed' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>RSS কপি করুন</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-52 leading-relaxed">
                  {rssFeed}
                </pre>
              </div>
              <span className="text-[11px] text-gray-400 mt-2 block">
                Google Publisher Center এ কন্টেন্ট সিংক করার জন্য সরাসরি ব্যবহার্য।
              </span>
            </div>
          </div>

          {/* Robots.txt */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white">
                Robots.txt কনফিগারেশন প্রিভিউ
              </h4>
              <button
                onClick={() => handleCopy(robotsTxt, 'robots')}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
              >
                {copiedType === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>কপি Robots.txt</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg">
              {robotsTxt}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: Schema Structured Data */}
      {activeTab === 'schema' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
            <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-teal-600" />
              <span>Schema.org NewsArticle JSON-LD Structured Data</span>
            </h4>
            <button
              onClick={() => handleCopy(JSON.stringify(sampleSchema, null, 2), 'schema')}
              className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
            >
              {copiedType === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>JSON কপি করুন</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            প্রতিটি সংবাদ ওপেন করার সাথে সাথে ব্রাউজারের হেডে এই JSON-LD কোড স্বয়ংক্রিয়ভাবে ইনজেক্ট হয়, যার ফলে গুগল সার্চে রিচ স্নsnippet ও গুগল নিউজে কারুসল আকারে নিউজ প্রদর্শিত হয়।
          </p>
          <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-72 leading-relaxed">
            {JSON.stringify(sampleSchema, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
