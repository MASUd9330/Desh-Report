import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { MapPin, ChevronRight, Clock, Building2, Compass } from 'lucide-react';
import { formatRelativeBanglaTime } from '../../utils/helpers';

interface DistrictStory {
  id: string;
  division: string;
  district: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  reporter: string;
}

const divisionList = [
  'সব বিভাগ',
  'ঢাকা বিভাগ',
  'চট্টগ্রাম বিভাগ',
  'রাজশাহী বিভাগ',
  'খুলনা বিভাগ',
  'বরিশাল বিভাগ',
  'সিলেট বিভাগ',
  'রংপুর বিভাগ'
];

const initialDistrictStories: DistrictStory[] = [
  {
    id: 'reg-1',
    division: 'চট্টগ্রাম বিভাগ',
    district: 'কক্সবাজার',
    title: 'কক্সবাজারে পর্যটন মৌসুমে উপচে পড়া ভিড়, নতুন ইকো-ট্যুরিজম জোনের উদ্বোধন',
    summary: 'সমুদ্রসৈকতের লাবণী ও কলাতলী পয়েন্টে লাখো পর্যটকের সমাগম। পরিবেশ সুরক্ষায় নেওয়া হয়েছে বিশেষ প্লাস্টিকমুক্ত উদ্যোগ।',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reporter: 'কক্সবাজার প্রতিনিধি'
  },
  {
    id: 'reg-2',
    division: 'রাজশাহী বিভাগ',
    district: 'বগুড়া',
    title: 'বগুড়ায় রকমারি রবিশস্যের বাম্পার ফলন: হাসি ফুটেছে কৃষকদের মুখে',
    summary: 'উন্নত জাতের বীজ ও আধুনিক সেচ ব্যবস্থাপনায় এবার লক্ষ্যমাত্রার চেয়েও ১৫ শতাংশ বেশি উৎপাদন হয়েছে।',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    reporter: 'বগুড়া সংবাদকর্মী'
  },
  {
    id: 'reg-3',
    division: 'সিলেট বিভাগ',
    district: 'শ্রীমঙ্গল',
    title: 'শ্রীমঙ্গলের চা বাগানে সবুজ কুঁড়ি সংগ্রহের ব্যস্ততা, রপ্তানিতে নতুন আশাবাদ',
    summary: 'শীত বিদায়ের পর নতুন কুঁড়ির আগমন ঘটেছে বাগানে। এবার বিদেশে প্রিমিয়াম ব্লেন্ডের চা রপ্তানির অর্ডার বেড়েছে।',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    reporter: 'শ্রীমঙ্গল প্রতিনিধি'
  },
  {
    id: 'reg-4',
    division: 'খুলনা বিভাগ',
    district: 'যশোর',
    title: 'যশোরের গদখালীর ফুলের বাজার জমে উঠেছে: বসন্ত বরণ ও উৎসবের আমেজ',
    summary: 'গোলাপ, রজনীগন্ধা ও জারবেরা ফুলের বেচাকেনা জমে উঠেছে। দেশের বিভিন্ন জেলা থেকে পাইকাররা আসছেন ভোরে।',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    reporter: 'যশোর ব্যুরো'
  },
  {
    id: 'reg-5',
    division: 'বরিশাল বিভাগ',
    district: 'পটুয়াখালী',
    title: 'কুয়াকাটা সৈকতে সূর্যাস্ত দেখতে হাজারো মানুষের মিলনমেলা',
    summary: 'পদ্মা সেতুর কারণে বরিশাল ও পটুয়াখালীর পর্যটন অর্থনীতিতে যুগান্তকারী পরিবর্তন এসেছে বলে জানান স্থানীয় ব্যবসায়ীরা।',
    image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    reporter: 'কুয়াকাটা প্রতিনিধি'
  },
  {
    id: 'reg-6',
    division: 'ঢাকা বিভাগ',
    district: 'নারায়ণগঞ্জ',
    title: 'শীতলক্ষ্যা নদীর তলদেশে আধুনিক ওয়াটার ট্রিটমেন্ট প্ল্যান্টের ট্রায়াল সম্পন্ন',
    summary: 'শিল্পবর্জ্য পরিশোধন করে পরিবেশবান্ধব টেকসই শিল্পাঞ্চল গড়ে তুলতে পরিবেশ অধিদপ্তরের নতুন মনিটরিং সেল চালু।',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    publishedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    reporter: 'নারায়ণগঞ্জ প্রতিনিধি'
  }
];

export const RegionalSection: React.FC = () => {
  const { navigateToCategory, navigateToArticle, articles } = useNews();
  const [selectedDivision, setSelectedDivision] = useState('সব বিভাগ');

  const filteredStories = selectedDivision === 'সব বিভাগ'
    ? initialDistrictStories
    : initialDistrictStories.filter(s => s.division === selectedDivision);

  const featured = filteredStories[0] || initialDistrictStories[0];
  const others = filteredStories.slice(1);

  return (
    <section className="mb-10 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-3 mb-5 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-950 dark:text-white">
              সারাদেশ ও জেলা সংবাদ
            </h2>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              ৬৪ জেলার তৃণমূলের খবরাখবর ও মানুষের জীবনচিত্র
            </span>
          </div>
        </div>

        <button
          onClick={() => navigateToCategory('bangladesh')}
          className="self-start sm:self-auto flex items-center gap-1 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 transition-colors cursor-pointer"
        >
          <span>সব জেলার খবর</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Division Pill Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-thin">
        {divisionList.map(div => {
          const isActive = selectedDivision === div;
          return (
            <button
              key={div}
              onClick={() => setSelectedDivision(div)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {div}
            </button>
          );
        })}
      </div>

      {/* Grid: 1 Big Left Card + 4 Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Big Spotlight Story */}
        <div
          onClick={() => {
            const matched = articles.find(a => a.title.includes(featured.district) || a.categoryId === 'national');
            if (matched) navigateToArticle(matched.id);
            else navigateToCategory('bangladesh');
          }}
          className="lg:col-span-5 group cursor-pointer bg-slate-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
            <img
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow">
              <MapPin className="w-3.5 h-3.5" />
              <span>{featured.district}</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                {featured.division}
              </span>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif-bn text-gray-950 dark:text-white leading-snug group-hover:text-emerald-600 transition-colors mt-1">
                {featured.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {featured.summary}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-slate-800 flex items-center justify-between text-xs text-gray-400">
              <span className="font-medium text-gray-700 dark:text-gray-300">{featured.reporter}</span>
              <div className="flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeBanglaTime(featured.publishedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Multi-district Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {others.map(item => (
            <div
              key={item.id}
              onClick={() => {
                const matched = articles.find(a => a.title.includes(item.district) || a.categoryId === 'national');
                if (matched) navigateToArticle(matched.id);
                else navigateToCategory('bangladesh');
              }}
              className="group cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 border border-gray-200 dark:border-slate-800 rounded-xl p-3.5 hover:shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  <MapPin className="w-3 h-3" />
                  <span>{item.district}</span>
                </span>
                <span className="text-[11px] text-gray-400">
                  {formatRelativeBanglaTime(item.publishedAt)}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold font-serif-bn text-gray-900 dark:text-white group-hover:text-emerald-600 line-clamp-2 leading-snug">
                {item.title}
              </h4>

              <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>

              <div className="mt-3 pt-2 border-t border-gray-200/60 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-gray-400">
                <span>{item.reporter}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
                  বিস্তারিত পড়ুন
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
