import React, { useState } from 'react';
import { Play, Film, Clock, Eye, X, Volume2, Share2, Flame } from 'lucide-react';
import { toBengaliNumber } from '../../utils/helpers';

interface VideoStory {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAgo: string;
  videoEmbedUrl?: string;
  summary: string;
}

const initialVideoStories: VideoStory[] = [
  {
    id: 'vid-1',
    title: 'মেট্রোরেলের কমলাপুর স্টেশনের নির্মাণকাজের সর্বশেষ ভিডিও প্রতিবেদন',
    category: 'বিশেষ প্রতিবেদন',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
    duration: '০৩:৪৫',
    views: '১,৪৫,০০০',
    publishedAgo: '২ ঘণ্টা আগে',
    summary: 'মাটির নিচের ভায়াডাক্ট ও প্ল্যাটফর্ম স্থাপনের কাজ শেষের পথে। চলতি বছরের মধ্যেই ট্রেন চলাচলের প্রস্তুতি খতিয়ে দেখছে প্রকৌশলীরা।'
  },
  {
    id: 'vid-2',
    title: 'চ্যাম্পিয়ন্স ট্রফি: লাহোরে শান্তদের নেটে বোলিং আক্রমণের আক্রমণাত্মক ড্রিল',
    category: 'খেলাধুলা',
    thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    duration: '০২:১৫',
    views: '৯৮,৫০০',
    publishedAgo: '৩ ঘণ্টা আগে',
    summary: 'পেস বোলিং অলরাউন্ডারদের নিয়ে হেড কোচের বিশেষ স্ট্র্যাটেজিক ব্রিফিং।'
  },
  {
    id: 'vid-3',
    title: 'গ্রামের কমিউনিটি ক্লিনিকে এআই প্রযুক্তি: স্বাস্থ্যকর্মীদের অভিজ্ঞতার গল্প',
    category: 'প্রযুক্তি ও জীবন',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    duration: '০৪:২০',
    views: '৭৬,২০০',
    publishedAgo: '৫ ঘণ্টা আগে',
    summary: 'ইন্টারনেট ছাড়াই প্রত্যন্ত চরাঞ্চলে ডায়াবেটিস ও উচ্চ রক্তচাপ দ্রুত স্ক্রিনিংয়ের সফল চিত্র।'
  },
  {
    id: 'vid-4',
    title: 'সুন্দরবনের গভীরে শীতের অতিথি পাখির জলকেলি ও প্রকৃতিপ্রেমীদের ভিড়',
    category: 'প্রকৃতি ও ভ্রমণ',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    duration: '০২:৫০',
    views: '৮৪,০০০',
    publishedAgo: '৬ ঘণ্টা আগে',
    summary: 'কটকা ও দুবলার চরে সাইবেরিয়া থেকে আসা পরিযায়ী পাখিদের কলকাকলিতে মুখরিত বনানী।'
  }
];

export const VideoSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoStory | null>(null);

  const mainVideo = initialVideoStories[0];
  const sideVideos = initialVideoStories.slice(1);

  return (
    <section className="mb-10 bg-slate-950 text-white rounded-2xl p-5 sm:p-7 border border-slate-800 shadow-xl overflow-hidden relative">
      {/* Subtle Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6 relative z-10">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-600/40">
            <Film className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-white flex items-center gap-2">
              <span>ভিডিও ও মাল্টিমিডিয়া সংবাদ</span>
              <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-sans uppercase font-bold tracking-wider hidden sm:inline">
                Video Desk
              </span>
            </h2>
          </div>
        </div>

        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>দৈনিক ভিডিও বুলেটিন</span>
        </span>
      </div>

      {/* Grid: Big Left Video + 3 Side Videos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Main Big Video Card (7 Cols) */}
        <div
          onClick={() => setActiveVideo(mainVideo)}
          className="lg:col-span-7 group cursor-pointer bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-red-600/60 transition-all flex flex-col justify-between"
        >
          <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-800">
            <img
              src={mainVideo.thumbnail}
              alt={mainVideo.title}
              className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white ml-1" />
              </div>
            </div>

            {/* Duration Tag */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded flex items-center gap-1">
              <Clock className="w-3 h-3 text-red-400" />
              <span>{mainVideo.duration}</span>
            </div>

            {/* Category Tag */}
            <div className="absolute top-3 left-3 bg-red-600 text-white font-bold text-xs px-2.5 py-1 rounded shadow">
              {mainVideo.category}
            </div>
          </div>

          <div className="p-4 sm:p-5">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold font-serif-bn text-white leading-snug group-hover:text-red-400 transition-colors">
              {mainVideo.title}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
              {mainVideo.summary}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>{mainVideo.views} বার দেখা হয়েছে</span>
              </span>
              <span>{mainVideo.publishedAgo}</span>
            </div>
          </div>
        </div>

        {/* 3 Right Column Videos (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 sm:gap-4">
          {sideVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setActiveVideo(video)}
              className="group cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 transition-all flex gap-3 sm:gap-4 items-center"
            >
              {/* Thumbnail with mini play overlay */}
              <div className="relative w-28 sm:w-36 aspect-16/10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1 py-0.5 rounded text-white">
                  {video.duration}
                </span>
              </div>

              {/* Text info */}
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">
                  {video.category}
                </span>
                <h4 className="text-xs sm:text-sm font-semibold font-serif-bn text-white group-hover:text-red-400 line-clamp-2 leading-snug mt-0.5">
                  {video.title}
                </h4>
                <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>{video.views} ভিউ</span>
                  <span>{video.publishedAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Lightbox Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95"
          >
            {/* Modal Top Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                <Film className="w-4 h-4" />
                <span>দেশরিপোর্ট ভিডিও প্লেয়ার</span>
              </span>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Live Video Player */}
            <div className="relative aspect-16/9 w-full bg-black overflow-hidden flex items-center justify-center">
              <img
                src={activeVideo.thumbnail}
                alt={activeVideo.title}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl shadow-red-600/50 animate-pulse">
                  <Volume2 className="w-8 h-8" />
                </div>
                <span className="text-xs text-white font-medium bg-black/60 px-3 py-1 rounded-full">
                  ভিডিও স্ট্রিমিং চলছে ({activeVideo.duration})
                </span>
              </div>
            </div>

            {/* Video Details */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                  {activeVideo.category}
                </span>
                <span className="text-xs text-slate-400">{activeVideo.publishedAgo}</span>
                <span className="text-xs text-slate-400">• {activeVideo.views} ভিউ</span>
              </div>
              <h3 className="text-lg font-bold font-serif-bn text-white">
                {activeVideo.title}
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                {activeVideo.summary}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
