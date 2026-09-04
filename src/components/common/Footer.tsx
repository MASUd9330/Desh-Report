import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Facebook,
  Youtube,
  Send,
  Twitter,
  Mail,
  CheckCircle,
  Phone,
  MapPin
} from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    siteSettings,
    categories,
    navigateToCategory,
    navigateToPage,
    navigateToHome
  } = useNews();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterName('');
      setNewsletterSuccess(false);
    }, 4000);
  };

  return (
    <footer className="w-full bg-[#111827] text-gray-300 border-t border-gray-800 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-gray-800">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={navigateToHome}
              className="cursor-pointer flex items-center gap-1.5 select-none"
            >
              <span className="text-3xl font-extrabold tracking-tight font-sans text-white">
                Desh<span className="text-red-600">Report</span>
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            </div>

            <p className="text-sm text-gray-400 leading-relaxed max-w-md">
              {siteSettings.siteDescription}
            </p>

            <div className="space-y-1.5 text-xs text-gray-400 pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>{siteSettings.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <span>{siteSettings.contactPhone}</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteSettings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-sky-500 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={siteSettings.xUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 border-l-2 border-red-600 pl-2.5">
              সংবাদ বিভাগ
            </h3>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigateToCategory(cat.slug)}
                    className="hover:text-red-400 transition-colors text-gray-400 hover:underline"
                  >
                    {cat.nameBn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Editorial & Policies */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 border-l-2 border-red-600 pl-2.5">
              নীতিমালা ও সহায়তা
            </h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <button
                  onClick={() => navigateToPage('about-us')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('editorial-policy')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  সম্পাদকীয় নীতিমালা
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('correction-policy')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  সংশোধনী নীতি
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('privacy-policy')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  প্রাইভেসি পলিসি
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('terms')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  ব্যবহারের শর্তাবলী
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToPage('contact')}
                  className="hover:text-red-400 transition-colors hover:underline"
                >
                  যোগাযোগ
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm mb-3 border-l-2 border-red-600 pl-2.5">
              নিউজলেটার
            </h3>
            <p className="text-xs text-gray-400 mb-3">
              প্রতিদিনের শীর্ষ সংবাদ ও বিশেষ প্রতিবেদন আপনার ইনবক্সে পেতে সাবস্ক্রাইব করুন।
            </p>

            {newsletterSuccess ? (
              <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-300 rounded text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <span>ধন্যবাদ! আপনি সফলভাবে দেশরিপোর্ট নিউজলেটারে যুক্ত হয়েছেন।</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  value={newsletterName}
                  onChange={e => setNewsletterName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-hidden focus:border-red-500"
                />
                <input
                  type="email"
                  required
                  placeholder="আপনার ইমেইল ঠিকানা"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-hidden focus:border-red-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded text-xs transition-colors shadow-xs"
                >
                  সাবস্ক্রাইব করুন
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>{siteSettings.copyrightBn}</p>
          <div className="flex items-center gap-4">
            <span>সম্পাদক: তানভীর আহমেদ</span>
            <span>•</span>
            <span>নিবন্ধন নং: DR-BD-2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
