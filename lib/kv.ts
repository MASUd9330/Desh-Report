// lib/kv.ts
// ছোট্ট হেল্পার — Upstash Redis REST API ব্যবহার করে সার্ভারলেস ফাংশন থেকে ডেটা সেভ/লোড করার জন্য।
// Vercel-এ "Storage" ট্যাব থেকে Upstash Redis (KV) যোগ করলে এই দুটো env variable
// অটোমেটিক তৈরি হয়ে যাবে: KV_REST_API_URL এবং KV_REST_API_TOKEN

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

function assertConfigured() {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error(
      'KV_REST_API_URL / KV_REST_API_TOKEN সেট নেই। Vercel Dashboard > Storage থেকে একটি Redis (Upstash) ডাটাবেস যোগ করে প্রজেক্টের সাথে কানেক্ট করুন।'
    );
  }
}

export async function kvGet<T>(key: string): Promise<T | null> {
  assertConfigured();
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

export async function kvSet(key: string, value: unknown): Promise<void> {
  assertConfigured();
  const body = JSON.stringify(value);
  const res = await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    body
  });
  if (!res.ok) throw new Error(`KV SET failed: ${res.status}`);
}
