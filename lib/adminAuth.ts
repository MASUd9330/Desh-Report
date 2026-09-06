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

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(sessionSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index++) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

export async function hashAdminPassword(password: string): Promise<string> {
  return sha256Hex(password);
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const configuredHash = process.env.ADMIN_PASSWORD_HASH?.trim().replace(/^sha256:/i, '');
  if (configuredHash) return safeEqual(await sha256Hex(password), configuredHash);

  const configuredPassword = process.env.ADMIN_PASSWORD;
  return Boolean(configuredPassword && safeEqual(password, configuredPassword));
}

export function verifyAdminIdentifier(identifier: string): boolean {
  const configured = process.env.ADMIN_IDENTIFIER?.trim().toLowerCase();
  return !configured || configured === identifier.trim().toLowerCase();
}

export async function createSessionCookie(): Promise<string> {
  const payload: SessionPayload = { exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' ? '; Secure' : '';
  return COOKIE_NAME + '=' + encoded + '.' + await sign(encoded) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + SESSION_TTL_SECONDS + secure;
}

export function clearSessionCookie(): string {
  return COOKIE_NAME + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';
}

function getCookie(request: VercelRequest, name: string): string | null {
  const cookies = typeof request.headers.cookie === 'string' ? request.headers.cookie : '';
  const match = cookies.split(';').map(part => part.trim()).find(part => part.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

export async function hasValidAdminSession(request: VercelRequest): Promise<boolean> {
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

export async function requireAdmin(request: VercelRequest, response: VercelResponse): Promise<boolean> {
  if (await hasValidAdminSession(request)) return true;
  response.status(401).json({ ok: false, error: 'অ্যাডমিন সেশন মেয়াদোত্তীর্ণ বা অনুপস্থিত।' });
  return false;
}
