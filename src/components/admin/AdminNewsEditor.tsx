import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { Article, NewsStatus } from '../../types';
import { generateSlug, calculateReadingTime } from '../../utils/helpers';
import {
  Save,
  Eye,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  Facebook,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Link2,
  AlertCircle
} from 'lucide-react';

export const AdminNewsEditor: React.FC = () => {
  const {
    categories,
    users,
    addArticle,
    updateArticle,
    articles,
    setAdminSection,
    mediaLibrary,
    navigateToArticle
  } = useNews();

  // Check if editing an existing article
  const editingId = localStorage.getItem('deshreport_editing_id');
  const existingArticle = articles.find(a => a.id === editingId);

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [subtitle, setSubtitle] = useState(existingArticle?.subtitle || '');
  const [content, setContent] = useState(existingArticle?.content || '');
  const [summary, setSummary] = useState(existingArticle?.summary || '');
  const [featuredImage, setFeaturedImage] = useState(
    existingArticle?.featuredImage ||
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80'
  );
  const [imageCaption, setImageCaption] = useState(existingArticle?.imageCaption || '');
  const [imageCredit, setImageCredit] = useState(existingArticle?.imageCredit || 'দেশরিপোর্ট');
  const [categoryId, setCategoryId] = useState(existingArticle?.categoryId || 'national');
  const [subcategory, setSubcategory] = useState(existingArticle?.subcategory || '');
  const [authorId, setAuthorId] = useState(existingArticle?.authorId || users[0]?.id);
  const [tags, setTags] = useState(existingArticle?.tags?.join(', ') || 'বাংলাদেশ, জাতীয়');
  const [source, setSource] = useState(existingArticle?.source || 'নিজস্ব প্রতিবেদক, ঢাকা');
  const [sourceUrl, setSourceUrl] = useState(existingArticle?.sourceUrl || '');
  const [status, setStatus] = useState<NewsStatus>(existingArticle?.status || 'published');
  const [scheduledAt, setScheduledAt] = useState(existingArticle?.scheduledAt || '');

  // Flags
  const [isFeaturedHero, setIsFeaturedHero] = useState(existingArticle?.isFeaturedHero || false);
  const [isSecondaryHero, setIsSecondaryHero] = useState(existingArticle?.isSecondaryHero || false);
  const [isBreaking, setIsBreaking] = useState(existingArticle?.isBreaking || false);
  const [isTrending, setIsTrending] = useState(existingArticle?.isTrending || false);
  const [isEditorsChoice, setIsEditorsChoice] = useState(existingArticle?.isEditorsChoice || false);

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState(existingArticle?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(existingArticle?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(existingArticle?.focusKeyword || '');
  const [canonicalUrl, setCanonicalUrl] = useState(existingArticle?.canonicalUrl || '');

  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Auto generate slug if title changes and user hasn't typed custom slug
    if (!existingArticle && title) {
      setSlug(generateSlug(title));
    }
  }, [title, existingArticle]);

  // Clean up editing ID when unmounting or leaving
  const handleCancel = () => {
    localStorage.removeItem('deshreport_editing_id');
    setAdminSection('news', 'all');
  };

  const handleSave = (saveStatus?: NewsStatus) => {
    if (!title.trim()) {
      alert('অনুগ্রহ করে খবরের শিরোনাম লিখুন!');
      return;
    }

    const currentStatus = saveStatus || status;
    const cleanTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const articleData: Partial<Article> = {
      title,
      slug: slug || generateSlug(title),
      subtitle,
      content,
      summary: summary || content.slice(0, 160) + '...',
      featuredImage,
      imageCaption,
      imageCredit,
      categoryId,
      subcategory,
      authorId,
      authorName: users.find(u => u.id === authorId)?.name || 'নিজস্ব প্রতিবেদক',
      tags: cleanTags,
      source,
      sourceUrl,
      status: currentStatus,
      scheduledAt: currentStatus === 'scheduled' ? scheduledAt : undefined,
      isFeaturedHero,
      isSecondaryHero,
      isBreaking,
      isTrending,
      isEditorsChoice,
      seoTitle: seoTitle || `${title} | DeshReport`,
      metaDescription: metaDescription || summary || title,
      focusKeyword,
      canonicalUrl: canonicalUrl || `https://deshreport.com/article/${slug || generateSlug(title)}`
    };

    if (existingArticle) {
      updateArticle(existingArticle.id, articleData);
      setNotification('সংবাদ প্রতিবেদন সফলভাবে আপডেট করা হয়েছে!');
    } else {
      const created = addArticle(articleData);
      setNotification('নতুন সংবাদ প্রতিবেদন সফলভাবে প্রকাশিত হয়েছে!');
      localStorage.setItem('deshreport_editing_id', created.id);
    }

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Content formatting toolbar helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + '\n' + prefix + 'এখানে টেক্সট লিখুন' + suffix + '\n');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-900 dark:text-white">
              {existingArticle ? 'সংবাদ সম্পাদনা (Edit Article)' : 'নতুন সংবাদ রচনা (Create Article)'}
            </h1>
            <span className="text-xs text-gray-400">
              {existingArticle ? `আইডি: ${existingArticle.id}` : 'সম্পূর্ণ তথ্য ও এসইও অপটিমাইজেশন নিশ্চিত করুন'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {existingArticle && (
            <button
              type="button"
              onClick={() => navigateToArticle(existingArticle.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>প্রিভিউ দেখুন</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3.5 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-400/40 rounded-lg text-xs font-semibold"
          >
            খসড়া হিসেবে সেভ
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>প্রকাশ করুন (Publish)</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Grid: Form Left (8 Cols) + Sidebar Options Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Core Fields */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              খবরের প্রধান শিরোনাম (Headline) *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="আকর্ষণীয় ও তথ্যবহুল শিরোনাম লিখুন..."
              className="w-full text-base sm:text-lg font-bold font-serif-bn px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />

            {/* Slug */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span className="shrink-0 font-medium">ইউআরএল স্লাগ (Slug):</span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="flex-1 font-mono text-xs px-2 py-1 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subtitle / Kicker */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              উপ-শিরোনাম (Sub-headline / Kicker)
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="সংক্ষিপ্ত পটভূমি বা প্রধান সূত্রের বক্তব্য..."
              className="w-full text-sm font-medium px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>

          {/* Rich Content Editor with Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                মূল প্রতিবেদন বিষয়বস্তু (Article Content) *
              </label>

              {/* Formatting quick toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  title="বোল্ড (Bold)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  title="ইটালিক (Italic)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  title="হেডিং ২ (Heading 2)"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  title="উদ্ধৃতি (Blockquote)"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                  title="তালিকা (Bullet list)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="এখানে আপনার বিস্তারিত প্রতিবেদন লিখুন। অনুচ্ছেদ তৈরিতে দুটি এন্টার চাপুন..."
              className="w-full text-base font-sans-bn leading-relaxed px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>আনুমানিক পাঠের সময়: {calculateReadingTime(content)} মিনিট</span>
              <span>শব্দ সংখ্যা: {content.trim().split(/\s+/).filter(Boolean).length}</span>
            </div>
          </div>

          {/* Short Summary */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              সংক্ষিপ্ত সারসংক্ষেপ (Summary for Home Card & Meta)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="কার্ডে প্রদর্শনের জন্য ২-৩ লাইনের সংক্ষিপ্ত বর্ণনা..."
              className="w-full text-xs font-medium px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
            />
          </div>

          {/* SEO & Facebook OpenGraph Live Preview */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                এসইও ও সোশ্যাল শেয়ার প্রিভিউ (Search & Facebook OpenGraph)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  এসইও টাইটেল (SEO Title)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder={title || 'টাইটেল...'}
                  className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  ফোকাস কি-ওয়ার্ড (Focus Keyword)
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  placeholder="উদাঃ মেট্রোরেল ঢাকা"
                  className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-red-500"
                />
              </div>
            </div>

            {/* Live Facebook Card Mockup */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>ফেসবুক শেয়ার প্রিভিউ (1200x630px OG Preview):</span>
              </span>
              <div className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 max-w-md shadow-xs">
                <div className="aspect-1200/630 w-full bg-gray-100 dark:bg-slate-700 overflow-hidden">
                  <img
                    src={featuredImage}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5 bg-[#f0f2f5] dark:bg-slate-800">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">
                    DESHREPORT.COM
                  </span>
                  <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate mt-0.5">
                    {seoTitle || title || 'প্রতিবেদনের শিরোনাম'}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {metaDescription || summary || 'সংক্ষিপ্ত বিবরণ...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Category, Media & Editorial Flags (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Publishing Status & Schedule */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              প্রকাশনা স্থিতি (Status)
            </h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">স্ট্যাটাস নির্বাচন করুন</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as NewsStatus)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="published">সরাসরি প্রকাশিত (Published)</option>
                <option value="draft">খসড়া হিসেবে জমা (Draft)</option>
                <option value="scheduled">নির্ধারিত সময়ে প্রকাশ (Scheduled)</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">প্রকাশের তারিখ ও সময়</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full text-xs p-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Category & Subcategory */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              বিভাগ ও উপ-বিভাগ (Taxonomy)
            </h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">প্রধান বিভাগ *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nameBn} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">উপ-বিভাগ (Subcategory)</label>
              <input
                type="text"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                placeholder="উদাঃ যোগাযোগ ও অবকাঠামো"
                className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          {/* Featured Image Picker */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              প্রধান ফিচার্ড ছবি (Featured Image)
            </h3>

            <div className="aspect-16/10 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <img
                src={featuredImage}
                alt="Featured Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">ইমেজ ইউআরএল (URL)</label>
              <input
                type="text"
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">ছবির ক্যাপশন</label>
              <input
                type="text"
                value={imageCaption}
                onChange={e => setImageCaption(e.target.value)}
                placeholder="ছবির বর্ণনা..."
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">ফটোগ্রাফার / সূত্র ক্রেডিট</label>
              <input
                type="text"
                value={imageCredit}
                onChange={e => setImageCredit(e.target.value)}
                placeholder="দেশরিপোর্ট আলোকচিত্রী"
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          {/* Editorial Display Options */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              সম্পাদকীয় অগ্রাধিকার (Editorial Flags)
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeaturedHero}
                  onChange={e => setIsFeaturedHero(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  হোমপেজ প্রধান হিরো লিড (Main Hero)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSecondaryHero}
                  onChange={e => setIsSecondaryHero(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  সেকেন্ডারি হিরো সংবাদ (Secondary Hero)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={e => setIsBreaking(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  ব্রেকিং নিউজ ট্যাগ সংযুক্ত করুন
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditorsChoice}
                  onChange={e => setIsEditorsChoice(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  সম্পাদকের পছন্দ (Editor's Choice)
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={e => setIsTrending(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  ট্রেন্ডিং তালিকায় প্রদর্শন
                </span>
              </label>
            </div>
          </div>

          {/* Author & Tags */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">লেখক / প্রতিবেদক</label>
              <select
                value={authorId}
                onChange={e => setAuthorId(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">ট্যাগ (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="বাংলাদেশ, উন্নয়ন, জাতীয়"
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
