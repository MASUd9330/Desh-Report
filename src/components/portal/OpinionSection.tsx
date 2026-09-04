import React from 'react';
import { useNews } from '../../context/NewsContext';
import { Quote, Feather, ArrowRight, BookOpen } from 'lucide-react';

interface OpinionColumn {
  id: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  columnTitle: string;
  snippet: string;
  readTime: string;
  dateBn: string;
}

const opinionColumns: OpinionColumn[] = [
  {
    id: 'op-1',
    authorName: 'মুহাম্মদ জাহাঙ্গীর হোসেন',
    authorTitle: 'অর্থনীতিবিদ ও সাবেক গভর্নর',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    columnTitle: 'রিজার্ভের স্থিতি ও আগামী বাজেটের কাঠামোগত সংস্কারের রূপরেখা',
    snippet: 'মূল্যস্ফীতি নিয়ন্ত্রণ ও রাজস্ব আদায়ে ডিজিটালাইজেশন ছাড়া কোনো দীর্ঘমেয়াদি বিকল্প নেই। কাঠামোগত সংস্কারে রাজনৈতিক সদিচ্ছা সবচেয়ে বড় বিষয়।',
    readTime: '৫ মিনিট পাঠ',
    dateBn: 'আজকের কলাম'
  },
  {
    id: 'op-2',
    authorName: 'ড. ফারহানা জামান',
    authorTitle: 'অধ্যাপক, আন্তর্জাতিক সম্পর্ক বিভাগ',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    columnTitle: 'দক্ষিণ এশিয়ার কূটনীতিতে ভারসাম্য: বাংলাদেশের নতুন ভূ-রাজনৈতিক অবস্থান',
    snippet: 'প্রতিবেশী দেশগুলোর সাথে পারস্পরিক বাণিজ্য ও সামুদ্রিক অর্থনীতির উন্নয়ন এখন আমাদের পররাষ্ট্রনীতির মূল কেন্দ্রবিন্দু হওয়া উচিত।',
    readTime: '৪ মিনিট পাঠ',
    dateBn: 'সম্পাদকীয়'
  },
  {
    id: 'op-3',
    authorName: 'সৈয়দ তানভীর আজম',
    authorTitle: 'পরিবেশ ও জলবায়ু বিশেষজ্ঞ',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    columnTitle: 'নগরের জলাশয় ভরাট ও ভূগর্ভস্থ পানির সংকট: এখনই সতর্ক না হলে কী ঘটবে?',
    snippet: 'বৃষ্টির পানি সংরক্ষণে বাধ্যতামূলক ড্রেনেজ নীতিমালা বাস্তবায়ন না করলে আগামী দশকে মেগাসিটিগুলো সুপেয় পানির চরম ঝুঁকিতে পড়বে।',
    readTime: '৬ মিনিট পাঠ',
    dateBn: 'বিশেষ মতামত'
  },
  {
    id: 'op-4',
    authorName: 'আফসানা চৌধুরী',
    authorTitle: 'প্রযুক্তি গবেষক ও কলামিস্ট',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
    columnTitle: 'স্কুল শিক্ষায় এআই ও প্রোগ্রামিং: আমরা কি ভবিষ্যতের জন্য তৈরি?',
    snippet: 'মুখস্থবিদ্যার বদলে সমস্যা সমাধানের মননশীলতা গড়ে তোলাই চতুর্থ শিল্পবিপ্লবের যুগে তরুণ প্রজন্মের আসল হাতিয়ার।',
    readTime: '৪ মিনিট পাঠ',
    dateBn: 'প্রযুক্তি কলাম'
  }
];

export const OpinionSection: React.FC = () => {
  const { navigateToCategory } = useNews();

  return (
    <section className="mb-10 bg-amber-50/50 dark:bg-slate-900/60 border border-amber-200/60 dark:border-slate-800 rounded-2xl p-5 sm:p-7 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-200/80 dark:border-slate-800 pb-3 mb-6">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/30">
            <Feather className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-950 dark:text-white">
              সম্পাদকীয় ও মতামত
            </h2>
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              দেশের শীর্ষ চিন্তাবিদ ও লেখকদের প্রজ্ঞাময় কলাম
            </span>
          </div>
        </div>

        <button
          onClick={() => navigateToCategory('opinion')}
          className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>সব মতামত</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: 4 Opinion Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {opinionColumns.map((col, idx) => (
          <div
            key={col.id}
            className="bg-white dark:bg-slate-900 border border-amber-100 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-amber-400/60 dark:hover:border-slate-700 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              {/* Author Row */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={col.authorAvatar}
                  alt={col.authorName}
                  className="w-11 h-11 rounded-full object-cover border-2 border-amber-200 dark:border-slate-700 shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                    {col.authorName}
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 truncate">
                    {col.authorTitle}
                  </p>
                </div>
              </div>

              {/* Title with quote icon */}
              <div className="relative mb-2">
                <Quote className="w-5 h-5 text-amber-300 dark:text-slate-700 -mb-1" />
                <h3 className="text-sm sm:text-base font-bold font-serif-bn text-gray-950 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-3 leading-snug">
                  {col.columnTitle}
                </h3>
              </div>

              {/* Snippet */}
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                "{col.snippet}"
              </p>
            </div>

            {/* Footer Tag & Read Time */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-gray-400">
              <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                {col.dateBn}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-gray-400" />
                <span>{col.readTime}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
