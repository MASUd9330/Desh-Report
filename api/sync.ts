// api/cron/sync.ts
// সম্পূর্ণ স্বনির্ভর (self-contained) — কোনো বাইরের ফাইল import করে না,
// তাই "Cannot find module" এরর হওয়ার কোনো সুযোগ নেই।
// এই ফাইলটাই সার্ভারে RSS ফিড fetch করে, নতুন আর্টিকেল বানায়, Redis-এ সেভ করে।

import type { VercelRequest, VercelResponse } from '@vercel/node';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ARTICLES_KEY = 'deshreport:articles';
const SOURCES_KEY = 'deshreport:automation_sources';
const MAX_STORED_ARTICLES = 500;
const MAX_ITEMS_PER_FEED = 5;

// ---- KV হেল্পার ----
async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN env variable পাওয়া যায়নি।');
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  if (!res.ok) throw new Error(`KV GET failed: ${res.status}`);
  const data = await res.json();
  if (data.result === null || data.result === undefined) return null;
  try {
    return JSON.parse(data.result) as T;
  } catch {
    return data.result as unknown as T;
  }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  if (!KV_URL || !KV_TOKEN) throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN env variable পাওয়া যায়নি।');
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    body: JSON.stringify(value)
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}

// ---- ছোট টেক্সট হেল্পার ----
function cleanHtml(input: string): string {
  if (!input) return '';
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanHeadline(title: string): string {
  return cleanHtml(title || '').replace(/\s*\|\s*.*$/, '').trim();
}

function generateSlug(title: string): string {
  const base = (title || 'news')
    .toLowerCase()
    .trim()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
  return base || 'news';
}

function calculateReadingTime(content: string): number {
  const words = (content || '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// ---- ফিড সোর্স ----
interface FeedSource {
  id: string;
  name: string;
  url: string;
  categoryId: string;
  region: 'national' | 'international';
  autoPublish: boolean;
}

const DEFAULT_SOURCES: FeedSource[] = [
  { id: 'src-1', name: 'Prothom Alo Top Feed (প্রথম আলো)', url: 'https://www.prothomalo.com/feed', categoryId: 'national', region: 'national', autoPublish: true },
  { id: 'src-2', name: 'BSS News RSS Feed (বাসস জাতীয় বার্তা সংস্থা)', url: 'https://www.bssnews.net/feed/rss', categoryId: 'national', region: 'national', autoPublish: true },
  { id: 'src-3', name: 'bdnews24.com Bangla (বিডিনিউজ২৪.কম)', url: 'https://bangla.bdnews24.com/feed', categoryId: 'politics', region: 'national', autoPublish: true },
  { id: 'src-4', name: 'BBC News Bangla (বিবিসি বাংলা আরএসএস)', url: 'https://feeds.bbci.co.uk/bengali/rss.xml', categoryId: 'international', region: 'international', autoPublish: true },
  { id: 'src-5', name: 'Daily Jugantor (দৈনিক যুগান্তর)', url: 'https://www.jugantor.com/feed/rss.xml', categoryId: 'economy', region: 'national', autoPublish: true },
  { id: 'src-6', name: 'DW Bangla (ডয়েচে ভেলে বাংলা)', url: 'https://rss.dw.com/rdf/rss-ben-all', categoryId: 'technology', region: 'international', autoPublish: true }
];

interface StoredArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  featuredImage: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  tags: string[];
  source: string;
  sourceUrl: string;
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  viewCount: number;
  shareCount: number;
  status: 'published' | 'draft';
}

// ---- খবরের শিরোনাম/সারাংশ পড়ে সঠিক ক্যাটাগরি বের করা (RSS ফিডের ফিক্সড ক্যাটাগরির বদলে) ----
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  sports: ['ক্রিকেট', 'ফুটবল', 'খেলা', 'বিশ্বকাপ', 'টেস্ট', 'ওয়ানডে', 'টি-টোয়েন্টি', 'অলিম্পিক', 'ম্যাচ', 'গোল', 'বিপিএল', 'আইপিএল', 'মেসি', 'রোনালদো', 'সাকিব', 'তামিম'],
  entertainment: ['সিনেমা', 'নাটক', 'গান', 'অভিনেতা', 'অভিনেত্রী', 'চলচ্চিত্র', 'বিনোদন', 'শোবিজ', 'নায়ক', 'নায়িকা', 'ওয়েব সিরিজ', 'সংগীতশিল্পী'],
  technology: ['প্রযুক্তি', 'স্মার্টফোন', 'ইন্টারনেট', 'অ্যাপ', 'সফটওয়্যার', 'এআই', 'কৃত্রিম বুদ্ধিমত্তা', 'গুগল', 'ফেসবুক', 'গ্যাজেট', 'কম্পিউটার', 'রোবট'],
  economy: ['অর্থনীতি', 'শেয়ারবাজার', 'ডলার', 'রিজার্ভ', 'বাজেট', 'মুদ্রাস্ফীতি', 'রপ্তানি', 'আমদানি', 'ব্যাংক', 'ঋণ', 'বাণিজ্য', 'জিডিপি', 'কর'],
  health: ['স্বাস্থ্য', 'হাসপাতাল', 'চিকিৎসক', 'রোগ', 'ভ্যাকসিন', 'ডেঙ্গু', 'করোনা', 'চিকিৎসা', 'ওষুধ'],
  international: ['যুক্তরাষ্ট্র', 'চীন', 'ভারত', 'পাকিস্তান', 'ইসরায়েল', 'ইরান', 'রাশিয়া', 'ইউক্রেন', 'জাতিসংঘ', 'আন্তর্জাতিক', 'বিশ্ব', 'গাজা', 'ফিলিস্তিন', 'যুদ্ধ'],
  politics: ['নির্বাচন', 'সংসদ', 'রাজনীতি', 'মন্ত্রী', 'সরকার', 'বিরোধী দল', 'রাষ্ট্রপতি', 'প্রধানমন্ত্রী', 'দল', 'আওয়ামী লীগ', 'বিএনপি', 'জামায়াত']
};

function categorizeArticle(title: string, description: string, fallbackCategoryId: string): string {
  const text = `${title} ${description}`;
  for (const [catId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      return catId;
    }
  }
  return fallbackCategoryId || 'national';
}

// ---- প্রতিটা ক্যাটাগরির জন্য একাধিক ছবি (যাতে সব খবরে একই ছবি না বসে) ----
const IMAGE_POOL: Record<string, string[]> = {
  national: [
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=1200&auto=format&fit=crop&q=80'
  ],
  politics: [
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&auto=format&fit=crop&q=80'
  ],
  international: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494972308805-463bc619d34e?w=1200&auto=format&fit=crop&q=80'
  ],
  economy: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200&auto=format&fit=crop&q=80'
  ],
  technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80'
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&auto=format&fit=crop&q=80'
  ],
  entertainment: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=1200&auto=format&fit=crop&q=80'
  ],
  health: [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&auto=format&fit=crop&q=80'
  ]
};

function hashToIndex(text: string, mod: number): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  return hash % mod;
}

function topicImage(title: string, categoryId: string): string {
  const pool = IMAGE_POOL[categoryId] || IMAGE_POOL.national;
  return pool[hashToIndex(title, pool.length)];
}

// ---- RSS পার্সার (রেগেক্স-ভিত্তিক, Node-এ DOMParser নেই বলে) ----
function extractTag(block: string, tag: string): string {
  const cdataRe = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, 'i');
  const plainRe = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = block.match(cdataRe) || block.match(plainRe);
  return m ? m[1].trim() : '';
}

function extractImage(block: string): string {
  const enclosure = block.match(/<enclosure[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (enclosure) return enclosure[1];
  const mediaContent = block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (mediaContent) return mediaContent[1];
  const mediaThumb = block.match(/<media:thumbnail[^>]+url=["']([^"']+)["'][^>]*>/i);
  if (mediaThumb) return mediaThumb[1];
  const imgTag = block.match(/<img[^>]+src=["'](https?:\/\/[^"']+)["']/i);
  if (imgTag) return imgTag[1];
  return '';
}

function parseRssItemsServer(xml: string): Array<{ title: string; link: string; description: string; image: string }> {
  const items: Array<{ title: string; link: string; description: string; image: string }> = [];
  const itemBlocks = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];

  for (const block of itemBlocks.slice(0, MAX_ITEMS_PER_FEED)) {
    const rawTitle = cleanHtml(extractTag(block, 'title'));
    if (!rawTitle || rawTitle.length < 5) continue;

    let link = extractTag(block, 'link');
    if (!link) {
      const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["']/i);
      link = hrefMatch ? hrefMatch[1] : '';
    }
    if (!link) link = cleanHtml(extractTag(block, 'guid'));

    const description =
      cleanHtml(extractTag(block, 'content:encoded')) ||
      cleanHtml(extractTag(block, 'description')) ||
      cleanHtml(extractTag(block, 'summary'));

    const image = extractImage(block);
    items.push({ title: rawTitle, link: link || '', description, image });
  }
  return items;
}

async function fetchFeed(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeshReportBot/1.0)' },
    signal: AbortSignal.timeout(8000)
  });
  if (!res.ok) throw new Error(`Feed fetch failed (${res.status}): ${url}`);
  return res.text();
}

// ---- ছোট শিরোনাম/সংক্ষিপ্তসার থেকে পূর্ণ আর্টিকেল বানানো (সরল ভার্সন) ----
function buildArticleContent(title: string, description: string, sourceName: string): { summary: string; content: string } {
  const cleanDesc = description && description.length > 40 ? description : `${title} সম্পর্কিত সর্বশেষ তথ্য সংগ্রহ করা হয়েছে।`;
  const summary = cleanDesc.slice(0, 200);

  const content = `<p>${cleanDesc}</p>
<p>${title} বিষয়ে বিস্তারিত তথ্যের জন্য মূল সূত্র (${sourceName}) অনুসরণ করা হচ্ছে এবং প্রয়োজনীয় হালনাগাদ পাওয়ামাত্র পাঠকদের জানানো হবে।</p>
<p>দেশরিপোর্ট সবসময় নির্ভরযোগ্য ও সময়োপযোগী সংবাদ পরিবেশনে প্রতিশ্রুতিবদ্ধ। এই প্রতিবেদনটি স্বয়ংক্রিয় সংবাদ সংগ্রহ ব্যবস্থার মাধ্যমে প্রকাশিত হয়েছে।</p>`;

  return { summary, content };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization || '';
  const isVercelCron = req.headers['x-vercel-cron'] !== undefined;
  if (secret && !isVercelCron && authHeader !== `Bearer ${secret}`) {
    res.status(401).json({ ok: false, error: 'Unauthorized' });
    return;
  }

  const startedAt = new Date().toISOString();
  const log: string[] = [];

  try {
    // ?reset=1 দিলে আগের সব আর্টিকেল মুছে নতুন করে শুরু হবে
    // (পুরনো ভুল ক্যাটাগরি/ছবি-ওয়ালা আর্টিকেলগুলো সরিয়ে ফেলতে একবার ব্যবহার করো)
    if (req.query.reset === '1') {
      await kvSet(ARTICLES_KEY, []);
      log.push('পুরনো সব আর্টিকেল রিসেট করা হয়েছে');
    }

    const sources = (await kvGet<FeedSource[]>(SOURCES_KEY)) || DEFAULT_SOURCES;
    const existingArticles = req.query.reset === '1' ? [] : (await kvGet<StoredArticle[]>(ARTICLES_KEY)) || [];
    const existingUrls = new Set(existingArticles.map(a => a.sourceUrl));
    const existingTitles = new Set(existingArticles.map(a => a.title.trim().toLowerCase()));

    const newArticles: StoredArticle[] = [];

    for (const src of sources) {
      try {
        const xml = await fetchFeed(src.url);
        const items = parseRssItemsServer(xml);
        let importedFromThisFeed = 0;

        for (const item of items) {
          const cleanTitle = cleanHeadline(item.title);
          const normalizedTitle = cleanTitle.trim().toLowerCase();
          if (!item.link || existingUrls.has(item.link) || existingTitles.has(normalizedTitle)) {
            continue;
          }

          const { summary, content } = buildArticleContent(cleanTitle, item.description, src.name);
          const resolvedCategoryId = categorizeArticle(cleanTitle, item.description, src.categoryId);
          const resolvedImage = item.image && item.image.startsWith('http') ? item.image : topicImage(cleanTitle, resolvedCategoryId);

          const article: StoredArticle = {
            id: 'art-auto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8),
            title: cleanTitle,
            slug: generateSlug(cleanTitle) + '-' + Math.floor(Math.random() * 10000),
            summary,
            content,
            featuredImage: resolvedImage,
            categoryId: resolvedCategoryId,
            authorId: 'usr-admin-masud',
            authorName: `দেশরিপোর্ট ডেস্ক (${src.name})`,
            tags: ['সংবাদ', 'অটোমেশন', src.region === 'international' ? 'আন্তর্জাতিক' : 'জাতীয়'],
            source: src.name,
            sourceUrl: item.link,
            publishedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            readingTimeMinutes: calculateReadingTime(content),
            viewCount: Math.floor(Math.random() * 40) + 15,
            shareCount: 0,
            status: src.autoPublish ? 'published' : 'draft'
          };

          newArticles.push(article);
          existingUrls.add(item.link);
          existingTitles.add(normalizedTitle);
          importedFromThisFeed++;
        }

        log.push(`${src.name}: ${importedFromThisFeed}টি নতুন সংগ্রহ`);
      } catch (feedErr: any) {
        log.push(`${src.name}: ব্যর্থ (${feedErr.message})`);
      }
    }

    if (newArticles.length > 0) {
      const combined = [...newArticles, ...existingArticles].slice(0, MAX_STORED_ARTICLES);
      await kvSet(ARTICLES_KEY, combined);

      const publishedNew = newArticles.filter(a => a.status === 'published');
      if (publishedNew.length > 0) {
        const siteUrl = process.env.SITE_URL || 'https://desh-report.vercel.app';
        const indexNowKey = process.env.INDEXNOW_KEY;
        if (indexNowKey) {
          try {
            await fetch('https://api.indexnow.org/indexnow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json; charset=utf-8' },
              body: JSON.stringify({
                host: new URL(siteUrl).hostname,
                key: indexNowKey,
                keyLocation: `${siteUrl}/${indexNowKey}.txt`,
                urlList: publishedNew.map(a => `${siteUrl}/article/${a.slug}`)
              })
            });
          } catch (_) {}
        }

        const tgToken = process.env.TELEGRAM_BOT_TOKEN;
        const tgChat = process.env.TELEGRAM_CHAT_ID;
        if (tgToken && tgChat) {
          for (const art of publishedNew) {
            try {
              await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: tgChat,
                  text: `📰 ${art.title}\n\n${art.summary}\n\n${siteUrl}/article/${art.slug}`
                })
              });
            } catch (_) {}
          }
        }
      }
    }

    res.status(200).json({
      ok: true,
      startedAt,
      finishedAt: new Date().toISOString(),
      totalNewArticles: newArticles.length,
      log
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message, log });
  }
}
