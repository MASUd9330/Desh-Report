// api/articles.ts
// পাবলিক এন্ডপয়েন্ট — সম্পূর্ণ স্বনির্ভর (self-contained), কোনো বাইরের ফাইল import করে না,
// তাই "Cannot find module" এরর হওয়ার কোনো সুযোগ নেই।

import type { VercelRequest, VercelResponse } from '@vercel/node';

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const ARTICLES_KEY = 'deshreport:articles';

async function kvGet<T>(key: string): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN env variable পাওয়া যায়নি।');
  }
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

  try {
    const articles = (await kvGet<any[]>(ARTICLES_KEY)) || [];
    let result = articles.filter(a => a.status === 'published');

    const category = req.query.category as string | undefined;
    if (category) {
      result = result.filter(a => a.categoryId === category);
    }

    const limit = parseInt((req.query.limit as string) || '', 10);
    if (!isNaN(limit) && limit > 0) {
      result = result.slice(0, limit);
    }

    res.status(200).json({ ok: true, count: result.length, articles: result });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message, articles: [] });
  }
}
