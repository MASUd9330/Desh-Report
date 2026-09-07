import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'deshreport_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = { exp: number };

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlEncode(value: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
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
  for (let index = 0; index < left.length; index++) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(value)
  );
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function verifyAdminPassword(password: string): Promise<boolean> {
  const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^sha256:/i, '');
  if (configuredHash) {
    return safeEqual(await sha256Hex(password), configuredHash);
  }

  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword && safeEqual(password, configuredPassword));
}

function verifyAdminIdentifier(identifier: string): boolean {
  const configured = process.env.ADMIN_IDENTIFIER?.trim().toLowerCase();
  return !configured || configured === identifier.trim().toLowerCase();
}

async function sign(value: string): Promise<string> {
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value)
  );
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

    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

async function createSessionCookie(): Promise<string> {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? '; Secure' : '';
  const signature = await sign(encoded);
  return COOKIE_NAME + '=' + encoded + '.' + signature +
    '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + SESSION_TTL_SECONDS + secure;
}

function clearSessionCookie(): string {
  return COOKIE_NAME + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

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
