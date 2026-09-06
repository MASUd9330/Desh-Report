import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  clearSessionCookie,
  createSessionCookie,
  hasValidAdminSession,
  verifyAdminIdentifier,
  verifyAdminPassword
} from '../../lib/adminAuth';

function readBody(req: VercelRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return {}; }
  }
  return req.body as Record<string, unknown>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    res.status(200).json({ ok: true, authenticated: await hasValidAdminSession(req) });
    return;
  }

  if (req.method === 'DELETE') {
    res.setHeader('Set-Cookie', clearSessionCookie());
    res.status(200).json({ ok: true });
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, DELETE');
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const body = readBody(req);
  const password = typeof body.password === 'string' ? body.password : '';
  const identifier = typeof body.identifier === 'string' ? body.identifier : '';

  if (!password || !verifyAdminIdentifier(identifier) || !(await verifyAdminPassword(password))) {
    res.status(401).json({ ok: false, error: 'ইমেইল/আইডি অথবা পাসওয়ার্ড সঠিক নয়।' });
    return;
  }

  try {
    res.setHeader('Set-Cookie', await createSessionCookie());
    res.status(200).json({ ok: true, authenticated: true });
  } catch (error: any) {
    res.status(500).json({ ok: false, error: error?.message || 'সেশন তৈরি করা যায়নি।' });
  }
}
