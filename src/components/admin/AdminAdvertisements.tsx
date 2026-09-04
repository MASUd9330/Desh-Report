import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdPlacement, AdType } from '../../types';
import {
  Megaphone,
  Plus,
  Trash2,
  Check,
  X
} from 'lucide-react';

export const AdminAdvertisements: React.FC = () => {
  const {
    adminSubSection,
    advertisements = [],
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  } = useNews();

  const [activeTab, setActiveTab] = useState<'all' | 'adsterra' | 'banner' | 'social_bar' | 'popunder' | 'placements'>(
    (adminSubSection as any) || 'all'
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AdType>('banner');
  const [newPlacement, setNewPlacement] = useState<AdPlacement>('after_first_paragraph');
  const [newSize, setNewSize] = useState<'728x90' | '970x90' | '300x250' | '336x280' | '320x50' | '300x600'>('300x250');
  const [newProvider, setNewProvider] = useState<'Adsterra' | 'Google AdSense' | 'Direct Sponsor' | 'Custom Script'>('Adsterra');
  const [newCode, setNewCode] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTargetUrl, setNewTargetUrl] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Adsterra API & Script Global Settings
  const [adsterraPublisherId, setAdsterraPublisherId] = useState('ADS-9842104-BD');
  const [popunderFrequency, setPopunderFrequency] = useState('1');

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAdvertisement({
      name: newTitle.trim(),
      type: newType,
      provider: newProvider,
      placement: newPlacement,
      bannerSize: newSize,
      codeSnippet: newCode || '<!-- Ad script container -->',
      imageUrl: newImageUrl.trim(),
      targetUrl: newTargetUrl.trim(),
      status: 'active',
      device: 'all',
      priority: 1,
      impressions: 0,
      clicks: 0
    });

    setNewTitle('');
    setNewCode('');
    setNewImageUrl('');
    setNewTargetUrl('');
    setShowAddModal(false);
  };

  const filteredAds = advertisements.filter(ad => {
    if (activeTab === 'adsterra') return ad.provider === 'Adsterra';
    if (activeTab === 'banner') return ad.type === 'banner';
    if (activeTab === 'social_bar') return ad.type === 'social_bar';
    if (activeTab === 'popunder') return ad.type === 'popunder';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-pink-600" />
            <span>Ad Management & Network Placements</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure Adsterra, Google AdSense, banners, popunders, and direct sponsor placements
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Ad Unit</span>
        </button>
      </div>

      {/* Quick Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">Active Ad Slots</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">
            {advertisements.filter(a => a.status === 'active').length}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">Total Impressions</span>
          <span className="text-xl font-bold text-pink-600 font-mono">
            {advertisements.reduce((a, c) => a + (c.impressions || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">Recorded Clicks</span>
          <span className="text-xl font-bold text-emerald-600 font-mono">
            {advertisements.reduce((a, c) => a + (c.clicks || 0), 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">Primary Network</span>
          <span className="text-xl font-bold text-indigo-600 font-mono">
            Adsterra
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Ad Units' },
          { id: 'adsterra', label: 'Adsterra Network' },
          { id: 'banner', label: 'Banner Displays' },
          { id: 'social_bar', label: 'Social Bar' },
          { id: 'popunder', label: 'Popunder Unit' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium cursor-pointer ${
              activeTab === tab.id
                ? 'bg-pink-600 text-white font-bold'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add Ad Modal */}
      {showAddModal && (
        <form
          onSubmit={handleCreateAd}
          className="bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/40 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">New Advertisement Unit</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Ad Unit Name / Identifier *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Header Leaderboard 728x90"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Ad Network Provider
              </label>
              <select
                value={newProvider}
                onChange={e => setNewProvider(e.target.value as any)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2"
              >
                <option value="Adsterra">Adsterra Network</option>
                <option value="Google AdSense">Google AdSense</option>
                <option value="Direct Sponsor">Direct Sponsor / Banner</option>
                <option value="Custom Script">Custom JavaScript Code</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Ad Type
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as AdType)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2"
              >
                <option value="banner">Standard Banner</option>
                <option value="social_bar">Social Bar (Floating)</option>
                <option value="popunder">Popunder (Background)</option>
                <option value="native_banner">Native Article Banner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Placement Location
              </label>
              <select
                value={newPlacement}
                onChange={e => setNewPlacement(e.target.value as AdPlacement)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2"
              >
                <option value="after_first_paragraph">Inside Article (After 1st Paragraph)</option>
                <option value="middle_article">Inside Article (Middle of Article)</option>
                <option value="after_article">Inside Article (After Full Article)</option>
                <option value="sidebar">Sidebar (Right Column)</option>
                <option value="below_header">Below Main Header (Leaderboard)</option>
                <option value="below_breaking">Below Breaking News Ticker</option>
                <option value="homepage_hero">Homepage Hero Grid</option>
                <option value="category_page">Category Page Top</option>
                <option value="footer">Footer Banner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Dimension (Width x Height)
              </label>
              <select
                value={newSize}
                onChange={e => setNewSize(e.target.value as any)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 font-mono"
              >
                <option value="300x250">300x250 (Medium Rectangle - Best for Articles & Sidebar)</option>
                <option value="728x90">728x90 (Leaderboard - Header & Footer)</option>
                <option value="336x280">336x280 (Large Rectangle)</option>
                <option value="300x600">300x600 (Half Page - Sidebar)</option>
                <option value="320x50">320x50 (Mobile Leaderboard)</option>
                <option value="970x90">970x90 (Large Leaderboard)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Direct Banner Image URL (Optional)
              </label>
              <input
                type="url"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/banner-ad.png"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Target Click URL (Optional)
              </label>
              <input
                type="url"
                value={newTargetUrl}
                onChange={e => setNewTargetUrl(e.target.value)}
                placeholder="https://sponsor-website.com"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Ad Script / HTML Snippet (For Adsterra, AdSense, etc.)
            </label>
            <textarea
              rows={3}
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              placeholder="Paste JavaScript snippet or HTML container code..."
              className="w-full text-xs font-mono px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs text-gray-500 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-bold cursor-pointer"
            >
              Save & Activate Unit
            </button>
          </div>
        </form>
      )}

      {/* Tab: Adsterra Dedicated Settings */}
      {activeTab === 'adsterra' && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Adsterra Publisher Integration
              </h3>
              <p className="text-xs text-gray-500">
                Network authentication key and frequency caps
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              Connected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl text-xs">
            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Adsterra Publisher ID
              </label>
              <input
                type="text"
                value={adsterraPublisherId}
                onChange={e => setAdsterraPublisherId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Popunder Frequency Limit (per 24 hours)
              </label>
              <select
                value={popunderFrequency}
                onChange={e => setPopunderFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="1">1 time (Recommended - best UX)</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="unlimited">Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Ads Units Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Ad Slot Name</th>
              <th className="py-3 px-3">Provider</th>
              <th className="py-3 px-3">Placement</th>
              <th className="py-3 px-3">Dimensions</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Impressions / Clicks</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredAds.map(ad => (
              <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                  {ad.name || (ad as any).title}
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                    {ad.provider}
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-gray-500">
                  {ad.placement}
                </td>
                <td className="py-3 px-3 font-mono font-bold">
                  {ad.bannerSize || (ad as any).size || '300x250'}
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() =>
                      updateAdvertisement(ad.id, {
                        status: ad.status === 'active' ? 'paused' : 'active'
                      })
                    }
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                      ad.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}
                  >
                    {ad.status === 'active' ? 'Active' : 'Paused'}
                  </button>
                </td>
                <td className="py-3 px-3 font-mono">
                  {(ad.impressions || 0).toLocaleString()} / {(ad.clicks || 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right">
                  {confirmDeleteId === ad.id ? (
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => {
                          deleteAdvertisement(ad.id);
                          setConfirmDeleteId(null);
                        }}
                        className="p-1 bg-red-600 text-white rounded cursor-pointer"
                        title="Confirm delete"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
                        title="Cancel"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(ad.id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                      title="Delete ad slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
