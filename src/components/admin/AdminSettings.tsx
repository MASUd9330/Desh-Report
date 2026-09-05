import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
  Cloud,
  X,
  ExternalLink,
  Copy,
  FileCode,
  Globe,
  Heart,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Sparkles
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetToDefaultData, exportDataAsJson, importDataFromJson, articles, categories } = useNews();

  const [siteName, setSiteName] = useState(siteSettings?.siteName || 'DeshReport');
  const [tagline, setTagline] = useState(siteSettings?.tagline || 'Leading Digital News Portal');
  const [description, setDescription] = useState(siteSettings?.description || '');
  const [contactEmail, setContactEmail] = useState(siteSettings?.contactEmail || 'contact@deshreport.com');
  const [contactPhone, setContactPhone] = useState(siteSettings?.contactPhone || '+880 1712-345678');
  const [contactAddress, setContactAddress] = useState(siteSettings?.contactAddress || 'Karwan Bazar, Dhaka-1215, Bangladesh');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(siteSettings?.googleAnalyticsId || '');
  const [googleSearchConsoleCode, setGoogleSearchConsoleCode] = useState(
    siteSettings?.googleSearchConsoleMeta || siteSettings?.googleSearchConsoleCode || ''
  );

  // Google Reader Revenue Manager State
  const [readerRevenueManagerEnabled, setReaderRevenueManagerEnabled] = useState(
    siteSettings?.readerRevenueManagerEnabled !== undefined ? siteSettings.readerRevenueManagerEnabled : true
  );
  const [readerRevenuePublicationId, setReaderRevenuePublicationId] = useState(
    siteSettings?.readerRevenuePublicationId || ''
  );
  const [readerRevenuePromptType, setReaderRevenuePromptType] = useState<'contributions' | 'subscriptions' | 'newsletter'>(
    siteSettings?.readerRevenuePromptType || 'contributions'
  );
  const [readerRevenueCustomSnippet, setReaderRevenueCustomSnippet] = useState(
    siteSettings?.readerRevenueCustomSnippet || ''
  );

  const [saved, setSaved] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const generateAndDownloadLiveSitemap = () => {
    const baseUrl = 'https://deshreport.vercel.app';
    const today = new Date().toISOString().split('T')[0];

    const categoryEntries = categories.map(cat => `  <url>
    <loc>${baseUrl}/category/${cat.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n');

    const publishedArticles = articles.filter(a => a.status === 'published');
    const articleEntries = publishedArticles.map(art => `  <url>
    <loc>${baseUrl}/article/${art.slug || art.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>`).join('\n');

    const institutionalPages = [
      'about.html',
      'editorial-policy.html',
      'corrections-policy.html',
      'privacy-policy.html',
      'terms-of-use.html',
      'contact.html',
      'sitemap.html'
    ].map(page => `  <url>
    <loc>${baseUrl}/${page}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>`).join('\n');

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Categories -->
${categoryEntries}

  <!-- Articles (${publishedArticles.length} published) -->
${articleEntries}

  <!-- Static Policy Pages -->
${institutionalPages}
</urlset>`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      siteName,
      tagline,
      description,
      contactEmail,
      contactPhone,
      contactAddress,
      googleAnalyticsId,
      googleSearchConsoleCode,
      googleSearchConsoleMeta: googleSearchConsoleCode,
      readerRevenueManagerEnabled,
      readerRevenuePublicationId,
      readerRevenuePromptType,
      readerRevenueCustomSnippet
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataFromJson(content);
        if (success) {
          setImportNotice({ type: 'success', message: 'Data backup successfully imported and restored! Reloading...' });
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setImportNotice({ type: 'error', message: 'Invalid file format. Please choose a valid DeshReport JSON backup file.' });
          setTimeout(() => setImportNotice(null), 4000);
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <span>System Settings & Data Backup</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Portal metadata, Google tracking, database backup/restore, and deployment guide
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Site settings successfully updated!</span>
        </div>
      )}

      {importNotice && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            importNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-red-50 text-red-800 dark:bg-red-950/60 dark:text-red-300'
          }`}
        >
          <span>{importNotice.message}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Identity */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            Portal Identity & Branding
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Portal Name (Site Title) *
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Tagline *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Site Meta Description (SEO)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Newsroom Office Address
              </label>
              <input
                type="text"
                value={contactAddress}
                onChange={e => setContactAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Search Console */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            Google Tracking & Console Integration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={e => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                value={googleSearchConsoleCode}
                onChange={e => setGoogleSearchConsoleCode(e.target.value)}
                placeholder="google-site-verification=..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Google Reader Revenue Manager (Google Publisher Center) Monetization Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 dark:border-emerald-500/30 rounded-xl p-6 shadow-sm space-y-5 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                    Google Reader Revenue Manager (গুগল রিডার রেভিনিউ ম্যানেজার)
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>গুগল কর্তৃক অনুমোদিত (Approved)</span>
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">desh-report.vercel.app</span> ডোমেইনের জন্য গুগল পাবলিশার সেন্টার থেকে অফিশিয়ালি অনুমোদিত
                </p>
              </div>
            </div>

            <a
              href="https://publishercenter.google.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Publisher Center খুলুন</span>
            </a>
          </div>

          {/* Toggle Enablement */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs">
            <div>
              <span className="font-bold text-gray-900 dark:text-white block">
                Reader Revenue Manager ফিচার সক্রিয় রাখুন
              </span>
              <span className="text-[11px] text-gray-600 dark:text-gray-400">
                পাঠকদের থেকে অনুদান (Contributions), সদস্যপদ (Subscriptions) ও নিউজলেটার সাইন-আপ প্রম্পট চালু রাখুন।
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readerRevenueManagerEnabled}
                onChange={e => setReaderRevenueManagerEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Prompt Type */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                প্রধান মনিটাইজেশন মডেল (Primary Prompt Type)
              </label>
              <select
                value={readerRevenuePromptType}
                onChange={e => setReaderRevenuePromptType(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-hidden"
              >
                <option value="contributions">Contributions (অনুদানের প্রম্পট - সবচেয়ে জনপ্রিয়)</option>
                <option value="subscriptions">Subscriptions (মাসিক/বার্ষিক পেইড সাবস্ক্রিপশন)</option>
                <option value="newsletter">Newsletter (গুগল ১-ক্লিক নিউজলেটার সাইন-আপ)</option>
              </select>
              <p className="text-[11px] text-gray-500 mt-1">
                অনুদানের মাধ্যমে পাঠকরা কোনো বাধা ছাড়াই সব খবর পড়তে পারেন এবং স্বেচ্ছায় আর্থিক সহায়তা প্রদান করতে পারেন।
              </p>
            </div>

            {/* Publication ID */}
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Publication ID / Product ID (গুগল পাবলিকেশন আইডি)
              </label>
              <input
                type="text"
                value={readerRevenuePublicationId}
                onChange={e => setReaderRevenuePublicationId(e.target.value)}
                placeholder="যেমন: CAow... অথবা পাবলিকেশন আইডি"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono text-xs focus:outline-hidden focus:border-emerald-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Google Publisher Center-এর Reader Revenue Manager মেনুতে এই আইডি পাওয়া যায়।
              </p>
            </div>
          </div>

          {/* Full Custom Snippet / Code block */}
          <div className="text-xs">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Google Publisher Center কোড স্নিপেট (Code Snippet - ঐচ্ছিক)
            </label>
            <textarea
              rows={3}
              value={readerRevenueCustomSnippet}
              onChange={e => setReaderRevenueCustomSnippet(e.target.value)}
              placeholder="গুগল পাবলিশার সেন্টার থেকে প্রাপ্ত সম্পূর্ণ <script>...</script> কোডটি এখানে পেস্ট করতে পারেন (যদি আলাদা আইডি না দিয়ে সম্পূর্ণ স্ক্রিপ্ট কপি করেন)"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono text-xs focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Next Steps Guide */}
          <div className="p-4 bg-gray-50 dark:bg-slate-800/60 rounded-xl border border-gray-200 dark:border-slate-700/70 text-xs space-y-2">
            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>অনুমোদন পাওয়ার পর আপনার পরবর্তী করণীয় ধাপসমূহ (Next Action Steps):</span>
            </div>
            <ol className="list-decimal pl-4 space-y-1.5 text-gray-600 dark:text-gray-300 text-[11px] leading-relaxed">
              <li>
                <strong>Google Publisher Center</strong> (<a href="https://publishercenter.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 font-bold underline">publishercenter.google.com</a>)-এ যান এবং <strong>Desh Report</strong> নির্বাচন করুন।
              </li>
              <li>
                বাম পাশের মেনু থেকে <strong>Reader Revenue Manager</strong>-এ ক্লিক করুন।
              </li>
              <li>
                <strong>Pricing & Contributions:</strong> পাঠকদের জন্য সহায়তার পরিমাণ নির্ধারণ করুন (যেমন: ৳৫০, ৳১০০, ৳৫০০ ইত্যাদি)।
              </li>
              <li>
                <strong>Payment Profile / Payouts:</strong> আপনার গুগল পেমেন্ট প্রোফাইল ও ব্যাংক অ্যাকাউন্ট যুক্ত করুন, যাতে আয়ের টাকা সরাসরি আপনার একাউন্টে জমা হয়।
              </li>
              <li>
                <strong>Snippet / Publication ID:</strong> পাবলিশার সেন্টার থেকে দেওয়া আইডি বা কোডটি কপি করে উপরের বক্সে বসিয়ে <strong>"Save System Settings"</strong> বাটনে ক্লিক করুন।
              </li>
            </ol>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>

      {/* XML & HTML Sitemap Management Card */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Sitemap & Search Engine Indexing (সাইটম্যাপ ব্যবস্থাপনা)
              </h3>
              <p className="text-[11px] text-gray-500">
                Google Search Console, Google News এবং বিং-এ স্বয়ংক্রিয় দ্রুত ইনডেক্সিংয়ের জন্য প্রস্তুত সাইটম্যাপ
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={generateAndDownloadLiveSitemap}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            title="বর্তমান সকল আর্টিকেলের ভিত্তিতে নতুন sitemap.xml ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Live sitemap.xml</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Item 1: Standard XML Sitemap */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-500" />
                <span>XML Sitemap</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold">
                Active
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              সকল ক্যাটাগরি, খবর ও প্রাতিষ্ঠানিক পেজের প্রধান XML সূচিপত্র।
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open /sitemap.xml</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy('https://deshreport.vercel.app/sitemap.xml', 'xml')}
                className="px-2.5 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-[11px] text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Copy Full URL"
              >
                {copiedItem === 'xml' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Item 2: Google News Sitemap */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-rose-500" />
                <span>Google News XML</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold">
                Google News
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              Google News crawler-এর জন্য নির্দিষ্ট news schema সংবলিত সাইটম্যাপ।
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href="/sitemap-news.xml"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open /sitemap-news.xml</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy('https://deshreport.vercel.app/sitemap-news.xml', 'news-xml')}
                className="px-2.5 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-[11px] text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Copy Full URL"
              >
                {copiedItem === 'news-xml' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Item 3: HTML User Sitemap */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>HTML Sitemap</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold">
                User Web Page
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              ভিজিটর ও পাঠকদের জন্য সম্পূর্ণ সাইটের আধুনিক সুবিন্যস্ত ওয়েব নেভিগেশন পেজ।
            </p>
            <div className="pt-2 flex items-center gap-2">
              <a
                href="/sitemap.html"
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded text-[11px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open /sitemap.html</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopy('https://deshreport.vercel.app/sitemap.html', 'html')}
                className="px-2.5 py-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 rounded text-[11px] text-gray-700 dark:text-gray-200 cursor-pointer"
                title="Copy Full URL"
              >
                {copiedItem === 'html' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Console Submission Guide */}
        <div className="p-3.5 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2">
          <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <span>গুগল সার্চ কনসোলে সাইটম্যাপ জমা দেওয়ার নিয়ম (Google Search Console Submission):</span>
          </div>
          <ol className="list-decimal pl-4 space-y-1 text-amber-900/90 dark:text-amber-300/90 text-[11px] leading-relaxed">
            <li>
              <strong>Google Search Console</strong>-এ লগইন করে আপনার সাইট প্রোপার্টি (<code>https://deshreport.vercel.app</code>) নির্বাচন করুন।
            </li>
            <li>
              বাম পাশের মেনু থেকে <strong>"Indexing" &gt; "Sitemaps"</strong> অপশনে যান।
            </li>
            <li>
              <strong>"Add a new sitemap"</strong> বক্সে প্রথমে <code className="font-bold bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">sitemap.xml</code> লিখে <strong>Submit</strong> বাটনে ক্লিক করুন।
            </li>
            <li>
              এরপর দ্বিতীয়বার বক্সে <code className="font-bold bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">sitemap-news.xml</code> লিখে <strong>Submit</strong> করুন।
            </li>
          </ol>
        </div>
      </div>

      {/* Data Backup & Portability */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
          Database Export, Backup & Portability
        </h3>
        <p className="text-xs text-gray-500">
          Download complete JSON snapshots of all news articles, categories, media assets, ads, and settings.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={exportDataAsJson}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON Backup</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Restore From Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          {confirmReset ? (
            <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 p-1.5 rounded-lg border border-red-200 dark:border-red-900">
              <span className="text-xs text-red-700 dark:text-red-300 font-semibold">Reset to default demo data?</span>
              <button
                onClick={() => {
                  resetToDefaultData();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="p-1 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Data</span>
            </button>
          )}
        </div>
      </div>

      {/* Production Deployment Architecture Card */}
      <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Cloud className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">
            Vercel Production Deployment Guide
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The DeshReport platform is optimized as a modern Vite + React single-page application and fully compatible with Vercel and Netlify.
        </p>
        <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-emerald-300 space-y-1">
          <div># Platform: Vercel (Recommended & 100% Free Unlimited)</div>
          <div># Build Command: npm run build</div>
          <div># Output Directory: dist</div>
          <div># Configuration: vercel.json & netlify.toml configured with full SPA Rewrites</div>
        </div>
      </div>
    </div>
  );
};
