import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Share2,
  Facebook,
  Twitter,
  Youtube,
  Send,
  MessageCircle,
  Save,
  Check
} from 'lucide-react';

export const AdminSocialMedia: React.FC = () => {
  const { socialLinks, updateSocialLinks } = useNews();

  const [fb, setFb] = useState(socialLinks.facebook);
  const [tw, setTw] = useState(socialLinks.twitter);
  const [yt, setYt] = useState(socialLinks.youtube);
  const [tg, setTg] = useState(socialLinks.telegram);
  const [wa, setWa] = useState(socialLinks.whatsapp);
  const [autoShare, setAutoShare] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSocialLinks({
      facebook: fb,
      twitter: tw,
      youtube: yt,
      telegram: tg,
      whatsapp: wa
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold font-serif-bn text-gray-900 dark:text-white flex items-center gap-2">
          <Share2 className="w-6 h-6 text-blue-600" />
          <span>সোশ্যাল মিডিয়া ও চ্যানেল সংযোগ (Social Media Channels)</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          ফেসবুক পেজ, টেলিগ্রাম চ্যানেল, ইউটিউব ও হোয়াটসঅ্যাপ চ্যানেলের লিংক ও অটো শেয়ার
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>সোশ্যাল মিডিয়া লিংকসমূহ সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>অফিসিয়াল ফেসবুক পেজ URL</span>
          </label>
          <input
            type="url"
            value={fb}
            onChange={e => setFb(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-sky-500" />
            <span>টেলিগ্রাম নিউজ চ্যানেল URL</span>
          </label>
          <input
            type="url"
            value={tg}
            onChange={e => setTg(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>ইউটিউব চ্যানেল URL</span>
          </label>
          <input
            type="url"
            value={yt}
            onChange={e => setYt(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <Twitter className="w-4 h-4 text-gray-900 dark:text-gray-200" />
            <span>এক্স (সাবেক টুইটার) প্রোফাইল URL</span>
          </label>
          <input
            type="url"
            value={tw}
            onChange={e => setTw(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>হোয়াটসঅ্যাপ চ্যানেল / হেল্পলাইন লিংক</span>
          </label>
          <input
            type="url"
            value={wa}
            onChange={e => setWa(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
          />
        </div>

        <div className="pt-3 border-t border-gray-100 dark:border-slate-800">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={autoShare}
              onChange={e => setAutoShare(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              নতুন সংবাদ প্রকাশের সাথে সাথে স্বয়ংক্রিয়ভাবে ফেসবুক ও টেলিগ্রামে পোস্ট জেনারেট করুন
            </span>
          </label>
        </div>

        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs"
        >
          <Save className="w-4 h-4" />
          <span>সংরক্ষণ করুন</span>
        </button>
      </form>
    </div>
  );
};
