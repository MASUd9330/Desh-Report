import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kvGet, kvSet } from '../../lib/kv';
import { requireAdmin } from '../../lib/adminAuth';

const ARTICLES_KEY = 'deshreport:articles';
const MAX_STORED_ARTICLES = 500;

function readBody(req: VercelRequest): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body as Record<string, any>;
}

function now(): string { return new Date().toISOString(); }

function normalizeArticle(input: Record<string, any>, existing?: Record<string, any>): Record<string, any> {
  const merged = { ...(existing || {}), ...input };
  const timestamp = now();
  return {
    ...merged,
    id: String(merged.id || 'art-admin-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)),
    title: String(merged.title || 'শিরোনামহীন সংবাদ').trim(),
    slug: String(merged.slug || ('news-' + Date.now())).trim(),
    summary: String(merged.summary || '').trim(),
    content: String(merged.content || '').trim(),
    categoryId: String(merged.categoryId || 'national'),
    authorId: String(merged.authorId || 'usr-admin-masud'),
    authorName: String(merged.authorName || 'মোহাম্মদ মাসুদ রানা'),
    tags: Array.isArray(merged.tags) ? merged.tags : [],
    featuredImage: String(merged.featuredImage || ''),
    source: String(merged.source || 'নিজস্ব প্রতিবেদক'),
    sourceUrl: String(merged.sourceUrl || ''),
    publishedAt: String(merged.publishedAt || timestamp),
    updatedAt: timestamp,
    readingTimeMinutes: Number(merged.readingTimeMinutes || 1),
    viewCount: Number(merged.viewCount || 0),
    shareCount: Number(merged.shareCount || 0),
    status: ['published', 'draft', 'scheduled', 'trash'].includes(merged.status) ? merged.status : 'draft'
  };
}

async function getArticles(): Promise<Record<string, any>[]> {
  return (await kvGet<Record<string, any>[]>(ARTICLES_KEY)) || [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (!(await requireAdmin(req, res))) return;

  try {
    if (req.method === 'GET') {
      const articles = await getArticles();
      res.status(200).json({ ok: true, count: articles.length, articles });
      return;
    }

    const current = await getArticles();
    const body = readBody(req);

    if (req.method === 'POST') {
      if (Array.isArray(body.articles)) {
        const incoming = body.articles.filter(item => item && typeof item === 'object').map(item => normalizeArticle(item));
        const byId = new Map<string, Record<string, any>>();
        [...incoming, ...current].forEach(item => { if (!byId.has(item.id)) byId.set(item.id, item); });
        const articles = Array.from(byId.values()).slice(0, MAX_STORED_ARTICLES);
        await kvSet(ARTICLES_KEY, articles);
        res.status(200).json({ ok: true, count: articles.length, articles });
        return;
      }

      const input = body.article && typeof body.article === 'object' ? body.article : body;
      const article = normalizeArticle(input);
      if (article.title.length < 2 || article.content.length < 2) {
        res.status(400).json({ ok: false, error: 'শিরোনাম ও কনটেন্ট প্রয়োজন।' });
        return;
      }
      const articles = [article, ...current.filter(item => item.id !== article.id)].slice(0, MAX_STORED_ARTICLES);
      await kvSet(ARTICLES_KEY, articles);
      res.status(201).json({ ok: true, article });
      return;
    }

    if (req.method === 'PUT') {
      const id = String(body.id || req.query.id || '');
      const index = current.findIndex(item => item.id === id);
      if (index < 0) {
        res.status(404).json({ ok: false, error: 'সংবাদটি পাওয়া যায়নি।' });
        return;
      }
      const updates = body.updates && typeof body.updates === 'object' ? body.updates : body;
      const article = normalizeArticle({ ...updates, id }, current[index]);
      let articles = current.map(item => item.id === id ? article : item);
      if (article.isFeaturedHero) articles = articles.map(item => item.id === id ? item : { ...item, isFeaturedHero: false });
      await kvSet(ARTICLES_KEY, articles);
      res.status(200).json({ ok: true, article });
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(body.id || req.query.id || '');
      if (!id) { res.status(400).json({ ok: false, error: 'id প্রয়োজন।' }); return; }
      const articles = current.filter(item => item.id !== id);
      if (articles.length === current.length) { res.status(404).json({ ok: false, error: 'সংবাদটি পাওয়া যায়নি।' }); return; }
      await kvSet(ARTICLES_KEY, articles);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'সংবাদ সংরক্ষণ করা যায়নি।' });
  }
}
