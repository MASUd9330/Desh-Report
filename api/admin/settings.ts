import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kvGet, kvSet } from '../../lib/kv';
import { requireAdmin } from '../../lib/adminAuth';

const SETTINGS_KEY = 'deshreport:automation_settings';

function readBody(req: VercelRequest): Record<string, any> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body as Record<string, any>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') {
      res.status(200).json({ ok: true, settings: (await kvGet<Record<string, any>>(SETTINGS_KEY)) || null });
      return;
    }
    if (req.method === 'PUT' || req.method === 'POST') {
      const body = readBody(req);
      const settings = body.settings && typeof body.settings === 'object' ? body.settings : body;
      await kvSet(SETTINGS_KEY, settings);
      res.status(200).json({ ok: true, settings });
      return;
    }
    res.setHeader('Allow', 'GET, POST, PUT');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'সেটিংস সংরক্ষণ করা যায়নি।' });
  }
}
