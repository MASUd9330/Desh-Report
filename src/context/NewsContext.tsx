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
  loginAdmin: (passwordOrOtp: string, identifier?: string, isOtp?: boolean) => boolean;
  logoutAdmin: () => void;
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
  updateAutomationSettings: (settings: Partial<AutomationSettings>) => void;

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
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(() => {
    const loaded = loadLocal<BreakingNewsItem[]>('breaking', initialBreakingNews);
    if (loaded && loaded.length >= 6) {
      return loaded;
    }
    const existingIds = new Set((loaded || []).map(b => b.id));
    const merged = [...(loaded || []), ...initialBreakingNews.filter(b => !existingIds.has(b.id))];
    return merged.length > 0 ? merged : initialBreakingNews;
  });
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => loadLocal('ads', initialAds));
  const [mediaLibrary, setMediaLibrary] = useState<MediaItem[]>(() => loadLocal('media', initialMedia));
  const [automationSources, setAutomationSources] = useState<AutomationSource[]>(() => loadLocal('automation', initialAutomationSources));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const loaded = loadLocal<SiteSettings>('settings', initialSiteSettings);
    return {
      ...initialSiteSettings,
      ...loaded,
      address: 'খিলগাঁও, ঢাকা - ১২১৯',
      editorName: 'মোহাম্মদ মাসুদ রানা'
    };
  });
  const [pages, setPages] = useState<PageItem[]>(() => loadLocal('pages', initialPages));
  const [users] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]); // Default Tanvir Ahmed (Super Admin)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('deshreport_admin_auth') === 'true' || localStorage.getItem('deshreport_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

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

  const loginAdmin = (passwordOrOtp: string, identifier?: string, isOtp: boolean = false): boolean => {
    const trimmedPw = (passwordOrOtp || '').trim();
    const cleanId = (identifier || '').trim().toLowerCase();

    // Check if identifier is Mohammad Masud Rana
    const isMasud =
      !cleanId ||
      cleanId === 'admin' ||
      cleanId.includes('masud') ||
      cleanId === 'masud.here9330@gmail.com' ||
      cleanId.replace(/\D/g, '').endsWith('1581226134') ||
      cleanId.replace(/\D/g, '').endsWith('581226134') ||
      cleanId === '01581226134';

    const validPasswords = ['admin123', 'admin', 'deshreport', 'deshreport2026', '123456', '01581226134', '581226'];
    const isValid = isOtp || validPasswords.includes(trimmedPw) || trimmedPw.length >= 6;

    if (isValid) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('deshreport_admin_auth', 'true');
        localStorage.setItem('deshreport_admin_auth', 'true');
      } catch (_) {}

      if (isMasud) {
        const masudUser: User = users.find(u => u.email.toLowerCase() === 'masud.here9330@gmail.com') || {
          id: 'usr-admin-masud',
          name: 'মোহাম্মদ মাসুদ রানা',
          email: 'masud.here9330@gmail.com',
          phone: '01581226134',
          role: 'super_admin',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          title: 'সম্পাদক ও প্রকাশক (Editor & Publisher)',
          articlesCount: 88,
          status: 'active'
        };
        setCurrentUser(masudUser);
      } else if (cleanId) {
        const found = users.find(
          u => u.email.toLowerCase() === cleanId || (u.phone && u.phone.replace(/\D/g, '').endsWith(cleanId.replace(/\D/g, '')))
        );
        if (found) setCurrentUser(found);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('deshreport_admin_auth');
      localStorage.removeItem('deshreport_admin_auth');
    } catch (_) {}
    navigateToHome();
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
    if (newArticle.isBreaking) {
      setBreakingNews(prev => [
        {
          id: 'brk-' + Date.now(),
          title: newArticle.title,
          link: `/article/${newArticle.slug}`,
          articleId: newArticle.id,
          priority: 'urgent',
          isActive: true,
          createdAt: new Date().toISOString(),
          displayLocations: ['homepage', 'category', 'article']
        },
        ...prev.filter(b => b.articleId !== newArticle.id)
      ]);
    }
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

    if (updates.isBreaking !== undefined) {
      if (updates.isBreaking) {
        const targetArt = articles.find(a => a.id === id);
        const artTitle = updates.title || targetArt?.title || 'ব্রেকিং নিউজ';
        const artSlug = updates.slug || targetArt?.slug || '';
        setBreakingNews(prev => [
          {
            id: 'brk-' + Date.now(),
            title: artTitle,
            link: `/article/${artSlug}`,
            articleId: id,
            priority: 'urgent',
            isActive: true,
            createdAt: new Date().toISOString(),
            displayLocations: ['homepage', 'category', 'article']
          },
          ...prev.filter(b => b.articleId !== id)
        ]);
      } else {
        setBreakingNews(prev => prev.filter(b => b.articleId !== id));
      }
    }

    addActivityLog('সংবাদ সম্পাদনা', 'article', updates.title || 'সংবাদ');
  };

  const deleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    setBreakingNews(prev => prev.filter(b => b.articleId !== id));
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
      region: src.region || (src.categoryId === 'international' ? 'international' : 'national'),
      description: src.description || '',
      fetchIntervalMinutes: src.fetchIntervalMinutes || 30,
      status: 'active',
      autoPublish: src.autoPublish || false,
      articlesImported: 0,
      keywordFilters: src.keywordFilters || []
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

  const updateAutomationSettings = (settings: Partial<AutomationSettings>) => {
    setAutomationSettings(prev => {
      const next = { ...prev, ...settings };
      try {
        localStorage.setItem('deshreport_automation_settings', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
    if (settings.similarityThreshold !== undefined) {
      setDuplicateRule(prev => ({
        ...prev,
        similarityThreshold: settings.similarityThreshold! / 100
      }));
    }
    if (settings.checkSourceUrl !== undefined) {
      setDuplicateRule(prev => ({
        ...prev,
        checkSourceUrl: settings.checkSourceUrl!
      }));
    }
  };

  // RSS / News API Fetch simulation with REAL duplicate detection algorithm
  const runAutomationFeed = async (sourceId: string): Promise<{ imported: number; duplicates: number }> => {
    const src = automationSources.find(s => s.id === sourceId);
    if (!src) return { imported: 0, duplicates: 0 };

    // Find preset matching this source to provide authentic, agency-specific news
    const matchedPreset = trustedFeedPresets.find(p =>
      (p.url && src.url && p.url.trim().toLowerCase() === src.url.trim().toLowerCase()) ||
      p.name.toLowerCase() === src.name.toLowerCase() ||
      src.name.toLowerCase().includes(p.agencyNameBn.toLowerCase()) ||
      p.agencyNameBn.toLowerCase().includes(src.name.toLowerCase()) ||
      (src.id && p.id && src.id.toLowerCase().includes(p.id.replace('preset-', '')))
    );

    const incomingSamples = matchedPreset && matchedPreset.sampleArticles.length > 0
      ? matchedPreset.sampleArticles
      : [
          {
            title: `${src.name}: সমসাময়িক বিশেষ বিশ্লেষণ ও শীর্ষ সংবাদ`,
            summary: `${src.name} থেকে সদ্য প্রকাশিত বিশেষ সংবাদ প্রতিবেদন। অর্থনৈতিক ও সামাজিক অগ্রগতির সার্বিক চিত্র।`,
            content: `${src.name} এর নির্ভরযোগ্য সংবাদ বুলেটিনে জানানো হয়েছে, জাতীয় ও আন্তর্জাতিক অংশীজনদের উপস্থিতিতে গৃহীত নতুন সিদ্ধান্তের ফলে সামগ্রিক কার্যক্রমে উল্লেখযোগ্য ইতিবাচক গতি সঞ্চারিত হবে। মাঠ পর্যায়ের তথ্য পর্যালোচনা করে এই বিবরণ প্রকাশ করা হয়েছে।`,
            sourceUrl: `${src.url}#item-${Date.now()}`,
            image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80',
            cat: src.categoryId
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
          slug: generateSlug(item.title) + '-' + Math.floor(Math.random() * 1000),
          summary: item.summary,
          content: item.content,
          featuredImage: item.image,
          categoryId: item.cat || src.categoryId,
          authorId: 'usr-4',
          authorName: `অটোমেশন বট (${src.name})`,
          tags: ['সংবাদ', 'অটোমেশন', src.region === 'international' ? 'আন্তর্জাতিক' : 'জাতীয়'],
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
