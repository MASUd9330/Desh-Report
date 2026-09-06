// api/articles.ts
// পাবলিক এন্ডপয়েন্ট — যেকোনো ভিজিটরের ব্রাউজার এখান থেকে সার্ভারে জমা থাকা
// (cron দিয়ে অটো-সিঙ্ক হওয়া) আর্টিকেলগুলো fetch করতে পারবে।
// GET /api/articles            -> সব published আর্টিকেল (নতুন আগে)
// GET /api/articles?category=national -> নির্দিষ্ট ক্যাটাগরি ফিল্টার
// GET /api/articles?limit=20   -> সংখ্যা সীমিত করা

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kvGet } from '../lib/kv';

const ARTICLES_KEY = 'deshreport:articles';

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
