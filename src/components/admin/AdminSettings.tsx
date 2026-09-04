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
  X
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetToDefaultData, exportDataAsJson, importDataFromJson } = useNews();

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

  const [saved, setSaved] = useState(false);
  const [importNotice, setImportNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

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
      googleSearchConsoleMeta: googleSearchConsoleCode
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

        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save System Settings</span>
        </button>
      </form>

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

      {/* Production Netlify Architecture Card */}
      <div className="bg-slate-900 text-slate-200 border border-slate-800 rounded-xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Cloud className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">
            Netlify Production Deployment Guide
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          The DeshReport platform is optimized as a modern Vite + React single-page application.
        </p>
        <div className="p-3 bg-slate-950 rounded-lg font-mono text-[11px] text-cyan-300 space-y-1">
          <div># Build Command: npm run build</div>
          <div># Publish Directory: dist</div>
          <div># SPA Fallback: public/_redirects configured with /* /index.html 200</div>
        </div>
      </div>
    </div>
  );
};
