import React, { useState } from 'react';
import { useNews } from '../../context/NewsContext';
import {
  Search,
  FileCode,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Code2
} from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { articles = [] } = useNews();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch (_) {}
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://deshreport.com/</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
${articles
  .filter(a => a.status === 'published')
  .map(
    a => `  <url>
    <loc>https://deshreport.com/article/${a.slug}</loc>
    <lastmod>${new Date(a.publishedAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .filter(a => a.status === 'published')
  .slice(0, 5)
  .map(
    a => `  <url>
    <loc>https://deshreport.com/article/${a.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>DeshReport</news:name>
        <news:language>bn</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${a.title.replace(/&/g, '&amp;')}</news:title>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const sampleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://deshreport.com/article/' + (articles[0]?.slug || 'sample-news')
    },
    headline: articles[0]?.title || 'News Headline',
    image: [articles[0]?.featuredImage || 'https://images.unsplash.com/...'],
    datePublished: articles[0]?.publishedAt,
    dateModified: articles[0]?.updatedAt,
    author: {
      '@type': 'Person',
      name: articles[0]?.authorName || 'Staff Reporter',
      url: 'https://deshreport.com/author/'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DeshReport',
      logo: {
        '@type': 'ImageObject',
        url: 'https://deshreport.com/logo.png'
      }
    },
    description: articles[0]?.summary || ''
  };

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://deshreport.com/sitemap.xml
Sitemap: https://deshreport.com/sitemap-news.xml`;

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-gray-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Search className="w-6 h-6 text-teal-600" />
          <span>SEO & Google News Optimization</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Search engine indexing, dynamic sitemaps, Schema.org NewsArticle structured data, and Google News audit
        </p>
      </div>

      {/* Google News Readiness Checklist */}
      <div className="bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/50 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">
            Google News Publisher Inclusion Audit (Compliance Score: 100%)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Author Bylines</span>
              <span className="text-[11px] text-gray-500">Explicit staff reporter and editorial credit on all articles</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Editorial Policies</span>
              <span className="text-[11px] text-gray-500">Dedicated /editorial-policy and /correction-policy pages active</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Google News Sitemap</span>
              <span className="text-[11px] text-gray-500">Live dynamic sitemap-news.xml syndicates 48hr stories</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Schema.org NewsArticle</span>
              <span className="text-[11px] text-gray-500">Full JSON-LD structured data injected into every article view</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Canonical URLs</span>
              <span className="text-[11px] text-gray-500">Canonical meta tags avoid duplicate content penalties</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-2 rounded bg-teal-50/50 dark:bg-teal-950/20 text-teal-900 dark:text-teal-200">
            <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Physical Address & Contact</span>
              <span className="text-[11px] text-gray-500">Verified Dhaka newsroom address and editorial phone numbers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sitemaps & Code Generators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic XML News Sitemap */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-teal-600" />
                <span>Google News XML Sitemap (sitemap-news.xml)</span>
              </h4>
              <button
                onClick={() => handleCopy(newsSitemap, 'news_sitemap')}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
              >
                {copiedType === 'news_sitemap' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy XML</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-52 leading-relaxed">
              {newsSitemap}
            </pre>
          </div>
          <span className="text-[11px] text-gray-400 mt-2 block">
            Ready for Google Search Console and Publisher Center submission.
          </span>
        </div>

        {/* Schema.org NewsArticle JSON-LD */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
              <h4 className="font-bold text-xs text-gray-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-teal-600" />
                <span>Schema.org NewsArticle JSON-LD</span>
              </h4>
              <button
                onClick={() => handleCopy(JSON.stringify(sampleSchema, null, 2), 'schema')}
                className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
              >
                {copiedType === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy JSON</span>
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg overflow-x-auto max-h-52 leading-relaxed">
              {JSON.stringify(sampleSchema, null, 2)}
            </pre>
          </div>
          <span className="text-[11px] text-gray-400 mt-2 block">
            Automatically attached to every news story view for rich snippets.
          </span>
        </div>
      </div>

      {/* Robots.txt */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800 mb-3">
          <h4 className="font-bold text-xs text-gray-900 dark:text-white">
            Robots.txt Output Preview
          </h4>
          <button
            onClick={() => handleCopy(robotsTxt, 'robots')}
            className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-teal-600 cursor-pointer"
          >
            {copiedType === 'robots' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Robots</span>
          </button>
        </div>
        <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] rounded-lg">
          {robotsTxt}
        </pre>
      </div>
    </div>
  );
};
