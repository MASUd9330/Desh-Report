import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
  Globe,
  Shield,
  Server,
  Cloud
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetToDefaultData, exportDataAsJson, importDataFromJson } = useNews();

  const [siteName, setSiteName] = useState(siteSettings.siteName);
  const [tagline, setTagline] = useState(siteSettings.tagline);
  const [description, setDescription] = useState(siteSettings.description);
  const [contactEmail, setContactEmail] = useState(siteSettings.contactEmail);
  const [contactPhone, setContactPhone] = useState(siteSettings.contactPhone);
  const [contactAddress, setContactAddress] = useState(siteSettings.contactAddress);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(siteSettings.googleAnalyticsId);
  const [googleSearchConsoleCode, setGoogleSearchConsoleCode] = useState(siteSettings.googleSearchConsoleCode);

  const [saved, setSaved] = useState(false);

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
      googleSearchConsoleCode
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
          alert('ডেটা ব্যাকআপ সফলভাবে ইমপোর্ট ও রিস্টোর করা হয়েছে!');
          window.location.reload();
        } else {
          alert('ভুল ফাইল ফরমেট। অনুগ্রহ করে সঠিক JSON ব্যাকআপ ফাইল নির্বাচন করুন।');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <span>সাইট কনফিগারেশন ও ব্যাকআপ (System Settings)</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          পোর্টালের সাধারণ তথ্য, গুগল ইন্টিগ্রেশন, ডাটাবেজ ব্যাকআপ ও নেটলিফাই ডেপ্লয়মেন্ট
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>সাইট কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Site Identity */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            পোর্টাল পরিচিতি ও ব্র্যান্ডিং
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                সাইটের নাম (Site Name)
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ট্যাগলাইন (Tagline)
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
              সাইট মেটা ডেসক্রিপশন (Meta Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                যোগাযোগের ইমেইল
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                যোগাযোগের ফোন
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                বার্তা কার্যালয়ের ঠিকানা
              </label>
              <input
                type="text"
                value={contactAddress}
                onChange={e => setContactAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Analytics & Search Console */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
            গুগল টুলস ইন্টিগ্রেশন (Google Services)
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
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono"
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
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>পরিবর্তন সংরক্ষণ করুন</span>
        </button>
      </form>

      {/* Data Backup & Portability */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
          ডাটাবেজ এক্সপোর্ট ও ব্যাকআপ (Database Portability)
        </h3>
        <p className="text-xs text-gray-500">
          আপনার সকল প্রকাশিত সংবাদ, সেটিংস ও মিডিয়া লাইব্রেরির সম্পূর্ণ ব্যাকআপ এক ক্লিকে ডাউনলোড বা রিস্টোর করুন।
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={exportDataAsJson}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>সম্পূর্ণ JSON ব্যাকআপ ডাউনলোড করুন</span>
          </button>

          <label className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (window.confirm('সকল টেস্ট ডেটা প্রাথমিক ডেমো অবস্থায় ফিরিয়ে আনতে চান?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ডেমো ডেটা রিসেট</span>
          </button>
        </div>
      </div>

      {/* Production Netlify Architecture Card */}
      <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Cloud className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">
            Netlify প্রোডাকশন ডেপ্লয়মেন্ট নির্দেশিকা (Production Ready)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          দেশরিপোর্ট প্রজেক্টটি আধুনিক Vite + React একক-পেজ অ্যাপ আর্কিটেকচারে অপটিমাইজ করা। নেটলিফাইতে ডেপ্লয় করতে:
        </p>
        <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300 space-y-1">
          <div># Build Command: npm run build</div>
          <div># Publish Directory: dist</div>
          <div># SPA Fallback Rule: public/_redirects created with /* /index.html 200</div>
        </div>
      </div>
    </div>
  );
};
