import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { trustedFeedPresets, TrustedFeedPreset } from '../../data/trustedFeeds';
import {
  Bot,
  Rss,
  Sliders,
  Clock,
  Plus,
  Trash2,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  Building2,
  ExternalLink,
  Layers,
  Search,
  Sparkles,
  Check,
  Copy
} from 'lucide-react';

export const AdminAutomation: React.FC = () => {
  const {
    adminSubSection,
    automationSources = [],
    automationSettings,
    updateAutomationSettings,
    addAutomationSource,
    deleteAutomationSource,
    runAutomationFeed,
    categories = []
  } = useNews();

  // Safe fallback for automation settings
  const safeSettings = automationSettings || {
    similarityThreshold: 75,
    checkSourceUrl: true,
    actionOnDuplicate: 'skip' as const,
    scheduleIntervalMinutes: 30,
    autoExtractImage: true,
    autoAssignCategory: true
  };

  const [activeTab, setActiveTab] = useState<'sources' | 'directory' | 'duplicate' | 'publish'>(
    adminSubSection === 'duplicate'
      ? 'duplicate'
      : adminSubSection === 'publish'
      ? 'publish'
      : 'sources'
  );

  // Region filter for connected sources
  const [sourcesRegionFilter, setSourcesRegionFilter] = useState<'all' | 'national' | 'international'>('all');

  // Directory state
  const [directoryRegionFilter, setDirectoryRegionFilter] = useState<'all' | 'national' | 'international'>('all');
  const [directorySearchQuery, setDirectorySearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // New custom source form state
  const [showAddSource, setShowAddSource] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [sourceRegion, setSourceRegion] = useState<'national' | 'international'>('national');
  const [targetCategory, setTargetCategory] = useState(categories[0]?.id || 'national');
  const [autoPublish, setAutoPublish] = useState(false);

  // Ingestion status state
  const [isRunning, setIsRunning] = useState(false);
  const [runningSourceId, setRunningSourceId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    sourceName?: string;
    fetchedCount: number;
    duplicatesDetected: number;
    insertedCount: number;
  } | null>(null);

  // Quick connect a preset
  const handleConnectPreset = (preset: TrustedFeedPreset) => {
    // Check if already added
    const isAlreadyConnected = automationSources.some(
      s => s.url.trim().toLowerCase() === preset.url.trim().toLowerCase()
    );

    if (isAlreadyConnected) return;

    addAutomationSource({
      name: preset.name,
      type: preset.type,
      url: preset.url,
      categoryId: preset.categoryId,
      region: preset.region,
      description: preset.description,
      status: 'active',
      autoPublish: false,
      fetchIntervalMinutes: preset.fetchIntervalMinutes,
      articlesImported: 0,
      keywordFilters: preset.tags
    });
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim() || !sourceUrl.trim()) return;

    addAutomationSource({
      name: sourceName.trim(),
      type: 'rss',
      url: sourceUrl.trim(),
      categoryId: targetCategory,
      region: sourceRegion,
      description: `কাস্টম ${sourceRegion === 'international' ? 'আন্তর্জাতিক' : 'জাতীয়'} আরএসএস ফিড`,
      status: 'active',
      autoPublish,
      fetchIntervalMinutes: safeSettings.scheduleIntervalMinutes || 30,
      articlesImported: 0
    });

    setSourceName('');
    setSourceUrl('');
    setShowAddSource(false);
  };

  const handleRunFeed = async (sourceId?: string) => {
    setIsRunning(true);
    setRunningSourceId(sourceId || null);
    setTestResult(null);

    const target = sourceId || automationSources[0]?.id;
    if (target) {
      try {
        const srcObj = automationSources.find(s => s.id === target);
        const res = await runAutomationFeed(target);
        setTestResult({
          sourceName: srcObj?.name || 'Feed',
          fetchedCount: (res.imported || 0) + (res.duplicates || 0),
          duplicatesDetected: res.duplicates || 0,
          insertedCount: res.imported || 0
        });
      } catch (err) {
        console.error('Automation feed execution error:', err);
      }
    }
    setIsRunning(false);
    setRunningSourceId(null);
  };

  // Sync all feeds sequentially
  const handleSyncAllFeeds = async () => {
    if (automationSources.length === 0) return;
    setIsRunning(true);
    setTestResult(null);

    let totalFetched = 0;
    let totalDuplicates = 0;
    let totalImported = 0;

    for (const src of automationSources) {
      try {
        const res = await runAutomationFeed(src.id);
        totalFetched += (res.imported || 0) + (res.duplicates || 0);
        totalDuplicates += res.duplicates || 0;
        totalImported += res.imported || 0;
      } catch (e) {
        console.error(`Error syncing ${src.name}:`, e);
      }
    }

    setTestResult({
      sourceName: `সকল সংযুক্ত ফিড (${automationSources.length}টি)`,
      fetchedCount: totalFetched,
      duplicatesDetected: totalDuplicates,
      insertedCount: totalImported
    });

    setIsRunning(false);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Filtered lists
  const filteredSources = automationSources.filter(s => {
    if (sourcesRegionFilter === 'national') return s.region !== 'international';
    if (sourcesRegionFilter === 'international') return s.region === 'international';
    return true;
  });

  const filteredPresets = trustedFeedPresets.filter(p => {
    const matchesRegion = directoryRegionFilter === 'all' || p.region === directoryRegionFilter;
    const matchesQuery =
      directorySearchQuery === '' ||
      p.name.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
      p.agencyNameBn.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(directorySearchQuery.toLowerCase()) ||
      p.categoryNameBn.toLowerCase().includes(directorySearchQuery.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  const nationalSourcesCount = automationSources.filter(s => s.region !== 'international').length;
  const internationalSourcesCount = automationSources.filter(s => s.region === 'international').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif-bn">
            <Bot className="w-6 h-6 text-cyan-600" />
            <span>কনটেন্ট ইনজেশন ও আরএসএস অটোমেশন</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            বিশ্বস্ত জাতীয় ও আন্তর্জাতিক সংবাদ সংস্থার আরএসএস ফিড সিঙ্ক ও স্বয়ংক্রিয় ডুপ্লিকেট ফিল্টারিং
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>বিশ্বস্ত ফিড ডিরেক্টরি</span>
          </button>

          <button
            onClick={handleSyncAllFeeds}
            disabled={isRunning || automationSources.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'ফিড সিঙ্ক হচ্ছে...' : 'সকল ফিড সিঙ্ক করুন'}</span>
          </button>
        </div>
      </div>

      {/* Execution Result Banner */}
      {testResult && (
        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-800 rounded-xl shadow-xs animate-fade-in flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-950 dark:text-cyan-200 flex-1">
            <p className="font-bold text-sm">
              {testResult.sourceName ? `[${testResult.sourceName}] ` : ''}ফিড ইনজেশন সফলভাবে সম্পন্ন হয়েছে!
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs">
              <span>মোট স্ক্যানকৃত রিপোর্ট: <strong className="font-mono">{testResult.fetchedCount}</strong>টি</span>
              <span>•</span>
              <span className="text-amber-700 dark:text-amber-300">
                ডুপ্লিকেট বাতিল: <strong className="font-mono">{testResult.duplicatesDetected}</strong>টি
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">
                নতুন নিবন্ধ যুক্ত: <strong className="font-mono">{testResult.insertedCount}</strong>টি
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'sources'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Rss className="w-3.5 h-3.5 text-orange-500" />
          <span>সংযুক্ত সক্রিয় ফিড ({automationSources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('directory')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'directory'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>বিশ্বস্ত আরএসএস ক্যাটালগ ({trustedFeedPresets.length})</span>
          <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
            Trusted
          </span>
        </button>

        <button
          onClick={() => setActiveTab('duplicate')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'duplicate'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>ডুপ্লিকেট প্রতিরোধ ইঞ্জিন</span>
        </button>

        <button
          onClick={() => setActiveTab('publish')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'publish'
              ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>শিডিউলার ও পাবলিশিং রুলস</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CONNECTED SOURCES */}
      {/* ========================================================================= */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* Action Row & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
            {/* Region Filter Chips */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-400 text-[11px] font-semibold">ফিল্টার:</span>
              <button
                onClick={() => setSourcesRegionFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  sourcesRegionFilter === 'all'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                সকল ফিড ({automationSources.length})
              </button>
              <button
                onClick={() => setSourcesRegionFilter('national')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  sourcesRegionFilter === 'national'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <span>🇧🇩 জাতীয়</span>
                <span className="text-[10px] opacity-80">({nationalSourcesCount})</span>
              </button>
              <button
                onClick={() => setSourcesRegionFilter('international')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  sourcesRegionFilter === 'international'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <span>🌍 আন্তর্জাতিক</span>
                <span className="text-[10px] opacity-80">({internationalSourcesCount})</span>
              </button>
            </div>

            {/* Quick Add Custom or Browse */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('directory')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ডিরেক্টরি থেকে যোগ করুন</span>
              </button>
              <button
                onClick={() => setShowAddSource(!showAddSource)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddSource ? 'বাতিল' : 'কাস্টম ফিড URL'}</span>
              </button>
            </div>
          </div>

          {/* Custom Add Form */}
          {showAddSource && (
            <form
              onSubmit={handleAddCustomSource}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-slate-800">
                <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <Rss className="w-4 h-4 text-orange-500" />
                  <span>নতুন কাস্টম আরএসএস ফিড কনফিগারেশন</span>
                </h4>
                <span className="text-[10px] text-gray-400">XML, RSS 2.0 অথবা Atom সাপোর্ট করে</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    সংবাদ সংস্থার নাম (Feed Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceName}
                    onChange={e => setSourceName(e.target.value)}
                    placeholder="উদাঃ BSS National News Feed"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    আরএসএস ফিড এন্ডপয়েন্ট (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/feed/rss"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    আঞ্চলিক পরিধি (Region)
                  </label>
                  <select
                    value={sourceRegion}
                    onChange={e => setSourceRegion(e.target.value as 'national' | 'international')}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="national">🇧🇩 জাতীয় সংবাদ (National)</option>
                    <option value="international">🌍 আন্তর্জাতিক সংবাদ (International)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    সংরক্ষণ ক্যাটাগরি (Target Category)
                  </label>
                  <select
                    value={targetCategory}
                    onChange={e => setTargetCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameBn} ({cat.nameEn || cat.nameBn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoPublish}
                      onChange={e => setAutoPublish(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium text-[11px]">
                      সরাসরি লাইভ প্রকাশ করুন (ড্রাফট ছাড়াই)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddSource(false)}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  ফিড সেভ করুন
                </button>
              </div>
            </form>
          )}

          {/* Sources Table */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">সংবাদ সংস্থা ও ফিড নাম</th>
                    <th className="py-3 px-3">ফিড এন্ডপয়েন্ট URL</th>
                    <th className="py-3 px-3">ক্যাটাগরি</th>
                    <th className="py-3 px-3">স্ট্যাটাস ও মোড</th>
                    <th className="py-3 px-3">সর্বশেষ সিঙ্ক</th>
                    <th className="py-3 px-3 text-center">ইনজেস্টেড</th>
                    <th className="py-3 px-4 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredSources.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-400">
                        <Rss className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p>কোনো আরএসএস ফিড পাওয়া যায়নি।</p>
                        <button
                          onClick={() => setActiveTab('directory')}
                          className="mt-3 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          বিশ্বস্ত ডিরেক্টরি থেকে ফিড যোগ করুন
                        </button>
                      </td>
                    </tr>
                  ) : (
                    filteredSources.map(s => {
                      const cat = categories.find(c => c.id === s.categoryId);
                      const isNational = s.region !== 'international';
                      const isCurrentlySyncing = isRunning && runningSourceId === s.id;

                      return (
                        <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                          {/* Name + Region badge */}
                          <td className="py-3 px-4">
                            <div className="flex items-start gap-2">
                              <span className="text-base shrink-0 mt-0.5" title={isNational ? 'জাতীয়' : 'আন্তর্জাতিক'}>
                                {isNational ? '🇧🇩' : '🌍'}
                              </span>
                              <div>
                                <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                  <span>{s.name}</span>
                                </div>
                                <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                  {isNational ? 'জাতীয় বার্তা/দৈনিক' : 'আন্তর্জাতিক সংস্থা'} • {s.fetchIntervalMinutes} মিনিট পর পর
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* URL */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1 max-w-xs">
                              <span className="font-mono text-[11px] text-gray-500 truncate" title={s.url}>
                                {s.url}
                              </span>
                              <button
                                onClick={() => handleCopyUrl(s.url)}
                                className="text-gray-400 hover:text-cyan-600 p-0.5"
                                title="URL কপি করুন"
                              >
                                {copiedUrl === s.url ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded font-semibold text-[11px]">
                              {cat ? cat.nameBn : 'সাধারণ'}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                s.autoPublish
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                            >
                              {s.autoPublish ? 'সরাসরি লাইভ' : 'ড্রাফট (পর্যালোচনা)'}
                            </span>
                          </td>

                          {/* Last Synced */}
                          <td className="py-3 px-3 text-gray-400 font-mono text-[11px] whitespace-nowrap">
                            {s.lastFetchedAt || 'এখনও হয়নি'}
                          </td>

                          {/* Ingested Articles */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-gray-700 dark:text-gray-300">
                            {s.articlesImported || 0}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              onClick={() => handleRunFeed(s.id)}
                              disabled={isRunning}
                              className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900 rounded text-[11px] font-semibold cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
                            >
                              <RefreshCw className={`w-3 h-3 ${isCurrentlySyncing ? 'animate-spin' : ''}`} />
                              <span>{isCurrentlySyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই সিঙ্ক'}</span>
                            </button>
                            <button
                              onClick={() => deleteAutomationSource(s.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                              title="ফিড মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TRUSTED RSS FEEDS DIRECTORY (PRESETS CATALOG) */}
      {/* ========================================================================= */}
      {activeTab === 'directory' && (
        <div className="space-y-5">
          {/* Directory Banner & Description */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 text-white p-6 rounded-2xl border border-slate-700 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded text-[10px] font-bold uppercase tracking-wider">
                    Verified Agencies
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Official Public RSS Endpoints</span>
                </div>
                <h3 className="text-lg font-bold font-serif-bn text-white">
                  বিশ্বস্ত জাতীয় ও আন্তর্জাতিক সংবাদ সংস্থার আরএসএস লাইব্রেরি
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  বাংলাদেশ ও আন্তর্জাতিক শীর্ষ গণমাধ্যমের সক্রিয় ফিড। যেকোনো বিশ্বস্ত সংবাদ সংস্থাকে ১-ক্লিকে আপনার পোর্টালে সংযুক্ত করে স্বয়ংক্রিয় নিউজ স্ক্র্যাপ ও আপডেট চালু করুন।
                </p>
              </div>

              {/* Counts */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
                  <div className="text-base font-bold font-mono text-emerald-400">
                    {trustedFeedPresets.filter(p => p.region === 'national').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">জাতীয় ফিড</div>
                </div>
                <div className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-center">
                  <div className="text-base font-bold font-mono text-cyan-400">
                    {trustedFeedPresets.filter(p => p.region === 'international').length}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">আন্তর্জাতিক ফিড</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Region Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-200 dark:border-slate-800">
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={directorySearchQuery}
                onChange={e => setDirectorySearchQuery(e.target.value)}
                placeholder="সংস্থার নাম, দেশ বা বিষয় দিয়ে খুঁজুন..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg placeholder-gray-400 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            {/* Region Filter Buttons */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setDirectoryRegionFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  directoryRegionFilter === 'all'
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                সবগুলো ({trustedFeedPresets.length})
              </button>
              <button
                onClick={() => setDirectoryRegionFilter('national')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  directoryRegionFilter === 'national'
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <span>🇧🇩 জাতীয় বিশ্বস্ত ফিড</span>
              </button>
              <button
                onClick={() => setDirectoryRegionFilter('international')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                  directoryRegionFilter === 'international'
                    ? 'bg-slate-900 dark:bg-cyan-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                <span>🌍 আন্তর্জাতিক শীর্ষ ফিড</span>
              </button>
            </div>
          </div>

          {/* Directory Preset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPresets.map(preset => {
              const isAlreadyConnected = automationSources.some(
                s => s.url.trim().toLowerCase() === preset.url.trim().toLowerCase()
              );
              const connectedSource = automationSources.find(
                s => s.url.trim().toLowerCase() === preset.url.trim().toLowerCase()
              );

              return (
                <div
                  key={preset.id}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Flag, Name, Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl shrink-0">{preset.flag}</span>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white font-serif-bn leading-snug">
                            {preset.agencyNameBn}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-mono block">
                            {preset.name}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          preset.region === 'national'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                        }`}
                      >
                        {preset.countryBadge}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 my-2.5 leading-relaxed">
                      {preset.description}
                    </p>

                    {/* Meta info tags */}
                    <div className="flex flex-wrap items-center gap-1.5 my-2">
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded text-[10px] font-semibold">
                        📁 {preset.categoryNameBn}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded text-[10px] font-mono">
                        ⏱ {preset.fetchIntervalMinutes} মিনিট
                      </span>
                      {preset.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] text-gray-400">
                          #{t}
                        </span>
                      ))}
                    </div>

                    {/* RSS Endpoint box */}
                    <div className="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-200 dark:border-slate-800 my-2 flex items-center justify-between gap-1">
                      <span className="text-[11px] font-mono text-gray-500 truncate" title={preset.url}>
                        {preset.url}
                      </span>
                      <button
                        onClick={() => handleCopyUrl(preset.url)}
                        className="text-gray-400 hover:text-cyan-600 p-1 shrink-0"
                        title="URL কপি করুন"
                      >
                        {copiedUrl === preset.url ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-2">
                    {isAlreadyConnected ? (
                      <>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>সক্রিয় প্যানেলে যুক্ত</span>
                        </div>
                        <button
                          onClick={() => connectedSource && handleRunFeed(connectedSource.id)}
                          disabled={isRunning}
                          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>সিঙ্ক করুন</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-gray-400">পাবলিক আরএসএস ফিড</span>
                        <button
                          onClick={() => handleConnectPreset(preset)}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-black dark:bg-cyan-600 dark:hover:bg-cyan-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>ফিড যুক্ত করুন</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DUPLICATE DETECTION ENGINE */}
      {/* ========================================================================= */}
      {activeTab === 'duplicate' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif-bn">
              <Sliders className="w-5 h-5 text-cyan-600" />
              <span>লেভেনশটাইন (Levenshtein) ডুপ্লিকেট শনাক্তকরণ অ্যালগরিদম</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              একই খবর বারবার প্রকাশ হওয়া রোধ করতে আগত সংবাদের শিরোনাম ও মূল সোর্স লিংক যাচাই করা হয়।
            </p>
          </div>

          <div className="space-y-5 max-w-xl text-xs">
            {/* Threshold Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  শিরোনাম মিলের সূচক (Headline Similarity Threshold):
                </span>
                <span className="font-mono font-bold text-cyan-600 text-sm">
                  {safeSettings.similarityThreshold}% match
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={safeSettings.similarityThreshold}
                onChange={e =>
                  updateAutomationSettings({ similarityThreshold: Number(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>৫০% (অধিক কঠোর ফিল্টার)</span>
                <span>৭৫% (প্রস্তাবিত স্ট্যান্ডার্ড)</span>
                <span>৯৫% (কেবল হুবহু মিল)</span>
              </div>
            </div>

            {/* Check URL Toggle */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={safeSettings.checkSourceUrl}
                  onChange={e =>
                    updateAutomationSettings({ checkSourceUrl: e.target.checked })
                  }
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <div>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                    সোর্স লিঙ্ক (Canonical Source URL) যাচাই করুন
                  </span>
                  <span className="text-gray-400 text-[11px] block mt-0.5">
                    একই সোর্স ইউআরএলের কোনো নিউজ ইতোমধ্যে পোর্টালে থাকলে তা স্বয়ংক্রিয়ভাবে বাতিল করা হবে।
                  </span>
                </div>
              </label>
            </div>

            {/* Action on Duplicate */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                ডুপ্লিকেট শনাক্ত হলে গৃহীত ব্যবস্থা (Action):
              </label>
              <div className="space-y-2">
                {[
                  { id: 'skip', label: 'সরাসরি বাদ দিন (প্রস্তাবিত - কোনো ডুপ্লিকেট সেভ হবে না)' },
                  { id: 'flag', label: 'পর্যালোচনার জন্য ড্রাফটে রাখুন (Duplicate ফ্ল্যাগসহ)' },
                  { id: 'overwrite', label: 'বিদ্যমান সংবাদটি আপডেট করুন' }
                ].map(opt => (
                  <label key={opt.id} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="dupAction"
                      checked={safeSettings.actionOnDuplicate === opt.id}
                      onChange={() =>
                        updateAutomationSettings({
                          actionOnDuplicate: opt.id as 'skip' | 'flag' | 'overwrite'
                        })
                      }
                      className="text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: PUBLISHING & SCHEDULE */}
      {/* ========================================================================= */}
      {activeTab === 'publish' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 font-serif-bn">
              <Clock className="w-5 h-5 text-cyan-600" />
              <span>ব্যাকগ্রাউন্ড শিডিউলার ও কনটেন্ট সমৃদ্ধকরণ</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              স্বয়ংক্রিয় ফিড ফেচ করার সময়সূচি ও কৃত্রিম বুদ্ধিমত্তা চালিত মেটাডেটা প্রসেসিং।
            </p>
          </div>

          <div className="space-y-4 max-w-md text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                ফিড ইনজেশন ফ্রিকোয়েন্সি (Cron Schedule)
              </label>
              <select
                value={safeSettings.scheduleIntervalMinutes}
                onChange={e =>
                  updateAutomationSettings({ scheduleIntervalMinutes: Number(e.target.value) })
                }
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5"
              >
                <option value={15}>প্রতি ১৫ মিনিট পর পর (তাত্ক্ষণিক ব্রেকিং আপডেট)</option>
                <option value={30}>প্রতি ৩০ মিনিট পর পর (স্ট্যান্ডার্ড নিউজরুম ব্যালেন্স)</option>
                <option value={60}>প্রতি ১ ঘণ্টা পর পর (পরিমিত ফেচিং)</option>
                <option value={120}>প্রতি ২ ঘণ্টা পর পর (হালকা সার্ভার লোড)</option>
              </select>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={safeSettings.autoExtractImage}
                  onChange={e =>
                    updateAutomationSettings({ autoExtractImage: e.target.checked })
                  }
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  আরএসএস ফিডের মিডিয়া ট্যাগ থেকে স্বয়ংক্রিয়ভাবে ফিচার্ড ছবি সংগ্রহ করুন
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={safeSettings.autoAssignCategory}
                  onChange={e =>
                    updateAutomationSettings({ autoAssignCategory: e.target.checked })
                  }
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  শিরোনামের কি-ওয়ার্ড বিশ্লেষণ করে স্বয়ংক্রিয়ভাবে ক্যাটাগরি নির্ধারণ করুন
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
