import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Article,
  Category,
  BreakingNewsItem,
  Advertisement,
  MediaItem,
  AutomationSource,
  User,
  SiteSettings,
  PageItem,
  ActivityLog,
  NewsStatus,
  DuplicateDetectionRule
} from '../types';
import {
  initialArticles,
  initialCategories,
  initialBreakingNews,
  initialAds,
  initialMedia,
  initialAutomationSources,
  initialSiteSettings,
  initialPages,
  initialUsers
} from '../data/initialData';
import { calculateSimilarity, generateSlug, calculateReadingTime } from '../utils/helpers';

interface NewsContextType {
  // Navigation & State
  currentView: 'portal' | 'article' | 'category' | 'page' | 'admin';
  activeArticleId: string | null;
  activeCategorySlug: string | null;
  activePageSlug: string | null;
  adminSection: string;
  adminSubSection: string;
  searchOpen: boolean;
  searchQuery: string;
  isDarkMode: boolean;
  currentUser: User;

  // Data
  articles: Article[];
  categories: Category[];
  breakingNews: BreakingNewsItem[];
  advertisements: Advertisement[];
  mediaLibrary: MediaItem[];
  automationSources: AutomationSource[];
  duplicateRule: DuplicateDetectionRule;
  siteSettings: SiteSettings;
  pages: PageItem[];
  users: User[];
  activityLogs: ActivityLog[];

  // Navigation Methods
  navigateToHome: () => void;
  navigateToArticle: (idOrSlug: string) => void;
  navigateToCategory: (slug: string) => void;
  navigateToPage: (slug: string) => void;
  navigateToAdmin: (section?: string, subSection?: string) => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setAdminSection: (section: string, subSection?: string) => void;
  toggleDarkMode: () => void;

  // Article Actions
  addArticle: (articleData: Partial<Article>) => Article;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  changeArticleStatus: (id: string, status: NewsStatus) => void;
  recordArticleView: (id: string) => void;

  // Breaking News Actions
  addBreakingNews: (item: Partial<BreakingNewsItem>) => void;
  updateBreakingNews: (id: string, updates: Partial<BreakingNewsItem>) => void;
  deleteBreakingNews: (id: string) => void;
  toggleBreakingNews: (id: string) => void;

  // Ad Actions
  updateAdvertisement: (id: string, updates: Partial<Advertisement>) => void;
  toggleAdStatus: (id: string) => void;
  addAdvertisement: (ad: Partial<Advertisement>) => void;

  // Category Actions
  addCategory: (category: Partial<Category>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Media Actions
  addMediaItem: (item: Partial<MediaItem>) => void;
  deleteMediaItem: (id: string) => void;

  // Automation Actions
  addAutomationSource: (src: Partial<AutomationSource>) => void;
  updateAutomationSource: (id: string, updates: Partial<AutomationSource>) => void;
  deleteAutomationSource: (id: string) => void;
  runAutomationFeed: (sourceId: string) => Promise<{ imported: number; duplicates: number }>;
  updateDuplicateRule: (rule: Partial<DuplicateDetectionRule>) => void;

  // Settings & Pages Actions
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updatePage: (id: string, updates: Partial<PageItem>) => void;
  exportDatabaseBackup: () => void;
  importDatabaseBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence initializer
  const loadLocal = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(`deshreport_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  // State
  const [currentView, setCurrentView] = useState<'portal' | 'article' | 'category' | 'page' | 'admin'>('portal');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [activePageSlug, setActivePageSlug] = useState<string | null>(null);
  const [adminSection, setAdminSectionState] = useState<string>('dashboard');
  const [adminSubSection, setAdminSubSection] = useState<string>('all');
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('deshreport_theme') === 'dark';
  });

  const [articles, setArticles] = useState<Article[]>(() => loadLocal('articles', initialArticles));
  const [categories, setCategories] = useState<Category[]>(() => loadLocal('categories', initialCategories));
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => loadLocal('breaking', initialBreakingNews));
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => loadLocal('ads', initialAds));
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => loadLocal('media', initialMedia));
  const [automationSources, setAutomationSources] = useState<AutomationSource[]>(() => loadLocal('automation', initialAutomationSources));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => loadLocal('settings', initialSiteSettings));
  const [pages, setPages] = useState<PageItem[]>(() => loadLocal('pages', initialPages));
  const [users] = useState<User[]>(initialUsers);
  const [currentUser] = useState<User>(initialUsers[0]); // Default Tanvir Ahmed (Super Admin)

  const [duplicateRule, setDuplicateRule] = useState<DuplicateDetectionRule>({
    enabled: true,
    similarityThreshold: 0.70,
    checkSourceUrl: true,
    checkHeadlineSimilarity: true,
    actionOnDuplicate: 'reject'
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-1',
      userName: 'তানভীর আহমেদ',
      action: 'প্রকাশিত',
      entityType: 'article',
      entityTitle: 'মেট্রোরেলের নতুন রুটের কাজ দ্রুত এগিয়ে চলছে',
      timestamp: 'আজ সকাল ১০:৪৫'
    },
    {
      id: 'log-2',
      userName: 'ফারহানা ইসলাম',
      action: 'আপডেট',
      entityType: 'breaking',
      entityTitle: 'গণপরিবহনে শৃঙ্খলা ফেরাতে টাস্কফোর্স',
      timestamp: 'আজ সকাল ১০:৩০'
    },
    {
      id: 'log-3',
      userName: 'সিস্টেম অটোমেশন',
      action: 'ফিড সংগ্রহ',
      entityType: 'automation',
      entityTitle: 'BSS News RSS Feed সিঙ্ক সম্পন্ন',
      timestamp: 'আজ সকাল ১০:১৫'
    }
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('deshreport_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('deshreport_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('deshreport_breaking', JSON.stringify(breakingNews));
  }, [breakingNews]);

  useEffect(() => {
    localStorage.setItem('deshreport_ads', JSON.stringify(advertisements));
  }, [advertisements]);

  useEffect(() => {
    localStorage.setItem('deshreport_media', JSON.stringify(mediaLibrary));
  }, [mediaLibrary]);

  useEffect(() => {
    localStorage.setItem('deshreport_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('deshreport_pages', JSON.stringify(pages));
  }, [pages]);

  // Handle Dark mode class on root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('deshreport_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('deshreport_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addActivityLog = (action: string, entityType: ActivityLog['entityType'], entityTitle: string) => {
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      userName: currentUser.name,
      action,
      entityType,
      entityTitle,
      timestamp: 'এইমাত্র'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  // Navigation Methods
  const navigateToHome = () => {
    setCurrentView('portal');
    setActiveArticleId(null);
    setActiveCategorySlug(null);
    setActivePageSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToArticle = (idOrSlug: string) => {
    const article = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (article) {
      setActiveArticleId(article.id);
      setCurrentView('article');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      recordArticleView(article.id);
    }
  };

  const navigateToCategory = (slug: string) => {
    setActiveCategorySlug(slug);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPage = (slug: string) => {
    setActivePageSlug(slug);
    setCurrentView('page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToAdmin = (section: string = 'dashboard', subSection: string = 'all') => {
    setAdminSectionState(section);
    setAdminSubSection(subSection);
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setAdminSection = (section: string, subSection: string = 'all') => {
    setAdminSectionState(section);
    setAdminSubSection(subSection);
  };

  // Article Actions
  const addArticle = (data: Partial<Article>): Article => {
    const title = data.title || 'শিরোনামহীন সংবাদ';
    const slug = data.slug || generateSlug(title);
    const content = data.content || '';
    const readingTime = calculateReadingTime(content);

    const newArticle: Article = {
      id: 'art-' + Date.now(),
      title,
      slug,
      subtitle: data.subtitle || '',
      summary: data.summary || content.slice(0, 150) + '...',
      content,
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      imageCaption: data.imageCaption || '',
      imageCredit: data.imageCredit || 'দেশরিপোর্ট',
      categoryId: data.categoryId || 'national',
      subcategory: data.subcategory || '',
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      tags: data.tags || ['বাংলাদেশ'],
      source: data.source || 'নিজস্ব প্রতিবেদক',
      sourceUrl: data.sourceUrl || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      readingTimeMinutes: readingTime,
      viewCount: 1,
      shareCount: 0,
      status: data.status || 'published',
      isFeaturedHero: data.isFeaturedHero || false,
      isSecondaryHero: data.isSecondaryHero || false,
      isBreaking: data.isBreaking || false,
      isTrending: data.isTrending || false,
      isEditorsChoice: data.isEditorsChoice || false,
      seoTitle: data.seoTitle || `${title} | DeshReport`,
      metaDescription: data.metaDescription || (data.summary || title),
      focusKeyword: data.focusKeyword || '',
      canonicalUrl: data.canonicalUrl || `https://deshreport.com/article/${slug}`
    };

    // If marked as Hero, toggle others
    if (newArticle.isFeaturedHero) {
      setArticles(prev => prev.map(a => ({ ...a, isFeaturedHero: false })));
    }

    setArticles(prev => [newArticle, ...prev]);
    addActivityLog('সংবাদ প্রকাশ', 'article', newArticle.title);
    return newArticle;
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          if (updates.content) {
            updated.readingTimeMinutes = calculateReadingTime(updates.content);
          }
          return updated;
        }
        if (updates.isFeaturedHero && item.id !== id) {
          return { ...item, isFeaturedHero: false };
        }
        return item;
      })
    );
    addActivityLog('সংবাদ সম্পাদনা', 'article', updates.title || 'সংবাদ');
  };

  const deleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    if (target) {
      addActivityLog('সংবাদ মুছে ফেলা হয়েছে', 'article', target.title);
    }
  };

  const changeArticleStatus = (id: string, status: NewsStatus) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
  };

  const recordArticleView = (id: string) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, viewCount: a.viewCount + 1 } : a))
    );
  };

  // Breaking News
  const addBreakingNews = (item: Partial<BreakingNewsItem>) => {
    const newItem: BreakingNewsItem = {
      id: 'brk-' + Date.now(),
      title: item.title || 'ব্রেকিং নিউজ শিরোনাম',
      link: item.link || '',
      articleId: item.articleId || '',
      priority: item.priority || 'normal',
      isActive: true,
      createdAt: new Date().toISOString(),
      displayLocations: item.displayLocations || ['homepage', 'category', 'article']
    };
    setBreakingNews(prev => [newItem, ...prev]);
    addActivityLog('ব্রেকিং নিউজ যুক্ত', 'breaking', newItem.title);
  };

  const updateBreakingNews = (id: string, updates: Partial<BreakingNewsItem>) => {
    setBreakingNews(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const deleteBreakingNews = (id: string) => {
    setBreakingNews(prev => prev.filter(b => b.id !== id));
    addActivityLog('ব্রেকিং নিউজ বাতিল', 'breaking', 'আইটেম');
  };

  const toggleBreakingNews = (id: string) => {
    setBreakingNews(prev =>
      prev.map(b => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  // Advertisements
  const updateAdvertisement = (id: string, updates: Partial<Advertisement>) => {
    setAdvertisements(prev =>
      prev.map(ad => (ad.id === id ? { ...ad, ...updates } : ad))
    );
    addActivityLog('বিজ্ঞাপন কনফিগারেশন আপডেট', 'ad', updates.name || id);
  };

  const toggleAdStatus = (id: string) => {
    setAdvertisements(prev =>
      prev.map(ad => (ad.id === id ? { ...ad, status: ad.status === 'active' ? 'paused' : 'active' } : ad))
    );
  };

  const addAdvertisement = (ad: Partial<Advertisement>) => {
    const newAd: Advertisement = {
      id: 'ad-' + Date.now(),
      name: ad.name || 'নতুন বিজ্ঞাপন ইউনিট',
      provider: ad.provider || 'Adsterra',
      type: ad.type || 'banner',
      bannerSize: ad.bannerSize || '728x90',
      placement: ad.placement || 'homepage_hero',
      codeSnippet: ad.codeSnippet || '<!-- Ad Code Placeholder -->',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      status: 'active',
      device: ad.device || 'all',
      priority: ad.priority || 1,
      impressions: 0,
      clicks: 0
    };
    setAdvertisements(prev => [...prev, newAd]);
    addActivityLog('নতুন বিজ্ঞাপন স্লট তৈরি', 'ad', newAd.name);
  };

  // Categories
  const addCategory = (category: Partial<Category>) => {
    const newCat: Category = {
      id: generateSlug(category.nameEn || category.nameBn || 'category-' + Date.now()),
      nameBn: category.nameBn || 'নতুন বিভাগ',
      nameEn: category.nameEn || 'Category',
      slug: generateSlug(category.slug || category.nameEn || 'category'),
      order: categories.length + 1,
      color: category.color || '#c00612',
      isActive: true,
      articleCount: 0
    };
    setCategories(prev => [...prev, newCat]);
    addActivityLog('নতুন বিভাগ তৈরি', 'category', newCat.nameBn);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  // Media
  const addMediaItem = (item: Partial<MediaItem>) => {
    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      filename: item.filename || 'image.webp',
      title: item.title || 'মিডিয়া ফাইল',
      url: item.url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
      format: item.format || 'webp',
      sizeKb: item.sizeKb || 150,
      dimensions: item.dimensions || '1920x1080',
      uploadedAt: new Date().toISOString().split('T')[0],
      altText: item.altText || item.title || 'দেশরিপোর্ট ছবি',
      caption: item.caption || ''
    };
    setMediaLibrary(prev => [newItem, ...prev]);
  };

  const deleteMediaItem = (id: string) => {
    setMediaLibrary(prev => prev.filter(m => m.id !== id));
  };

  // Automation
  const addAutomationSource = (src: Partial<AutomationSource>) => {
    const newSrc: AutomationSource = {
      id: 'src-' + Date.now(),
      name: src.name || 'নতুন আরএসএস ফিড',
      type: src.type || 'rss',
      url: src.url || 'https://example.com/feed',
      apiKey: src.apiKey || '',
      categoryId: src.categoryId || 'national',
      fetchIntervalMinutes: src.fetchIntervalMinutes || 60,
      status: 'active',
      autoPublish: src.autoPublish || false,
      articlesImported: 0
    };
    setAutomationSources(prev => [...prev, newSrc]);
    addActivityLog('নতুন অটোমেশন সোর্স যুক্ত', 'automation', newSrc.name);
  };

  const updateAutomationSource = (id: string, updates: Partial<AutomationSource>) => {
    setAutomationSources(prev =>
      prev.map(s => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteAutomationSource = (id: string) => {
    setAutomationSources(prev => prev.filter(s => s.id !== id));
  };

  const updateDuplicateRule = (rule: Partial<DuplicateDetectionRule>) => {
    setDuplicateRule(prev => ({ ...prev, ...rule }));
  };

  // RSS / News API Fetch simulation with REAL duplicate detection algorithm
  const runAutomationFeed = async (sourceId: string): Promise<{ imported: number; duplicates: number }> => {
    const src = automationSources.find(s => s.id === sourceId);
    if (!src) return { imported: 0, duplicates: 0 };

    // Authentic mock feed samples incoming from external RSS / Wire
    const incomingSamples = [
      {
        title: 'বাংলাদেশ ব্যাংকের বৈদেশিক মুদ্রার রিজার্ভ ফের ২০ বিলিয়ন ডলার অতিক্রম করল',
        summary: 'প্রবাসী আয়ের ইতিবাচক প্রবৃদ্ধি ও রপ্তানি আয়ের প্রভাবে রিজার্ভের পরিমাণ বৃদ্ধি পেয়েছে বলে জানিয়েছে কেন্দ্রীয় ব্যাংক।',
        content: 'বাংলাদেশ ব্যাংকের গভর্নর আজ সাংবাদিকদের ব্রিফিংকালে জানান, ব্যাংক চ্যানেলে রেমিট্যান্স আসার হার গত দুই মাসে রেকর্ড পরিমাণ বৃদ্ধি পেয়েছে। এর ফলে বৈদেশিক মুদ্রার রিজার্ভ ফের ২০ বিলিয়ন ডলার অতিক্রম করে স্থিতিশীল অবস্থানে ফিরেছে।',
        sourceUrl: 'https://bssnews.net/economy/forex-20b',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=80',
        cat: src.categoryId
      },
      {
        title: 'চট্টগ্রাম বন্দরে আধুনিক স্বয়ংক্রিয় স্ক্যানার স্থাপন, কন্টেইনার খালাসে নতুন গতি',
        summary: 'পণ্য খালাসের গতি ত্বরান্বিত করতে এবং শুল্ক ফাঁকি রোধে চট্টগ্রাম বন্দরে চারটি নতুন সর্বাধুনিক স্ক্যানার অপারেশনাল করা হয়েছে।',
        content: 'দেশের প্রধান সমুদ্রবন্দর চট্টগ্রামে আমদানি-রপ্তানি বাণিজ্যের জট নিরসনে কৃত্রিম বুদ্ধিমত্তা চালিত এক্স-রে কনটেইনার স্ক্যানার চালু করা হয়েছে। এর মাধ্যমে দিনে অতিরিক্ত ১ হাজার কন্টেইনার দ্রুত স্ক্যান করে খালাস করা সম্ভব হবে।',
        sourceUrl: 'https://bssnews.net/chittagong-port-scanners-operational',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
        cat: 'business'
      },
      {
        title: 'বিশ্ব পরিবেশ দিবসে দেশজুড়ে ২০ লাখ ফলজ ও বনজ বৃক্ষরোপণের বিশাল কর্মসূচি',
        summary: 'জলবায়ু পরিবর্তনের ঝুঁকি মোকাবিলা ও সবুজায়নের লক্ষ্যে সরকারি ও বেসরকারি উদ্যোগে জাতীয় বৃক্ষরোপণ কর্মসূচি শুরু হচ্ছে।',
        content: 'পরিবেশ, বন ও জলবায়ু পরিবর্তন মন্ত্রণালয় জানিয়েছে, এ বছর উপকূলীয় জেলাগুলোতে ম্যানগ্রোভ বনায়ন এবং বরেন্দ্র অঞ্চলে খরা সহনশীল গাছ রোপণে বিশেষ অগ্রাধিকার দেওয়া হচ্ছে।',
        sourceUrl: 'https://bssnews.net/environment-plantation-campaign',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
        cat: 'national'
      }
    ];

    let imported = 0;
    let duplicates = 0;

    for (const item of incomingSamples) {
      let isDuplicate = false;

      // 1. Check Source URL duplicate
      if (duplicateRule.checkSourceUrl) {
        const urlMatch = articles.some(a => a.sourceUrl && a.sourceUrl === item.sourceUrl);
        if (urlMatch) isDuplicate = true;
      }

      // 2. Check Headline similarity with Levenshtein algorithm
      if (!isDuplicate && duplicateRule.checkHeadlineSimilarity) {
        for (const existing of articles) {
          const sim = calculateSimilarity(item.title, existing.title);
          if (sim >= duplicateRule.similarityThreshold) {
            isDuplicate = true;
            break;
          }
        }
      }

      if (isDuplicate) {
        duplicates++;
      } else {
        const status: NewsStatus = src.autoPublish ? 'published' : 'draft';
        const newArt: Article = {
          id: 'art-auto-' + Date.now() + '-' + imported,
          title: item.title,
          slug: generateSlug(item.title),
          summary: item.summary,
          content: item.content,
          featuredImage: item.image,
          categoryId: item.cat,
          authorId: 'usr-4',
          authorName: 'অটোমেশন বট (RSS Feeder)',
          tags: ['সংবাদ', 'অটোমেশন'],
          source: src.name,
          sourceUrl: item.sourceUrl,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readingTimeMinutes: 2,
          viewCount: 1,
          shareCount: 0,
          status
        };
        setArticles(prev => [newArt, ...prev]);
        imported++;
      }
    }

    // Update source stats
    setAutomationSources(prev =>
      prev.map(s => (s.id === sourceId ? {
        ...s,
        lastFetchedAt: 'এইমাত্র',
        articlesImported: s.articlesImported + imported
      } : s))
    );

    addActivityLog('অটোমেশন ফিড চালানো হয়েছে', 'automation', `${src.name}: ${imported}টি সংগৃহীত, ${duplicates}টি ডুপ্লিকেট বাদ`);
    return { imported, duplicates };
  };

  // Site Settings & Pages
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
    addActivityLog('সাইট সেটিংস হালনাগাদ', 'settings', 'জেনারেল সেটিংস');
  };

  const updatePage = (id: string, updates: Partial<PageItem>) => {
    setPages(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : p))
    );
  };

  // Database Backup Export & Import
  const exportDatabaseBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      siteSettings,
      articles,
      categories,
      breakingNews,
      advertisements,
      mediaLibrary,
      automationSources,
      pages
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `deshreport_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addActivityLog('ডাটাবেজ ব্যাকআপ এক্সপোর্ট', 'settings', 'JSON ব্যাকআপ ডাউনলোড');
  };

  const importDatabaseBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.articles) setArticles(data.articles);
      if (data.categories) setCategories(data.categories);
      if (data.breakingNews) setBreakingNews(data.breakingNews);
      if (data.advertisements) setAdvertisements(data.advertisements);
      if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
      if (data.automationSources) setAutomationSources(data.automationSources);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.pages) setPages(data.pages);
      addActivityLog('ডাটাবেজ ব্যাকআপ রিস্টোর', 'settings', 'JSON ব্যাকআপ থেকে রিস্টোর সম্পন্ন');
      return true;
    } catch (e) {
      console.error('Failed to parse backup JSON', e);
      return false;
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে সকল ডাটামোড রিসেট করে ডিফল্ট অবস্থায় ফিরিয়ে আনতে চান?')) {
      localStorage.clear();
      setArticles(initialArticles);
      setCategories(initialCategories);
      setBreakingNews(initialBreakingNews);
      setAdvertisements(initialAds);
      setMediaLibrary(initialMedia);
      setAutomationSources(initialAutomationSources);
      setSiteSettings(initialSiteSettings);
      setPages(initialPages);
      addActivityLog('ফ্যাক্টরি রিসেট', 'settings', 'সকল তথ্য ডিফল্ট করা হয়েছে');
    }
  };

  return (
    <NewsContext.Provider
      value={{
        currentView,
        activeArticleId,
        activeCategorySlug,
        activePageSlug,
        adminSection,
        adminSubSection,
        searchOpen,
        searchQuery,
        isDarkMode,
        currentUser,
        articles,
        categories,
        breakingNews,
        advertisements,
        mediaLibrary,
        automationSources,
        duplicateRule,
        siteSettings,
        pages,
        users,
        activityLogs,
        navigateToHome,
        navigateToArticle,
        navigateToCategory,
        navigateToPage,
        navigateToAdmin,
        setSearchOpen,
        setSearchQuery,
        setAdminSection,
        toggleDarkMode,
        addArticle,
        updateArticle,
        deleteArticle,
        changeArticleStatus,
        recordArticleView,
        addBreakingNews,
        updateBreakingNews,
        deleteBreakingNews,
        toggleBreakingNews,
        updateAdvertisement,
        toggleAdStatus,
        addAdvertisement,
        addCategory,
        updateCategory,
        deleteCategory,
        addMediaItem,
        deleteMediaItem,
        addAutomationSource,
        updateAutomationSource,
        deleteAutomationSource,
        runAutomationFeed,
        updateDuplicateRule,
        updateSiteSettings,
        updatePage,
        exportDatabaseBackup,
        importDatabaseBackup,
        resetToDefaults
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};
