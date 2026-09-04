import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import { formatBengaliDate, toBengaliNumber, formatRelativeBanglaTime } from '../../utils/helpers';
import { AdSlot } from '../ads/AdSlot';
import {
  Facebook,
  Send,
  Twitter,
  Share2,
  Copy,
  Check,
  Clock,
  Calendar,
  ChevronRight,
  Eye,
  Bookmark,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const ArticleView: React.FC = () => {
  const {
    articles,
    categories,
    activeArticleId,
    navigateToHome,
    navigateToCategory,
    navigateToArticle
  } = useNews();

  const [copied, setCopied] = useState(false);
  const [ogModalOpen, setOgModalOpen] = useState(false);

  const article = articles.find(a => a.id === activeArticleId) || articles[0];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          সংবাদটি খুঁজে পাওয়া যায়নি
        </h2>
        <button
          onClick={navigateToHome}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-medium text-sm"
        >
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  const category = categories.find(c => c.id === article.categoryId);

  // Related articles in same category
  const relatedArticles = articles
    .filter(a => a.categoryId === article.categoryId && a.id !== article.id && a.status === 'published')
    .slice(0, 4);

  // Most read sidebar
  const mostRead = [...articles]
    .filter(a => a.id !== article.id && a.status === 'published')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `https://deshreport.com/article/${article.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareFacebook = () => {
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=500');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' - ' + currentUrl)}`;
    window.open(waUrl, '_blank');
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`;
    window.open(tgUrl, '_blank');
  };

  const handleShareTwitter = () => {
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twUrl, '_blank');
  };

  // Split content into paragraphs for inline ad and related insertion
  const paragraphs = article.content.split('\n\n').filter(p => p.trim());

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner Ad */}
      <AdSlot placement="before_article" className="mb-6" />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4 overflow-x-auto">
        <button onClick={navigateToHome} className="hover:text-red-600 transition-colors">
          হোম
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        {category && (
          <>
            <button
              onClick={() => navigateToCategory(category.slug)}
              className="text-red-600 font-medium hover:underline"
            >
              {category.nameBn}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          </>
        )}
        <span className="truncate max-w-xs text-gray-400">{article.title}</span>
      </nav>

      {/* Article Main Layout (Content 8 Cols + Sidebar 4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Center Column (8 Cols) */}
        <div className="lg:col-span-8">
          {/* Category Badge & Headline */}
          <div className="mb-3">
            <span
              className="inline-block px-2.5 py-1 text-xs font-bold text-white rounded uppercase tracking-wider"
              style={{ backgroundColor: category?.color || '#c00612' }}
            >
              {category?.nameBn || 'জাতীয়'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif-bn text-gray-950 dark:text-white leading-tight mb-3">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-4 border-l-3 border-red-600 pl-3">
              {article.subtitle}
            </p>
          )}

          {/* Author & Timestamp Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-gray-200 dark:border-slate-800 text-xs text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-3">
              {article.authorAvatar && (
                <img
                  src={article.authorAvatar}
                  alt={article.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
              )}
              <div>
                <span className="font-bold text-gray-900 dark:text-white block text-sm">
                  {article.authorName}
                </span>
                <span className="text-[11px] text-gray-500">{article.source || 'নিজস্ব প্রতিবেদক'}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatBengaliDate(article.publishedAt)}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{toBengaliNumber(article.readingTimeMinutes)} মিনিট পড়া</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>{toBengaliNumber(article.viewCount)} বার</span>
              </div>
            </div>
          </div>

          {/* Featured Image & Caption */}
          <div className="mb-6 rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800">
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full max-h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
            {(article.imageCaption || article.imageCredit) && (
              <div className="p-2.5 bg-gray-50 dark:bg-slate-800/80 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>{article.imageCaption}</span>
                {article.imageCredit && (
                  <span className="font-medium italic">ছবি: {article.imageCredit}</span>
                )}
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg mb-8">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-red-600" />
              <span>শেয়ার করুন:</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShareFacebook}
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="ফেসবুকে শেয়ার করুন"
              >
                <Facebook className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="হোয়াটসঅ্যাপে শেয়ার করুন"
              >
                <MessageCircle className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareTelegram}
                className="w-8 h-8 rounded-full bg-[#229ED9] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="টেলিগ্রামে শেয়ার করুন"
              >
                <Send className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareTwitter}
                className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                title="X (টুইটারে) শেয়ার করুন"
              >
                <Twitter className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyLink}
                className={`px-2.5 h-8 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                }`}
                title="লিংক কপি করুন"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'কপি হয়েছে' : 'কপি লিঙ্ক'}</span>
              </button>

              <button
                onClick={() => setOgModalOpen(true)}
                className="px-2.5 h-8 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/40 text-red-600 hover:bg-red-100 flex items-center gap-1"
                title="Facebook OpenGraph প্রিভিউ কার্ড"
              >
                <ExternalLink className="w-3 h-3" />
                <span>OG কার্ড</span>
              </button>
            </div>
          </div>

          {/* Article Body Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-900 dark:text-gray-100 font-sans-bn leading-[1.85] text-lg sm:text-[19px]">
            {paragraphs.map((p, idx) => (
              <React.Fragment key={idx}>
                {/* Check for heading */}
                {p.startsWith('## ') ? (
                  <h2 className="text-2xl font-bold font-serif-bn text-gray-950 dark:text-white mt-8 mb-4 border-b pb-2">
                    {p.replace('## ', '')}
                  </h2>
                ) : (
                  <p className={`mb-6 ${idx === 0 ? 'dropcap' : ''}`}>
                    {p}
                  </p>
                )}

                {/* Inline Ad after 1st paragraph */}
                {idx === 0 && (
                  <AdSlot placement="after_first_paragraph" className="my-6" />
                )}

                {/* Inline Middle Ad */}
                {idx === Math.floor(paragraphs.length / 2) && paragraphs.length > 2 && (
                  <AdSlot placement="middle_article" className="my-6" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500">ট্যাগ:</span>
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* After Article Ad */}
          <AdSlot placement="after_article" className="my-8" />

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="mt-10 pt-6 border-t-2 border-gray-200 dark:border-slate-800">
              <h3 className="text-xl font-bold font-serif-bn text-gray-950 dark:text-white mb-4">
                সম্পর্কিত সংবাদ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigateToArticle(rel.id)}
                    className="cursor-pointer group flex items-start gap-3 p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="w-20 h-16 rounded overflow-hidden shrink-0 bg-gray-100 dark:bg-slate-800">
                      <img
                        src={rel.featuredImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold font-serif-bn text-gray-900 dark:text-white group-hover:text-red-600 line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        {formatRelativeBanglaTime(rel.publishedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sidebar Ad (300x250) */}
          <AdSlot placement="sidebar" />

          {/* Most Read in Sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-4 shadow-xs">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-800 pb-2.5 mb-3 flex items-center justify-between">
              <span>সর্বাধিক পঠিত</span>
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
            </h3>

            <div className="divide-y divide-gray-100 dark:divide-slate-800">
              {mostRead.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => navigateToArticle(item.id)}
                  className="py-3 first:pt-0 last:pb-0 cursor-pointer group flex items-start gap-3"
                >
                  <span className="text-2xl font-black font-serif-bn text-gray-300 dark:text-gray-600 group-hover:text-red-600 transition-colors shrink-0">
                    {toBengaliNumber(idx + 1)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold font-serif-bn text-gray-900 dark:text-gray-200 group-hover:text-red-600 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {formatRelativeBanglaTime(item.publishedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Facebook OpenGraph Preview Modal (Requirement 16, 17) */}
      {ogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>ফেসবুক সোশ্যাল কার্ড প্রিভিউ (1200x630 OG Standard)</span>
              </h3>
              <button
                onClick={() => setOgModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Realistic Facebook Link Card Mockup */}
            <div className="border border-gray-300 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-xs">
              <div className="relative aspect-1200/630 w-full overflow-hidden bg-gray-100">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-sans font-bold">
                  DESHREPORT.COM
                </div>
              </div>
              <div className="p-3 bg-[#f0f2f5] dark:bg-slate-800 text-gray-900 dark:text-gray-100">
                <span className="text-[11px] text-gray-500 uppercase tracking-wide block">
                  DESHREPORT.COM
                </span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 mt-0.5">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {article.summary}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-500 space-y-1">
              <p>• <strong>og:title:</strong> {article.title}</p>
              <p>• <strong>og:description:</strong> {article.summary}</p>
              <p>• <strong>og:image:</strong> 1200×630px high resolution social image</p>
              <p>• <strong>og:site_name:</strong> DeshReport</p>
            </div>

            <button
              onClick={() => setOgModalOpen(false)}
              className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium text-xs"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
