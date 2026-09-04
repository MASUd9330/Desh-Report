import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { AdPlacement, AdType, Advertisement } from '../../types';
import {
  Megaphone,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Code,
  Layout,
  Sliders,
  DollarSign,
  Smartphone,
  ExternalLink,
  Shield,
  Activity
} from 'lucide-react';
import { toBengaliNumber } from '../../utils/helpers';

export const AdminAdvertisements: React.FC = () => {
  const {
    adminSubSection,
    advertisements,
    addAdvertisement,
    updateAdvertisement,
    deleteAdvertisement
  } = useNews();

  const [activeTab, setActiveTab] = useState<'all' | 'adsterra' | 'banner' | 'social_bar' | 'popunder' | 'placements'>(
    (adminSubSection as any) || 'all'
  );

  // New Ad Unit Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<AdType>('banner');
  const [newPlacement, setNewPlacement] = useState<AdPlacement>('sidebar');
  const [newSize, setNewSize] = useState('300x250');
  const [newProvider, setNewProvider] = useState<'adsterra' | 'google_adsense' | 'direct'>('adsterra');
  const [newCode, setNewCode] = useState('');

  // Adsterra API & Script Global Settings
  const [adsterraPublisherId, setAdsterraPublisherId] = useState('ADS-9842104-BD');
  const [popunderFrequency, setPopunderFrequency] = useState('1');
  const [socialBarDelay, setSocialBarDelay] = useState('3');

  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAdvertisement({
      title: newTitle.trim(),
      type: newType,
      provider: newProvider,
      placement: newPlacement,
      size: newSize,
      code: newCode || '<!-- Adsterra script container -->',
      status: 'active',
      impressions: 0,
      clicks: 0
    });

    setNewTitle('');
    setNewCode('');
    setShowAddModal(false);
  };

  const filteredAds = advertisements.filter(ad => {
    if (activeTab === 'adsterra') return ad.provider === 'adsterra';
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
          <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-pink-600" />
            <span>বিজ্ঞাপন নেটওয়ার্ক ও প্লেসমেন্ট (Ad Management)</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Adsterra, Google AdSense ও লোকাল স্পনসর ব্যানার, পপআন্ডার ও সোশ্যাল বার নিয়ন্ত্রণ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন ইউনিট যোগ করুন</span>
        </button>
      </div>

      {/* Quick Overview Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">মোট অ্যাক্টিভ স্লট</span>
          <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">
            {toBengaliNumber(advertisements.filter(a => a.status === 'active').length)}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">মোট ইমপ্রেশন (আজ)</span>
          <span className="text-xl font-bold text-pink-600 font-mono">
            {toBengaliNumber(advertisements.reduce((a, c) => a + c.impressions, 0))}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">ক্লিক সংখ্যা (Clicks)</span>
          <span className="text-xl font-bold text-emerald-600 font-mono">
            {toBengaliNumber(advertisements.reduce((a, c) => a + c.clicks, 0))}
          </span>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-gray-400 block mb-1">গড় সিটিআর (CTR)</span>
          <span className="text-xl font-bold text-blue-600 font-mono">২.৪৫%</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-slate-800 text-xs overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'সকল অ্যাড ইউনিট' },
          { id: 'adsterra', label: 'Adsterra কনফিগারেশন' },
          { id: 'banner', label: 'ব্যানার (Banner Ads)' },
          { id: 'social_bar', label: 'সোশ্যাল বার (Social Bar)' },
          { id: 'popunder', label: 'পপআন্ডার (Popunder)' },
          { id: 'placements', label: 'প্লেসমেন্ট ম্যাট্রিক্স' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
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
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">নতুন অ্যাড ইউনিট যুক্ত করুন</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                বিজ্ঞাপনের নাম *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="উদাঃ Adsterra 728x90 Header Leaderboard"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                বিজ্ঞাপনদাতা প্রোভাইডার
              </label>
              <select
                value={newProvider}
                onChange={e => setNewProvider(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="adsterra">Adsterra Network</option>
                <option value="google_adsense">Google AdSense</option>
                <option value="direct">লোকাল স্পনসর (Direct Image)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                বিজ্ঞাপনের ধরন
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="banner">ব্যানার (Banner)</option>
                <option value="social_bar">সোশ্যাল বার (Social Bar)</option>
                <option value="popunder">পপআন্ডার (Popunder)</option>
                <option value="native">নেটিভ বিজ্ঞাপন (Native)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                প্লেসমেন্ট অবস্থান
              </label>
              <select
                value={newPlacement}
                onChange={e => setNewPlacement(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="header_top">হেডার শীর্ষ (728x90)</option>
                <option value="below_breaking">ব্রেকিং টিকারে নিচে (970x90)</option>
                <option value="sidebar">সাইডবার (300x250)</option>
                <option value="in_article">প্রতিবেদনের ভেতরে (300x250)</option>
                <option value="between_cards">নিউজ কার্ডের মাঝে</option>
                <option value="footer_sticky">মোবাইল স্টিকি ফুটার (320x50)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                সাইজ / মাত্রা
              </label>
              <input
                type="text"
                value={newSize}
                onChange={e => setNewSize(e.target.value)}
                placeholder="728x90"
                className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              এইচটিএমএল / স্ক্রিপ্ট কোড (Script Embed Code)
            </label>
            <textarea
              rows={3}
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              placeholder="<script type='text/javascript' src='//...'>"
              className="w-full font-mono text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs text-gray-500"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded text-xs font-bold"
            >
              সংরক্ষণ ও সক্রিয় করুন
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
                Adsterra পাবলিশার সেটিংস
              </h3>
              <p className="text-xs text-gray-500">
                Adsterra নেটওয়ার্কের ডিরেক্ট স্ক্রিপ্ট ও কি-আইডি সংযোগ
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              সক্রিয় সংযুক্ত
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
                পপআন্ডার ফ্রিকোয়েন্সি লিমিট (প্রতি ২৪ ঘণ্টায়)
              </label>
              <select
                value={popunderFrequency}
                onChange={e => setPopunderFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
              >
                <option value="1">১ বার (প্রস্তাবিত - সর্বোচ্চ ইউজার ফ্রেন্ডলি)</option>
                <option value="2">২ বার</option>
                <option value="3">৩ বার</option>
                <option value="unlimited">আনলিমিটেড</option>
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
              <th className="py-3 px-4">বিজ্ঞাপন স্লট ও নাম</th>
              <th className="py-3 px-3">প্রোভাইডার</th>
              <th className="py-3 px-3">অবস্থান (Placement)</th>
              <th className="py-3 px-3">মাত্রা (Size)</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3">ইমপ্রেশন / ক্লিক</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredAds.map(ad => (
              <tr key={ad.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                <td className="py-3 px-4 font-bold text-gray-900 dark:text-white">
                  {ad.title}
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
                  {ad.size}
                </td>
                <td className="py-3 px-3">
                  <button
                    onClick={() =>
                      updateAdvertisement(ad.id, {
                        status: ad.status === 'active' ? 'paused' : 'active'
                      })
                    }
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ad.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}
                  >
                    {ad.status === 'active' ? 'সক্রিয় (Active)' : 'স্থগিত (Paused)'}
                  </button>
                </td>
                <td className="py-3 px-3 font-mono">
                  {toBengaliNumber(ad.impressions)} / {toBengaliNumber(ad.clicks)}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      if (window.confirm('এই বিজ্ঞাপন স্লটটি মুছে ফেলতে চান?')) {
                        deleteAdvertisement(ad.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
