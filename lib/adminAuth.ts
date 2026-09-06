import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'deshreport_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = { exp: number };

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.CRON_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET env variable সেট করা হয়নি।');
  return secret;
}

function sign(value: string): string {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function hashAdminPassword(password: string): string {
  return createHash('sha256').update(password, 'utf8').digest('hex');
}

export function verifyAdminPassword(password: string): boolean {
  const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^sha256:/i, '');
  if (configuredHash) return safeEqual(hashAdminPassword(password), configuredHash);

  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword && safeEqual(password, configuredPassword));
}

export function verifyAdminIdentifier(identifier: string): boolean {
  const configured = process.env.ADMIN_IDENTIFIER?.trim().toLowerCase();
  return !configured || configured === identifier.trim().toLowerCase();
}

export function createSessionCookie(): string {
  const payload: SessionPayload = { exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? '; Secure' : '';
  return COOKIE_NAME + '=' + encoded + '.' + sign(encoded) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + SESSION_TTL_SECONDS + secure;
}

export function clearSessionCookie(): string {
  return COOKIE_NAME + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function getCookie(request: VercelRequest, name: string): string | null {
  const cookies = request.headers.cookie || '';
  const match = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

export function hasValidAdminSession(request: VercelRequest): boolean {
  try {
    const raw = getCookie(request, COOKIE_NAME);
    if (!raw) return false;
    const dot = raw.lastIndexOf('.');
    if (dot <= 0) return false;
    const encoded = raw.slice(0, dot);
    const signature = raw.slice(dot + 1);
    if (!safeEqual(sign(encoded), signature)) return false;
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    return Number.isFinite(payload.exp) && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function requireAdmin(request: VercelRequest, response: VercelResponse): boolean {
  if (hasValidAdminSession(request)) return true;
  response.status(401).json({ ok: false, error: 'অ্যাডমিন সেশন মেয়াদোত্তীর্ণ বা অনুপস্থিত।' });
  return false;
}
