import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kvGet, kvSet } from '../../lib/kv';
import { requireAdmin } from '../../lib/adminAuth';

const SOURCES_KEY = 'deshreport:automation_sources';

function readBody(req: VercelRequest): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body as Record<string, any>;
}

function normalizeSource(input: Record<string, any>, existing?: Record<string, any>): Record<string, any> {
  const merged = { ...(existing || {}), ...input };
  return {
    ...merged,
    id: String(merged.id || 'src-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6)),
    name: String(merged.name || 'নতুন আরএসএস ফিড'),
    type: ['rss', 'news_api', 'json'].includes(merged.type) ? merged.type : 'rss',
    url: String(merged.url || ''),
    categoryId: String(merged.categoryId || 'national'),
    region: merged.region === 'international' ? 'international' : 'national',
    fetchIntervalMinutes: Number(merged.fetchIntervalMinutes || 30),
    status: merged.status === 'paused' ? 'paused' : 'active',
    autoPublish: merged.autoPublish !== false,
    articlesImported: Number(merged.articlesImported || 0),
    keywordFilters: Array.isArray(merged.keywordFilters) ? merged.keywordFilters : []
  };
}

async function getSources(): Promise<Record<string, any>[]> {
  return (await kvGet<Record<string, any>[]>(SOURCES_KEY)) || [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;

  try {
    if (req.method === 'GET') {
      const sources = await getSources();
      res.status(200).json({ ok: true, count: sources.length, sources });
      return;
    }

    const current = await getSources();
    const body = readBody(req);

    if (req.method === 'POST') {
      const incoming = Array.isArray(body.sources)
        ? body.sources.filter(item => item && typeof item === 'object').map(item => normalizeSource(item))
        : [normalizeSource(body.source && typeof body.source === 'object' ? body.source : body)];
      const byId = new Map<string, Record<string, any>>();
      [...incoming, ...current].forEach(item => { if (!byId.has(item.id)) byId.set(item.id, item); });
      const sources = Array.from(byId.values());
      await kvSet(SOURCES_KEY, sources);
      res.status(200).json({ ok: true, sources, source: incoming[0] });
      return;
    }

    if (req.method === 'PUT') {
      const id = String(body.id || req.query.id || '');
      const index = current.findIndex(item => item.id === id);
      if (index < 0) { res.status(404).json({ ok: false, error: 'সোর্সটি পাওয়া যায়নি।' }); return; }
      const updates = body.updates && typeof body.updates === 'object' ? body.updates : body;
      const source = normalizeSource({ ...updates, id }, current[index]);
      const sources = current.map(item => item.id === id ? source : item);
      await kvSet(SOURCES_KEY, sources);
      res.status(200).json({ ok: true, source });
      return;
    }

    if (req.method === 'DELETE') {
      const id = String(body.id || req.query.id || '');
      const sources = current.filter(item => item.id !== id);
      if (!id || sources.length === current.length) { res.status(404).json({ ok: false, error: 'সোর্সটি পাওয়া যায়নি।' }); return; }
      await kvSet(SOURCES_KEY, sources);
      res.status(200).json({ ok: true, id });
      return;
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'সোর্স সংরক্ষণ করা যায়নি।' });
  }
}
