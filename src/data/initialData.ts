import { Article, Category, BreakingNewsItem, Advertisement, MediaItem, AutomationSource, User, SiteSettings, PageItem } from '../types';

export const initialCategories: Category[] = [
  { id: 'national', nameBn: 'জাতীয়', nameEn: 'National', slug: 'national', order: 1, color: '#c00612', isActive: true, articleCount: 42 },
  { id: 'politics', nameBn: 'রাজনীতি', nameEn: 'Politics', slug: 'politics', order: 2, color: '#0284c7', isActive: true, articleCount: 38 },
  { id: 'international', nameBn: 'আন্তর্জাতিক', nameEn: 'International', slug: 'international', order: 3, color: '#0d9488', isActive: true, articleCount: 29 },
  { id: 'economy', nameBn: 'অর্থনীতি', nameEn: 'Economy', slug: 'economy', order: 4, color: '#16a34a', isActive: true, articleCount: 24 },
  { id: 'business', nameBn: 'বাণিজ্য', nameEn: 'Business', slug: 'business', order: 5, color: '#d97706', isActive: true, articleCount: 19 },
  { id: 'technology', nameBn: 'প্রযুক্তি', nameEn: 'Technology', slug: 'technology', order: 6, color: '#7c3aed', isActive: true, articleCount: 31 },
  { id: 'sports', nameBn: 'খেলা', nameEn: 'Sports', slug: 'sports', order: 7, color: '#ea580c', isActive: true, articleCount: 35 },
  { id: 'entertainment', nameBn: 'বিনোদন', nameEn: 'Entertainment', slug: 'entertainment', order: 8, color: '#db2777', isActive: true, articleCount: 22 },
  { id: 'health', nameBn: 'স্বাস্থ্য', nameEn: 'Health', slug: 'health', order: 9, color: '#059669', isActive: true, articleCount: 18 },
  { id: 'lifestyle', nameBn: 'লাইফস্টাইল', nameEn: 'Lifestyle', slug: 'lifestyle', order: 10, color: '#e11d48', isActive: true, articleCount: 15 },
  { id: 'education', nameBn: 'শিক্ষা', nameEn: 'Education', slug: 'education', order: 11, color: '#4f46e5', isActive: true, articleCount: 14 },
  { id: 'opinion', nameBn: 'মতামত', nameEn: 'Opinion', slug: 'opinion', order: 12, color: '#475569', isActive: true, articleCount: 12 },
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin-masud',
    name: 'মোহাম্মদ মাসুদ রানা',
    email: 'masud.here9330@gmail.com',
    phone: '01581226134',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    title: 'সম্পাদক ও প্রকাশক (Editor & Publisher)',
    articlesCount: 88,
    status: 'active'
  },
  {
    id: 'usr-1',
    name: 'তানভীর আহমেদ',
    email: 'tanvir@deshreport.com',
    phone: '01711000001',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'প্রধান নির্বাহী সম্পাদক (Executive Editor)',
    articlesCount: 64,
    status: 'active'
  },
  {
    id: 'usr-2',
    name: 'ফারহানা ইসলাম',
    email: 'farhana@deshreport.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'বার্তা সম্পাদক (News Editor)',
    articlesCount: 48,
    status: 'active'
  },
  {
    id: 'usr-3',
    name: 'মাহমুদুল হাসান',
    email: 'mahmud@deshreport.com',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'বিশেষ প্রতিবেদক (Special Correspondent)',
    articlesCount: 39,
    status: 'active'
  },
  {
    id: 'usr-4',
    name: 'রাশেদ খান',
    email: 'rashed@deshreport.com',
    role: 'author',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'অর্থনীতি ও বাণিজ্য প্রতিবেদক',
    articlesCount: 27,
    status: 'active'
  }
];

export const initialBreakingNews: BreakingNewsItem[] = [
  {
    id: 'brk-iran-us-1',
    title: 'ইরান-যুক্তরাষ্ট্র উত্তেজনা তুঙ্গে: হরমুজ প্রণালী ঘিরে মধ্যপ্রাচ্যে সর্বোচ্চ সামরিক সতর্কতা',
    link: '/article/iran-us-tensions-escalate-hormuz-strait-military-alert',
    priority: 'urgent',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-iran-us-2',
    title: 'ইরান-আমেরিকা যুদ্ধ পরিস্থিতিতে আন্তর্জাতিক বাজারে অপরিশোধিত জ্বালানি তেলের দামে বড় উল্লম্ফন',
    link: '/article/iran-us-war-oil-prices-global-impact',
    priority: 'urgent',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-1',
    title: 'ঢাকায় গণপরিবহনে শৃঙ্খলা ফেরাতে উচ্চপর্যায়ের জাতীয় টাস্কফোর্স গঠনের সিদ্ধান্ত',
    link: '/article/dhaka-transport-national-taskforce',
    priority: 'urgent',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-2',
    title: 'বাংলাদেশ ব্যাংকের বৈদেশিক মুদ্রার রিজার্ভ ফের ২০ বিলিয়ন ডলার অতিক্রম করল',
    link: '/article/forex-reserve-crosses-twenty-billion',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-3',
    title: 'টি-টোয়েন্টি সিরিজে আফগানিস্তানকে হোয়াইটওয়াশ করল বাংলাদেশ টাইগার্স',
    link: '/article/bangladesh-cricket-whitewash-afghanistan',
    priority: 'normal',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-4',
    title: 'মতিঝিল থেকে কমলাপুর মেট্রোরেলের পরীক্ষামূলক চলাচল শুরু হবে চলতি মাসেই',
    link: '/article/dhaka-metro-rail-kamalapur-extension-timeline',
    priority: 'urgent',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-5',
    title: 'রমজানে নিত্যপণ্যের দাম নিয়ন্ত্রণে জেলাভিত্তিক বিশেষ টাস্কফোর্স গঠনের কঠোর নির্দেশ',
    link: '/article/commerce-ministry-taskforce-commodity-price-ramadan',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-6',
    title: 'চট্টগ্রাম বন্দরে আধুনিক স্বয়ংক্রিয় স্ক্যানার স্থাপন, পণ্য খালাসে রেকর্ড গতি',
    link: '/article/chattogram-port-automation-terminal',
    priority: 'normal',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-7',
    title: 'বিশ্ববাজারে অপরিশোধিত জ্বালানি তেলের দামে বড় পতন, মূল্যস্ফীতি কমার আশা',
    link: '/article/global-crude-oil-prices-drop',
    priority: 'high',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  },
  {
    id: 'brk-8',
    title: 'স্মার্ট বাংলাদেশ বিনির্মাণে এআই প্রযুক্তির পাইলট প্রকল্প চালু করল তথ্যপ্রযুক্তি বিভাগ',
    link: '/article/bangladesh-ai-governance-pilot-initiative',
    priority: 'normal',
    isActive: true,
    createdAt: new Date().toISOString(),
    displayLocations: ['homepage', 'category', 'article']
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'মেট্রোরেলের নতুন রুটের কাজ দ্রুত এগিয়ে চলছে, মতিঝিল থেকে কমলাপুর যুক্ত হবে এ বছরই',
    slug: 'dhaka-metro-rail-kamalapur-extension-timeline',
    subtitle: 'রাজধানীর যানজট নিরসনে নতুন মাইলফলক, দৈনিক যাত্রী পরিবহন সক্ষমতা পৌঁছাবে সাড়ে ছয় লাখে',
    summary: 'রাজধানীর যোগাযোগের প্রধান ভরসা হয়ে ওঠা মেট্রোরেলের মতিঝিল থেকে কমলাপুর পর্যন্ত বর্ধিতাংশের নির্মাণকাজ দ্রুত সম্পন্ন হচ্ছে। চলতি বছরের শেষ নাগাদ এই রুটে পরীক্ষামূলক ট্রেন চলাচল শুরু হবে বলে জানিয়েছে ডিএমটিসিএল কর্তৃপক্ষ।',
    content: `রাজধানীর যোগাযোগের প্রধান ভরসা ও স্বস্তির প্রতীক হয়ে ওঠা ঢাকা মেট্রোরেলের (এমআরটি লাইন-৬) মতিঝিল থেকে কমলাপুর পর্যন্ত বর্ধিত ১.১৬ কিলোমিটার অংশের নির্মাণকাজে বড় অগ্রগতি হয়েছে। ডিএমটিসিএলের সর্বশেষ অগ্রগতি প্রতিবেদনে জানানো হয়েছে, মাটির নিচের পাইলিং ও ভায়াডাক্ট বসানোর সিংহভাগ কাজ শেষ পর্যায়ে।

প্রকল্প সংশ্লিষ্ট কর্মকর্তারা জানান, কমলাপুর অংশে স্টেশন প্লাজা ও প্ল্যাটফর্ম নির্মাণের কাজ চলছে নিরবচ্ছিন্নভাবে। এই রুটটি চালু হলে বাংলাদেশ রেলওয়ের কেন্দ্রীয় স্টেশন কমলাপুরের সঙ্গে সরাসরি মেট্রোরেলের সংযোগ স্থাপিত হবে। এতে করে দেশের বিভিন্ন প্রান্ত থেকে ঢাকায় আসা যাত্রীরা যানজটের বিড়ম্বনা ছাড়াই সরাসরি উত্তরা, মিরপুর, ধানমন্ডি সংলগ্ন ফার্মগেট কিংবা সচিবালয়ে পৌঁছে যেতে পারবেন।

## যাত্রী ধারণক্ষমতা ও ভবিষ্যৎ পরিকল্পনা

ডিএমটিসিএলের ব্যবস্থাপনা পরিচালক জানান, "বর্তমানে দৈনিক প্রায় ৩ লাখ যাত্রী উত্তরা-মতিঝিল রুটে যাতায়াত করছেন। কমলাপুর পর্যন্ত চালু হলে দৈনিক যাত্রী পরিবহন সক্ষমতা সাড়ে ছয় লাখে পৌঁছাবে। যাত্রীদের নিরাপত্তা ও দ্রুত টিকিট পাওয়ায় নতুন নতুন আধুনিক স্বয়ংক্রিয় ভেন্ডিং মেশিন স্থাপন করা হচ্ছে।"

পরিবহন বিশেষজ্ঞদের মতে, কমলাপুর স্টেশনটি দেশের বৃহত্তম মাল্টিমোডাল ট্রান্সপোর্ট হাবে পরিণত হতে যাচ্ছে। এখানে মেট্রোরেল, শহরতলীর রেল, এবং প্রস্তাবিত সাবওয়ে ও বাস র‍্যাপিড ট্রানজিটের সমন্বয় ঘটবে, যা রাজধানী ঢাকার পরিবহন ব্যবস্থার দীর্ঘস্থায়ী সমাধান নিশ্চিত করবে।`,
    featuredImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'মেট্রোরেলের চলমান প্রকল্প ও ভায়াডাক্টের কাজ পরিদর্শন করছেন প্রকৌশলীরা',
    imageCredit: 'দেশরিপোর্ট আলোকচিত্রী / মো. মনিরুজ্জামান',
    categoryId: 'national',
    subcategory: 'যোগাযোগ ও অবকাঠামো',
    authorId: 'usr-1',
    authorName: 'তানভীর আহমেদ',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    tags: ['মেট্রোরেল', 'ঢাকা', 'যোগাযোগ', 'কমলাপুর', 'উন্নয়ন'],
    source: 'নিজস্ব প্রতিবেদক, ঢাকা',
    publishedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    readingTimeMinutes: 4,
    viewCount: 14820,
    shareCount: 1240,
    status: 'published',
    isFeaturedHero: false,
    isTrending: true,
    seoTitle: 'মেট্রোরেলের কমলাপুর রুটের অগ্রগতি ও উদ্বোধনের সময়সূচি | DeshReport',
    metaDescription: 'মতিঝিল থেকে কমলাপুর মেট্রোরেল অংশের সর্বশেষ নির্মাণ অগ্রগতি ও উদ্বোধনের বিস্তারিত প্রতিবেদন পড়ুন দেশরিপোর্টে।'
  },
  {
    id: 'art-2',
    title: 'রমজানে নিত্যপণ্যের দাম নিয়ন্ত্রণে জেলা পর্যায়ে বিশেষ টাস্কফোর্স গঠনের নির্দেশ বাণিজ্য মন্ত্রণালয়ের',
    slug: 'commerce-ministry-taskforce-commodity-price-ramadan',
    subtitle: 'তেল, চিনি, ছোলা ও পেঁয়াজের পাইকারি ও খুচরা মূল্যের ব্যবধান খতিয়ে দেখতে চলবে সার্বক্ষণিক নজরদারি',
    summary: 'আসন্ন পবিত্র রমজান উপলক্ষে চাল, ডাল, তেল, চিনি ও ছোলার সরবরাহ স্বাভাবিক রাখা এবং অযৌক্তিক মূল্যবৃদ্ধি রোধে দেশের প্রতিটি জেলায় বিশেষ বাজার তদারকি কমিটি সক্রিয় করার নির্দেশ দিয়েছে সরকার।',
    content: `পবিত্র মাহে রমজানে সাধারণ মানুষের নিত্যপ্রয়োজনীয় ভোগ্যপণ্য সুলভ মূল্যে প্রাপ্তি নিশ্চিত করতে কঠোর অবস্থানের কথা জানিয়েছে বাণিজ্য মন্ত্রণালয়। সচিবালয়ে অনুষ্ঠিত উচ্চপর্যায়ের এক আন্তঃমন্ত্রণালয় সভায় বাণিজ্য উপদেষ্টা বলেন, অসাধু মজুতদার কিংবা সিন্ডিকেটের কোনো কারসাজি বরদাশত করা হবে না।

জেলা প্রশাসন, জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর ও আইনশৃঙ্খলা রক্ষাকারী বাহিনীর যৌথ সমন্বয়ে প্রতিটি পাইকারি ও খুচরা আড়তে প্রতিদিন সকাল ও বিকেলে আকস্মিক অভিযান চালানো হবে। প্রতিটি দোকানে পণ্যের হালনাগাদ মূল্যতালিকা প্রদর্শন বাধ্যতামূলক করা হয়েছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'রাজধানীর কারওয়ান বাজারে নিত্যপণ্যের পাইকারি সরবরাহ পর্যালোচনা',
    imageCredit: 'দেশরিপোর্ট ছবি',
    categoryId: 'economy',
    subcategory: 'বাজার দর',
    authorId: 'usr-4',
    authorName: 'রাশেদ খান',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    tags: ['বাণিজ্য', 'রমজান', 'নিত্যপণ্য', 'বাজারদর', 'অর্থনীতি'],
    source: 'সচিবালয় প্রতিনিধি',
    publishedAt: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    readingTimeMinutes: 3,
    viewCount: 11450,
    shareCount: 890,
    status: 'published',
    isSecondaryHero: true,
    isBreaking: false
  },
  {
    id: 'art-3',
    title: 'কৃত্রিম বুদ্ধিমত্তা ব্যবহারে বাংলাদেশ প্রকৌশলীদের নতুন আন্তর্জাতিক সাফল্য',
    slug: 'bangladeshi-engineers-ai-healthcare-global-breakthrough',
    subtitle: 'গ্রামীণ স্বাস্থ্যসেবায় ডায়াবেটিস ও হৃদরোগের পূর্বাভাস দিতে সক্ষম সাশ্রয়ী এআই মডেল উদ্ভাবন',
    summary: 'বুয়েট ও ঢাকা বিশ্ববিদ্যালয়ের সাবেক শিক্ষার্থীদের সমন্বয়ে গঠিত প্রযুক্তি দল তৈরি করেছে বিশেষ এআই অ্যালগরিদম, যা স্মার্টফোনে সাধারণ রক্তচাপ ও অক্ষিপট পরীক্ষার মাধ্যমে জটিল রোগ দ্রুত শনাক্ত করতে পারে।',
    content: `চিকিৎসা বিজ্ঞানে কৃত্রিম বুদ্ধিমত্তার (এআই) সফল প্রয়োগে যুগান্তকারী নজির স্থাপন করেছেন একদল বাংলাদেশি সফটওয়্যার ইঞ্জিনিয়ার ও চিকিৎসক। সম্প্রতি আন্তর্জাতিক শীর্ষস্থানীয় স্বাস্থ্যপ্রযুক্তি সম্মেলনে তাদের উদ্ভাবিত মডেলটি প্রথম স্থান অধিকার করেছে।

এই প্রযুক্তির মূল বিশেষত্ব হলো এটি ইন্টারনেটের দুর্বল গতিতেও অফলাইনে কাজ করতে সক্ষম। ফলে প্রত্যন্ত চরাঞ্চল বা পাহাড়ি অঞ্চলের কমিউনিটি ক্লিনিকগুলোতে স্বাস্থ্যকর্মীরা সহজেই রোগীদের প্রাথমিক শারীরিক স্ক্রিনিং সম্পন্ন করতে পারবেন। উদ্ভাবক দলটি জানিয়েছে, আগামী মাস থেকেই দেশের তিনটি জেলায় পাইলট প্রজেক্ট শুরু হতে যাচ্ছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'মেডিকেল এআই সফটওয়্যারের ইন্টারফেস প্রদর্শন করছেন গবেষকরা',
    imageCredit: 'প্রযুক্তি ডেস্ক / দেশরিপোর্ট',
    categoryId: 'technology',
    subcategory: 'উদ্ভাবন ও তথ্যপ্রযুক্তি',
    authorId: 'usr-3',
    authorName: 'মাহমুদুল হাসান',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    tags: ['প্রযুক্তি', 'এআই', 'স্বাস্থ্য', 'উদ্ভাবন', 'বাংলাদেশ'],
    source: 'বিজ্ঞান ও প্রযুক্তি ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    readingTimeMinutes: 5,
    viewCount: 9780,
    shareCount: 650,
    status: 'published',
    isSecondaryHero: true,
    isEditorsChoice: true
  },
  {
    id: 'art-4',
    title: 'নির্বাচন ব্যবস্থার সংস্কার কমিশনের সুপারিশ চূড়ান্ত, সর্বসম্মত খসড়া জমা এ সপ্তাহে',
    slug: 'election-reform-commission-draft-finalized',
    subtitle: 'রাজনৈতিক দলগুলোর প্রস্তাবনা ও অংশীজনদের সাথে মতবিনিময় শেষে তৈরি হয়েছে সমন্বিত রূপরেখা',
    summary: 'সুষ্ঠু, নিরপেক্ষ ও গ্রহণযোগ্য জাতীয় নির্বাচন আয়োজনের লক্ষ্যে গঠিত নির্বাচন ব্যবস্থা সংস্কার কমিশন তাদের সুপারিশমালা চূড়ান্ত করেছে। কমিশনের সদস্য ও বিশেষজ্ঞরা জানিয়েছেন, নির্বাচন কমিশনকে পূর্ণ প্রশাসনিক ও আর্থিক স্বাধীনতা দেওয়ার সুপারিশ রাখা হয়েছে।',
    content: `দেশের ভবিষ্যৎ গণতান্ত্রিক পথরেখা বিনির্মাণে নির্বাচন ব্যবস্থা সংস্কার কমিশন তাদের চূড়ান্ত প্রতিবেদন প্রস্তুত করেছে। আগামী বৃহস্পতিবার প্রধান উপদেষ্টার দপ্তরে এই প্রতিবেদন আনুষ্ঠানিক পেশ করার কথা রয়েছে।

প্রতিবেদনে প্রধান প্রধান সুপারিশের মধ্যে রয়েছে:
১. প্রধান নির্বাচন কমিশনার ও অন্যান্য কমিশনার নিয়োগে স্বচ্ছ সার্চ কমিটি গঠন ও জনসাধারণের গণশুনানি।
২. নির্বাচনের তফসিল ঘোষণার পর মাঠ প্রশাসন ও পুলিশ প্রশাসনের ওপর নির্বাচন কমিশনের নিরঙ্কুশ নিয়ন্ত্রণ।
৩. নির্বাচনী বিরোধ দ্রুত নিষ্পত্তিতে বিশেষায়িত ট্রাইব্যুনাল স্থাপন ও আধুনিক প্রযুক্তির সর্বোচ্চ ব্যবহার।`,
    featuredImage: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'নির্বাচন ভবনে সংস্কার কমিশনের গুরুত্বপূর্ণ বৈঠকের দৃশ্য',
    imageCredit: 'দেশরিপোর্ট ছবি',
    categoryId: 'politics',
    subcategory: 'জাতীয় রাজনীতি',
    authorId: 'usr-2',
    authorName: 'ফারহানা ইসলাম',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    tags: ['রাজনীতি', 'নির্বাচন', 'সংস্কার কমিশন', 'আইন'],
    source: 'রাজনৈতিক প্রতিনিধি',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 16230,
    shareCount: 1890,
    status: 'published',
    isTrending: true,
    isEditorsChoice: true
  },
  {
    id: 'art-5',
    title: 'চ্যাম্পিয়ন্স ট্রফির সেমিফাইনালের স্বপ্ন জিইয়ে রাখতে কঠোর অনুশীলনে শান্ত-মিরাজরা',
    slug: 'bangladesh-champions-trophy-cricket-preparations',
    subtitle: 'বোলিং কম্বিনেশন ও মিডল অর্ডারের ব্যাটিং দুর্বলতা কাটিয়ে উঠতে রণকৌশল নির্ধারণ',
    summary: 'আসন্ন মহাগুরুত্বপূর্ণ আইসিসি টুর্নামেন্টে নিজেদের শক্তি প্রদর্শনে বদ্ধপরিকর বাংলাদেশ জাতীয় ক্রিকেট দল। লাহোরের গাদ্দাফি স্টেডিয়ামে তীব্র ব্যাটিং ও পেস বোলিং ড্রিল পরিচালনা করছেন প্রধান কোচ।',
    content: `আইসিসি চ্যাম্পিয়ন্স ট্রফির গুরুত্বপূর্ণ ম্যাচে মাঠে নামার আগে পূর্ণ প্রস্তুতিতে মনোনিবেশ করেছে বাংলাদেশ ক্রিকেট দল। আগের ম্যাচে টপ অর্ডারের ব্যর্থতা সত্ত্বেও বোলারদের দুর্দান্ত কামব্যাকে অনুপ্রেরণা খুঁজে পেয়েছে ড্রেসিংরুম।

অধিনায়ক নাজমুল হোসেন শান্ত সংবাদ সম্মেলনে জানান, "আমাদের পেস বোলিং ইউনিট বর্তমানে বিশ্বের যেকোনো কন্ডিশনে আক্রমণাত্মক খেলতে সক্ষম। টপ অর্ডারে দায়িত্বশীল শুরু পেলে আমরা যেকোনো শক্তিশালী দলকে পরাজিত করতে পারব।" দলের সহ-অধিনায়ক মেহেদী হাসান মিরাজ অলরাউন্ড নৈপুণ্য প্রদর্শন করতে বাড়তি অনুশীলন চালাচ্ছেন।`,
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'মাঠে অনুশীলনে ঘাম ঝরাচ্ছেন জাতীয় দলের ক্রিকেটাররা',
    imageCredit: 'ক্রীড়া ডেস্ক / দেশরিপোর্ট',
    categoryId: 'sports',
    subcategory: 'ক্রিকেট',
    authorId: 'usr-3',
    authorName: 'মাহমুদুল হাসান',
    tags: ['ক্রিকেট', 'বাংলাদেশ', 'চ্যাম্পিয়ন্স ট্রফি', 'খেলাধুলা'],
    source: 'ক্রীড়া প্রতিবেদক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    viewCount: 13950,
    shareCount: 1120,
    status: 'published'
  },
  {
    id: 'art-6',
    title: 'জাতিসংঘ নিরাপত্তা পরিষদে গাজায় স্থায়ী যুদ্ধবিরতির প্রস্তাব সর্বসম্মতভাবে পাস',
    slug: 'un-security-council-permanent-ceasefire-gaza',
    subtitle: 'আন্তর্জাতিক সম্প্রদায়ের দীর্ঘ কূটনৈতিক প্রচেষ্টার ফল, মানবিক সহায়তা প্রবেশে বাধাহীন করিডোর চালুর আহ্বান',
    summary: 'নিউইয়র্কে জাতিসংঘের নিরাপত্তা পরিষদে দীর্ঘ আলোচনার পর গাজা উপত্যকায় অবিলম্বে স্থায়ী যুদ্ধবিরতি ও সকল জিম্মি মুক্তির খসড়া প্রস্তাব অনুমোদিত হয়েছে। বিভিন্ন দেশের নেতারা এই পদক্ষেপকে ঐতিহাসিক হিসেবে আখ্যা দিয়েছেন।',
    content: `আন্তর্জাতিক চাপ ও ক্রমবর্ধমান মানবিক বিপর্যয়ের প্রেক্ষাপটে জাতিসংঘ নিরাপত্তা পরিষদ অবশেষে গাজায় সর্বাত্মক যুদ্ধবিরতির প্রস্তাব পাস করেছে। প্রস্তাবে অবিলম্বে ত্রাণবাহী ট্রাক চলাচলের নিরাপত্তা নিশ্চিতকরণ এবং ধ্বংসপ্রাপ্ত হাসপাতালগুলোতে ওষুধ ও বিদ্যুৎ সরবরাহের তাগিদ দেওয়া হয়েছে।

## জাতিসংঘের জরুরি পদক্ষেপ ও কূটনীতিকদের প্রতিক্রিয়া

জাতিসংঘের মহাসচিব আন্তোনিও গুতেরেস বলেন, "এটি বিশ্ববাসীর দীর্ঘ প্রতীক্ষিত এক সিদ্ধান্ত। এখন সবচেয়ে জরুরি হলো মাঠপর্যায়ে এই প্রস্তাবের শতভাগ বাস্তবায়ন নিশ্চিত করা এবং নিরীহ বেসামরিক জনগোষ্ঠীর জীবন রক্ষা করা।"

## মানবিক সহায়তা ও ধ্বংসপ্রাপ্ত অবকাঠামো পুনর্গঠন

আন্তর্জাতিক রেড ক্রস ও বিশ্ব স্বাস্থ্য সংস্থা অবিলম্বে গাজায় জরুরি ওষুধ ও খাদ্যবাহী কনভয় পাঠানোর প্রস্তুতি শুরু করেছে। ক্ষতিগ্রস্ত বেসামরিক নাগরিকদের জন্য অস্থায়ী আশ্রয়কেন্দ্র ও চিকিৎসাকেন্দ্র স্থাপনের বিষয়ে আন্তর্জাতিক দাতা সংস্থাগুলো বিশেষ তহবিল বরাদ্দের ঘোষণা দিয়েছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'জাতিসংঘের সাধারণ পরিষদ ও নিরাপত্তা পরিষদের বিশেষ অধিবেশন',
    imageCredit: 'রয়টার্স / দেশরিপোর্ট',
    categoryId: 'international',
    subcategory: 'বিশ্ব রাজনীতি',
    authorId: 'usr-2',
    authorName: 'ফারহানা ইসলাম',
    tags: ['আন্তর্জাতিক', 'জাতিসংঘ', 'গাজা', 'শান্তি'],
    source: 'আন্তর্জাতিক ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 18450,
    shareCount: 2310,
    status: 'published',
    isTrending: true
  },
  {
    id: 'art-int-ai-1',
    title: 'জাতিসংঘের আন্তর্জাতিক সম্মেলনে কৃত্রিম বুদ্ধিমত্তা (AI) পরিচালনায় নতুন বৈশ্বিক চুক্তি অনুমোদন',
    slug: 'un-global-summit-artificial-intelligence-governance-treaty',
    subtitle: 'মানবাধিকার সুরক্ষা, তথ্য নিরাপত্তা ও এআই ঝুঁকি রোধে বিশ্বের ১৯০ দেশের ঐতিহাসিক ঐকমত্য',
    summary: 'জেনেভায় অনুষ্ঠিত বৈশ্বিক প্রযুক্তি সম্মেলনে কৃত্রিম বুদ্ধিমত্তার নৈতিক ব্যবহার নিশ্চিত করতে এবং বিপজ্জনক অপব্যবহার রোধে আন্তর্জাতিক পর্যবেক্ষণ সংস্থা গঠনের বিষয়ে যুগান্তকারী সিদ্ধান্ত হয়েছে।',
    content: `বিশ্বজুড়ে কৃত্রিম বুদ্ধিমত্তা বা এআই প্রযুক্তির অভাবনীয় অগ্রগতির সঙ্গে সঙ্গে এর ঝুঁকি নিয়ন্ত্রণে বৈশ্বিক ঐকমত্য প্রতিষ্ঠিত হয়েছে। জেনেভায় জাতিসংঘ আয়োজিত বিশেষ প্রযুক্তি শীর্ষ সম্মেলনে বিশ্বের ১৯০টি দেশের প্রতিনিধিরা এআই গভর্নেন্স সনদে স্বাক্ষর করেছেন।

## প্রযুক্তি নিরাপত্তা ও মানবাধিকারের অগ্রাধিকার

সম্মেলনে শীর্ষ বিজ্ঞানীরা উল্লেখ করেন, ডিপফেক, সাইবার আক্রমণ এবং স্বয়ংক্রিয় ম্যালওয়্যার তৈরির অপচেষ্টা রুখতে সমন্বিত বৈশ্বিক মনিটরিং ব্যবস্থা ছাড়া কোনো একক দেশের পক্ষে নিরাপত্তা নিশ্চিত করা অসম্ভব।

## আন্তর্জাতিক এআই গবেষণা ও মনিটরিং কাউন্সিল গঠন

চুক্তির আওতায় জাতিসংঘের তত্ত্বাবধানে একটি আন্তর্জাতিক পর্যবেক্ষণ কাউন্সিল গঠন করা হবে, যা উচ্চ ঝুঁকিপূর্ণ এআই মডেলগুলোর নিরাপত্তা অডিট পরিচালনা করবে এবং উন্নয়নশীল দেশগুলোতে এআই প্রযুক্তি প্রসারে আর্থিক সহায়তা প্রদান করবে।`,
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'জাতিসংঘ প্রযুক্তি সম্মেলনে এআই নিরাপত্তা নিয়ে বিশ্বনেতাদের মতবিনিময়',
    imageCredit: 'এএফপি / আন্তর্জাতিক প্রযুক্তি ডেস্ক',
    categoryId: 'international',
    subcategory: 'বিশ্ব প্রযুক্তি ও কূটনীতি',
    authorId: 'usr-2',
    authorName: 'ফারহানা ইসলাম',
    tags: ['আন্তর্জাতিক', 'এআই', 'প্রযুক্তি', 'জাতিসংঘ', 'গবেষণা'],
    source: 'আন্তর্জাতিক ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 12400,
    shareCount: 1530,
    status: 'published'
  },
  {
    id: 'art-int-climate-1',
    title: 'প্যারিস জলবায়ু চুক্তি বাস্তবায়নে বৈশ্বিক নবায়নযোগ্য জ্বালানি তহবিলে ১০০ বিলিয়ন ডলার ছাড়ের ঘোষণা',
    slug: 'paris-climate-global-renewable-energy-fund-commitment',
    subtitle: 'উন্নয়নশীল উপকূলীয় দেশগুলোর জলবায়ু অভিযোজন ও সৌর-বায়ু বিদ্যুৎ প্রকল্পে অর্থায়ন ত্বরান্বিত করার সিদ্ধান্ত',
    summary: 'আন্তর্জাতিক জলবায়ু বিষয়ক জরুরি শীর্ষ সম্মেলনে ধনী দেশগুলো ক্ষতিপূরণ তহবিল ছাড় করতে সম্মত হয়েছে। বাংলাদেশসহ ঝুঁকিপূর্ণ দেশগুলো এই তহবিল থেকে অগ্রাধিকার ভিত্তিতে সহায়তা পাবে।',
    content: `বৈশ্বিক উষ্ণতা বৃদ্ধি ১.৫ ডিগ্রি সেলসিয়াসের মধ্যে ধরে রাখার বৈশ্বিক লক্ষ্য অর্জনে নতুন আন্তর্জাতিক অঙ্গীকার ঘোষিত হয়েছে। জাতিসংঘের জলবায়ু পরিবর্তন বিষয়ক ফ্রেমওয়ার্ক কনভেনশনের (UNFCCC) বৈঠকে উন্নয়নশীল দেশগুলোর জন্য ১০০ বিলিয়ন ডলারের সবুজ রূপান্তর তহবিল কার্যকরের রূপরেখা চূড়ান্ত করা হয়েছে।

## নবায়নযোগ্য জ্বালানি ও কার্বন নির্গমন হ্রাস

আন্তর্জাতিক শক্তি সংস্থা (IEA) জানিয়েছে, আগামী পাঁচ বছরে সৌর ও বায়ু বিদ্যুৎ উৎপাদনে বৈশ্বিক বিনিয়োগ দ্বিগুণ হবে। এর ফলে কয়লাভিত্তিক বিদ্যুৎ প্রকল্পের ওপর নির্ভরতা উল্লেখযোগ্যভাবে কমবে।

## উপকূলীয় ঝুঁকিপূর্ণ দেশগুলোর অভিযোজন কৌশল

বাংলাদেশ, মালদ্বীপ ও প্রশান্ত মহাসাগরীয় দ্বীপরাষ্ট্রগুলোর জন্য সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি ও প্রাকৃতিক দুর্যোগ মোকাবিলায় দীর্ঘমেয়াদি বাঁধ নির্মাণ এবং সাইক্লোন শেল্টার আধুনিকায়নে বিশেষ অনুদান বরাদ্দ রাখা হয়েছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'নবায়নযোগ্য সৌর ও বায়ু বিদ্যুৎ প্রকল্পের বিস্তৃতি',
    imageCredit: 'রয়টার্স / পরিবেশ ডেস্ক',
    categoryId: 'international',
    subcategory: 'পরিবেশ ও জলবায়ু',
    authorId: 'usr-4',
    authorName: 'রাশেদ খান',
    tags: ['আন্তর্জাতিক', 'জলবায়ু', 'পরিবেশ', 'নবায়নযোগ্য শক্তি'],
    source: 'পরিবেশ ও আন্তর্জাতিক ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 14100,
    shareCount: 1890,
    status: 'published'
  },
  {
    id: 'art-iran-us-1',
    title: 'ইরান-যুক্তরাষ্ট্র মুখোমুখি সংঘাতের চরম আশঙ্কা: মধ্যপ্রাচ্যের ভূরাজনীতি ও হরমুজ প্রণালী ঘিরে তীব্র উত্তেজনা',
    slug: 'iran-us-tensions-escalate-hormuz-strait-military-alert',
    subtitle: 'হরমুজ প্রণালীতে নৌ-মহড়া ও ড্রোন নজরদারি জোরদার, কূটনীতির পথ উন্মুক্ত রাখার আহ্বান জাতিসংঘের',
    summary: 'মধ্যপ্রাচ্যের কৌশলগত জলপথ হরমুজ প্রণালী ও আশেপাশের আকাশে যুক্তরাষ্ট্র ও ইরানের মধ্যকার সামরিক উত্তেজনা নতুন করে বিপজ্জনক মোড় নিয়েছে। আন্তর্জাতিক কূটনৈতিক মহল অবিলম্বে সংযম প্রদর্শনের তাগিদ দিচ্ছে।',
    content: `মধ্যপ্রাচ্যে দীর্ঘদিনের পুঞ্জীভূত দ্বন্দ্ব ও সামরিক সমাবেশ ঘিরে ইরান ও যুক্তরাষ্ট্রের মধ্যকার উত্তেজনা সর্বোচ্চ সতর্কাবস্থায় পৌঁছেছে। পারস্য উপসাগরীয় অঞ্চলে মার্কিন রণতরী দলের অতিরিক্ত নজরদারি এবং ইরানের বিপ্লবী গার্ড বাহিনীর (আইআরজিসি) উপকূলীয় ক্ষেপণাস্ত্র মহড়ার খবরে বিশ্ব রাজনীতি ও জ্বালানি অর্থনীতিতে চরম উদ্বেগ তৈরি হয়েছে।

## হরমুজ প্রণালীর কৌশলগত গুরুত্ব

বিশ্বের মোট সামুদ্রিক তেল পরিবহনের প্রায় এক-পঞ্চমাংশ এই হরমুজ প্রণালী দিয়ে পরিবাহিত হয়। বিশেষজ্ঞদের মতে, এখানে সামান্যতম সংঘাত ঘটলেও তা সরাসরি বিশ্ব বাণিজ্য এবং জ্বালানি তেলের দামকে আকাশচুম্বী করে তুলবে। ওমান ও সংযুক্ত আরব আমিরাতের কাছাকাছি এই সরু জলপথকে কেন্দ্র করে উভয় পক্ষের নৌবহর সর্বোচ্চ সতর্কাবস্থায় অবস্থান করছে।

## আন্তর্জাতিক সম্প্রদায়ের প্রতিক্রিয়া

জাতিসংঘ মহাসচিব আন্তোনিও গুতেরেস জেনেভায় এক জরুরি সংবাদ সম্মেলনে উভয় পক্ষকে চরম ধৈর্য ধরার আহ্বান জানিয়ে বলেছেন, "মধ্যপ্রাচ্য আরেকটি পূর্ণমাত্রার ধ্বংসাত্মক যুদ্ধ সহ্য করতে পারবে না। সংশ্লিষ্ট সকল পক্ষকে অবিলম্বে কূটনৈতিক সংলাপের টেবিলে ফিরতে হবে।"

এদিকে ইউরোপীয় ইউনিয়ন, চীন ও উপসাগরীয় সহযোগিতা সংস্থা (জিসিসি) উভয় দেশের প্রতিনিধিদের সঙ্গে যোগাযোগ করে সংঘাত এড়িয়ে চলার কূটনৈতিক প্রচেষ্টা অব্যাহত রেখেছে। দেশরিপোর্টের আন্তর্জাতিক কূটনৈতিক ডেস্ক পরিস্থিতির ওপর সার্বক্ষণিক গভীর নজর রাখছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'মধ্যপ্রাচ্যে সামরিক মহড়া ও ভূকৌশলগত উত্তেজনার প্রতীকী দৃশ্য',
    imageCredit: 'রয়টার্স / আন্তর্জাতিক ডেস্ক',
    categoryId: 'international',
    subcategory: 'আন্তর্জাতিক ভূরাজনীতি',
    authorId: 'usr-2',
    authorName: 'ফারহানা ইসলাম',
    tags: ['ইরান-যুক্তরাষ্ট্র যুদ্ধ', 'ইরান', 'যুক্তরাষ্ট্র', 'হরমুজ প্রণালী', 'আন্তর্জাতিক', 'মধ্যপ্রাচ্য'],
    source: 'আন্তর্জাতিক ডেস্ক / দেশরিপোর্ট',
    publishedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 5,
    viewCount: 28940,
    shareCount: 4210,
    status: 'published',
    isBreaking: true,
    isTrending: true,
    isFeaturedHero: true,
    seoTitle: 'ইরান-যুক্তরাষ্ট্র যুদ্ধ উত্তেজনা ও মধ্যপ্রাচ্যের সামরিক সংকট | DeshReport',
    metaDescription: 'ইরান ও যুক্তরাষ্ট্রের চরম সামরিক উত্তেজনা, হরমুজ প্রণালী ঘিরে উদ্বেগ এবং আন্তর্জাতিক ভূরাজনীতির সর্বশেষ বিশ্লেষণ দেশরিপোর্টে।'
  },
  {
    id: 'art-iran-us-2',
    title: 'ইরান-আমেরিকা যুদ্ধ পরিস্থিতিতে আন্তর্জাতিক বাজারে অপরিশোধিত তেলের দামে রেকর্ড উল্লম্ফন',
    slug: 'iran-us-war-oil-prices-global-impact',
    subtitle: 'ব্রেন্ট ক্রুডের দাম ব্যারেলে ৯২ ডলার স্পর্শ করল, বৈশ্বিক মূল্যস্ফীতি ও পরিবহন খরচ বৃদ্ধির শঙ্কা',
    summary: 'ইরান-যুক্তরাষ্ট্র উত্তেজনার প্রত্যক্ষ প্রভাবে আন্তর্জাতিক জ্বালানি বাজারে আকস্মিক অস্থিরতা তৈরি হয়েছে। জাহাজ চলাচল নিরাপত্তা ঝুঁকির কারণে পণ্যবাহী জাহাজের বীমা প্রিমিয়াম উল্লেখযোগ্য হারে বৃদ্ধি পেয়েছে।',
    content: `ইরান ও যুক্তরাষ্ট্রের মধ্যে সম্ভাব্য সংঘাতের আশঙ্কায় আন্তর্জাতিক কমোডিটি মার্কেটে জ্বালানি তেলের দামে বড় ধরনের ঊর্ধ্বগতি দেখা দিয়েছে। লন্ডনের আইসিই ফিউচার্স এক্সচেঞ্জে ব্রেন্ট ক্রুড ফিউচার্সের দাম একলাফে প্রতি ব্যারেলে ৯২ ডলার ছাড়িয়ে গেছে, যা গত দশ মাসের মধ্যে সর্বোচ্চ।

জ্বালানি অর্থনীতিবিদরা সতর্ক করে দিয়ে বলেছেন, পারস্য উপসাগরের তেল রফতানি বাধাগ্রস্ত হলে বিশ্বজুড়ে পেট্রোলিয়াম, এলএনজি ও সার উৎপাদনে ঘাটতি দেখা দিতে পারে। এর ফলে এশিয়ার উন্নয়নশীল দেশগুলোতে বিদ্যুৎ উৎপাদন খরচ ও আমদানি ব্যয় নতুন করে চাপের মুখে পড়বে।`,
    featuredImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'আন্তর্জাতিক জ্বালানি বাজার ও তেলের ট্যাঙ্কার চলাচল',
    imageCredit: 'ব্লুমবার্গ / দেশরিপোর্ট',
    categoryId: 'economy',
    subcategory: 'বিশ্ব অর্থনীতি',
    authorId: 'usr-4',
    authorName: 'রাশেদ খান',
    tags: ['ইরান-যুক্তরাষ্ট্র যুদ্ধ', 'জ্বালানি তেল', 'আন্তর্জাতিক অর্থনীতি', 'ব্রেন্ট ক্রুড', 'ইরান', 'যুক্তরাষ্ট্র'],
    source: 'বাণিজ্য ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 19820,
    shareCount: 2850,
    status: 'published',
    isBreaking: true,
    isTrending: true
  },
  {
    id: 'art-7',
    title: 'দেশীয় ওটিটি প্ল্যাটফর্মে মুক্তি পেল ঐতিহাসিক গল্পের আলোচিত সিনেমা ‘সোনার বাংলা’',
    slug: 'sonar-bangla-movie-ott-release-review',
    subtitle: 'মুক্তির প্রথম দিনেই দর্শকদের বিপুল সাড়া, তারকাদের অভিনয় ও সিনেমাটোগ্রাফির ভূয়সী প্রশংসা',
    summary: 'বাংলাদেশের গৌরবোজ্জ্বল ইতিহাস ও জনমানুষের জীবনসংগ্রামের প্রেক্ষাপটে নির্মিত চলচ্চিত্র ‘সোনার বাংলা’ দেশ-বিদেশের ওটিটি মাধ্যমে একযোগে মুক্তি পেয়েছে। প্রথম ২৪ ঘণ্টাতেই রেকর্ডসংখ্যক স্ট্রিমিং সম্পন্ন হয়েছে।',
    content: `জাতীয় চলচ্চিত্র পুরস্কারপ্রাপ্ত পরিচালকের বহুল প্রতীক্ষিত নতুন চলচ্চিত্রটি মুক্তির পর থেকেই সামাজিক যোগাযোগ মাধ্যমে ইতিবাচক আলোচনার জন্ম দিয়েছে। ছবিতে ষাটের দশক থেকে মুক্তিযুদ্ধ পরবর্তী সময়কালের গ্রামীণ সমাজের টানাপোড়েন ও তরুণ প্রজন্মের আত্মত্যাগ জীবন্ত হয়ে উঠেছে।

চলচ্চিত্র সমালোচকদের মতে, আধুনিক ক্যামেরা ফ্রেম, সাউন্ড ডিজাইন এবং মূল চরিত্রের নিপুণ অভিব্যক্তি বাংলা সিনেমাকে বিশ্বমঞ্চে নতুন উচ্চতায় নিয়ে যাওয়ার সম্ভাবনা তৈরি করেছে।`,
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'চলচ্চিত্রের একটি আবেগঘন দৃশ্যের স্থিরচিত্র',
    imageCredit: 'বিনোদন ডেস্ক',
    categoryId: 'entertainment',
    subcategory: 'চলচ্চিত্র',
    authorId: 'usr-1',
    authorName: 'তানভীর আহমেদ',
    tags: ['বিনোদন', 'চলচ্চিত্র', 'ওটিটি', 'সিনেমা'],
    source: 'বিনোদন প্রতিবেদক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    viewCount: 8400,
    shareCount: 420,
    status: 'published'
  },
  {
    id: 'art-8',
    title: 'শীতের শেষে সুস্থ থাকতে খাদ্যাভ্যাস ও প্রাত্যহিক ব্যায়ামের সঠিক নিয়ম',
    slug: 'health-lifestyle-seasonal-change-wellness-tips',
    subtitle: 'ঋতু পরিবর্তনের সময় সাধারণ সর্দি-কাশি ও অ্যালার্জি প্রতিরোধে বিশেষজ্ঞদের জরুরি পরামর্শ',
    summary: 'ঋতু পরিবর্তনের এই সন্ধিক্ষণে তাপমাত্রার ওঠা-নামার কারণে শিশু ও বয়স্কদের মধ্যে শ্বাসকষ্ট ও ফ্লুর প্রকোপ বাড়ছে। রোগ প্রতিরোধ ক্ষমতা বাড়াতে ভিটামিন সি সমৃদ্ধ খাবার ও পর্যাপ্ত ঘুমের তাগিদ দিচ্ছেন চিকিৎসকরা।',
    content: `আবহাওয়ার রূপবদলের সঙ্গে সঙ্গে মানবদেহের রোগ প্রতিরোধ ব্যবস্থার ওপর বাড়তি চাপ পড়ে। বিশিষ্ট মেডিসিন বিশেষজ্ঞ ডা. রেজওয়ানুল করিম জানান, "এই সময়ে অতিরিক্ত ঠান্ডা পানি পান করা থেকে বিরত থাকতে হবে এবং সকালে হালকা রোদ গায়ে লাগানো ভিটামিন ডি তৈরিতে সহায়তা করে।"

প্রতিদিনের খাদ্যতালিকায় তুলসী চা, আদা-লেবুর রস, দেশীয় ফল আমলকী, পেয়ারা এবং প্রচুর পরিমাণে শাকসবজি রাখা উচিত। এছাড়া ধূলাবালি এড়াতে ঘরের বাইরে মাস্ক ব্যবহারের অভ্যাস গড়ে তোলা প্রয়োজন।`,
    featuredImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'সকালে নিয়মিত শরীরচর্চা ও মুক্ত বাতাসে হাঁটা স্বাস্থ্যের জন্য অত্যন্ত উপকারী',
    imageCredit: 'লাইফস্টাইল ডেস্ক / দেশরিপোর্ট',
    categoryId: 'health',
    subcategory: 'স্বাস্থ্য ও পুষ্টি',
    authorId: 'usr-3',
    authorName: 'মাহমুদুল হাসান',
    tags: ['স্বাস্থ্য', 'লাইফস্টাইল', 'ফিটনেস', 'চিকিৎসা'],
    source: 'স্বাস্থ্য ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    viewCount: 6520,
    shareCount: 310,
    status: 'published'
  },
  {
    id: 'art-9',
    title: 'ইউরোপের বাজারে দেশীয় তৈরি পোশাক ও পরিবেশবান্ধব ডেনিমের নতুন রপ্তানি রেকর্ড',
    slug: 'bangladesh-rmg-eco-denim-export-record-europe',
    subtitle: 'গ্রিন ফ্যাক্টরি সার্টিফিকেশনে শীর্ষে বাংলাদেশ, আন্তর্জাতিক বায়ারদের ব্যাপক আগ্রহ',
    summary: 'ইউরোপীয় ইউনিয়নে বাংলাদেশি পরিবেশবান্ধব ও রি-সাইকেল্ড ডেনিম পোশাকের চাহিদা বৃদ্ধি পেয়েছে। চলতি অর্থবছরের প্রথম সাত মাসে ইউরোপে পোশাক রপ্তানিতে ১২ শতাংশ প্রবৃদ্ধি হয়েছে বলে জানিয়েছে বিজিএমইএ।',
    content: `বিশ্বের শীর্ষ ১০০ পরিবেশবান্ধব তৈরি পোশাক কারখানার মধ্যে অর্ধেকের বেশি বাংলাদেশে প্রতিষ্ঠিত হওয়ায় আন্তর্জাতিক বাজারে ইতিবাচক ভাবমূর্তি তৈরি হয়েছে। 

বিজিএমইএ সভাপতি বলেন, "আমরা এখন সাধারণ সস্তা পোশাকের গণ্ডি পেরিয়ে হাই-ভ্যালু ফ্যাশনেবল পণ্যে ঝুঁকছি। পরিবেশবান্ধব কারখানা ও কম কার্বন ফুটপ্রিন্টের কারণে ক্রেতারা এখন দীর্ঘমেয়াদি অর্ডারে বাংলাদেশকে সর্বোচ্চ অগ্রাধিকার দিচ্ছেন।"`,
    featuredImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'একটি আধুনিক গ্রিন ডেনিম পোশাক কারখানায় উৎপাদন পর্যবেক্ষণ',
    imageCredit: 'দেশরিপোর্ট বাণিজ্য আলোকচিত্রী',
    categoryId: 'economy',
    subcategory: 'পোশাক শিল্প',
    authorId: 'usr-4',
    authorName: 'রাশেদ খান',
    tags: ['অর্থনীতি', 'পোশাক শিল্প', 'রপ্তানি', 'ইউরোপ', 'বাণিজ্য'],
    source: 'বাণিজ্য প্রতিবেদক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 11200,
    shareCount: 780,
    status: 'published'
  },
  {
    id: 'art-10',
    title: 'পাবলিক বিশ্ববিদ্যালয়গুলোতে মৌলিক গবেষণায় জাতীয় বাজেট অনুদান দ্বিগুণ করার ঘোষণা',
    slug: 'public-university-fundamental-research-national-grant-boost',
    subtitle: 'কৃষি, ন্যানোটেকনোলজি ও বায়োমেডিকেলে উদ্ভাবনী প্রকল্প প্রণয়নে অগ্রাধিকার',
    summary: 'উচ্চশিক্ষার মান আন্তর্জাতিক মানে উন্নীত করতে এবং স্থানীয় সমস্যা সমাধানে কার্যকর বৈজ্ঞানিক আবিষ্কার বাড়াতে বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (ইউজিসি) বিশেষ গবেষণা তহবিল বরাদ্দ করেছে।',
    content: `বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (ইউজিসি) জানিয়েছে, ২০২৩-২৪ অর্থবছরের সংশোধিত বাজেটে দেশের সব সরকারি বিশ্ববিদ্যালয়ের গবেষকদের জন্য তহবিল দ্বিগুণের বেশি বাড়িয়ে বিশেষ স্কলারশিপের ব্যবস্থা করা হয়েছে।

শিক্ষাবিদরা এই সিদ্ধান্তকে স্বাগত জানিয়ে বলেছেন, শিল্পপ্রতিষ্ঠান ও বিশ্ববিদ্যালয়ের মধ্যে সেতুবন্ধন তৈরির মাধ্যমে গবেষণার ফলাফল দেশের সার্বিক অর্থনীতিতে সরাসরি প্রভাব রাখবে।`,
    featuredImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'বিশ্ববিদ্যালয় রসায়ন গবেষণাগারে তরুণ বিজ্ঞানীদের প্রকল্প কাজ',
    imageCredit: 'শিক্ষা ডেস্ক / দেশরিপোর্ট',
    categoryId: 'national',
    subcategory: 'উচ্চশিক্ষা',
    authorId: 'usr-2',
    authorName: 'ফারহানা ইসলাম',
    tags: ['শিক্ষা', 'গবেষণা', 'বিশ্ববিদ্যালয়', 'ইউজিসি'],
    source: 'শিক্ষা প্রতিবেদক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 540).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    viewCount: 7890,
    shareCount: 520,
    status: 'published'
  },
  {
    id: 'art-11',
    title: 'সাফ অনূর্ধ্ব-২০ নারী চ্যাম্পিয়নশিপে শক্তিশালী ভারতকে হারিয়ে ফাইনালে বাংলাদেশ',
    slug: 'saff-u20-women-championship-bangladesh-beats-india',
    subtitle: 'কমলাপুর স্টেডিয়ামে তীব্র প্রতিদ্বন্দ্বিতাপূর্ণ ম্যাচে ২-১ গোলের চোখধাঁধানো জয়',
    summary: 'বীরশ্রেষ্ঠ শহীদ সিপাহী মোস্তফা কামাল স্টেডিয়ামে হাজারো দর্শকের উচ্ছ্বাসের মাঝে অসাধারণ ফুটবল নৈপুণ্য প্রদর্শন করে ফাইনালে জায়গা করে নিয়েছে বাংলাদেশের অদম্য নারী ফুটবল দল।',
    content: `ম্যাচের শুরু থেকেই আক্রমণাত্মক ফুটবলের কৌশল বেছে নেয় বাংলাদেশ। প্রথমার্ধের ২৫ মিনিটে ডি-বক্সের বাইরে থেকে চোখধাঁধানো দূরপাল্লার শটে প্রথম গোলটি করেন শামসুন্নাহার জুনিয়র। দ্বিতীয়ার্ধে ভারত সমতায় ফিরলেও ম্যাচের অন্তিম মুহূর্তে অধিনায়ক আফঈদা খন্দকারের হেডারে ঐতিহাসিক জয় নিশ্চিত হয়।

ম্যাচ শেষে কোচ বলেন, "আমাদের মেয়েরা শারীরিক ও মানসিকভাবে দৃঢ় ছিল। পুরো টুর্নামেন্টে আমরা অপরাজিত চ্যাম্পিয়ন হওয়ার লক্ষ্য নিয়েই মাঠে নামব।"`,
    featuredImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'ম্যাচ জয়ের পর লাল-সবুজ পতাকা নিয়ে নারী দলের বিজয়োল্লাস',
    imageCredit: 'ক্রীড়া প্রতিবেদক / দেশরিপোর্ট',
    categoryId: 'sports',
    subcategory: 'ফুটবল',
    authorId: 'usr-3',
    authorName: 'মাহমুদুল হাসান',
    tags: ['খেলাধুলা', 'ফুটবল', 'সাফ', 'নারী ফুটবল'],
    source: 'ক্রীড়া ডেস্ক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 3,
    viewCount: 15400,
    shareCount: 2100,
    status: 'published',
    isTrending: true
  },
  {
    id: 'art-12',
    title: 'সাইবার হুমকি ও ব্যাংকিং ডেটা সুরক্ষায় নতুন জাতীয় সাইবার সিকিউরিটি ফ্রেমওয়ার্ক',
    slug: 'national-cyber-security-framework-banking-data-protection',
    subtitle: 'আর্থিক প্রতিষ্ঠানগুলোতে রিয়েল-টাইম থ্রেট ইন্টেলিজেন্স ও এআই ডিফেন্স বাধ্যতামূলক',
    summary: 'ডিজিটাল লেনদেনের নিরাপত্তা নিশ্চিতে কেন্দ্রীয় ব্যাংক ও তথ্যপ্রযুক্তি বিভাগের যৌথ উদ্যোগে আধুনিক সাইবার মনিটরিং সেন্টার স্থাপনের রোডম্যাপ ঘোষণা করা হয়েছে।',
    content: `অনলাইন ট্রানজেকশন এবং মোবাইল ব্যাংকিংয়ের ক্রমবর্ধমান বিস্তারের সঙ্গে সঙ্গে হ্যাকিং প্রতিরোধে উচ্চমানের এন্ড-টু-এন্ড এনক্রিপশন ও টু-ফ্যাক্টর অথেনটিকেশন কঠোরভাবে বাস্তবায়নের নির্দেশ দেওয়া হয়েছে। 

সাইবার বিশেষজ্ঞরা জানান, আগামী মাস থেকে বাণিজ্যিক ব্যাংকগুলোর কোর ব্যাংকিং সিস্টেমে নিয়মিত ভালনারেবিলিটি স্ক্যান ও পেনিট্রেশন টেস্টিং করা হবে।`,
    featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    imageCaption: 'সাইবার থ্রেট মনিটরিং স্ক্রিনে ডেটা বিশ্লেষণ করছেন নিরাপত্তা প্রকৌশলীরা',
    imageCredit: 'প্রযুক্তি ডেস্ক',
    categoryId: 'technology',
    subcategory: 'সাইবার নিরাপত্তা',
    authorId: 'usr-3',
    authorName: 'মাহমুদুল হাসান',
    tags: ['প্রযুক্তি', 'সাইবার নিরাপত্তা', 'ব্যাংকিং', 'এআই'],
    source: 'প্রযুক্তি প্রতিবেদক',
    publishedAt: new Date(Date.now() - 1000 * 60 * 660).toISOString(),
    updatedAt: new Date().toISOString(),
    readingTimeMinutes: 4,
    viewCount: 8900,
    shareCount: 610,
    status: 'published'
  }
];

export const initialAds: Advertisement[] = [
  {
    id: 'ad-1',
    name: 'হেডার লিডারবোর্ড ব্যানার (Adsterra 728x90)',
    provider: 'Adsterra',
    type: 'banner',
    bannerSize: '728x90',
    placement: 'below_header',
    codeSnippet: '<!-- Adsterra 728x90 Header Placement -->\n<div class="ad-placeholder" data-adsterra-zone="912838">Sponsored Content</div>',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=728&h=90&fit=crop&q=80',
    targetUrl: 'https://deshreport.com/sponsor',
    status: 'active',
    device: 'all',
    priority: 1,
    impressions: 48290,
    clicks: 1420
  },
  {
    id: 'ad-2',
    name: 'নিউজ সাইডবার স্কয়ার বিজ্ঞাপন (300x250)',
    provider: 'Adsterra',
    type: 'banner',
    bannerSize: '300x250',
    placement: 'sidebar',
    codeSnippet: '<!-- Adsterra 300x250 Sidebar Banner -->\n<div class="adsterra-sidebar-300">Premium Partner Ad</div>',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=250&fit=crop&q=80',
    targetUrl: 'https://deshreport.com/partner',
    status: 'active',
    device: 'desktop',
    priority: 2,
    impressions: 34100,
    clicks: 980
  },
  {
    id: 'ad-3',
    name: 'আর্টিকেল প্যারাগ্রাফ ইনলাইন বিজ্ঞাপন (Adsterra Native)',
    provider: 'Adsterra',
    type: 'banner',
    bannerSize: '336x280',
    placement: 'after_first_paragraph',
    codeSnippet: '<!-- In-Article Native Feed Unit -->',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=200&fit=crop&q=80',
    targetUrl: 'https://deshreport.com/cloud-services',
    status: 'active',
    device: 'all',
    priority: 3,
    impressions: 29800,
    clicks: 1120
  },
  {
    id: 'ad-4',
    name: 'Adsterra সোশ্যাল বার (Floating Notification Bar)',
    provider: 'Adsterra',
    type: 'social_bar',
    placement: 'footer',
    codeSnippet: '<script type="text/javascript" src="//pl19482910.adsterra.com/socialbar.js"></script>',
    status: 'active',
    device: 'all',
    priority: 1,
    impressions: 68120,
    clicks: 3410
  },
  {
    id: 'ad-5',
    name: 'Adsterra স্মার্ট পপআন্ডার (Popunder Direct)',
    provider: 'Adsterra',
    type: 'popunder',
    placement: 'header',
    codeSnippet: '<script type="text/javascript" src="//pl19482910.adsterra.com/popunder.js"></script>',
    status: 'paused',
    device: 'mobile',
    priority: 1,
    popunderFrequencyHours: 24,
    impressions: 12400,
    clicks: 650
  }
];

export const initialMedia: MediaItem[] = [
  {
    id: 'med-1',
    filename: 'dhaka_metro_rail_extension.webp',
    title: 'ঢাকা মেট্রোরেল সম্প্রসারণ কাজ',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200&auto=format&fit=crop&q=80',
    format: 'webp',
    sizeKb: 142,
    dimensions: '1920x1080',
    uploadedAt: '2026-03-01',
    altText: 'মেট্রোরেল লাইন ৬ কমলাপুর সংযোগ'
  },
  {
    id: 'med-2',
    filename: 'bangladesh_parliament_jatiya_sangsad.webp',
    title: 'জাতীয় সংসদ ভবন ও রাষ্ট্রীয় সংস্কার',
    url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&auto=format&fit=crop&q=80',
    format: 'webp',
    sizeKb: 188,
    dimensions: '1920x1200',
    uploadedAt: '2026-03-02',
    altText: 'জাতীয় সংসদ ভবন'
  },
  {
    id: 'med-3',
    filename: 'bangladesh_cricket_team_training.webp',
    title: 'বাংলাদেশ জাতীয় ক্রিকেট দলের নেট অনুশীলন',
    url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80',
    format: 'webp',
    sizeKb: 165,
    dimensions: '1920x1080',
    uploadedAt: '2026-03-03',
    altText: 'টাইগার্স ক্রিকেট অনুশীলন'
  },
  {
    id: 'med-4',
    filename: 'ai_technology_research_bangladesh.webp',
    title: 'এআই ও প্রযুক্তি গবেষণা',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
    format: 'webp',
    sizeKb: 210,
    dimensions: '1920x1280',
    uploadedAt: '2026-03-03',
    altText: 'প্রযুক্তিবিদ ও এআই স্বাস্থ্য সেবা'
  }
];

export const initialAutomationSources: AutomationSource[] = [
  // 1. National: Prothom Alo (প্রথম আলো)
  {
    id: 'src-1',
    name: 'Prothom Alo Top Feed (প্রথম আলো)',
    type: 'rss',
    url: 'https://www.prothomalo.com/feed',
    categoryId: 'national',
    region: 'national',
    description: 'শীর্ষ জাতীয় দৈনিক - অনুসন্ধানী প্রতিবেদন, রাজনীতি ও সমসাময়িক জাতীয় সংবাদ',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ১০:৪৫ পূর্বাহ্ন',
    articlesImported: 184,
    keywordFilters: ['রাজনীতি', 'অর্থনীতি', 'শিক্ষা']
  },
  // 2. National: BSS News (বাংলাদেশ সংবাদ সংস্থা)
  {
    id: 'src-2',
    name: 'BSS News RSS Feed (বাসস জাতীয় বার্তা সংস্থা)',
    type: 'rss',
    url: 'https://www.bssnews.net/feed/rss',
    categoryId: 'national',
    region: 'national',
    description: 'জাতীয় বার্তা সংস্থা - সরকারি নীতি, সার্কুলার, উন্নয়ন অবকাঠামো ও পরিবেশ সংবাদ',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ১০:১৫ পূর্বাহ্ন',
    articlesImported: 142,
    keywordFilters: ['বাংলাদেশ', 'উন্নয়ন', 'প্রশাসন']
  },
  // 3. National / Politics: bdnews24 (বিডিনিউজ২৪.কম)
  {
    id: 'src-3',
    name: 'bdnews24.com Bangla (বিডিনিউজ২৪.কম)',
    type: 'rss',
    url: 'https://bangla.bdnews24.com/feed',
    categoryId: 'politics',
    region: 'national',
    description: 'প্রথম ২৪/৭ অনলাইন পত্রিকা - তাৎক্ষণিক ব্রেকিং ও বিচার-প্রশাসন সংবাদ',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ১০:৫০ পূর্বাহ্ন',
    articlesImported: 98,
    keywordFilters: ['ব্রেকিং', 'আদালত', 'আইনশৃঙ্খলা']
  },
  // 4. International: BBC Bangla (বিবিসি বাংলা)
  {
    id: 'src-4',
    name: 'BBC News Bangla (বিবিসি বাংলা আরএসএস)',
    type: 'rss',
    url: 'https://feeds.bbci.co.uk/bengali/rss.xml',
    categoryId: 'international',
    region: 'international',
    description: 'আন্তর্জাতিক ভূরাজনীতি, বিশ্ব কূটনীতি ও বস্তুনিষ্ঠ তথ্যভিত্তিক বৈশ্বিক সংবাদ',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ১১:০৫ পূর্বাহ্ন',
    articlesImported: 215,
    keywordFilters: ['আন্তর্জাতিক', 'কূটনীতি', 'জলবায়ু', 'জাতিসংঘ']
  },
  // 5. Economy: Daily Jugantor (দৈনিক যুগান্তর)
  {
    id: 'src-5',
    name: 'Daily Jugantor (দৈনিক যুগান্তর)',
    type: 'rss',
    url: 'https://www.jugantor.com/feed/rss.xml',
    categoryId: 'economy',
    region: 'national',
    description: 'শীর্ষ জাতীয় দৈনিক - অর্থনীতি, বাজার বিশ্লেষণ ও ব্যবসা-বাণিজ্যের নিয়মিত আরএসএস',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ০৯:৪০ পূর্বাহ্ন',
    articlesImported: 110,
    keywordFilters: ['অর্থনীতি', 'ব্যাংক', 'রপ্তানি', 'ব্যবসা']
  },
  // 6. Technology & Science: DW Bangla (ডয়েচে ভেলে বাংলা)
  {
    id: 'src-6',
    name: 'DW Bangla (ডয়েচে ভেলে বাংলা)',
    type: 'rss',
    url: 'https://rss.dw.com/rdf/rss-ben-all',
    categoryId: 'technology',
    region: 'international',
    description: 'বিজ্ঞান প্রযুক্তি, পরিবেশ ও বিশ্ব সংস্কৃতির নির্ভরযোগ্য বাংলা সংবাদ প্রবাহ',
    fetchIntervalMinutes: 10,
    status: 'active',
    autoPublish: true,
    lastFetchedAt: '২০২৬-০৩-০৫ ০৭:১৫ পূর্বাহ্ন',
    articlesImported: 86
  }
];

export const initialSiteSettings: SiteSettings = {
  siteName: 'DeshReport',
  taglineBn: 'দেশের খবর, সবার আগে',
  taglineEn: 'Bangladesh, Reported First',
  siteDescription: 'DeshReport - বাংলাদেশের দ্রুততম ও বিশ্বাসযোগ্য আধুনিক ডিজিটাল সংবাদ পোর্টাল। নিরপেক্ষ সাংবাদিকতা, তাৎক্ষণিক ব্রেকিং নিউজ ও গভীর অনুসন্ধানী প্রতিবেদন।',
  contactEmail: 'editor@deshreport.com',
  contactPhone: '',
  address: 'খিলগাঁও, ঢাকা - ১২১৯, বাংলাদেশ',
  editorName: 'মোহাম্মদ মাসুদ রানা',
  facebookUrl: 'https://facebook.com/DeshReportOfficial',
  telegramUrl: 'https://t.me/DeshReportLive',
  youtubeUrl: 'https://youtube.com/@DeshReportBD',
  xUrl: 'https://twitter.com/DeshReport',
  pinterestUrl: '',
  whatsappNumber: '',
  featuredTopic: {
    tag: 'ইরান-যুক্তরাষ্ট্র যুদ্ধ',
    titleBn: 'ইরান-যুক্তরাষ্ট্র যুদ্ধ',
    active: true
  },
  googleAnalyticsId: 'G-D8F30NEM7X',
  googleSearchConsoleMeta: 'google-site-verification=deshreport_gsc_token_2026',
  copyrightBn: '© ২০২৬ DeshReport. সর্বস্বত্ব সংরক্ষিত। বস্তুনিষ্ঠ সাংবাদিকতা ও তথ্যের সত্যতায় আমাদের অঙ্গীকার।',
  timezone: 'Asia/Dhaka (GMT+6)',
  defaultLanguage: 'bn',
  theme: 'light',
  newsletterEnabled: true,
  readerRevenueManagerEnabled: true,
  readerRevenuePublicationId: '',
  readerRevenuePromptType: 'contributions',
  readerRevenueCustomSnippet: ''
};

export const initialPages: PageItem[] = [
  {
    id: 'page-about',
    slug: 'about-us',
    titleBn: 'আমাদের সম্পর্কে',
    titleEn: 'About Us',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `**দেশরিপোর্ট (DeshReport)** হলো বাংলাদেশের একটি দায়িত্বশীল, স্বাধীন ও বস্তুনিষ্ঠ ডিজিটাল সংবাদ মাধ্যম। তথ্যপ্রযুক্তির উৎকর্ষ ও সামাজিক দায়বদ্ধতাকে ধারণ করে আমরা প্রতিদিনের ঘটনাপ্রবাহকে সঠিক প্রেক্ষাপটে পাঠকদের সামনে তুলে ধরি।

### আমাদের লক্ষ্য ও দর্শন
সাংবাদিকতা কোনো কৃত্রিম অনুকরণ নয়; এটি সততা, পর্যবেক্ষণ ও মানবিক সংবেদনশীলতার মেলবন্ধন। দেশরিপোর্টের মূল লক্ষ্য হলো গুজব ও অপতথ্যের বিপরীতে সত্য ও বিশ্বাসযোগ্য তথ্য পরিবেশন করা। দেশের প্রত্যন্ত অঞ্চলের খেটে খাওয়া মানুষের কথা থেকে শুরু করে বিশ্ব কূটনীতি ও ভূরাজনীতি—প্রতিটি সংবাদে গভীরতা ও ভারসাম্য রক্ষা করা আমাদের নিয়মিত অনুশীলন।

### পেশাদার সম্পাদকীয় দল
আমাদের সম্পাদকীয় পর্ষদ অভিজ্ঞ পেশাদার সাংবাদিক, গবেষক ও কলামিস্টদের সমন্বয়ে গঠিত। প্রতিটি খবর প্রকাশের পূর্বে মাঠপর্যায়ের তথ্য যাচাই, প্রত্যক্ষদর্শী সাক্ষাত্কার এবং সরকারি-বেসরকারি নির্ভরযোগ্য নথিপত্র পর্যালোচনা করা হয়।

### প্রাতিষ্ঠানিক মূল্যবোধ
- **নিরপেক্ষতা ও বস্তুনিষ্ঠতা:** কোনো রাজনৈতিক বা বাণিজ্যিক গোষ্ঠীর স্বার্থে আপস না করা।
- **স্বচ্ছতা:** তথ্যের উৎস ও প্রেক্ষাপট স্পষ্ট রাখা।
- **জনস্বার্থ:** প্রান্তিক নাগরিকের মৌলিক অধিকার ও ন্যায়বিচারের পক্ষে অবস্থান নেওয়া।
- **দায়বদ্ধতা:** ভুল হলে নিঃসংকোচে স্বীকার করা ও দ্রুত সংশোধন প্রকাশ করা।`
  },
  {
    id: 'page-editorial-policy',
    slug: 'editorial-policy',
    titleBn: 'সম্পাদকীয় নীতিমালা',
    titleEn: 'Editorial Policy',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `দেশরিপোর্টের সম্পাদকীয় স্বাধীনতা আমাদের সবচেয়ে বড় শক্তি। আমরা পেশাদার সাংবাদিকতার স্বীকৃত জাতীয় ও আন্তর্জাতিক চার্টার এবং নৈতিক মূল্যবোধ অক্ষরে অক্ষরে অনুসরণ করি।

### ১. স্বাধীনতা ও নিরপেক্ষতা
দেশরিপোর্ট কোনো রাজনৈতিক দল, বাণিজ্যিক করপোরেট প্রতিষ্ঠান কিংবা প্রভাবশালী ব্যক্তিবর্গের প্রভাবমুক্ত থেকে সংবাদ পরিবেশন করে। সাংবাদিকতার বাইরে অন্য কোনো স্বার্থ আমাদের সম্পাদকীয় সিদ্ধান্তকে প্রভাবিত করে না।

### ২. তথ্য যাচাইয়ের কঠোর মানদণ্ড
- কোনো ব্রেকিং বা স্পর্শকাতর খবর প্রকাশের আগে অন্তত দুটি নির্ভরযোগ্য ও স্বাধীন উৎস থেকে তথ্য যাচাই করা বাধ্যতামূলক।
- তথ্য বা সূত্র অপ্রকাশিত রাখতে হলে সম্পাদকীয় প্রধানের পূর্বানুমোদন প্রয়োজন হয়।
- সামাজিক যোগাযোগ মাধ্যমের ভাইরাল পোস্ট সরাসরি সংবাদ হিসেবে প্রকাশ না করে তার সত্যতা ও প্রেক্ষাপট নিশ্চিত করা হয়।

### ৩. মতামত ও সংবাদের পার্থক্য
আমরা সংবাদ প্রতিবেদন এবং সম্পাদকীয় মতামত/বিশ্লেষণের মধ্যে সুস্পষ্ট পার্থক্য বজায় রাখি। মতামত অংশে বিভিন্ন চিন্তাধারার লেখকদের গণতান্ত্রিক সুযোগ দেওয়া হলেও সংবাদের মূল কাঠামো সর্বদা তথ্যভিত্তিক ও নিরপেক্ষ থাকে।

### ৪. ঘৃণা বক্তব্য ও সুরক্ষা নীতি
আমরা কোনো প্রকার জাতিগত, ধর্মীয়, বর্ণবাদী কিংবা লিঙ্গভিত্তিক বিদ্বেষমূলক বক্তব্য বা উস্কানিমূলক উপাদান প্রচার থেকে কঠোরভাবে বিরত থাকি। জাতীয় নিরাপত্তা ও মানবাধিকারের নীতিকে অগ্রাধিকার দেওয়া হয়।`
  },
  {
    id: 'page-correction-policy',
    slug: 'correction-policy',
    titleBn: 'সংশোধনী ও ভুলত্রুটি নীতি',
    titleEn: 'Correction Policy',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `দেশরিপোর্ট তথ্যের শতভাগ নিখুঁত পরিবেশনায় বিশ্বাস করে। তবে মানুষের কাজে অনিচ্ছাকৃত ভুল হওয়া অসম্ভব নয়। আমরা যে কোনো ধরণের তথ্যগত ত্রুটি চিহ্নিত হওয়ামাত্র স্বচ্ছতা ও দায়িত্বশীলতার সাথে তা সংশোধনে অঙ্গীকারবদ্ধ।

### সংশোধনের নিয়মাবলী:
১. **তাৎক্ষণিক হালনাগাদ:** কোনো সংবাদে তথ্যগত ভুল, নাম বা পরিসংখ্যানের ত্রুটি চিহ্নিত হলে তা অবিলম্বে সংশোধন করা হয়।
২. **স্বচ্ছ পাদটীকা:** সংশোধিত প্রতিবেদনের নিচে স্পষ্ট বাক্যে উল্লেখ করা হয়—কখন এবং কী সংশোধন করা হয়েছে, যাতে পাঠকদের কোনো বিভ্রান্তি না থাকে।
৩. **গুরুত্বপূর্ণ ভ্রান্তি সংশোধন:** বড় ধরনের কোনো ভুল হলে তা কেবল প্রতিবেদনের ভেতরে নয়, বরং হোমপেজের নোটিশ বা আলাদা ব্যাখ্যা দিয়ে স্পষ্ট করা হয়।

### পাঠকের সহযোগিতা:
আমাদের কোনো প্রতিবেদনে কোনো অসঙ্গতি নজরে এলে পাঠক সরাসরি আমাদের ইমেইল ঠিকানায় যোগাযোগ করতে পারেন:
**ইমেইল:** editor@deshreport.com অথবা news@deshreport.com
বিষয়লাইনে ‘সংশোধনী আবেদন - [খবরের শিরোনাম]’ উল্লেখ করার জন্য অনুরোধ জানানো হচ্ছে।`
  },
  {
    id: 'page-privacy-policy',
    slug: 'privacy-policy',
    titleBn: 'গোপনীয়তা ও প্রাইভেসি পলিসি',
    titleEn: 'Privacy Policy',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `দেশরিপোর্ট (DeshReport) তার ভিজিটর ও পাঠকদের ব্যক্তিগত তথ্যের গোপনীয়তাকে সর্বোচ্চ শ্রদ্ধার সাথে বিবেচনা করে। আপনি যখন আমাদের পোর্টাল ভিজিট করেন, আপনার তথ্য কীভাবে সংরক্ষিত ও ব্যবহৃত হয় তা নিচে স্পষ্ট করা হলো:

### ১. সংগৃহীত তথ্যের ধরন
- **অ্যানালিটিক্স তথ্য:** সাইটের ট্র্যাফিক, বহুল পঠিত ক্যাটাগরি ও ব্যবহারকারীর অভিজ্ঞতা উন্নয়নের জন্য গুগল অ্যানালিটিক্সের (GA4) মাধ্যমে স্ট্যান্ডার্ড ব্রাউজিং ডেটা সংগৃহীত হয়। এটি সম্পূর্ণ বেনামী (Anonymous) এবং কোনো ব্যক্তিগত পরিচয় ধারণ করে না।
- **যোগাযোগের তথ্য:** আপনি যখন মতামত ফর্মের মাধ্যমে বার্তা পাঠান, আপনার প্রদত্ত নাম ও ইমেইল ঠিকানা শুধুমাত্র আপনার বার্তার উত্তর দেওয়ার উদ্দেশ্যেই সংরক্ষিত থাকে।

### ২. তথ্য নিরাপত্তা ও তৃতীয় পক্ষ
আমরা কোনো অবস্থাতেই পাঠকদের ব্যক্তিগত তথ্য বা ইমেইল ঠিকানা কোনো তৃতীয় পক্ষের কাছে বিক্রি, ভাড়া বা বাণিজ্যিক উদ্দেশ্যে হস্তান্তর করি না। আন্তর্জাতিক মানসম্পন্ন আধুনিক এনক্রিপশন প্রটোকলের মাধ্যমে সাইটের তথ্য সুরক্ষিত রাখা হয়।

### ৩. কুকিজের ব্যবহার
সাইটের লোডিং স্পিড এবং পাঠকের পছন্দসই ইন্টারফেস (যেমন ডার্ক/লাইট মোড) সংরক্ষণ করতে ব্রাউজার কুকিজ ব্যবহৃত হয়। পাঠক চাইলে তার নিজস্ব ব্রাউজার সেটিংস থেকে যে কোনো সময় কুকিজ মুছে ফেলতে পারেন।`
  },
  {
    id: 'page-terms',
    slug: 'terms',
    titleBn: 'ব্যবহারের শর্তাবলী',
    titleEn: 'Terms and Conditions',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `দেশরিপোর্ট ওয়েবসাইটে আপনাকে স্বাগতম। এই পোর্টাল ও এর যে কোনো ডিজিটাল সেবা ব্যবহারের মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীর সাথে একমত প্রকাশ করছেন:

### ১. মেধাস্বত্ব ও কপিরাইট
দেশরিপোর্টে প্রকাশিত সকল সংবাদ, অনুসন্ধানী প্রতিবেদন, আলোকচিত্র, গ্রাফিক্স ও ভিডিও কনটেন্ট কপিরাইট আইন অনুযায়ী সংরক্ষিত। পূর্বলিখিত লিখিত অনুমতি ছাড়া যে কোনো বাণিজ্যিক পুনঃব্যবহার, হুবহু পুনর্মুদ্রণ বা পাইরেসি সম্পূর্ণ নিষিদ্ধ ও আইনত দণ্ডনীয়।

### ২. উদ্ধৃতি ও তথ্যসূত্র
শিক্ষামূলক, সামাজিক বা পর্যালোচনামূলক উদ্দেশ্যে কোনো প্রতিবেদনের অংশবিশেষ উদ্ধৃত করা হলে সেখানে স্পষ্টাক্ষরে **‘দেশরিপোর্ট (DeshReport)’** এর নাম ও সক্রিয় ওয়েব লিংক ক্রেডিট হিসেবে উল্লেখ করতে হবে।

### ৩. মন্তব্য ও পাঠকের আচরণ
সাইটের মন্তব্য অংশে কোনো অশালীন, মানহানিকর, ধর্মীয় অনুভূতিতে আঘাত হানার মতো বক্তব্য দেওয়া যাবে না। সুস্থ বিতর্কের পরিবেশ বজায় রাখা প্রত্যেক পাঠকের নাগরিক দায়িত্ব।`
  },
  {
    id: 'page-contact',
    slug: 'contact',
    titleBn: 'যোগাযোগ',
    titleEn: 'Contact',
    status: 'published',
    updatedAt: '২০২৬-০৩-০৫',
    contentBn: `দেশরিপোর্ট পাঠকের মতামত, খবরের সূত্র ও গঠনমূলক পরামর্শকে সবসময় স্বাগত জানায়। আমাদের সাথে প্রাতিষ্ঠানিক যোগাযোগের বিস্তারিত তথ্য নিচে দেওয়া হলো:

### প্রধান সম্পাদকীয় কার্যালয়
**দেশরিপোর্ট (DeshReport)**
ঠিকানা: খিলগাঁও, ঢাকা - ১২১৯, বাংলাদেশ
সম্পাদক ও প্রকাশক: মোহাম্মদ মাসুদ রানা

### প্রাতিষ্ঠানিক ইমেইল যোগাযোগ
আমাদের যেকোনো তথ্য, সংবাদ বা প্রশ্নের জন্য সরাসরি ইমেইলে যোগাযোগ করুন (আমাদের নিয়মিত যোগাযোগের প্রধান মাধ্যম ইমেইল):
- **সম্পাদকীয় ও প্রধান ডেস্ক:** editor@deshreport.com
- **সংবাদ প্রেরক ও প্রেস বিজ্ঞপ্তি:** news@deshreport.com
- **সংশোধনী ও মতামত:** corrections@deshreport.com
- **বিজ্ঞাপন ও বাণিজ্যিক যোগাযোগ:** ads@deshreport.com

আমাদের টিম কর্মদিবসে প্রতিটি ইমেইল অত্যন্ত গুরুত্বের সাথে পর্যালোচনা করে দ্রুততম সময়ে উত্তর প্রদান করে। নিচের অনলাইন ফর্মের মাধ্যমেও আপনি সরাসরি বার্তা পাঠাতে পারেন।`
  }
];
