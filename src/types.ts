export type NewsStatus = 'published' | 'draft' | 'scheduled' | 'trash';

export type UserRole = 'super_admin' | 'editor' | 'author' | 'moderator';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  title: string;
  articlesCount: number;
  status: 'active' | 'inactive';
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  description?: string;
  order: number;
  color?: string;
  isActive: boolean;
  articleCount?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  summary: string;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  categoryId: string;
  subcategory?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  tags: string[];
  source?: string;
  sourceUrl?: string;
  publishedAt: string;
  updatedAt: string;
  scheduledAt?: string;
  readingTimeMinutes: number;
  viewCount: number;
  shareCount: number;
  status: NewsStatus;
  isFeaturedHero?: boolean;
  isSecondaryHero?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  isEditorsChoice?: boolean;
  seoTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
}

export interface BreakingNewsItem {
  id: string;
  title: string;
  link?: string;
  articleId?: string;
  priority: 'urgent' | 'high' | 'normal';
  isActive: boolean;
  createdAt: string;
  scheduledEnd?: string;
  displayLocations: ('homepage' | 'category' | 'article')[];
}

export type AdType = 'banner' | 'social_bar' | 'popunder' | 'native';
export type AdPlacement = 
  | 'header'
  | 'below_header'
  | 'below_breaking'
  | 'homepage_hero'
  | 'between_cards'
  | 'before_article'
  | 'after_first_paragraph'
  | 'middle_article'
  | 'after_article'
  | 'sidebar'
  | 'category_page'
  | 'footer';

export interface Advertisement {
  id: string;
  name: string;
  provider: 'Adsterra' | 'Google AdSense' | 'Direct Sponsor' | 'Custom Script';
  type: AdType;
  bannerSize?: '728x90' | '970x90' | '300x250' | '336x280' | '320x50' | '300x600';
  placement: AdPlacement;
  codeSnippet: string;
  imageUrl?: string;
  targetUrl?: string;
  status: 'active' | 'paused';
  device: 'all' | 'desktop' | 'mobile';
  priority: number;
  impressions: number;
  clicks: number;
  popunderFrequencyHours?: number;
}

export interface MediaItem {
  id: string;
  filename: string;
  title: string;
  url: string;
  format: 'jpg' | 'png' | 'webp' | 'avif';
  sizeKb: number;
  dimensions: string;
  uploadedAt: string;
  altText: string;
  caption?: string;
}

export interface AutomationSource {
  id: string;
  name: string;
  type: 'rss' | 'news_api' | 'json';
  url: string;
  apiKey?: string;
  categoryId: string;
  fetchIntervalMinutes: number;
  status: 'active' | 'paused';
  autoPublish: boolean;
  lastFetchedAt?: string;
  articlesImported: number;
  keywordFilters?: string[];
  region?: 'national' | 'international';
  description?: string;
  logo?: string;
}

export interface DuplicateDetectionRule {
  enabled: boolean;
  similarityThreshold: number; // 0.1 to 1.0 (e.g. 0.75)
  checkSourceUrl: boolean;
  checkHeadlineSimilarity: boolean;
  actionOnDuplicate: 'reject' | 'mark_duplicate_draft';
}

export interface AutomationSettings {
  similarityThreshold: number;
  checkSourceUrl: boolean;
  actionOnDuplicate: 'skip' | 'flag' | 'overwrite';
  scheduleIntervalMinutes: number;
  autoExtractImage: boolean;
  autoAssignCategory: boolean;
}

export interface SiteSettings {
  siteName: string;
  taglineBn: string;
  taglineEn: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  editorName?: string;
  facebookUrl: string;
  telegramUrl: string;
  youtubeUrl: string;
  xUrl: string;
  whatsappNumber: string;
  googleAnalyticsId: string;
  googleSearchConsoleMeta: string;
  googleSearchConsoleCode?: string;
  tagline?: string;
  contactAddress?: string;
  description?: string;
  copyrightBn: string;
  timezone: string;
  defaultLanguage: 'bn' | 'en';
  theme: 'light' | 'dark' | 'system';
  customHeaderCode?: string;
  customFooterCode?: string;
  newsletterEnabled: boolean;
  readerRevenueManagerEnabled?: boolean;
  readerRevenuePublicationId?: string;
  readerRevenuePromptType?: 'contributions' | 'subscriptions' | 'newsletter';
  readerRevenueCustomSnippet?: string;
}

export interface PageItem {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  contentBn: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

export type StaticPage = PageItem;

export interface ActivityLog {
  id: string;
  userName: string;
  action: string;
  entityType: 'article' | 'breaking' | 'ad' | 'category' | 'automation' | 'settings';
  entityTitle: string;
  timestamp: string;
}
