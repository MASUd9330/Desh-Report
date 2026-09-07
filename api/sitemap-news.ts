// api/sitemap-news.ts
// Google News sitemap স্পেসিফিকেশন অনুযায়ী — শুধু সর্বশেষ ৪৮ ঘণ্টার পাবলিশড আর্টিকেল থাকে
// (Google News-এর নিয়ম অনুযায়ী পুরনো আর্টিকেল এতে না রাখাই ভালো)

import type { VercelRequest, VercelResponse } from '@vercel/node';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ARTICLES_KEY = 'deshreport:articles';
const SITE_URL = process.env.SITE_URL || 'https://desh-report.vercel.app';

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
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = articles
    .filter(a => a.status === 'published' && new Date(a.publishedAt).getTime() >= cutoff)
    .slice(0, 1000);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recent
  .map(
    a => `  <url>
    <loc>${SITE_URL}/article/${escapeXml(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>DeshReport</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');
  res.status(200).send(xml);
}
