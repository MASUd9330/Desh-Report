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
  AlertCircle
} from 'lucide-react';

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
  const [imageCredit, setImageCredit] = useState(existingArticle?.imageCredit || 'DeshReport News');
  const [categoryId, setCategoryId] = useState(existingArticle?.categoryId || 'national');
  const [subcategory, setSubcategory] = useState(existingArticle?.subcategory || '');
  const [authorId, setAuthorId] = useState(existingArticle?.authorId || users[0]?.id);
  const [tags, setTags] = useState(existingArticle?.tags?.join(', ') || 'Bangladesh, National');
  const [source, setSource] = useState(existingArticle?.source || 'Staff Reporter, Dhaka');
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

  useEffect(() => {
    if (!existingArticle && title) {
      setSlug(generateSlug(title));
    }
  }, [title, existingArticle]);

  const handleCancel = () => {
    try {
      localStorage.removeItem('deshreport_editing_id');
    } catch (_) {}
    setAdminSection('news', 'all');
  };

  const handleSave = (saveStatus?: NewsStatus) => {
    setErrorMessage(null);
    if (!title.trim()) {
      setErrorMessage('Please enter an article headline before saving.');
      return;
    }

    const currentStatus = saveStatus || status;
    const cleanTags = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const articleData: Partial<Article> = {
      title: title.trim(),
      slug: slug || generateSlug(title),
      subtitle: subtitle.trim(),
      content,
      summary: summary.trim() || content.slice(0, 160) + '...',
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim(),
      imageCredit: imageCredit.trim(),
      categoryId,
      subcategory: subcategory.trim(),
      authorId,
      authorName: users.find(u => u.id === authorId)?.name || 'Staff Reporter',
      tags: cleanTags,
      source: source.trim(),
      sourceUrl: sourceUrl.trim(),
      status: currentStatus,
      scheduledAt: currentStatus === 'scheduled' ? scheduledAt : undefined,
      isFeaturedHero,
      isSecondaryHero,
      isBreaking,
      isTrending,
      isEditorsChoice,
      seoTitle: seoTitle || `${title} | DeshReport`,
      metaDescription: metaDescription || summary || title,
      focusKeyword: focusKeyword.trim(),
      canonicalUrl: canonicalUrl || `https://deshreport.com/article/${slug || generateSlug(title)}`
    };

    if (existingArticle) {
      updateArticle(existingArticle.id, articleData);
      setNotification('Article report updated successfully!');
    } else {
      const created = addArticle(articleData);
      setNotification('New article created and saved successfully!');
      try {
        localStorage.setItem('deshreport_editing_id', created.id);
      } catch (_) {}
    }

    setTimeout(() => {
      setNotification(null);
    }, 4000);
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
        <div className="flex items-center gap-2">
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

      {/* Notifications */}
      {errorMessage && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/60 border border-red-500 text-red-800 dark:text-red-300 rounded-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

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
