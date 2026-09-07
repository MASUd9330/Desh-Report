import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'deshreport_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(normalized);
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.CRON_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET env variable সেট করা হয়নি।');
  return secret;
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function sign(value: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function getCookie(request: VercelRequest, name: string): string | null {
  const cookies = typeof request.headers.cookie === 'string' ? request.headers.cookie : '';
  const match = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

async function hasValidAdminSession(request: VercelRequest): Promise<boolean> {
  try {
    const raw = getCookie(request, COOKIE_NAME);
    if (!raw) return false;
    const dot = raw.lastIndexOf('.');
    if (dot <= 0) return false;
    const encoded = raw.slice(0, dot);
    const signature = raw.slice(dot + 1);
    if (!safeEqual(await sign(encoded), signature)) return false;
    const payload = JSON.parse(base64UrlDecode(encoded)) as { exp: number };
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function requireAdmin(request: VercelRequest, response: VercelResponse): Promise<boolean> {
  if (await hasValidAdminSession(request)) return true;
  response.status(401).json({ ok: false, error: 'অ্যাডমিন সেশন মেয়াদোত্তীর্ণ বা অনুপস্থিত।' });
  return false;
}

function kvConfig(): { url: string; token: string } {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.KV_REST_API_READ_ONLY_TOKEN;
  if (!url || !token) throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN সেট নেই।');
  return { url, token };
}

async function kvGet<T>(key: string): Promise<T | null> {
  const { url, token } = kvConfig();
  const response = await fetch(url + '/get/' + encodeURIComponent(key), {
    headers: { Authorization: 'Bearer ' + token }
  });
  if (!response.ok) throw new Error('KV GET failed: ' + response.status);
  const data = await response.json();
  if (data.result === null || data.result === undefined) return null;
  try { return JSON.parse(data.result) as T; } catch { return data.result as T; }
}

async function kvSet(key: string, value: unknown): Promise<void> {
  const { url, token } = kvConfig();
  const response = await fetch(url + '/set/' + encodeURIComponent(key), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token },
    body: JSON.stringify(value)
  });
  if (!response.ok) throw new Error('KV SET failed: ' + response.status);
}


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
  if (!(await requireAdmin(req, res))) return;
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
