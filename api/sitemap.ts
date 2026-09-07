// api/sitemap.ts
// ডাইনামিক sitemap.xml — সবসময় Redis-এ থাকা সর্বশেষ পাবলিশড আর্টিকেল অনুযায়ী আপডেটেড থাকে।
// আগের স্ট্যাটিক ফাইলটার বদলে এটা ব্যবহার হবে, তাই নতুন আর্টিকেল অটোমেটিক সাইটম্যাপে যোগ হবে।

import type { VercelRequest, VercelResponse } from '@vercel/node';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ARTICLES_KEY = 'deshreport:articles';
const SITE_URL = process.env.SITE_URL || 'https://desh-report.vercel.app';

const CATEGORIES = ['national', 'politics', 'international', 'economy', 'business', 'technology', 'sports', 'entertainment', 'health', 'lifestyle'];

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.result === null || data.result === undefined) return null;
  try {
    return JSON.parse(data.result) as T;
  } catch {
    return null;
  }
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const articles = (await kvGet<any[]>(ARTICLES_KEY)) || [];
  const published = articles.filter(a => a.status === 'published');
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
${CATEGORIES.map(
  c => `  <url>
    <loc>${SITE_URL}/category/${c}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`
).join('\n')}
${published
  .map(
    a => `  <url>
    <loc>${SITE_URL}/article/${escapeXml(a.slug)}</loc>
    <lastmod>${new Date(a.updatedAt || a.publishedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).send(xml);
}
