import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
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
  AlertCircle
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

  // Safe fallback for automation settings to guarantee zero undefined crashes
  const safeSettings = automationSettings || {
    similarityThreshold: 75,
    checkSourceUrl: true,
    actionOnDuplicate: 'skip' as const,
    scheduleIntervalMinutes: 30,
    autoExtractImage: true,
    autoAssignCategory: true
  };

  const [activeTab, setActiveTab] = useState<'sources' | 'duplicate' | 'publish'>(
    adminSubSection === 'duplicate'
      ? 'duplicate'
      : adminSubSection === 'publish'
      ? 'publish'
      : 'sources'
  );

  // New source form state
  const [showAddSource, setShowAddSource] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [targetCategory, setTargetCategory] = useState(categories[0]?.id || 'national');
  const [autoPublish, setAutoPublish] = useState(false);

  // Ingestion status state
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<{
    fetchedCount: number;
    duplicatesDetected: number;
    insertedCount: number;
  } | null>(null);

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceName.trim() || !sourceUrl.trim()) return;

    addAutomationSource({
      name: sourceName.trim(),
      type: 'rss',
      url: sourceUrl.trim(),
      categoryId: targetCategory,
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
    setTestResult(null);

    const target = sourceId || automationSources[0]?.id;
    if (target) {
      try {
        const res = await runAutomationFeed(target);
        setTestResult({
          fetchedCount: (res.imported || 0) + (res.duplicates || 0),
          duplicatesDetected: res.duplicates || 0,
          insertedCount: res.imported || 0
        });
      } catch (err) {
        console.error('Automation feed execution error:', err);
      }
    }
    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-600" />
            <span>Content Ingestion & RSS Automation</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Automated news scraping, Levenshtein duplicate prevention, and background cron scheduler
          </p>
        </div>

        <button
          onClick={() => handleRunFeed()}
          disabled={isRunning || automationSources.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Analyzing & Ingesting...' : 'Run Feed Ingestion Now'}</span>
        </button>
      </div>

      {/* Test Execution Result Banner */}
      {testResult && (
        <div className="p-4 bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-300 dark:border-cyan-800 rounded-xl shadow-xs animate-fade-in flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
          <div className="text-xs text-cyan-950 dark:text-cyan-200 flex-1">
            <p className="font-bold text-sm">
              Automated Feed Ingestion Completed Successfully!
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-4 text-xs">
              <span>Total Items Scanned: <strong className="font-mono">{testResult.fetchedCount}</strong></span>
              <span>•</span>
              <span className="text-amber-700 dark:text-amber-300">
                Duplicates Blocked: <strong className="font-mono">{testResult.duplicatesDetected}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-700 dark:text-emerald-300">
                New Articles Ingested: <strong className="font-mono">{testResult.insertedCount}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('sources')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'sources'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          RSS & API Feeds ({automationSources.length})
        </button>
        <button
          onClick={() => setActiveTab('duplicate')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'duplicate'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Duplicate Detection Engine
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'publish'
              ? 'border-cyan-600 text-cyan-600'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Scheduler & Publishing Rules
        </button>
      </div>

      {/* Tab 1: Sources */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Connected Feed Sources
            </h3>
            <button
              onClick={() => setShowAddSource(!showAddSource)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddSource ? 'Cancel' : 'Add New Feed'}</span>
            </button>
          </div>

          {showAddSource && (
            <form
              onSubmit={handleAddSource}
              className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3"
            >
              <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">
                New RSS / Wire API Feed Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Feed / Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={sourceName}
                    onChange={e => setSourceName(e.target.value)}
                    placeholder="e.g., BSS National News Feed"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Feed Endpoint URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={sourceUrl}
                    onChange={e => setSourceUrl(e.target.value)}
                    placeholder="https://example.com/rss/national.xml"
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Target News Category
                  </label>
                  <select
                    value={targetCategory}
                    onChange={e => setTargetCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameEn || cat.nameBn} ({cat.nameBn})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoPublish}
                      onChange={e => setAutoPublish(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      Publish directly (Live without Draft)
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Feed Source
                </button>
              </div>
            </form>
          )}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
                  <tr>
                    <th className="py-3 px-4">Source Name</th>
                    <th className="py-3 px-3">Feed URL</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status / Mode</th>
                    <th className="py-3 px-3">Last Synced</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {automationSources.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        No automation feeds connected yet. Click "Add New Feed" to connect an RSS source.
                      </td>
                    </tr>
                  ) : (
                    automationSources.map(s => {
                      const cat = categories.find(c => c.id === s.categoryId);
                      return (
                        <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Rss className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span>{s.name}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[11px] text-gray-500 max-w-xs truncate">
                            {s.url}
                          </td>
                          <td className="py-3 px-3 font-medium text-gray-700 dark:text-gray-300">
                            {cat ? (cat.nameEn || cat.nameBn) : 'General'}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.autoPublish
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {s.autoPublish ? 'Auto Published' : 'Draft for Review'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                            {s.lastFetchedAt || 'Never'}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleRunFeed(s.id)}
                              disabled={isRunning}
                              className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 rounded hover:bg-cyan-100 text-[11px] font-semibold cursor-pointer"
                            >
                              Sync Now
                            </button>
                            <button
                              onClick={() => deleteAutomationSource(s.id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                              title="Delete source"
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

      {/* Tab 2: Duplicate Detection */}
      {activeTab === 'duplicate' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-600" />
              <span>Levenshtein Duplicate Detection Algorithm</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Prevent duplicate news publications by comparing incoming headlines against existing stories and checking canonical source URLs.
            </p>
          </div>

          <div className="space-y-5 max-w-xl text-xs">
            {/* Threshold Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Headline Similarity Threshold:
                </span>
                <span className="font-mono font-bold text-cyan-600 text-sm">
                  {safeSettings.similarityThreshold}% match
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={95}
                step={5}
                value={safeSettings.similarityThreshold}
                onChange={e =>
                  updateAutomationSettings({ similarityThreshold: Number(e.target.value) })
                }
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Articles with headline word and character similarity above {safeSettings.similarityThreshold}% will be flagged as duplicates.
              </p>
            </div>

            {/* Check Source URL */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={safeSettings.checkSourceUrl}
                  onChange={e =>
                    updateAutomationSettings({ checkSourceUrl: e.target.checked })
                  }
                  className="rounded text-cyan-600 focus:ring-cyan-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Block articles with identical Source Canonical URLs
                </span>
              </label>
            </div>

            {/* Action on Duplicate */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Action When Duplicate is Detected:
              </label>
              <div className="space-y-2">
                {[
                  { id: 'skip', label: 'Skip & Ignore (Recommended - Do not save duplicate)' },
                  { id: 'flag', label: 'Flag for Review (Save into Drafts marked with Duplicate tag)' },
                  { id: 'overwrite', label: 'Update existing report if source content changed' }
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

      {/* Tab 3: Publishing & Schedule */}
      {activeTab === 'publish' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-600" />
              <span>Background Cron Scheduler & Enrichment</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Configure background fetch frequency and AI content extraction settings.
            </p>
          </div>

          <div className="space-y-4 max-w-md text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Feed Ingestion Frequency (Cron Interval)
              </label>
              <select
                value={safeSettings.scheduleIntervalMinutes}
                onChange={e =>
                  updateAutomationSettings({ scheduleIntervalMinutes: Number(e.target.value) })
                }
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2.5"
              >
                <option value={15}>Every 15 minutes (Fastest breaking updates)</option>
                <option value={30}>Every 30 minutes (Standard newsroom balance)</option>
                <option value={60}>Every 1 hour (Periodic syndication)</option>
                <option value={120}>Every 2 hours (Light server load)</option>
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
                  Automatically extract featured hero image from RSS feed media tags
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
                  Auto-categorize articles based on keyword pattern matching
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
