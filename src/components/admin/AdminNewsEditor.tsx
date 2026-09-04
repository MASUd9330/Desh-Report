import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { Article, NewsStatus } from '../../types';
import { generateSlug, calculateReadingTime } from '../../utils/helpers';
import {
  Save,
  Eye,
  ArrowLeft,
  Check,
  Facebook,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  AlertCircle,
  Send,
  Share2,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import { autoPublishArticle, getStoredSocialConfig } from '../../services/socialPublisher';

export const AdminNewsEditor: React.FC = () => {
  const {
    categories = [],
    users = [],
    addArticle,
    updateArticle,
    articles = [],
    setAdminSection,
    navigateToArticle
  } = useNews();

  // Check if editing an existing article
  const [editingId, setEditingId] = useState<string | null>(() => {
    return typeof window !== 'undefined' ? localStorage.getItem('deshreport_editing_id') : null;
  });

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
  const [imageCredit, setImageCredit] = useState(existingArticle?.imageCredit || 'DeshReport News');
  const [categoryId, setCategoryId] = useState(existingArticle?.categoryId || (categories[0]?.id || 'national'));
  const [subcategory, setSubcategory] = useState(existingArticle?.subcategory || '');
  const [authorId, setAuthorId] = useState(existingArticle?.authorId || users[0]?.id || 'usr-admin-masud');
  const [tags, setTags] = useState(existingArticle?.tags?.join(', ') || 'বাংলাদেশ, জাতীয়');
  const [source, setSource] = useState(existingArticle?.source || 'নিজস্ব প্রতিবেদক, ঢাকা');
  const [sourceUrl, setSourceUrl] = useState(existingArticle?.sourceUrl || '');
  const [status, setStatus] = useState<NewsStatus>(existingArticle?.status || 'published');
  const [scheduledAt, setScheduledAt] = useState(existingArticle?.scheduledAt || '');

  // Editorial Flags
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastSavedArticle, setLastSavedArticle] = useState<{ id: string; slug: string; title: string } | null>(null);

  // Social Auto-Post Options (Telegram & Facebook with Image)
  const [autoPostTelegram, setAutoPostTelegram] = useState(true);
  const [autoPostFacebook, setAutoPostFacebook] = useState(true);
  const [socialPublishing, setSocialPublishing] = useState(false);
  const [socialNotice, setSocialNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!existingArticle && title) {
      setSlug(generateSlug(title));
    }
  }, [title, existingArticle]);

  const handleResetForm = () => {
    try {
      localStorage.removeItem('deshreport_editing_id');
    } catch (_) {}
    setEditingId(null);
    setTitle('');
    setSlug('');
    setSubtitle('');
    setContent('');
    setSummary('');
    setFeaturedImage('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80');
    setImageCaption('');
    setImageCredit('DeshReport News');
    setCategoryId(categories[0]?.id || 'national');
    setSubcategory('');
    setTags('বাংলাদেশ, জাতীয়');
    setSource('নিজস্ব প্রতিবেদক, ঢাকা');
    setSourceUrl('');
    setStatus('published');
    setIsFeaturedHero(false);
    setIsSecondaryHero(false);
    setIsBreaking(false);
    setIsTrending(false);
    setIsEditorsChoice(false);
    setSeoTitle('');
    setMetaDescription('');
    setFocusKeyword('');
    setCanonicalUrl('');
    setErrorMessage(null);
    setNotification(null);
    setLastSavedArticle(null);
  };

  const handleCancel = () => {
    try {
      localStorage.removeItem('deshreport_editing_id');
    } catch (_) {}
    setAdminSection('news', 'all');
  };

  const triggerSocialBroadcast = async (art: { title: string; summary?: string; slug: string; featuredImage?: string }) => {
    if (!autoPostTelegram && !autoPostFacebook) return;
    setSocialPublishing(true);
    try {
      const stored = getStoredSocialConfig();
      const runConfig = {
        ...stored,
        telegramEnabled: autoPostTelegram && stored.telegramEnabled,
        facebookEnabled: autoPostFacebook && stored.facebookEnabled
      };
      const results = await autoPublishArticle(art, runConfig);
      const successful = results.filter(r => r.success).map(r => (r.platform === 'telegram' ? 'টেলিগ্রাম' : 'ফেসবুক'));
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        setSocialNotice(`ছবিসহ সফলভাবে ${successful.join(' এবং ')} চ্যানেলে পোস্ট সম্প্রচারিত হয়েছে!`);
      } else if (failed.length > 0) {
        setSocialNotice(`সোশ্যাল পোস্টের ত্রুটি: ${failed[0].message}`);
      }
    } catch (e: any) {
      setSocialNotice(`সোশ্যাল সংযোগ ত্রুটি: ${e?.message || 'সমস্যা হয়েছে'}`);
    } finally {
      setSocialPublishing(false);
      setTimeout(() => setSocialNotice(null), 6000);
    }
  };

  const handleSave = (saveStatus?: NewsStatus) => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('অনুগ্রহ করে সংবাদের শিরোনাম (Headline) লিখুন।');
      return;
    }

    const currentStatus = saveStatus || status;
    const cleanTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const generatedSlug = generateSlug(title.trim());
    const targetSlug = slug.trim() || generatedSlug || ('news-' + Date.now());

    const articleData: Partial<Article> = {
      title: title.trim(),
      slug: targetSlug,
      subtitle: subtitle.trim(),
      content: content.trim() || summary.trim() || title.trim(),
      summary: summary.trim() || (content.trim() ? content.slice(0, 160) + '...' : title.trim()),
      featuredImage: featuredImage.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      imageCaption: imageCaption.trim(),
      imageCredit: imageCredit.trim(),
      categoryId: categoryId || 'national',
      subcategory: subcategory.trim(),
      authorId: authorId || users[0]?.id || 'usr-admin-masud',
      authorName: users.find(u => u.id === authorId)?.name || 'মোহাম্মদ মাসুদ রানা',
      tags: cleanTags.length > 0 ? cleanTags : ['বাংলাদেশ'],
      source: source.trim() || 'নিজস্ব প্রতিবেদক',
      sourceUrl: sourceUrl.trim(),
      status: currentStatus,
      scheduledAt: currentStatus === 'scheduled' ? scheduledAt : undefined,
      isFeaturedHero,
      isSecondaryHero,
      isBreaking,
      isTrending,
      isEditorsChoice,
      seoTitle: seoTitle.trim() || `${title.trim()} | DeshReport`,
      metaDescription: metaDescription.trim() || summary.trim() || title.trim(),
      focusKeyword: focusKeyword.trim(),
      canonicalUrl: canonicalUrl.trim() || `https://deshreport.vercel.app/article/${targetSlug}`
    };

    if (existingArticle) {
      updateArticle(existingArticle.id, articleData);
      setNotification('সংবাদটি সফলভাবে আপডেট করা হয়েছে!');
      setLastSavedArticle({ id: existingArticle.id, slug: targetSlug, title: title.trim() });
    } else {
      const created = addArticle(articleData);
      setNotification('নতুন সংবাদ সফলভাবে তৈরি ও প্রকাশ করা হয়েছে!');
      setLastSavedArticle({ id: created.id, slug: targetSlug, title: title.trim() });
      try {
        localStorage.removeItem('deshreport_editing_id');
      } catch (_) {}
    }

    // Auto-Post to Telegram and Facebook if published
    if (currentStatus === 'published' && (autoPostTelegram || autoPostFacebook)) {
      triggerSocialBroadcast({
        title: articleData.title!,
        summary: articleData.summary,
        slug: targetSlug,
        featuredImage: articleData.featuredImage
      });
    }

    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent(prev => prev + '\n' + prefix + 'Insert text here' + suffix + '\n');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-lg border border-gray-300 dark:border-slate-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
            title="Back to article list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {existingArticle ? 'Edit Article' : 'Write New Article'}
            </h1>
            <span className="text-xs text-gray-400">
              {existingArticle ? `Article ID: ${existingArticle.id}` : 'Complete editorial information & SEO parameters'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="flex items-center gap-1 px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            title="নতুন সংবাদ লিখতে ফর্ম পরিষ্কার করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>নতুন ফর্ম / ক্লিয়ার</span>
          </button>

          {existingArticle && (
            <button
              type="button"
              onClick={() => navigateToArticle(existingArticle.id)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview Live</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="px-3.5 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-400/40 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Notifications & Quick Post-Save Action Card */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-500 text-red-800 dark:text-red-300 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {lastSavedArticle && (
        <div className="p-4 bg-emerald-50/90 dark:bg-emerald-950/70 border border-emerald-500/80 rounded-xl shadow-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                  {notification || 'সংবাদটি সফলভাবে ডাটাবেজে সংরক্ষিত ও প্রকাশিত হয়েছে!'}
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 line-clamp-1">
                  শিরোনাম: "{lastSavedArticle.title}"
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
            <button
              type="button"
              onClick={handleResetForm}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ আরেকটি নতুন সংবাদ লিখুন</span>
            </button>

            <button
              type="button"
              onClick={() => navigateToArticle(lastSavedArticle.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-slate-700 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>লাইভ সংবাদটি দেখুন</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSection('news', 'all')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-lg text-xs font-medium cursor-pointer"
            >
              <span>সকল সংবাদের তালিকা</span>
            </button>
          </div>
        </div>
      )}

      {socialNotice && (
        <div className="p-3.5 bg-sky-50 dark:bg-sky-950/60 border border-sky-500 text-sky-800 dark:text-sky-300 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
          <Send className="w-4 h-4 text-sky-600 shrink-0" />
          <span>{socialNotice}</span>
        </div>
      )}

      {/* Main Grid: Form Left (8 Cols) + Sidebar Options Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Article Core Fields */}
        <div className="lg:col-span-8 space-y-5">
          {/* Title */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter informative and engaging headline..."
              className="w-full text-base sm:text-lg font-bold px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />

            {/* Slug */}
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span className="shrink-0 font-medium">URL Slug:</span>
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
              Sub-headline / Kicker
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              placeholder="Brief context or key quote..."
              className="w-full text-sm font-medium px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Rich Content Editor with Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200 dark:border-slate-800">
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Article Body Content *
              </label>

              {/* Formatting quick toolbar */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('**', '**')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('*', '*')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('## ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                  title="Heading 2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('> ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                  title="Quote"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('- ')}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 cursor-pointer"
                  title="Bullet list"
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
              placeholder="Write the full news story here..."
              className="w-full text-sm leading-relaxed px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />

            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <span>Estimated Reading Time: {calculateReadingTime(content)} min</span>
              <span>Word Count: {content.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>

          {/* Short Summary */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
              Summary for Grid & Search Snippets
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="2-3 sentence overview shown in homepage cards..."
              className="w-full text-xs font-medium px-3.5 py-2 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* SEO & Social Media Card Preview */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                Search & Facebook OpenGraph Meta
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={e => setSeoTitle(e.target.value)}
                  placeholder={title || 'SEO Title...'}
                  className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Focus Keyword
                </label>
                <input
                  type="text"
                  value={focusKeyword}
                  onChange={e => setFocusKeyword(e.target.value)}
                  placeholder="e.g. Bangladesh Economy"
                  className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
                />
              </div>
            </div>

            {/* Live Facebook Card Mockup */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                <Facebook className="w-3.5 h-3.5 text-blue-600" />
                <span>Social Share Preview (1200x630px Card):</span>
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
                    {seoTitle || title || 'Article Headline'}
                  </h5>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                    {metaDescription || summary || 'Article summary description...'}
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
              Publishing State
            </h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Select Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as NewsStatus)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                <option value="published">Published (Live to public)</option>
                <option value="draft">Draft (Private editorial review)</option>
                <option value="scheduled">Scheduled (Publish at specific time)</option>
              </select>
            </div>

            {status === 'scheduled' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Scheduled Date & Time</label>
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
              Category & Section
            </h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Primary Category *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn || c.nameBn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Subcategory (Optional)</label>
              <input
                type="text"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                placeholder="e.g. Infrastructure, Elections"
                className="w-full text-xs px-3 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          {/* Featured Image Picker */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              Featured Image
            </h3>

            <div className="aspect-16/10 w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
              <img
                src={featuredImage}
                alt="Featured Preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Image URL</label>
              <input
                type="text"
                value={featuredImage}
                onChange={e => setFeaturedImage(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Image Caption</label>
              <input
                type="text"
                value={imageCaption}
                onChange={e => setImageCaption(e.target.value)}
                placeholder="Description of the image..."
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Photographer / Source Credit</label>
              <input
                type="text"
                value={imageCredit}
                onChange={e => setImageCredit(e.target.value)}
                placeholder="DeshReport Photo"
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>

          {/* Editorial Display Options */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-2">
              Editorial Placement Flags
            </h3>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeaturedHero}
                  onChange={e => setIsFeaturedHero(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Homepage Primary Hero Lead
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSecondaryHero}
                  onChange={e => setIsSecondaryHero(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Secondary Hero Spotlight
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={e => setIsBreaking(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Tag as Breaking News
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isEditorsChoice}
                  onChange={e => setIsEditorsChoice(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Editor's Choice Badge
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={e => setIsTrending(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Show in Trending Top List
                </span>
              </label>
            </div>
          </div>

          {/* Social Auto-Post Options (Telegram & Facebook with Image) */}
          <div className="bg-white dark:bg-slate-900 border border-sky-200 dark:border-sky-900/50 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
              <Share2 className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-xs text-gray-900 dark:text-white">
                অটো সোশ্যাল সম্প্রচার (ছবিসহ)
              </h3>
            </div>

            <p className="text-[11px] text-gray-500">
              সংবাদটি পাবলিশ হওয়ার সাথে সাথে স্বয়ংক্রিয়ভাবে ছবি ও লিংকসহ সোশ্যাল চ্যানেলে চলে যাবে:
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPostTelegram}
                  onChange={e => setAutoPostTelegram(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <span className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                  <Send className="w-3.5 h-3.5 text-sky-500" />
                  <span>টেলিগ্রামে ছবিসহ পোস্ট</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPostFacebook}
                  onChange={e => setAutoPostFacebook(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>ফেসবুকে ছবিসহ পোস্ট</span>
                </span>
              </label>
            </div>

            <button
              type="button"
              disabled={socialPublishing || !title.trim()}
              onClick={() =>
                triggerSocialBroadcast({
                  title: title.trim(),
                  summary: summary.trim() || content.slice(0, 160) + '...',
                  slug: slug || generateSlug(title),
                  featuredImage: featuredImage.trim()
                })
              }
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-linear-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer transition-all mt-1"
            >
              {socialPublishing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{socialPublishing ? 'ছবিসহ পাঠানো হচ্ছে...' : 'ছবিসহ এখনই সোশ্যালে পোস্ট করুন'}</span>
            </button>
          </div>

          {/* Author & Tags */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Author / Reporter</label>
              <select
                value={authorId}
                onChange={e => setAuthorId(e.target.value)}
                className="w-full text-xs font-semibold bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg p-2 focus:outline-hidden"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title || u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="Bangladesh, Economy, Politics"
                className="w-full text-xs px-2.5 py-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-lg focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
