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

জাতিসংঘের মহাসচিব আন্তোনিও গুতেরেস বলেন, "এটি বিশ্ববাসীর দীর্ঘ প্রতীক্ষিত এক সিদ্ধান্ত। এখন সবচেয়ে জরুরি হলো মাঠপর্যায়ে এই প্রস্তাবের শতভাগ বাস্তবায়ন নিশ্চিত করা এবং নিরীহ বেসামরিক জনগোষ্ঠীর জীবন রক্ষা করা।"`,
    featuredImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=800&auto=format&fit=crop&q=80',
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
  contactPhone: '+880 1711-000000',
  address: 'খিলগাঁও, ঢাকা - ১২১৯',
  editorName: 'মোহাম্মদ মাসুদ রানা',
  facebookUrl: 'https://facebook.com/DeshReportOfficial',
  telegramUrl: 'https://t.me/DeshReportLive',
  youtubeUrl: 'https://youtube.com/@DeshReportBD',
  xUrl: 'https://twitter.com/DeshReport',
  whatsappNumber: '+8801711000000',
  googleAnalyticsId: 'G-D8F30NEM7X',
  googleSearchConsoleMeta: 'google-site-verification=deshreport_gsc_token_2026',
  copyrightBn: '© ২০২৬ DeshReport. সর্বস্বত্ব সংরক্ষিত। অনুমতি ছাড়া যেকোনো প্রতিবেদন পুনঃপ্রকাশ সম্পূর্ণ নিষিদ্ধ।',
  timezone: 'Asia/Dhaka (GMT+6)',
  defaultLanguage: 'bn',
  theme: 'light',
  newsletterEnabled: true
};

export const initialPages: PageItem[] = [
  {
    id: 'page-about',
    slug: 'about-us',
    titleBn: 'আমাদের সম্পর্কে',
    titleEn: 'About Us',
    status: 'published',
    updatedAt: '২০২৬-০১-১৫',
    contentBn: `**দেশরিপোর্ট (DeshReport)** হলো একবিংশ শতাব্দীর আধুনিক বাংলাদেশের একটি স্বাধীন, নিরপেক্ষ ও প্রযুক্তিচালিত ডিজিটাল সংবাদ মাধ্যম। 

আমাদের অঙ্গীকার—"দেশের খবর, সবার আগে"। তথ্যের সত্যতা, তথ্যের গভীরতা এবং নৈতিক সাংবাদিকতার মানদণ্ড বজায় রেখে আমরা সারা দেশের প্রত্যন্ত অঞ্চল থেকে শুরু করে আন্তর্জাতিক পরিমণ্ডলের গুরুত্বপূর্ণ প্রতিটি ঘটনা বস্তুনিষ্ঠভাবে তুলে ধরি।`
  },
  {
    id: 'page-editorial-policy',
    slug: 'editorial-policy',
    titleBn: 'সম্পাদকীয় নীতিমালা',
    titleEn: 'Editorial Policy',
    status: 'published',
    updatedAt: '২০২৬-০১-২০',
    contentBn: `দেশরিপোর্টের সম্পাদকীয় স্বাধীনতা সম্পূর্ণভাবে নিরপেক্ষ। কোনো রাজনৈতিক দল, করপোরেট স্বার্থগোষ্ঠী কিংবা ব্যক্তিগত প্রভাব আমাদের সাংবাদিকতাকে পরিচালিত করে না। প্রতিটি প্রতিবেদন প্রকাশের পূর্বে অন্তত দুটি স্বাধীন উৎস থেকে তথ্য যাচাই করা বাধ্যতামূলক।`
  },
  {
    id: 'page-correction-policy',
    slug: 'correction-policy',
    titleBn: 'সংশোধনী ও ভুলত্রুটি নীতি',
    titleEn: 'Correction Policy',
    status: 'published',
    updatedAt: '২০২৬-০২-০১',
    contentBn: `আমরা তথ্যের নিখুঁত নির্ভুলতায় বিশ্বাসী। কোনো প্রতিবেদনে কোনো অসঙ্গতি বা অনাকাঙ্ক্ষিত ভুল পরিলক্ষিত হলে তা অবিলম্বে সংশোধিত শিরোনামসহ আর্টিকেলের পাদটীকায় স্পষ্টাক্ষরে ব্যাখ্যা করা হয়। পাঠক সরাসরি editor@deshreport.com ঠিকানায় সংশোধনী প্রস্তাব পাঠাতে পারেন।`
  },
  {
    id: 'page-privacy-policy',
    slug: 'privacy-policy',
    titleBn: 'গোপনীয়তা ও প্রাইভেসি পলিসি',
    titleEn: 'Privacy Policy',
    status: 'published',
    updatedAt: '২০২৬-০১-১০',
    contentBn: `দেশরিপোর্ট পাঠকদের ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা দিতে অঙ্গীকারবদ্ধ। সাইটে ব্রাউজিংকালে সংগৃহীত অ্যানালিটিক্স ডেটা শুধুমাত্র ব্যবহারকারীর অভিজ্ঞতা উন্নয়ন এবং প্রাসঙ্গিক কন্টেন্ট সরবরাহের উদ্দেশ্যে ব্যবহৃত হয়। আমরা কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে ব্যক্তিগত তথ্য হস্তান্তর করি না।`
  },
  {
    id: 'page-terms',
    slug: 'terms',
    titleBn: 'ব্যবহারের শর্তাবলী',
    titleEn: 'Terms and Conditions',
    status: 'published',
    updatedAt: '২০২৬-০১-১০',
    contentBn: `দেশরিপোর্টের ওয়েবসাইট ও ডিজিটাল কন্টেন্ট ব্যবহারের ক্ষেত্রে বাংলাদেশ কপিরাইট আইন ও তথ্যপ্রযুক্তি নীতিমালা প্রযোজ্য। লিখিত পূর্বানুমতি ব্যতীত সাইটের কোনো ছবি, ভিডিও বা প্রতিবেদন হুবহু বা আংশিক বাণিজ্যিক উদ্দেশ্যে নকল করা দণ্ডনীয় অপরাধ।`
  },
  {
    id: 'page-contact',
    slug: 'contact',
    titleBn: 'যোগাযোগ',
    titleEn: 'Contact',
    status: 'published',
    updatedAt: '২০২৬-০১-২৫',
    contentBn: `**প্রধান কার্যালয়:**
খিলগাঁও, ঢাকা - ১২১৯, বাংলাদেশ
সম্পাদক ও প্রকাশক: মোহাম্মদ মাসুদ রানা
ইমেইল: news@deshreport.com, editor@deshreport.com
ফোন: +৮৮০ ২ ৯৯৮৮৭৭৬৬, মোবাইল: +৮৮০ ১৭১১ ০০০০০০
বিজ্ঞাপন বিভাগ: ads@deshreport.com`
  }
];
