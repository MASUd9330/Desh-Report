export interface TrustedFeedPreset {
  id: string;
  name: string;
  agencyNameBn: string;
  type: 'rss' | 'news_api' | 'json';
  url: string;
  categoryId: string;
  categoryNameBn: string;
  region: 'national' | 'international';
  countryBadge: string;
  flag: string;
  description: string;
  fetchIntervalMinutes: number;
  tags: string[];
  sampleArticles: Array<{
    title: string;
    summary: string;
    content: string;
    sourceUrl: string;
    image: string;
    cat: string;
  }>;
}

export const trustedFeedPresets: TrustedFeedPreset[] = [
  // ==================== 1. NATIONAL TRUSTED FEEDS (জাতীয় সংবাদ মাধ্যম) ====================
  {
    id: 'preset-bss',
    name: 'BSS News (বাংলাদেশ সংবাদ সংস্থা)',
    agencyNameBn: 'বাংলাদেশ সংবাদ সংস্থা (বাসস)',
    type: 'rss',
    url: 'https://www.bssnews.net/feed/rss',
    categoryId: 'national',
    categoryNameBn: 'জাতীয় সংবাদ',
    region: 'national',
    countryBadge: 'বাংলাদেশ (জাতীয়)',
    flag: '🇧🇩',
    description: 'বাংলাদেশের জাতীয় বার্তা সংস্থা (BSS)-এর অফিসিয়াল আরএসএস ফিড। সরকারি নীতি, জাতীয় অর্থনীতি ও রাষ্ট্রীয় উন্নয়ন কর্মকাণ্ডের বিশ্বস্ত উৎস।',
    fetchIntervalMinutes: 30,
    tags: ['বাসস', 'বাংলাদেশ', 'সরকার', 'জাতীয়'],
    sampleArticles: [
      {
        title: 'বাংলাদেশ ব্যাংকের বৈদেশিক মুদ্রার রিজার্ভ ফের ২০ বিলিয়ন ডলার অতিক্রম করল',
        summary: 'প্রবাসী আয়ের ইতিবাচক প্রবৃদ্ধি ও রপ্তানি আয়ের প্রভাবে রিজার্ভের পরিমাণ বৃদ্ধি পেয়েছে বলে জানিয়েছে কেন্দ্রীয় ব্যাংক।',
        content: 'বাংলাদেশ ব্যাংকের গভর্নর আজ সাংবাদিকদের ব্রিফিংকালে জানান, বৈধ ব্যাংক চ্যানেলে রেমিট্যান্স আসার হার গত দুই মাসে রেকর্ড পরিমাণ বৃদ্ধি পেয়েছে। এর ফলে বৈদেশিক মুদ্রার মোট রিজার্ভ ফের ২০ বিলিয়ন ডলারের মাইলফলক অতিক্রম করেছে। ব্যাংকগুলোতে তারল্য সংকট অনেকটাই নিরসন হয়েছে বলে জানিয়েছে মনিটরিং সেল।',
        sourceUrl: 'https://www.bssnews.net/economy/forex-reserve-crosses-20b',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1000&auto=format&fit=crop&q=80',
        cat: 'business'
      },
      {
        title: 'চট্টগ্রাম বন্দরে অত্যাধুনিক স্বয়ংক্রিয় স্ক্যানার স্থাপন, কনটেইনার খালাসে নতুন গতি',
        summary: 'পণ্য খালাসের গতি ত্বরান্বিত করতে এবং শুল্ক ফাঁকি রোধে চট্টগ্রাম বন্দরে চারটি নতুন সর্বাধুনিক স্ক্যানার অপারেশনাল করা হয়েছে।',
        content: 'দেশের প্রধান সমুদ্রবন্দর চট্টগ্রামে আমদানি-রপ্তানি বাণিজ্যের জট নিরসনে কৃত্রিম বুদ্ধিমত্তা চালিত এক্স-রে কনটেইনার স্ক্যানার স্থাপন সফলভাবে সম্পন্ন হয়েছে। বন্দর কর্তৃপক্ষের চেয়ারম্যান জানান, এর মাধ্যমে দৈনিক অতিরিক্ত এক হাজার কনটেইনার কোনো ধরনের বিলম্ব ছাড়াই দ্রুত খালাস করা সম্ভব হবে।',
        sourceUrl: 'https://www.bssnews.net/chittagong-port-ai-scanners-operational',
        image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      },
      {
        title: 'উপকূলীয় অঞ্চলে ২০ লাখ ফলজ ও বনজ চারা রোপণের মেগা কর্মসূচি শুরু',
        summary: 'ঘূর্ণিঝড় ও জলোচ্ছ্বাস প্রতিরোধে বন বিভাগের তত্ত্বাবধানে সবুজ বেষ্টনী গড়ে তোলার জাতীয় প্রকল্প উদ্বোধন।',
        content: 'পরিবেশ, বন ও জলবায়ু পরিবর্তন মন্ত্রণালয়ের উদ্যোগে দেশের দক্ষিণ-পশ্চিমাঞ্চলের ৭টি উপকূলীয় জেলায় ম্যানগ্রোভ ও স্থানীয় ফলজ বৃক্ষের সমন্বয়ে নতুন সবুজ বেষ্টনী সৃষ্টির উদ্যোগ নেওয়া হয়েছে। স্থানীয় শিক্ষার্থী ও তরুণ স্বেচ্ছাসেবকরা এই কর্মসূচিতে সক্রিয়ভাবে অংশ নিচ্ছেন।',
        sourceUrl: 'https://www.bssnews.net/environment/mega-coastal-afforestation',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      }
    ]
  },
  {
    id: 'preset-prothomalo',
    name: 'Prothom Alo Top News (প্রথম আলো)',
    agencyNameBn: 'দৈনিক প্রথম আলো',
    type: 'rss',
    url: 'https://www.prothomalo.com/feed',
    categoryId: 'national',
    categoryNameBn: 'জাতীয় ও রাজনীতি',
    region: 'national',
    countryBadge: 'বাংলাদেশ (শীর্ষ দৈনিক)',
    flag: '🇧🇩',
    description: 'দেশের সর্বাধিক প্রচারিত ও পঠিত শীর্ষ জাতীয় দৈনিক প্রথম আলোর মূল আরএসএস সংবাদ স্ট্রিম। অনুসন্ধানী ও সাম্প্রতিক ঘটনাবলী।',
    fetchIntervalMinutes: 20,
    tags: ['প্রথম আলো', 'শীর্ষ খবর', 'বাংলাদেশ', 'রাজনীতি'],
    sampleArticles: [
      {
        title: 'মেট্রোরেলের দ্বিতীয় পর্বের ট্রায়াল রান সফল: চলতি বছরই মতিঝিল-কমলাপুর চলাচল',
        summary: 'মাটির নিচের অবকাঠামো ও রেললাইন পাতার কাজ চূড়ান্ত পর্যায়ে পৌঁছানোর পর আজ সকালে চালানো হলো প্রথম বিশেষ ট্রায়াল ট্রেন।',
        content: 'ঢাকা ম্যাস ট্রানজিট কোম্পানি লিমিটেড (ডিএমটিসিএল) কর্তৃপক্ষ জানিয়েছে, মতিঝিল থেকে কমলাপুর পর্যন্ত অংশে পরীক্ষামূলক ট্রেন চলাচল সম্পূর্ণ নিরাপদ ও মানসম্মত প্রমাণিত হয়েছে। আগামী কয়েক সপ্তাহের মধ্যে সিগন্যালিং ও পাওয়ার ডিস্ট্রিবিউশন সিস্টেম পুরোপুরি ইন্টিগ্রেট করা হবে।',
        sourceUrl: 'https://www.prothomalo.com/bangladesh/dhaka/metro-rail-kamalapur-trial-run',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      },
      {
        title: 'সারাদেশে প্রাথমিক বিদ্যালয়ে শিক্ষক নিয়োগে স্বচ্ছতা নিশ্চিত করতে ডিজিটাল মূল্যায়ন পদ্ধতি',
        summary: 'ওএমআর শিট মূল্যায়ন ও মৌখিক পরীক্ষার স্কোর তাৎক্ষণিক সেন্ট্রাল সার্ভারে আপলোডের নতুন সফটওয়্যার তৈরি করেছে প্রাথমিক শিক্ষা অধিদপ্তর।',
        content: 'প্রাথমিক বিদ্যালয়ে সহকারী শিক্ষক নিয়োগ প্রক্রিয়ায় যেকোনো প্রকার অনিয়ম বা প্রভাব খাটানোর সুযোগ বন্ধ করতে শতভাগ স্বয়ংক্রিয় মেধা মূল্যায়ন প্ল্যাটফর্ম চালু করা হয়েছে। সংশ্লিষ্ট কর্মকর্তারা জানান, লিখিত ও মৌখিক উভয় পরীক্ষার ফলাফল কেন্দ্রীয়ভাবে এনক্রিপ্ট থাকবে।',
        sourceUrl: 'https://www.prothomalo.com/education/primary-teacher-recruitment-digital-system',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      }
    ]
  },
  {
    id: 'preset-bdnews24',
    name: 'bdnews24.com Bangla Feed (বিডিনিউজ২৪)',
    agencyNameBn: 'বিডিনিউজ২৪.কম',
    type: 'rss',
    url: 'https://bangla.bdnews24.com/feed',
    categoryId: 'national',
    categoryNameBn: 'ব্রেকিং ও জাতীয়',
    region: 'national',
    countryBadge: 'বাংলাদেশ (অনলাইন নিউজ)',
    flag: '🇧🇩',
    description: 'বাংলাদেশের প্রথম ২৪/৭ ইন্টারনেট সংবাদপত্র বিডিনিউজ২৪-এর দ্রুততম ব্রেকিং নিউজ এবং লাইভ আপডেট আরএসএস ফিড।',
    fetchIntervalMinutes: 15,
    tags: ['বিডিনিউজ২৪', 'অনলাইন', 'ব্রেকিং', 'বাংলাদেশ'],
    sampleArticles: [
      {
        title: 'উচ্চ আদালতের নির্দেশে নদীর সীমানা পিলার পুনঃনির্ধারণে নামছে বিশেষ টাস্কফোর্স',
        summary: 'তুরাগ, বুড়িগঙ্গা ও বালু নদীর অবৈধ দখলদার উচ্ছেদে এবার জিও-স্পেশিয়াল স্যাটেলাইট ম্যাপিংয়ের মাধ্যমে চূড়ান্ত সীমানা চিহ্নিত করা হচ্ছে।',
        content: 'নদী রক্ষা কমিশনের সভাপতি জানিয়েছেন, স্যাটেলাইট রিমোট সেন্সিং ডেটা ও ১৯৬০ সালের সিএস রেকর্ডের সমন্বয়ে নদীর প্রকৃত সীমানা বের করা হয়েছে। অবৈধ পাকা স্থাপনাগুলো আগামী সপ্তাহ থেকে ভেঙে দেওয়ার স্পষ্ট নির্দেশনা দিয়েছে সংশ্লিষ্ট মন্ত্রণালয়।',
        sourceUrl: 'https://bangla.bdnews24.com/bangladesh/river-eviction-satellite-taskforce',
        image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      },
      {
        title: 'বঙ্গবন্ধু টানেলে যানবাহনের চাপ বৃদ্ধি: বিকল্প এক্সপ্রেসওয়ে চালুর প্রস্তুতি',
        summary: 'কর্ণফুলী নদীর তলদেশের টানেল দিয়ে পণ্যবাহী ভারী যানবাহনের চলাচল নির্বিঘ্ন করতে আনোয়ারার সংযোগ সড়ক ৪ লেনে উন্নীত করা হচ্ছে।',
        content: 'কর্ণফুলী টানেল ব্যবহারকারী পরিবহন মালিক ও চালকরা জানান, টানেল চালু হওয়ার পর দক্ষিণ চট্টগ্রামের সাথে ঢাকা ও কক্সবাজারের যোগাযোগ সময় অন্তত দুই ঘণ্টা কমেছে। সংযোগ সড়কের সম্প্রসারণ দ্রুত শেষ হলে পর্যটন ও শিল্পপণ্যের পরিবহন আরও সাশ্রয়ী হবে।',
        sourceUrl: 'https://bangla.bdnews24.com/bangladesh/bangabandhu-tunnel-expressway-extension',
        image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      }
    ]
  },
  {
    id: 'preset-dailystar',
    name: 'The Daily Star (ডেইলি স্টার)',
    agencyNameBn: 'দ্য ডেইলি স্টার',
    type: 'rss',
    url: 'https://www.thedailystar.net/frontpage/rss.xml',
    categoryId: 'business',
    categoryNameBn: 'অর্থনীতি ও বিশ্লেষণ',
    region: 'national',
    countryBadge: 'বাংলাদেশ (ইংরেজি শীর্ষ)',
    flag: '🇧🇩',
    description: 'বাংলাদেশের অন্যতম সম্মানজনক ইংরেজি জাতীয় দৈনিক The Daily Star-এর ফ্রন্টপেজ আরএসএস ফিড। ম্যাক্রো-ইকোনমি ও নীতিনির্ধারণী সংবাদ।',
    fetchIntervalMinutes: 45,
    tags: ['Daily Star', 'Economy', 'Policy', 'Bangladesh'],
    sampleArticles: [
      {
        title: 'তৈরি পোশাক খাতের গ্রিন ফ্যাক্টরি সার্টিফিকেশনে ফের বিশ্বরেকর্ড গড়ল বাংলাদেশ',
        summary: 'বিশ্বের শীর্ষ ১০০ পরিবেশবান্ধব তৈরি পোশাক কারখানার মধ্যে ৫৭টিই এখন বাংলাদেশে, যা বৈশ্বিক ক্রেতাদের নজর কাড়ছে।',
        content: 'ইউএস গ্রিন বিল্ডিং কাউন্সিল (USGBC) জানিয়েছে, বাংলাদেশে আরও তিনটি তৈরি পোশাক কারখানা মর্যাদাপূর্ণ প্ল্যাটিনাম ক্যাটাগরিতে সনদ লাভ করেছে। এর ফলে পরিবেশবান্ধব টেকসই পোশাকে বাংলাদেশের একক আধিপত্য আরও সুসংহত হলো।',
        sourceUrl: 'https://www.thedailystar.net/business/green-garment-factories-world-record',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80',
        cat: 'business'
      },
      {
        title: 'কৃত্রিম বুদ্ধিমত্তা ব্যবহারে ফ্রিল্যান্সিংয়ে নতুন দিগন্ত: তরুণদের আয় বাড়ছে',
        summary: 'সফটওয়্যার ডেভেলপমেন্ট ও ক্লাউড ডেটা অ্যানালিটিক্সে দক্ষ বাংলাদেশি ফ্রিল্যান্সারদের বার্ষিক রেমিট্যান্স আয় নতুন মাইলফলক স্পর্শ করেছে।',
        content: 'তথ্য ও যোগাযোগ প্রযুক্তি বিভাগের এক জরিপে দেখা গেছে, জেনারেটিভ এআই ও মেশিন লার্নিং প্রযুক্তি রপ্তানি করে দেশীয় তরুণ ফ্রিল্যান্সাররা আন্তর্জাতিক রিমোট জবে দ্রুত নিজেদের অবস্থান জোরদার করছেন। সরকারি হাইটেক পার্কগুলোতে বিনামূল্যে প্রশিক্ষণ দেওয়া হচ্ছে।',
        sourceUrl: 'https://www.thedailystar.net/tech-startup/bangladesh-freelancers-ai-growth',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
        cat: 'technology'
      }
    ]
  },
  {
    id: 'preset-ittefaq',
    name: 'Daily Ittefaq (দৈনিক ইত্তেফাক)',
    agencyNameBn: 'দৈনিক ইত্তেফাক',
    type: 'rss',
    url: 'https://www.ittefaq.com.bd/feed',
    categoryId: 'national',
    categoryNameBn: 'জাতীয় ও সমাজ',
    region: 'national',
    countryBadge: 'বাংলাদেশ (ঐতিহ্যবাহী)',
    flag: '🇧🇩',
    description: 'বাংলাদেশের স্বাধীনতা ও জাতীয় ইতিহাসের সাথে অঙ্গাঙ্গীভাবে জড়িত ঐতিহ্যবাহী দৈনিক ইত্তেফাকের অফিসিয়াল ফিড।',
    fetchIntervalMinutes: 30,
    tags: ['ইত্তেফাক', 'জাতীয়', 'বাংলাদেশ'],
    sampleArticles: [
      {
        title: 'স্মার্ট সেচ ও সৌরবিদ্যুতে বরেন্দ্র অঞ্চলে ভূগর্ভস্থ পানির অপচয় রোধে বড় সাফল্য',
        summary: 'সৌরচালিত পাম্প এবং পাইপলাইনের মাধ্যমে সরাসরি ড্রিপ ইরিগেশন পদ্ধতিতে খরা মৌসুমেও চাষাবাদে বিদ্যুৎ ও পানির ৬০% সাশ্রয়।',
        content: 'রাজশাহী ও চাঁপাইনবাবগঞ্জের বরেন্দ্র অঞ্চলে ভূগর্ভস্থ পানির স্তর নেমে যাওয়ার সংকট নিরসনে সৌরবিদ্যুৎ চালিত অটোমেটেড সেচ ব্যবস্থাপনা নতুন আশার সঞ্চার করেছে। কৃষি কর্মকর্তারা জানান, এই মডেল সারাদেশে ছড়িয়ে দেওয়া হবে।',
        sourceUrl: 'https://www.ittefaq.com.bd/national/solar-irrigation-barind-success',
        image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1000&auto=format&fit=crop&q=80',
        cat: 'national'
      }
    ]
  },

  // ==================== 2. INTERNATIONAL TRUSTED FEEDS (আন্তর্জাতিক শীর্ষ সংবাদ মাধ্যম) ====================
  {
    id: 'preset-bbc-bangla',
    name: 'BBC News Bangla (বিবিসি বাংলা)',
    agencyNameBn: 'বিবিসি বাংলা (BBC News Bengali)',
    type: 'rss',
    url: 'https://feeds.bbci.co.uk/bengali/rss.xml',
    categoryId: 'international',
    categoryNameBn: 'আন্তর্জাতিক ও দক্ষিণ এশিয়া',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (যুক্তরাজ্য)',
    flag: '🇬🇧',
    description: 'বিবিসি ওয়ার্ল্ড সার্ভিসের শতাব্দীপ্রাচীন বিশ্বস্ত সংবাদ ধারা। আন্তর্জাতিক বিশ্বরাজনীতি, কূটনীতি ও বস্তুনিষ্ঠ তথ্যভিত্তিক প্রতিবেদন।',
    fetchIntervalMinutes: 20,
    tags: ['বিবিসি', 'আন্তর্জাতিক', 'বিবিসি বাংলা', 'দক্ষিণ এশিয়া'],
    sampleArticles: [
      {
        title: 'জাতিসংঘ নিরাপত্তা পরিষদে জলবায়ু তহবিলের জন্য উন্নয়নশীল দেশগুলোর যৌথ ঘোষণা',
        summary: 'বিশ্ব উষ্ণায়ন ২ ডিগ্রি সেলসিয়াসের নিচে রাখতে ধনী দেশগুলোর প্রতিশ্রুতি অনুযায়ী দ্রুত ১০০ বিলিয়ন ডলার তহবিল ছাড়ের দাবি।',
        content: 'জাতিসংঘের সাধারণ পরিষদ অধিবেশনে বক্তৃতাকালে প্রতিনিধিরা জানান, বৈশ্বিক উষ্ণতা বৃদ্ধির কারণে সবচেয়ে বেশি ক্ষতিগ্রস্ত হচ্ছে উপকূলীয় ও উন্নয়নশীল দেশগুলো। কার্বন নিঃসরণ কমানোর পাশাপাশি আর্থিক ক্ষতিপূরণ নিশ্চিত করতে বাধ্যতামূলক আইন করার প্রস্তাব উঠেছে।',
        sourceUrl: 'https://www.bbc.com/bengali/news-international-climate-un-accord',
        image: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=1000&auto=format&fit=crop&q=80',
        cat: 'international'
      },
      {
        title: 'দক্ষিণ চীন সাগরে আন্তর্জাতিক নৌচলাচল সুরক্ষায় বহুপাক্ষিক কূটনৈতিক বৈঠক অনুষ্ঠিত',
        summary: 'এশিয়া-প্যাসিফিক অঞ্চলে বাণিজ্য পথ নির্বিঘ্ন রাখতে আসিয়ানভুক্ত দেশগুলোর মধ্যে সামুদ্রিক নিরাপত্তা সংলাপ শুরু।',
        content: 'বাণিজ্যিক পণ্যবাহী জাহাজের নির্বিঘ্ন যাতায়াত নিশ্চিত করতে আসিয়ান দেশগুলোর প্রতিরক্ষামন্ত্রীরা এক যৌথ কনফারেন্সে মিলিত হয়েছেন। সব পক্ষকেই আন্তর্জাতিক সমুদ্র আইন মেনে চলার আহ্বান জানানো হয়েছে।',
        sourceUrl: 'https://www.bbc.com/bengali/news-asean-maritime-diplomacy',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
        cat: 'international'
      }
    ]
  },
  {
    id: 'preset-reuters',
    name: 'Reuters World Wire (রয়টার্স বিশ্ব সংবাদ)',
    agencyNameBn: 'রয়টার্স ওয়ার্ল্ড নিউজ (Reuters)',
    type: 'news_api',
    url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best',
    categoryId: 'international',
    categoryNameBn: 'আন্তর্জাতিক বার্তা সংস্থা',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (যুক্তরাজ্য/বিশ্ব)',
    flag: '🌍',
    description: 'বিশ্বের বৃহত্তম ও প্রাচীনতম আর্থিক ও আন্তর্জাতিক বার্তা সংস্থা রয়টার্স-এর গ্লোবাল নিউজ ফিড। নির্ভরযোগ্য ভূ-রাজনীতি ও বাজার রিপোর্ট।',
    fetchIntervalMinutes: 30,
    tags: ['রয়টার্স', 'Reuters', 'World', 'Markets'],
    sampleArticles: [
      {
        title: 'বৈশ্বিক শেয়ারবাজারে ইতিবাচক ধারা: জ্বালানি তেল ও প্রাকৃতিক গ্যাসের দামে স্বস্তি',
        summary: 'যুক্তরাষ্ট্র ও ইউরোপের কেন্দ্রীয় ব্যাংকগুলোর মূল্যস্ফীতি নিয়ন্ত্রণ নীতি সফল হওয়ায় বিশ্ববাজারে অর্থনৈতিক স্থিতিশীলতার আভাস।',
        content: 'লন্ডন ও নিউইয়র্ক স্টক এক্সচেঞ্জে প্রধান সূচকগুলোর ঊর্ধ্বমুখী যাত্রা অব্যাহত রয়েছে। অপরিশোধিত তেলের ব্যারেল প্রতি দাম স্থিতিশীল থাকায় বৈশ্বিক সাপ্লাই চেইনে ব্যয় সংকোচনের ইতিবাচক প্রভাব পড়ছে বলে জানিয়েছেন বাজার বিশ্লেষকেরা।',
        sourceUrl: 'https://www.reuters.com/markets/global-markets-oil-inflation-stabilizes',
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1000&auto=format&fit=crop&q=80',
        cat: 'business'
      },
      {
        title: 'নবায়নযোগ্য শক্তিতে ইউরোপের নতুন বিনিয়োগ: সৌর ও বায়ুবিদ্যুতের শেয়ার ৫০ শতাংশে',
        summary: 'জীবাশ্ম জ্বালানির ব্যবহার কমিয়ে পরিবেশবান্ধব গ্রিন এনার্জি গ্রিড তৈরিতে নতুন যুগান্তকারী চুক্তি সই করেছে শীর্ষ দেশগুলো।',
        content: 'ইউরোপীয় কমিশনের সাম্প্রতিক তথ্য অনুযায়ী, সদস্য দেশগুলোতে উৎপাদিত বিদ্যুতের অর্ধেকেরও বেশি এখন উৎপাদিত হচ্ছে পরিবেশবান্ধব নবায়নযোগ্য উৎস থেকে। ২০৩০ সালের মধ্যে এই হার ৭০ শতাংশে উন্নীত করার লক্ষ্যমাত্রা নির্ধারণ করা হয়েছে।',
        sourceUrl: 'https://www.reuters.com/business/energy/europe-renewable-energy-milestone',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=1000&auto=format&fit=crop&q=80',
        cat: 'international'
      }
    ]
  },
  {
    id: 'preset-aljazeera',
    name: 'Al Jazeera International (আল জাজিরা)',
    agencyNameBn: 'আল জাজিরা নিউজ নেটওয়ার্ক',
    type: 'rss',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    categoryId: 'international',
    categoryNameBn: 'আন্তর্জাতিক ও মধ্যপ্রাচ্য',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (কাতার/গ্লোবাল)',
    flag: '🇶🇦',
    description: 'গ্লোবাল সাউথ ও মধ্যপ্রাচ্যের কণ্ঠস্বরখ্যাত আল জাজিরার বিশ্বসংবাদ ফিড। মানবাধিকার, আন্তর্জাতিক সংঘাত সমাধান ও মানবিক প্রতিবেদন।',
    fetchIntervalMinutes: 25,
    tags: ['আল জাজিরা', 'Al Jazeera', 'Middle East', 'World'],
    sampleArticles: [
      {
        title: 'গাজায় জাতিসংঘ ও রেডক্রসের মানবিক সহায়তা কনভয় প্রবেশ: জরুরি খাদ্য ও ওষুধ বিতরণ',
        summary: 'আন্তর্জাতিক যুদ্ধবিরতি চুক্তির অংশ হিসেবে অবরুদ্ধ মানুষের মাঝে পৌঁছে দেওয়া হচ্ছে খাবার পানি, জেনারেটর জ্বালানি ও চিকিৎসা সামগ্রী।',
        content: 'আন্তর্জাতিক মানবিক ত্রাণবাহী অর্ধশতাধিক ট্রাক সীমান্তবর্তী ক্রসিং দিয়ে প্রবেশ করেছে। হাসপাতালগুলোতে বিদ্যুৎ সংযোগ চালু করতে পাঠানো হয়েছে জ্বালানি তেল। চিকিৎসক ও স্বাস্থ্যকর্মীরা নিরবচ্ছিন্ন চিকিৎসাসেবা দিতে রাতদিন কাজ করছেন।',
        sourceUrl: 'https://www.aljazeera.com/news/middle-east-humanitarian-aid-convoy-enters',
        image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1000&auto=format&fit=crop&q=80',
        cat: 'international'
      },
      {
        title: 'সুয়েজ খালে জাহাজ চলাচলে রেকর্ড নিরাপত্তা ব্যবস্থা: আন্তর্জাতিক বাণিজ্যে স্বাভাবিক গতি',
        summary: 'লোহিত সাগরে যৌথ উপকূলীয় নিরাপত্তা টহল জোরদারের পর প্রধান শিপিং কোম্পানিগুলো পুনরায় তাদের বাণিজ্যিক রুট চালু করেছে।',
        content: 'মিশরীয় সুয়েজ খাল কর্তৃপক্ষ জানিয়েছে, এশিয়া ও ইউরোপের মধ্যে পণ্য পরিবহনে প্রধান এই জলপথে জাহাজ চলাচলের সংখ্যা স্বাভাবিক ধারায় ফিরে এসেছে। এতে বৈশ্বিক কনটেইনার ভাড়া কমতে শুরু করেছে।',
        sourceUrl: 'https://www.aljazeera.com/economy/suez-canal-shipping-security-recovery',
        image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=1000&auto=format&fit=crop&q=80',
        cat: 'business'
      }
    ]
  },
  {
    id: 'preset-dw-bangla',
    name: 'DW Bangla (ডয়েচে ভেলে বাংলা)',
    agencyNameBn: 'ডয়েচে ভেলে (Deutsche Welle)',
    type: 'rss',
    url: 'https://rss.dw.com/rdf/rss-ben-all',
    categoryId: 'international',
    categoryNameBn: 'ইউরোপ ও বিজ্ঞান-প্রযুক্তি',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (জার্মানি)',
    flag: '🇩🇪',
    description: 'জার্মানির আন্তর্জাতিক সম্প্রচারমাধ্যম ডয়েচে ভেলের বাংলা আরএসএস ফিড। ইউরোপের রাজনীতি, পরিবেশ বিজ্ঞান ও উদ্ভাবনী সমাজচিত্র।',
    fetchIntervalMinutes: 30,
    tags: ['DW', 'ডয়েচে ভেলে', 'ইউরোপ', 'বিজ্ঞান'],
    sampleArticles: [
      {
        title: 'কৃত্রিম বুদ্ধিমত্তা চালিত ড্রাগ ডিসকভারিতে চিকিৎসাবিজ্ঞানে নতুন মাইলফলক',
        summary: 'ক্যান্সার ও বিরল জিনগত রোগের বিরুদ্ধে কার্যকর নতুন অ্যান্টিবডি অণু উদ্ভাবনে এআই মডেলের সফল ক্লিনিক্যাল ট্রায়াল সম্পন্ন।',
        content: 'জার্মানি ও সুইজারল্যান্ডের গবেষকেরা যৌথভাবে উদ্ভাবিত ডিপ লার্নিং অ্যালগরিদম ব্যবহার করে মাত্র কয়েক মাসে এমন এক জীবনরক্ষাকারী ঔষধের নকশা তৈরি করেছেন যা সাধারণ গবেষণায় কয়েক দশক সময় লাগত। ইউরোপীয় মেডিসিন এজেন্সি দ্রুত অনুমোদনের নির্দেশ দিয়েছে।',
        sourceUrl: 'https://www.dw.com/bn/science-ai-drug-discovery-cancer-breakthrough',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1000&auto=format&fit=crop&q=80',
        cat: 'technology'
      }
    ]
  },
  {
    id: 'preset-voa-bangla',
    name: 'VOA Bangla (ভয়েস অব আমেরিকা)',
    agencyNameBn: 'ভয়েস অব আমেরিকা বাংলা',
    type: 'rss',
    url: 'https://www.voabangla.com/api/zyty_e-mym',
    categoryId: 'international',
    categoryNameBn: 'আন্তর্জাতিক ও কূটনীতি',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (যুক্তরাষ্ট্র)',
    flag: '🇺🇸',
    description: 'যুক্তরাষ্ট্রের আন্তর্জাতিক বার্তা সংস্থা Voice of America-র বাংলা সংবাদ ফিড। বিশ্ব কূটনীতি ও আন্তর্জাতিক মুক্ত সমাজ পর্যবেক্ষণ।',
    fetchIntervalMinutes: 30,
    tags: ['VOA', 'ভয়েস অব আমেরিকা', 'যুক্তরাষ্ট্র', 'কূটনীতি'],
    sampleArticles: [
      {
        title: 'বাংলাদেশ ও যুক্তরাষ্ট্রের দ্বিপাক্ষিক বাণিজ্য বৈঠকে শুল্কমুক্ত রপ্তানি ও বিনিয়োগ বৃদ্ধির আলোচনা',
        summary: 'ওয়াশিংটনে অনুষ্ঠিত উচ্চপর্যায়ের অর্থনৈতিক সংলাপে তথ্যপ্রযুক্তি সেবা, ফার্মাসিউটিক্যালস ও কৃষি প্রক্রিয়াজাতকরণে যৌথ সহযোগিতার অঙ্গীকার।',
        content: 'বাংলাদেশি প্রতিনিধিদলের সাথে মার্কিন ট্রেড রিপ্রেজেন্টেটিভের বৈঠক ফলপ্রসূ হয়েছে। পরিবেশবান্ধব কারখানা ও শ্রমিক কল্যাণে অগ্রগতি সাধিত হওয়ায় মার্কিন বাজারে বাংলাদেশি পণ্যের অগ্রাধিকার নিশ্চিত করতে নতুন ফ্রেমওয়ার্ক তৈরি হচ্ছে।',
        sourceUrl: 'https://www.voabangla.com/usa-bangladesh-bilateral-trade-dialogue',
        image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&auto=format&fit=crop&q=80',
        cat: 'international'
      }
    ]
  },
  {
    id: 'preset-cnn',
    name: 'CNN International World News',
    agencyNameBn: 'সিএনএন ওয়ার্ল্ড নিউজ (CNN)',
    type: 'rss',
    url: 'http://rss.cnn.com/rss/edition_world.rss',
    categoryId: 'international',
    categoryNameBn: 'বিশ্ব ব্রেকিং ও ভূ-রাজনীতি',
    region: 'international',
    countryBadge: 'আন্তর্জাতিক (সিএনএন গ্লোবাল)',
    flag: '🌐',
    description: 'বিশ্বের শীর্ষস্থানীয় সংবাদ চ্যানেল CNN-এর আন্তর্জাতিক এডিশন আরএসএস ফিড। তাৎক্ষণিক বৈশ্বিক সংকট ও রাষ্ট্রনেতাদের আন্তর্জাতিক চুক্তি।',
    fetchIntervalMinutes: 20,
    tags: ['CNN', 'International', 'Breaking', 'World News'],
    sampleArticles: [
      {
        title: 'আন্তর্জাতিক মহাকাশ স্টেশনে নতুন কৃত্রিম গ্র্যাভিটি ল্যাবরেটরি মডিউলের সফল ডকিং',
        summary: 'চাঁদ ও মঙ্গল গ্রহে ভবিষ্যৎ মানব অভিযানের প্রস্তুতি হিসেবে নাসা ও ইউরোপীয় মহাকাশ সংস্থার যৌথ বিজ্ঞান মিশন সম্পন্ন।',
        content: 'মহাকাশচারীরা সফলভাবে নতুন বৈজ্ঞানিক মডিউলের বিদ্যুৎ ও লাইফ সাপোর্ট সিস্টেম চালু করেছেন। এই গবেষণাগারে উদ্ভিদের বৃদ্ধি ও শূন্য মাধ্যাকর্ষণে মানবদেহের প্রতিরোধ ক্ষমতা নিয়ে দীর্ঘমেয়াদি গবেষণা চালানো হবে।',
        sourceUrl: 'https://edition.cnn.com/world/space-station-gravity-module-docking-success',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80',
        cat: 'technology'
      }
    ]
  },
  {
    id: 'preset-techcrunch',
    name: 'TechCrunch Asia & Global Tech Feed',
    agencyNameBn: 'টেকক্রাঞ্চ গ্লোবাল ইনোভেশন',
    type: 'rss',
    url: 'https://techcrunch.com/region/asia/feed/',
    categoryId: 'technology',
    categoryNameBn: 'প্রযুক্তি ও স্টার্টআপ',
    region: 'international',
    countryBadge: 'প্রযুক্তি (সিলিকন ভ্যালি / এশিয়া)',
    flag: '🚀',
    description: 'সিলিকন ভ্যালি ও এশিয়ার উদীয়মান প্রযুক্তি উদ্যোক্তা, এআই ল্যাব, ক্লাউড কম্পিউটিং এবং ভেঞ্চার ক্যাপিটাল বিনিয়োগের প্রথম সারির ফিড।',
    fetchIntervalMinutes: 45,
    tags: ['TechCrunch', 'AI', 'Startups', 'Technology'],
    sampleArticles: [
      {
        title: 'পরবর্তী প্রজন্মের নিউরাল প্রসেসর উদ্ভাবন: স্মার্টফোনেই চলবে ফুল-স্কেল লার্জ ল্যাঙ্গুয়েজ মডেল',
        summary: 'ক্লাউড সার্ভারের সাহায্য ছাড়াই ডিভাইসের ভেতরেই নিরাপদে প্রাইভেট ডেটা প্রসেসিংয়ে নতুন মাইক্রোচিপ স্থাপত্যের উন্মোচন।',
        content: 'নতুন প্রজন্মের ন্যানোমিটার প্রসেসরটিতে শক্তি খরচ ৮০ শতাংশ কমিয়ে এআই মডেল চালানোর সক্ষমতা সংযুক্ত করা হয়েছে। এর ফলে ইন্টারনেট সংযোগ ছাড়াই ব্যবহারকারীরা স্বয়ংক্রিয় অনুবাদ ও কম্পিউটার ভিশন সুবিধা পাবেন।',
        sourceUrl: 'https://techcrunch.com/hardware/on-device-neural-processors-generative-ai',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80',
        cat: 'technology'
      }
    ]
  }
];
