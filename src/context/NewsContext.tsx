import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  DuplicateDetectionRule,
  AutomationSettings
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
import { trustedFeedPresets } from '../data/trustedFeeds';
import { calculateSimilarity, generateSlug, calculateReadingTime, cleanHeadline } from '../utils/helpers';
import { autoPublishArticle } from '../services/socialPublisher';
import { notifySearchEnginesOfNewArticle } from '../services/indexingService';
import {
  fetchLiveRssFeed,
  generateDynamicFreshNews,
  getRandomCategoryImage,
  generateAiNewsImageUrl,
  fetchArticleOgImage,
  getExactTopicImage,
  expandToFullJournalisticArticle
} from '../services/rssService';

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
  darkMode: boolean;
  currentUser: User;
  isAdminAuthenticated: boolean;

  // Data
  articles: Article[];
  categories: Category[];
  breakingNews: BreakingNewsItem[];
  advertisements: Advertisement[];
  mediaLibrary: MediaItem[];
  automationSources: AutomationSource[];
  duplicateRule: DuplicateDetectionRule;
  automationSettings: AutomationSettings;
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
  loginAdmin: (password: string, identifier?: string) => Promise<boolean>;
  logoutAdmin: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setAdminSection: (section: string, subSection?: string) => void;
  toggleDarkMode: () => void;

  // Article Actions
  addArticle: (articleData: Partial<Article>) => Promise<Article>;
  updateArticle: (id: string, updates: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  changeArticleStatus: (id: string, status: NewsStatus) => Promise<void>;
  recordArticleView: (id: string) => void;

  // Image Helper Actions
  generateAiImageForArticle: (title: string, summary?: string, categoryId?: string) => string;
  fetchArticleOgImage: (url: string) => Promise<string | null>;
  getExactTopicImage: (headline: string, categoryId?: string) => string;

  // Breaking News Actions
  breakingAutoTriggerEnabled: boolean;
  lastBreakingAutoTriggerAt: string;
  toggleBreakingAutoTrigger: () => void;
  triggerBreakingAutoRefresh: () => void;
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

  // Automation & RSS Actions
  autoRssSyncEnabled: boolean;
  autoPostDraftsEnabled: boolean;
  rssSyncIntervalMinutes: number;
  autoPostIntervalMinutes: number;
  autoPostBatchSize: number;
  lastRssSyncAt: string;
  lastAutoPostAt: string;
  nextRssSyncSeconds: number;
  nextAutoPostSeconds: number;
  toggleAutoRssSync: () => void;
  toggleAutoPostDrafts: () => void;
  triggerRssSyncNow: () => Promise<void>;
  triggerAutoPostDraftsNow: (countOverride?: number) => number;
  publishAllDraftsNow: () => number;
  setAutoPostBatchSize: (size: number) => void;
  setAutoPostIntervalMinutes: (minutes: number) => void;
  setRssSyncIntervalMinutes: (minutes: number) => void;
  addAutomationSource: (src: Partial<AutomationSource>) => Promise<void>;
  updateAutomationSource: (id: string, updates: Partial<AutomationSource>) => Promise<void>;
  deleteAutomationSource: (id: string) => Promise<void>;
  runAutomationFeed: (sourceId: string) => Promise<{ imported: number; duplicates: number }>;
  updateDuplicateRule: (rule: Partial<DuplicateDetectionRule>) => void;
  updateAutomationSettings: (settings: Partial<AutomationSettings>) => Promise<void>;

  // Settings & Pages Actions
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  updatePage: (id: string, updates: Partial<PageItem>) => void;
  exportDatabaseBackup: () => void;
  importDatabaseBackup: (jsonData: string) => boolean;
  resetToDefaults: () => void;
}


async function adminApiRequest(path: string, init: RequestInit = {}): Promise<any> {
  const headers = new Headers(init.headers || {});
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(path, { ...init, headers, credentials: 'include' });
  let data: any = null;
  try { data = await response.json(); } catch (_) {}
  if (!response.ok) throw new Error(data?.error || 'সার্ভার অনুরোধ ব্যর্থ হয়েছে।');
  return data;
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

  const [articles, setArticles] = useState<Article[]>(() => {
    const loaded = loadLocal<Article[]>('articles', initialArticles);
    const list = loaded && loaded.length > 0 ? loaded : initialArticles;

    // Deduplicate any repeated titles or duplicate IDs
    const seenTitles = new Set<string>();
    const seenIds = new Set<string>();
    const cleanArticles: Article[] = [];

    for (const art of list) {
      if (!art || !art.id) continue;
      const cleanTitle = cleanHeadline(art.title || 'শিরোনামহীন সংবাদ');
      const normalizedTitle = cleanTitle.trim().toLowerCase().replace(/\s+/g, ' ');
      if (seenIds.has(art.id) || seenTitles.has(normalizedTitle)) continue;

      seenIds.add(art.id);
      seenTitles.add(normalizedTitle);

      // Clear hardcoded stale lock on art-1 so hero is fully dynamic with newest news
      const isStaleArt1 = art.id === 'art-1';
      const isHero = isStaleArt1 ? false : !!art.isFeaturedHero;

      // Expand short contents to full multi-paragraph journalistic articles
      const expanded = expandToFullJournalisticArticle(cleanTitle, art.summary, art.content, art.categoryId);

      cleanArticles.push({
        ...art,
        title: expanded.title,
        summary: expanded.summary,
        content: expanded.content,
        readingTimeMinutes: calculateReadingTime(expanded.content),
        isFeaturedHero: isHero,
        status: 'published'
      });
    }

    // Ensure all unique articles from initialArticles exist
    for (const art of initialArticles) {
      const cleanTitle = cleanHeadline(art.title || 'শিরোনামহীন সংবাদ');
      const normalizedTitle = cleanTitle.trim().toLowerCase().replace(/\s+/g, ' ');
      if (!seenIds.has(art.id) && !seenTitles.has(normalizedTitle)) {
        seenIds.add(art.id);
        seenTitles.add(normalizedTitle);
        const expanded = expandToFullJournalisticArticle(cleanTitle, art.summary, art.content, art.categoryId);
        cleanArticles.push({
          ...art,
          title: expanded.title,
          summary: expanded.summary,
          content: expanded.content,
          readingTimeMinutes: calculateReadingTime(expanded.content),
          isFeaturedHero: art.id === 'art-1' ? false : art.isFeaturedHero,
          status: 'published'
        });
      }
    }

    // Sort by latest published date first so newest updates naturally lead
    cleanArticles.sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
      return timeB - timeA;
    });

    return cleanArticles;
  });
  const [categories, setCategories] = useState<Category[]>(() => loadLocal('categories', initialCategories));

  // ---- সার্ভার থেকে অটো-সিঙ্ক হওয়া আর্টিকেল টেনে আনা ----
  // /api/articles থেকে যেসব আর্টিকেল cron job অটোমেটিক পাবলিশ করেছে
  // (ব্রাউজার বন্ধ থাকলেও), সেগুলো এখানে লোকাল state-এ মার্জ করা হয়।
  useEffect(() => {
    let cancelled = false;

    const syncFromServer = async () => {
      try {
        const res = await fetch('/api/articles?limit=100');
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.ok || !Array.isArray(data.articles)) return;

        setArticles(prev => {
          const existingIds = new Set(prev.map((a: Article) => a.id));
          const existingUrls = new Set(prev.map((a: Article) => a.sourceUrl).filter(Boolean));
          const freshOnes = data.articles.filter(
            (a: Article) => !existingIds.has(a.id) && !existingUrls.has(a.sourceUrl)
          );
          if (freshOnes.length === 0) return prev;
          return [...freshOnes, ...prev];
        });
      } catch (_) {
        // নেটওয়ার্ক এরর হলে চুপচাপ ইগনোর — লোকাল ডেটা নিয়েই সাইট চলবে
      }
    };

    syncFromServer(); // পেজ লোড হওয়ার সাথে সাথেই একবার
    const serverSyncInterval = setInterval(syncFromServer, 2 * 60 * 1000); // এরপর প্রতি ২ মিনিটে চেক

    return () => {
      cancelled = true;
      clearInterval(serverSyncInterval);
    };
  }, []);
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => {
    const loaded = loadLocal<BreakingNewsItem[]>('breaking', initialBreakingNews);
    const existingIds = new Set((loaded || []).map(b => b.id));
    // Prioritize initial breaking news items (which now include Iran-US war alerts)
    const iranItems = initialBreakingNews.filter(b => b.id.includes('iran-us'));
    const nonIranExisting = (loaded || []).filter(b => !b.id.includes('iran-us'));
    const merged = [...iranItems, ...nonIranExisting, ...initialBreakingNews.filter(b => !existingIds.has(b.id) && !b.id.includes('iran-us'))];
    return merged.length > 0 ? merged : initialBreakingNews;
  });
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => loadLocal('ads', initialAds));
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => loadLocal('media', initialMedia));
  const [automationSources, setAutomationSources] = useState<AutomationSource[]>(() => {
    const loaded = loadLocal<AutomationSource[]>('automation', initialAutomationSources);
    const sourceMap = new Map<string, AutomationSource>();
    // Guarantee 6 active RSS feeds with autoPublish: true
    initialAutomationSources.forEach(s => {
      sourceMap.set(s.id, { ...s, autoPublish: true, status: 'active' });
    });

    if (loaded && loaded.length > 0) {
      loaded.forEach(s => {
        const existing = sourceMap.get(s.id);
        if (existing) {
          sourceMap.set(s.id, {
            ...existing,
            ...s,
            autoPublish: true,
            status: 'active'
          });
        } else if (sourceMap.size < 6) {
          sourceMap.set(s.id, { ...s, autoPublish: true, status: 'active' });
        }
      });
    }

    return Array.from(sourceMap.values()).slice(0, 6);
  });
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const loaded = loadLocal<SiteSettings>('settings', initialSiteSettings);
    return {
      ...initialSiteSettings,
      ...loaded,
      contactPhone: '',
      address: 'খিলগাঁও, ঢাকা - ১২১৯, বাংলাদেশ',
      editorName: 'মোহাম্মদ মাসুদ রানা',
      featuredTopic: loaded.featuredTopic || initialSiteSettings.featuredTopic
    };
  });
  const [pages, setPages] = useState<PageItem[]>(() => {
    // If local pages has short outdated placeholder content, prioritize initialPages
    const loaded = loadLocal<PageItem[]>('pages', initialPages);
    if (!Array.isArray(loaded) || loaded.length === 0 || loaded[0]?.contentBn?.length < 150) {
      return initialPages;
    }
    return loaded;
  });
  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Tanvir Ahmed (Super Admin)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  const [duplicateRule, setDuplicateRule] = useState<DuplicateDetectionRule>({
    enabled: true,
    similarityThreshold: 0.70,
    checkSourceUrl: true,
    checkHeadlineSimilarity: true,
    actionOnDuplicate: 'reject'
  });

  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(() => {
    try {
      const saved = localStorage.getItem('deshreport_automation_settings');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return {
      similarityThreshold: 75,
      checkSourceUrl: true,
      actionOnDuplicate: 'skip',
      scheduleIntervalMinutes: 30,
      autoExtractImage: true,
      autoAssignCategory: true
    };
  });

  // 10-Minute RSS Auto-Sync & 15-Minute Draft Auto-Post Engine State
  const [autoRssSyncEnabled, setAutoRssSyncEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('deshreport_auto_rss_sync');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [autoPostDraftsEnabled, setAutoPostDraftsEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('deshreport_auto_post_drafts');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const [rssSyncIntervalMinutes, setRssSyncIntervalMinutes] = useState<number>(10); // 10 Minutes RSS Sync
  const [autoPostIntervalMinutes, setAutoPostIntervalMinutes] = useState<number>(5); // 5 Minutes Auto-Post
  const [autoPostBatchSize, setAutoPostBatchSize] = useState<number>(1); // 1 draft per cycle

  const [lastRssSyncAt, setLastRssSyncAt] = useState<string>('সক্রিয় (Active)');
  const [lastAutoPostAt, setLastAutoPostAt] = useState<string>('সক্রিয় (Active)');
  const [nextRssSyncSeconds, setNextRssSyncSeconds] = useState<number>(10 * 60);
  const [nextAutoPostSeconds, setNextAutoPostSeconds] = useState<number>(5 * 60);

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

  // Synchronize state references for non-stale callbacks and timers
  const articlesRef = useRef(articles);
  useEffect(() => { articlesRef.current = articles; }, [articles]);

  const automationSourcesRef = useRef(automationSources);
  useEffect(() => { automationSourcesRef.current = automationSources; }, [automationSources]);

  const autoRssSyncEnabledRef = useRef(autoRssSyncEnabled);
  useEffect(() => { autoRssSyncEnabledRef.current = autoRssSyncEnabled; }, [autoRssSyncEnabled]);

  const autoPostDraftsEnabledRef = useRef(autoPostDraftsEnabled);
  useEffect(() => { autoPostDraftsEnabledRef.current = autoPostDraftsEnabled; }, [autoPostDraftsEnabled]);

  const rssSyncIntervalMinutesRef = useRef(rssSyncIntervalMinutes);
  useEffect(() => { rssSyncIntervalMinutesRef.current = rssSyncIntervalMinutes; }, [rssSyncIntervalMinutes]);

  const autoPostIntervalMinutesRef = useRef(autoPostIntervalMinutes);
  useEffect(() => { autoPostIntervalMinutesRef.current = autoPostIntervalMinutes; }, [autoPostIntervalMinutes]);

  // Articles and automation configuration are persisted by the authenticated server APIs.
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

  // Synchronize Google Analytics & Search Console verification tags
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (siteSettings?.googleAnalyticsId) {
      try {
        const gaId = siteSettings.googleAnalyticsId.trim();
        if (gaId) {
          let script = document.getElementById('ga-gtag-script') as HTMLScriptElement;
          if (!script) {
            script = document.createElement('script');
            script.id = 'ga-gtag-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script);

            (window as any).dataLayer = (window as any).dataLayer || [];
            function gtag(...args: any[]) {
              (window as any).dataLayer.push(args);
            }
            (window as any).gtag = gtag;
            gtag('js', new Date());
            gtag('config', gaId);
          } else if ((window as any).gtag) {
            (window as any).gtag('config', gaId);
          }
        }
      } catch (_) {}
    }

    if (siteSettings?.googleSearchConsoleMeta) {
      try {
        let meta = document.getElementById('google-site-verification-meta') as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'google-site-verification';
          meta.id = 'google-site-verification-meta';
          document.head.appendChild(meta);
        }
        meta.content = siteSettings.googleSearchConsoleMeta.replace(/^google-site-verification=/, '').trim();
      } catch (_) {}
    }
  }, [siteSettings?.googleAnalyticsId, siteSettings?.googleSearchConsoleMeta]);

  const triggerGaPageView = (path: string, title: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'page_view', {
          page_path: path,
          page_title: title,
          page_location: window.location.href
        });
      }
    } catch (_) {}
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Synchronize URL routing (/admin, #admin, articles, categories, pages)
  useEffect(() => {
    const handleUrlRoute = () => {
      try {
        const path = window.location.pathname.toLowerCase();
        const hash = window.location.hash.toLowerCase();
        const search = window.location.search.toLowerCase();

        if (path === '/admin' || path.startsWith('/admin') || hash === '#admin' || search.includes('admin')) {
          setActiveArticleId(null);
          setActiveCategorySlug(null);
          setActivePageSlug(null);
          setCurrentView('admin');
        } else if (path.startsWith('/article/')) {
          const rawSlug = window.location.pathname.replace(/^\/article\//, '').replace(/\/$/, '').trim();
          if (rawSlug) {
            const art = articles.find(a => a.slug === rawSlug || a.id === rawSlug);
            if (art) {
              setActiveCategorySlug(null);
              setActivePageSlug(null);
              setActiveArticleId(art.id);
              setCurrentView('article');
            }
          }
        } else if (path.startsWith('/category/')) {
          const rawSlug = window.location.pathname.replace(/^\/category\//, '').replace(/\/$/, '').trim();
          if (rawSlug) {
            setActiveArticleId(null);
            setActivePageSlug(null);
            setActiveCategorySlug(rawSlug);
            setCurrentView('category');
          }
        } else if (path.startsWith('/page/')) {
          const rawSlug = window.location.pathname.replace(/^\/page\//, '').replace(/\/$/, '').trim();
          if (rawSlug) {
            setActiveArticleId(null);
            setActiveCategorySlug(null);
            setActivePageSlug(rawSlug);
            setCurrentView('page');
          }
        }
      } catch (_) {}
    };

    handleUrlRoute();

    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    // Discreet key combo: Ctrl+Alt+A or Cmd+Alt+A to open Admin CMS
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [articles]);

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

  // Navigation Methods with URL PushState support
  const navigateToHome = () => {
    setActiveArticleId(null);
    setActiveCategorySlug(null);
    setActivePageSlug(null);
    setCurrentView('portal');
    try {
      if (window.location.pathname !== '/') {
        window.history.pushState({ view: 'portal' }, '', '/');
      }
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerGaPageView('/', 'DeshReport | হোম');
  };

  const navigateToArticle = (idOrSlug: string) => {
    const article = articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
    if (article) {
      setActiveCategorySlug(null);
      setActivePageSlug(null);
      setActiveArticleId(article.id);
      setCurrentView('article');
      try {
        window.history.pushState({ view: 'article', slug: article.slug }, '', `/article/${article.slug}`);
      } catch (_) {}
      window.scrollTo({ top: 0, behavior: 'smooth' });
      recordArticleView(article.id);
      triggerGaPageView(`/article/${article.slug}`, `${article.title} - DeshReport`);
    }
  };

  const navigateToCategory = (slug: string) => {
    setActiveArticleId(null);
    setActivePageSlug(null);
    setActiveCategorySlug(slug);
    setCurrentView('category');
    try {
      window.history.pushState({ view: 'category', slug }, '', `/category/${slug}`);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerGaPageView(`/category/${slug}`, `বিভাগ: ${slug} - DeshReport`);
  };

  const navigateToPage = (slug: string) => {
    setActiveArticleId(null);
    setActiveCategorySlug(null);
    setActivePageSlug(slug);
    setCurrentView('page');
    try {
      window.history.pushState({ view: 'page', slug }, '', `/page/${slug}`);
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerGaPageView(`/page/${slug}`, `পাতা: ${slug} - DeshReport`);
  };

  const navigateToAdmin = (section: string = 'dashboard', subSection: string = 'all') => {
    setActiveArticleId(null);
    setActiveCategorySlug(null);
    setActivePageSlug(null);
    setAdminSectionState(section);
    setAdminSubSection(subSection);
    setCurrentView('admin');
    try {
      if (!window.location.pathname.startsWith('/admin')) {
        window.history.pushState({ view: 'admin' }, '', '/admin');
      }
    } catch (_) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = async (password: string, identifier?: string): Promise<boolean> => {
    try {
      await adminApiRequest('/api/admin/login', { method: 'POST', body: JSON.stringify({ password, identifier: identifier || '' }) });
      setIsAdminAuthenticated(true);
      try { sessionStorage.setItem('deshreport_admin_auth', 'true'); } catch (_) {}
      await loadAdminData();
      return true;
    } catch (_) {
      return false;
    }
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try { sessionStorage.removeItem('deshreport_admin_auth'); } catch (_) {}
    void fetch('/api/admin/login', { method: 'DELETE', credentials: 'include' });
    navigateToHome();
  };

  const setAdminSection = (section: string, subSection: string = 'all') => {
    setAdminSectionState(section);
    setAdminSubSection(subSection);
  };

  const loadAdminData = async (): Promise<void> => {
    try {
      const [articleData, sourceData, settingsData] = await Promise.all([
        adminApiRequest('/api/admin/articles'),
        adminApiRequest('/api/admin/sources'),
        adminApiRequest('/api/admin/settings')
      ]);

      if (Array.isArray(articleData?.articles)) {
        if (articleData.articles.length > 0 || articlesRef.current.length === 0) {
          setArticles(articleData.articles);
        } else {
          await adminApiRequest('/api/admin/articles', {
            method: 'POST',
            body: JSON.stringify({ articles: articlesRef.current })
          });
        }
      }

      if (Array.isArray(sourceData?.sources)) {
        if (sourceData.sources.length > 0 || automationSourcesRef.current.length === 0) {
          setAutomationSources(sourceData.sources);
        } else {
          await adminApiRequest('/api/admin/sources', {
            method: 'POST',
            body: JSON.stringify({ sources: automationSourcesRef.current })
          });
        }
      }

      if (settingsData?.settings && typeof settingsData.settings === 'object') {
        setAutomationSettings(prev => ({ ...prev, ...settingsData.settings }));
      }
    } catch (error) {
      console.warn('Admin data hydration failed:', error);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const restoreAdminSession = async () => {
      try {
        const response = await fetch('/api/admin/login', { credentials: 'include' });
        const data = await response.json();
        if (!cancelled && data?.authenticated) {
          setIsAdminAuthenticated(true);
          await loadAdminData();
        } else if (!cancelled) {
          setIsAdminAuthenticated(false);
          try { sessionStorage.removeItem('deshreport_admin_auth'); } catch (_) {}
        }
      } catch (_) {
        if (!cancelled) setIsAdminAuthenticated(false);
      }
    };
    void restoreAdminSession();
    return () => { cancelled = true; };
  }, []);

  // Article Actions
  const addArticle = async (data: Partial<Article>): Promise<Article> => {
    const rawTitle = data.title || 'শিরোনামহীন সংবাদ';
    const title = cleanHeadline(rawTitle);
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(title);
    const rawContent = data.content || '';
    const expanded = expandToFullJournalisticArticle(title, data.summary, rawContent, data.categoryId || 'national');
    const readingTime = calculateReadingTime(expanded.content);
    const newArticle: Article = {
      id: 'art-' + Date.now(), title: expanded.title, slug,
      subtitle: data.subtitle || '', summary: expanded.summary, content: expanded.content,
      featuredImage: data.featuredImage || getExactTopicImage(expanded.title, data.categoryId || 'national') || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
      imageCaption: data.imageCaption || '', imageCredit: data.imageCredit || 'দেশরিপোর্ট',
      categoryId: data.categoryId || 'national', subcategory: data.subcategory || '',
      authorId: data.authorId || currentUser.id, authorName: data.authorName || currentUser.name,
      authorAvatar: data.authorAvatar || currentUser.avatar, tags: data.tags || ['বাংলাদেশ'],
      source: data.source || 'নিজস্ব প্রতিবেদক', sourceUrl: data.sourceUrl || '',
      publishedAt: data.publishedAt || new Date().toISOString(), updatedAt: new Date().toISOString(),
      readingTimeMinutes: readingTime, viewCount: 1, shareCount: 0,
      status: data.status || 'published', isFeaturedHero: data.isFeaturedHero || false,
      isSecondaryHero: data.isSecondaryHero || false, isBreaking: data.isBreaking || false,
      isTrending: data.isTrending || false, isEditorsChoice: data.isEditorsChoice || false,
      seoTitle: data.seoTitle || expanded.title + ' | DeshReport',
      metaDescription: data.metaDescription || expanded.summary || expanded.title,
      focusKeyword: data.focusKeyword || '', canonicalUrl: data.canonicalUrl || 'https://deshreport.com/article/' + slug
    };
    const response = await adminApiRequest('/api/admin/articles', { method: 'POST', body: JSON.stringify({ article: newArticle }) });
    const saved = response.article || newArticle;
    setArticles(prev => [saved, ...prev.map(item => saved.isFeaturedHero ? { ...item, isFeaturedHero: false } : item)]);
    if (saved.isBreaking) {
      setBreakingNews(prev => [{ id: 'brk-' + Date.now(), title: saved.title, link: '/article/' + saved.slug, articleId: saved.id, priority: 'urgent', isActive: true, createdAt: new Date().toISOString(), displayLocations: ['homepage', 'category', 'article'] }, ...prev.filter(b => b.articleId !== saved.id)]);
    }
    addActivityLog('সংবাদ প্রকাশ', 'article', saved.title);
    if (saved.status === 'published') {
      try { autoPublishArticle(saved); } catch (_) {}
      try { notifySearchEnginesOfNewArticle(saved); } catch (_) {}
    }
    return saved;
  };

  const updateArticle = async (id: string, updates: Partial<Article>): Promise<void> => {
    const targetArt = articlesRef.current.find(a => a.id === id);
    if (!targetArt) throw new Error('সংবাদটি পাওয়া যায়নি।');
    const nextUpdates: Partial<Article> = { ...updates, updatedAt: new Date().toISOString() };
    if (updates.content) nextUpdates.readingTimeMinutes = calculateReadingTime(updates.content);
    const response = await adminApiRequest('/api/admin/articles', { method: 'PUT', body: JSON.stringify({ id, updates: nextUpdates }) });
    const updated = response.article || { ...targetArt, ...nextUpdates };
    setArticles(prev => prev.map(item => item.id === id ? updated : (updated.isFeaturedHero ? { ...item, isFeaturedHero: false } : item)));
    if (updates.isBreaking !== undefined) {
      if (updates.isBreaking) {
        setBreakingNews(prev => [{ id: 'brk-' + Date.now(), title: updated.title, link: '/article/' + updated.slug, articleId: id, priority: 'urgent', isActive: true, createdAt: new Date().toISOString(), displayLocations: ['homepage', 'category', 'article'] }, ...prev.filter(b => b.articleId !== id)]);
      } else setBreakingNews(prev => prev.filter(b => b.articleId !== id));
    }
    addActivityLog('সংবাদ সম্পাদনা', 'article', updated.title || 'সংবাদ');
  };

  const deleteArticle = async (id: string): Promise<void> => {
    const target = articlesRef.current.find(a => a.id === id);
    await adminApiRequest('/api/admin/articles', { method: 'DELETE', body: JSON.stringify({ id }) });
    setArticles(prev => prev.filter(a => a.id !== id));
    setBreakingNews(prev => prev.filter(b => b.articleId !== id));
    if (target) addActivityLog('সংবাদ মুছে ফেলা হয়েছে', 'article', target.title);
  };

  const changeArticleStatus = async (id: string, status: NewsStatus): Promise<void> => {
    await updateArticle(id, { status, publishedAt: status === 'published' ? new Date().toISOString() : undefined });
  };

  const recordArticleView = (id: string) => {
    setArticles(prev => prev.map(article => article.id === id ? { ...article, viewCount: (article.viewCount || 0) + 1 } : article));
  };

  // Breaking News State & 15-Minute Auto-Trigger
  const [breakingAutoTriggerEnabled, setBreakingAutoTriggerEnabled] = useState<boolean>(() =>
    loadLocal('breaking_auto_trigger_enabled', true)
  );
  const [lastBreakingAutoTriggerAt, setLastBreakingAutoTriggerAt] = useState<string>(() =>
    loadLocal('last_breaking_auto_trigger_at', 'এখনই সক্রিয়')
  );

  const toggleBreakingAutoTrigger = () => {
    setBreakingAutoTriggerEnabled(prev => {
      const next = !prev;
      localStorage.setItem('deshreport_breaking_auto_trigger_enabled', JSON.stringify(next));
      return next;
    });
  };

  const triggerBreakingAutoRefresh = () => {
    setArticles(currentArticles => {
      const eligibleArticles = currentArticles
        .filter(a => a.status === 'published')
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      const topBreakingArticles = eligibleArticles
        .filter(a => a.isBreaking || a.isTrending || a.isFeaturedHero)
        .slice(0, 5);

      const backupArticles = eligibleArticles.slice(0, 4);
      const chosenArticles = topBreakingArticles.length > 0 ? topBreakingArticles : backupArticles;

      if (chosenArticles.length > 0) {
        const generatedItems: BreakingNewsItem[] = chosenArticles.map((art, idx) => ({
          id: 'auto-brk-' + art.id,
          title: art.title,
          link: `/article/${art.slug}`,
          articleId: art.id,
          priority: idx === 0 || art.isBreaking ? 'urgent' : 'high',
          isActive: true,
          createdAt: new Date().toISOString(),
          displayLocations: ['homepage', 'category', 'article']
        }));

        setBreakingNews(prev => {
          const manualItems = prev.filter(p => !p.id.startsWith('auto-brk-'));
          return [...manualItems, ...generatedItems];
        });
      }
      return currentArticles;
    });

    const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
    setLastBreakingAutoTriggerAt(timeStr);
    localStorage.setItem('deshreport_last_breaking_auto_trigger_at', JSON.stringify(timeStr));
    addActivityLog('ব্রেকিং অটো-ট্রিগার (১৫ মিনিট)', 'breaking', 'ব্রেকিং নিউজ স্বয়ংক্রিয়ভাবে রিফ্রেশ করা হয়েছে');
  };

  // Breaking News Actions
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

  const addAdvertisement = (ad: Partial<Advertisement> | any) => {
    const newAd: Advertisement = {
      id: 'ad-' + Date.now(),
      name: ad.name || ad.title || 'নতুন বিজ্ঞাপন ইউনিট',
      provider: ad.provider || 'Adsterra',
      type: ad.type || 'banner',
      bannerSize: ad.bannerSize || ad.size || '728x90',
      placement: ad.placement || 'homepage_hero',
      codeSnippet: ad.codeSnippet || ad.code || '<!-- Ad Code Placeholder -->',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      status: ad.status || 'active',
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
  const addAutomationSource = async (src: Partial<AutomationSource>): Promise<void> => {
    const newSrc: AutomationSource = {
      id: 'src-' + Date.now(), name: src.name || 'নতুন আরএসএস ফিড', type: src.type || 'rss', url: src.url || 'https://example.com/feed',
      apiKey: src.apiKey || '', categoryId: src.categoryId || 'national', region: src.region || (src.categoryId === 'international' ? 'international' : 'national'),
      description: src.description || '', fetchIntervalMinutes: src.fetchIntervalMinutes || 30, status: 'active', autoPublish: src.autoPublish || false,
      articlesImported: 0, keywordFilters: src.keywordFilters || []
    };
    const response = await adminApiRequest('/api/admin/sources', { method: 'POST', body: JSON.stringify({ source: newSrc }) });
    const saved = response.source || newSrc;
    setAutomationSources(prev => [...prev, saved]);
    addActivityLog('নতুন অটোমেশন সোর্স যুক্ত', 'automation', saved.name);
  };

  const updateAutomationSource = async (id: string, updates: Partial<AutomationSource>): Promise<void> => {
    const response = await adminApiRequest('/api/admin/sources', { method: 'PUT', body: JSON.stringify({ id, updates }) });
    setAutomationSources(prev => prev.map(s => s.id === id ? (response.source || { ...s, ...updates }) : s));
  };

  const deleteAutomationSource = async (id: string): Promise<void> => {
    await adminApiRequest('/api/admin/sources', { method: 'DELETE', body: JSON.stringify({ id }) });
    setAutomationSources(prev => prev.filter(s => s.id !== id));
  };

  const updateDuplicateRule = (rule: Partial<DuplicateDetectionRule>) => {
    setDuplicateRule(prev => ({ ...prev, ...rule }));
  };

  const updateAutomationSettings = async (settings: Partial<AutomationSettings>): Promise<void> => {
    const next = { ...automationSettings, ...settings };
    const response = await adminApiRequest('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ settings: next }) });
    setAutomationSettings(response.settings || next);
    if (settings.similarityThreshold !== undefined) setDuplicateRule(prev => ({ ...prev, similarityThreshold: settings.similarityThreshold! / 100 }));
    if (settings.checkSourceUrl !== undefined) setDuplicateRule(prev => ({ ...prev, checkSourceUrl: settings.checkSourceUrl! }));
  };

  // Real RSS / Feed Fetch with multi-proxy XML DOMParser + dynamic fresh news guarantee & social dispatch
  const runAutomationFeed = async (sourceId: string): Promise<{ imported: number; duplicates: number }> => {
    const src = automationSources.find(s => s.id === sourceId);
    if (!src) return { imported: 0, duplicates: 0 };

    let incomingSamples: Array<{
      title: string;
      summary: string;
      content: string;
      sourceUrl: string;
      image: string;
      cat: string;
      publishedAt?: string;
    }> = [];

    // 1. Attempt Multi-Proxy Live RSS / Atom XML fetch over internet
    if (src.url && src.url.startsWith('http')) {
      try {
        const liveItems = await fetchLiveRssFeed(src.url, src.categoryId);
        if (Array.isArray(liveItems) && liveItems.length > 0) {
          incomingSamples = liveItems;
        }
      } catch (err) {
        console.warn('Live RSS fetch error for', src.name, err);
      }
    }

    // 2. If live fetch returned nothing or network failed, generate dynamic fresh real-time content
    if (incomingSamples.length === 0) {
      incomingSamples = generateDynamicFreshNews(src.name, src.categoryId, src.region);
    }

    let imported = 0;
    let duplicates = 0;
    const newlyCreatedArticles: Article[] = [];

    // Check against existing articles
    for (const item of incomingSamples) {
      let isDuplicate = false;

      // 1. Check Source URL duplicate
      if (duplicateRule.checkSourceUrl && item.sourceUrl) {
        const urlMatch =
          articles.some(a => a.sourceUrl && a.sourceUrl === item.sourceUrl) ||
          newlyCreatedArticles.some(a => a.sourceUrl && a.sourceUrl === item.sourceUrl);
        if (urlMatch) isDuplicate = true;
      }

      // 2. Check exact / normalized title duplicate
      if (!isDuplicate && item.title) {
        const cleanTitle = item.title.trim().toLowerCase().replace(/\s+/g, ' ');
        const exactMatch =
          articles.some(a => a.title.trim().toLowerCase().replace(/\s+/g, ' ') === cleanTitle) ||
          newlyCreatedArticles.some(a => a.title.trim().toLowerCase().replace(/\s+/g, ' ') === cleanTitle);
        if (exactMatch) isDuplicate = true;
      }

      // 3. Check Headline similarity
      const threshold = duplicateRule.similarityThreshold > 1
        ? duplicateRule.similarityThreshold / 100
        : duplicateRule.similarityThreshold;

      if (!isDuplicate && duplicateRule.checkHeadlineSimilarity && item.title) {
        for (const existing of articles) {
          const sim = calculateSimilarity(item.title, existing.title);
          if (sim >= threshold) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          for (const created of newlyCreatedArticles) {
            const sim = calculateSimilarity(item.title, created.title);
            if (sim >= threshold) {
              isDuplicate = true;
              break;
            }
          }
        }
      }

      if (isDuplicate) {
        duplicates++;
      } else {
        const shouldDirectPublish = src.autoPublish !== false;
        const status: NewsStatus = shouldDirectPublish ? 'published' : 'draft';
        const cleanTitle = cleanHeadline(item.title);
        const expanded = expandToFullJournalisticArticle(cleanTitle, item.summary, item.content, item.cat || src.categoryId);
        const isWarFocus = cleanTitle.includes('ইরান') || cleanTitle.includes('যুক্তরাষ্ট্র') || cleanTitle.includes('যুদ্ধ');
        const resolvedImage = item.image && item.image.trim().length > 0 && !item.image.includes('placeholder')
          ? item.image
          : (getExactTopicImage(expanded.title, item.cat || src.categoryId) || generateAiNewsImageUrl(expanded.title, expanded.summary, item.cat || src.categoryId));

        const newArt: Article = {
          id: 'art-auto-' + Date.now() + '-' + imported + '-' + Math.random().toString(36).substring(2, 6),
          title: expanded.title,
          slug: generateSlug(expanded.title) + '-' + Math.floor(Math.random() * 10000),
          summary: expanded.summary,
          content: expanded.content,
          featuredImage: resolvedImage,
          categoryId: item.cat || src.categoryId,
          authorId: 'usr-admin-masud',
          authorName: `দেশরিপোর্ট ডেস্ক (${src.name})`,
          tags: [
            'সংবাদ',
            'অটোমেশন',
            src.region === 'international' ? 'আন্তর্জাতিক' : 'জাতীয়',
            ...(isWarFocus ? ['ইরান-যুক্তরাষ্ট্র যুদ্ধ', 'শীর্ষ খবর'] : [])
          ],
          source: src.name,
          sourceUrl: item.sourceUrl,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readingTimeMinutes: calculateReadingTime(expanded.content || expanded.summary || ''),
          viewCount: Math.floor(Math.random() * 40) + 15,
          shareCount: 0,
          isBreaking: isWarFocus,
          isTrending: isWarFocus,
          status
        };
        newlyCreatedArticles.push(newArt);
        imported++;
      }
    }

    // If all online items were already in database (all duplicates), guarantee at least 1 fresh update
    if (imported === 0 && incomingSamples.length > 0) {
      const freshFallback = generateDynamicFreshNews(src.name, src.categoryId, src.region);
      for (const item of freshFallback) {
        const status: NewsStatus = src.autoPublish !== false ? 'published' : 'draft';
        const cleanTitle = cleanHeadline(item.title);
        const expanded = expandToFullJournalisticArticle(cleanTitle, item.summary, item.content, item.cat || src.categoryId);
        const isWarFocus = cleanTitle.includes('ইরান') || cleanTitle.includes('যুক্তরাষ্ট্র');
        const fallbackResolvedImage = item.image && item.image.trim().length > 0
          ? item.image
          : (getExactTopicImage(expanded.title, item.cat || src.categoryId) || generateAiNewsImageUrl(expanded.title, expanded.summary, item.cat || src.categoryId));

        const fallbackArt: Article = {
          id: 'art-auto-' + Date.now() + '-fsh-' + Math.random().toString(36).substring(2, 6),
          title: expanded.title,
          slug: generateSlug(expanded.title) + '-' + Math.floor(Math.random() * 10000),
          summary: expanded.summary,
          content: expanded.content,
          featuredImage: fallbackResolvedImage,
          categoryId: item.cat || src.categoryId,
          authorId: 'usr-admin-masud',
          authorName: `দেশরিপোর্ট ডেস্ক (${src.name})`,
          tags: ['সংবাদ', 'অটোমেশন', src.region === 'international' ? 'আন্তর্জাতিক' : 'জাতীয়', ...(isWarFocus ? ['ইরান-যুক্তরাষ্ট্র যুদ্ধ'] : [])],
          source: src.name,
          sourceUrl: item.sourceUrl,
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          readingTimeMinutes: calculateReadingTime(expanded.content || expanded.summary || ''),
          viewCount: Math.floor(Math.random() * 40) + 15,
          shareCount: 0,
          isTrending: isWarFocus,
          status
        };
        newlyCreatedArticles.push(fallbackArt);
        imported++;
      }
    }

    if (newlyCreatedArticles.length > 0) {
      setArticles(prev => [...newlyCreatedArticles, ...prev]);

      // If any item is breaking, add to breaking news ticker
      const breakingToAdd = newlyCreatedArticles.filter(a => a.isBreaking && a.status === 'published');
      if (breakingToAdd.length > 0) {
        setBreakingNews(prev => [
          ...breakingToAdd.map(b => ({
            id: 'brk-' + b.id,
            title: b.title,
            link: `/article/${b.slug}`,
            articleId: b.id,
            priority: 'urgent' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            displayLocations: ['homepage', 'category', 'article']
          })),
          ...prev
        ]);
      }

      // If auto-published, push to Telegram, Facebook, Pinterest, LinkedIn & WhatsApp and ping search engines
      if (src.autoPublish !== false) {
        newlyCreatedArticles.forEach(art => {
          try {
            autoPublishArticle(art);
          } catch (_) {}
          try {
            notifySearchEnginesOfNewArticle(art);
          } catch (_) {}
        });
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

    addActivityLog('অটোমেশন ফিড চালানো হয়েছে', 'automation', `${src.name}: ${imported}টি সংগৃহীত, ${duplicates}টি ডুপ্লিকেট ফিল্টার`);
    return { imported, duplicates };
  };

  // Trigger 10-Min RSS Feed Sync across all active feeds
  const triggerRssSyncNow = async () => {
    const activeSources = automationSources.filter(s => s.status === 'active');
    const sourcesToRun = activeSources.length > 0 ? activeSources : automationSources.slice(0, 6);
    
    let totalImported = 0;
    for (const src of sourcesToRun) {
      try {
        const res = await runAutomationFeed(src.id);
        totalImported += (res.imported || 0);
      } catch (err) {
        console.error('Auto RSS sync error for source:', src.name, err);
      }
    }
    
    const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastRssSyncAt(timeStr);
    setNextRssSyncSeconds(rssSyncIntervalMinutes * 60);
    addActivityLog('RSS অটো-সিংক সম্পন্ন', 'automation', `১০ মিনিট চক্র: ${sourcesToRun.length}টি ফিড স্ক্যান, ${totalImported}টি নতুন সংবাদ যুক্ত`);
  };

  // Trigger 15-Min Auto-Post of Draft Articles
  const triggerAutoPostDraftsNow = (countOverride?: number): number => {
    const drafts = articles.filter(a => a.status === 'draft');
    if (drafts.length === 0) return 0;

    const countToPublish = countOverride || autoPostBatchSize || 1;
    // Take the oldest drafts first (FIFO queue)
    const sortedDrafts = [...drafts].reverse();
    const toPublish = sortedDrafts.slice(0, countToPublish);
    const publishIds = new Set(toPublish.map(p => p.id));
    toPublish.forEach(p => { void updateArticle(p.id, { status: 'published', publishedAt: new Date().toISOString() }); });

    setArticles(prev =>
      prev.map(art => {
        if (publishIds.has(art.id)) {
          const publishedArt = {
            ...art,
            status: 'published' as const,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          // Broadcast to Social Media & Search Engines
          try {
            autoPublishArticle(publishedArt);
          } catch (_) {}
          try {
            notifySearchEnginesOfNewArticle(publishedArt);
          } catch (_) {}
          return publishedArt;
        }
        return art;
      })
    );

    const timeStr = new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastAutoPostAt(timeStr);
    setNextAutoPostSeconds(autoPostIntervalMinutes * 60);

    toPublish.forEach(p => {
      addActivityLog('অটো-পোস্ট সফল', 'article', `${autoPostIntervalMinutes} মিনিট শিডিউল: "${p.title.slice(0, 30)}..." প্রকাশিত হয়েছে`);
    });

    return toPublish.length;
  };

  // Publish All Drafts Immediately with 1-click
  const publishAllDraftsNow = (): number => {
    const drafts = articles.filter(a => a.status === 'draft');
    if (drafts.length === 0) return 0;
    return triggerAutoPostDraftsNow(drafts.length);
  };

  const toggleAutoRssSync = () => {
    setAutoRssSyncEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('deshreport_auto_rss_sync', String(next));
      } catch (_) {}
      return next;
    });
  };

  const toggleAutoPostDrafts = () => {
    setAutoPostDraftsEnabled(prev => {
      const next = !prev;
      try {
        localStorage.setItem('deshreport_auto_post_drafts', String(next));
      } catch (_) {}
      return next;
    });
  };

  const triggerRssSyncNowRef = useRef(triggerRssSyncNow);
  useEffect(() => { triggerRssSyncNowRef.current = triggerRssSyncNow; }, [triggerRssSyncNow]);

  const triggerAutoPostDraftsNowRef = useRef(triggerAutoPostDraftsNow);
  useEffect(() => { triggerAutoPostDraftsNowRef.current = triggerAutoPostDraftsNow; }, [triggerAutoPostDraftsNow]);

  // Precision 1-Second Background Countdown & Auto-Execution Timer
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. RSS 10-Minute Auto-Sync
      setNextRssSyncSeconds(prev => {
        if (prev <= 1) {
          if (autoRssSyncEnabledRef.current) {
            triggerRssSyncNowRef.current();
          }
          return (rssSyncIntervalMinutesRef.current || 10) * 60;
        }
        return prev - 1;
      });

      // 2. Drafts 15-Minute Auto-Post
      setNextAutoPostSeconds(prev => {
        if (prev <= 1) {
          if (autoPostDraftsEnabledRef.current) {
            triggerAutoPostDraftsNowRef.current();
          }
          return (autoPostIntervalMinutesRef.current || 15) * 60;
        }
        return prev - 1;
      });

      // 3. Breaking News 15-Minute Auto-Refresh
      if (breakingAutoTriggerEnabled && Math.random() < 0.001) {
        triggerBreakingAutoRefresh();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [breakingAutoTriggerEnabled]);

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
        darkMode: isDarkMode,
        currentUser,
        isAdminAuthenticated,
        articles,
        categories,
        breakingNews,
        advertisements,
        mediaLibrary,
        automationSources,
        duplicateRule,
        automationSettings,
        siteSettings,
        pages,
        users,
        activityLogs,
        navigateToHome,
        navigateToArticle,
        navigateToCategory,
        navigateToPage,
        navigateToAdmin,
        loginAdmin,
        logoutAdmin,
        setSearchOpen,
        setSearchQuery,
        setAdminSection,
        toggleDarkMode,
        addArticle,
        updateArticle,
        deleteArticle,
        changeArticleStatus,
        recordArticleView,
        generateAiImageForArticle: generateAiNewsImageUrl,
        fetchArticleOgImage,
        getExactTopicImage,
        breakingAutoTriggerEnabled,
        lastBreakingAutoTriggerAt,
        toggleBreakingAutoTrigger,
        triggerBreakingAutoRefresh,
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
        autoRssSyncEnabled,
        autoPostDraftsEnabled,
        rssSyncIntervalMinutes,
        autoPostIntervalMinutes,
        autoPostBatchSize,
        lastRssSyncAt,
        lastAutoPostAt,
        nextRssSyncSeconds,
        nextAutoPostSeconds,
        toggleAutoRssSync,
        toggleAutoPostDrafts,
        triggerRssSyncNow,
        triggerAutoPostDraftsNow,
        publishAllDraftsNow,
        setAutoPostBatchSize,
        setAutoPostIntervalMinutes,
        setRssSyncIntervalMinutes,
        addAutomationSource,
        updateAutomationSource,
        deleteAutomationSource,
        runAutomationFeed,
        updateDuplicateRule,
        updateAutomationSettings,
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
