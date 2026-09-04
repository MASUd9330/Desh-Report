import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { ChevronRight, CheckCircle, Mail, Phone, MapPin, Send } from 'lucide-react';

export const StaticPageView: React.FC = () => {
  const { activePageSlug, pages, navigateToHome, siteSettings } = useNews();
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const page = pages.find(p => p.slug === activePageSlug) || pages[0];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 5000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
        <button onClick={navigateToHome} className="hover:text-red-600 transition-colors">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-red-600">{page.titleBn}</span>
      </nav>

      {/* Page Title & Badge */}
      <div className="border-b-2 border-red-600 pb-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-black font-serif-bn text-gray-950 dark:text-white">
          {page.titleBn}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {page.titleEn} | সর্বশেষ হালনাগাদ: {page.updatedAt}
        </p>
      </div>

      {/* Page Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 font-sans-bn leading-relaxed text-base sm:text-lg mb-10 whitespace-pre-line">
        {page.contentBn}
      </div>

      {/* If Contact Page, show interactive Form */}
      {page.slug === 'contact' && (
        <div className="mt-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-bold font-serif-bn text-gray-900 dark:text-white mb-2">
            আমাদের বার্তা পাঠান (Send Us a Message)
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            সংবাদ সম্পর্কিত তথ্য, প্রতিবেদন বা বিজ্ঞাপনের বিষয়ে যে কোনো জিজ্ঞাসা আমাদের জানান।
          </p>

          {contactSubmitted ? (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">আপনার বার্তা সফলভাবে গৃহীত হয়েছে!</p>
                <p className="text-xs mt-0.5">আমাদের বার্তা বিভাগ শীঘ্রই আপনার সাথে যোগাযোগ করবে।</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="উদাঃ রফিকুল ইসলাম"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    ইমেইল ঠিকানা *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  বিষয় *
                </label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={e => setContactSubject(e.target.value)}
                  placeholder="খবরের সূত্র, প্রেস বিজ্ঞপ্তি বা বিজ্ঞাপন"
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  বার্তা লিখুন *
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={e => setContactMessage(e.target.value)}
                  placeholder="আপনার বিস্তারিত তথ্য এখানে লিখুন..."
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm flex items-center gap-2 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
