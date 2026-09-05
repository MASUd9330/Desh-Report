import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Link,
  Sparkles,
  Check,
  X,
  Clock,
  RefreshCw,
  Zap,
  Activity
} from 'lucide-react';

export const AdminBreakingNews: React.FC = () => {
  const {
    breakingNews = [],
    addBreakingNews,
    updateBreakingNews,
    deleteBreakingNews,
    articles = [],
    breakingAutoTriggerEnabled,
    lastBreakingAutoTriggerAt,
    toggleBreakingAutoTrigger,
    triggerBreakingAutoRefresh
  } = useNews();

  const [newTitle, setNewTitle] = useState('');
  const [newArticleId, setNewArticleId] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'normal'>('urgent');
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [triggerNotice, setTriggerNotice] = useState(false);

  const handleArticleSelect = (artId: string) => {
    setNewArticleId(artId);
    if (artId) {
      const art = articles.find(a => a.id === artId);
      if (art && !newTitle) {
        setNewTitle(art.title);
      }
    }
  };

  const handleManualTrigger = () => {
    triggerBreakingAutoRefresh();
    setTriggerNotice(true);
    setTimeout(() => setTriggerNotice(false), 3000);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const selectedArt = articles.find(a => a.id === newArticleId);

    addBreakingNews({
      title: newTitle.trim(),
      articleId: newArticleId || undefined,
      link: selectedArt ? `/article/${selectedArt.slug}` : undefined,
      priority: newPriority,
      isActive: true,
      displayLocations: ['homepage', 'category', 'article']
    });

    setNewTitle('');
    setNewArticleId('');
    setNewPriority('urgent');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600" />
            <span>ব্রেকিং নিউজ ও অটো-ট্রিগার ম্যানেজার</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            ১৫ মিনিট পর পর স্বয়ংক্রিয় ব্রেকিং নিউজ পরিবর্তন ও লাইভ টিকার কন্ট্রোল প্যানেল
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualTrigger}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            title="এখনই ১৫ মিনিটের ব্রেকিং অ্যালার্ট রিফ্রেশ করুন"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse" />
            <span>অটো-ট্রিগার রিফ্রেশ</span>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'বাতিল' : '+ নতুন ব্রেকিং অ্যালার্ট'}</span>
          </button>
        </div>
      </div>

      {/* 15-Minute Auto-Trigger Status Banner */}
      <div className="bg-linear-to-r from-red-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-red-950/30 dark:to-slate-900 border border-red-200 dark:border-red-900/40 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-600 text-white rounded-lg shrink-0 mt-0.5 shadow-xs">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  ১৫ মিনিট স্বয়ংক্রিয় ব্রেকিং ট্রিগার ইঞ্জিন
                </h3>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                  breakingAutoTriggerEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400'
                }`}>
                  {breakingAutoTriggerEnabled ? 'সক্রিয় (Active)' : 'বন্ধ (Paused)'}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                প্রতি ১৫ মিনিট পর পর সর্বশেষ জরুরি ও গুরুত্বপূর্ণ সংবাদগুলো স্বয়ংক্রিয়ভাবে সংগ্রহ করে ব্রেকিং টিকারে আপডেট ও চক্রাকারে পরিবর্তন করা হয়।
              </p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>সর্বশেষ ট্রিগার: {lastBreakingAutoTriggerAt || 'এখনই সক্রিয়'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>চক্রের সময়কাল: প্রতি ১৫ মিনিট</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                অটো-ট্রিগার {breakingAutoTriggerEnabled ? 'চালু' : 'বন্ধ'}
              </span>
              <div
                onClick={toggleBreakingAutoTrigger}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                  breakingAutoTriggerEnabled ? 'bg-red-600' : 'bg-gray-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    breakingAutoTriggerEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        {triggerNotice && (
          <div className="mt-3 p-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs rounded-lg flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>সফল! সর্বশেষ জরুরি সংবাদসমূহ ব্রেকিং টিকারে ১৫ মিনিট চক্রে তাৎক্ষণিক রিফ্রেশ করা হয়েছে।</span>
          </div>
        )}
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/40 rounded-xl p-5 shadow-xs space-y-4 animate-fade-in"
        >
          <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>নতুন ব্রেকিং অ্যালার্টের বিবরণ</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              ব্রেকিং নিউজ শিরোনাম *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="উদাহরণ: জাতীয় সংসদে গুরুত্বপূর্ণ নীতিগত বিল সর্বসম্মতভাবে পাস..."
              className="w-full text-xs px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                সংবাদের সাথে লিংক করুন (ঐচ্ছিক)
              </label>
              <select
                value={newArticleId}
                onChange={e => handleArticleSelect(e.target.value)}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="">কোনো লিংক নেই (শুধুমাত্র টেক্সট)</option>
                {articles.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                অগ্রাধিকার (Priority)
              </label>
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as 'urgent' | 'high' | 'normal')}
                className="w-full text-xs bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="urgent">জরুরি (Urgent - লাল রঙের ফ্ল্যাশ)</option>
                <option value="high">উচ্চ অগ্রাধিকার (High)</option>
                <option value="normal">সাধারণ (Normal)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              ব্রেকিং অ্যালার্ট প্রকাশ করুন
            </button>
          </div>
        </form>
      )}

      {/* Breaking List Table */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">
            সক্রিয় ব্রেকিং হেডলাইন তালিকা ({breakingNews.length}টি)
          </h3>
          <span className="text-[11px] text-gray-500">
            টিকারে ডিসপ্লে সময়কাল ও অটো-রোটেশন প্রতি ১৫ মিনিটে রিলোড হয়
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 dark:bg-slate-950 text-gray-500 border-b border-gray-200 dark:border-slate-800 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">শিরোনাম</th>
              <th className="py-3 px-3">সংযুক্ত সংবাদ</th>
              <th className="py-3 px-3">স্ট্যাটাস</th>
              <th className="py-3 px-3">তৈরির তারিখ</th>
              <th className="py-3 px-4 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
            {breakingNews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  কোনো সক্রিয় ব্রেকিং নিউজ নেই। &apos;অটো-ট্রিগার রিফ্রেশ&apos; চাপলে সর্বশেষ সংবাদ থেকে ব্রেকিং যুক্ত হবে।
                </td>
              </tr>
            ) : (
              breakingNews.map(item => {
                const linkedArt = articles.find(a => a.id === item.articleId);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-gray-900 dark:text-white max-w-md">
                      <div className="flex items-center gap-2">
                        <Flame className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>{item.title}</span>
                        {item.priority === 'urgent' && (
                          <span className="px-1.5 py-0.2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[10px] rounded">
                            জরুরি
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                      {linkedArt ? (
                        <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                          <Link className="w-3 h-3" />
                          <span className="truncate max-w-xs">{linkedArt.title}</span>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">সরাসরি টেক্সট</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() =>
                          updateBreakingNews(item.id, { isActive: !item.isActive })
                        }
                        className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-slate-800'
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয়</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>নিষ্ক্রিয়</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {confirmDeleteId === item.id ? (
                        <div className="inline-flex items-center gap-1 bg-red-50 dark:bg-red-950/80 p-1 rounded-lg border border-red-200 dark:border-red-800">
                          <span className="text-[10px] text-red-600 font-semibold px-1">মুছবেন?</span>
                          <button
                            onClick={() => {
                              deleteBreakingNews(item.id);
                              setConfirmDeleteId(null);
                            }}
                            className="p-1 text-white bg-red-600 hover:bg-red-700 rounded cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-white rounded cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
