import React, { useEffect } from 'react';
import { useNews } from '../../context/NewsContext';
import { getBaseSiteUrl } from '../../services/indexingService';

export const SEOHelper: React.FC = () => {
  const {
    activeSection,
    activeArticleId,
    activeCategorySlug,
    activePageSlug,
    articles = [],
    categories = [],
    siteSettings
  } = useNews();

  useEffect(() => {
    const base = getBaseSiteUrl();

    // Helper to set or update meta tag
    const setMeta = (nameOrProperty: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set canonical tag
    const setCanonical = (url: string) => {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', url);
    };

    // Helper to inject JSON-LD script
    const setJsonLd = (schemaData: any) => {
      let scriptTag = document.getElementById('json-ld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'json-ld-schema';
        scriptTag.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    };

    // 1. Google Search Console Verification Meta
    if (siteSettings?.googleSearchConsoleMeta || siteSettings?.googleSearchConsoleCode) {
      const gscCode = (siteSettings.googleSearchConsoleMeta || siteSettings.googleSearchConsoleCode || '').trim();
      setMeta('google-site-verification', gscCode);
    }

    // Default Robots for Search Engines & Google News
    setMeta('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMeta('googlebot-news', 'index, follow');
    setMeta('og:site_name', siteSettings?.siteName || 'DeshReport', true);
    setMeta('og:locale', 'bn_BD', true);

    // 2. Route-Specific SEO & Schema
    if (activeSection === 'article' && activeArticleId) {
      const article = articles.find(a => a.id === activeArticleId) || articles[0];
      if (article) {
        const articleUrl = `${base}/article/${article.slug}`;
        const cleanTitle = article.title;
        const cleanSummary = article.summary || article.title;
        const cat = categories.find(c => c.id === article.categoryId);

        // Document Title
        document.title = `${cleanTitle} | ${siteSettings?.siteName || 'DeshReport'}`;

        // Meta Tags
        setMeta('description', cleanSummary);
        setMeta('keywords', article.tags?.join(', ') || 'বাংলাদেশ সংবাদ, খবর, ব্রেকিং নিউজ');
        setMeta('news_keywords', article.tags?.join(', ') || 'বাংলাদেশ সংবাদ, খবর, ব্রেকিং নিউজ');
        setMeta('author', article.authorName || 'DeshReport');

        // OpenGraph
        setMeta('og:title', cleanTitle, true);
        setMeta('og:description', cleanSummary, true);
        setMeta('og:type', 'article', true);
        setMeta('og:url', articleUrl, true);
        setMeta('og:image', article.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80', true);
        setMeta('article:published_time', new Date(article.publishedAt).toISOString(), true);
        setMeta('article:modified_time', new Date(article.updatedAt || article.publishedAt).toISOString(), true);
        if (cat) {
          setMeta('article:section', cat.nameBn, true);
        }

        // Twitter Card
        setMeta('twitter:card', 'summary_large_image');
        setMeta('twitter:title', cleanTitle);
        setMeta('twitter:description', cleanSummary);
        setMeta('twitter:image', article.featuredImage || '');

        // Canonical
        setCanonical(article.canonicalUrl || articleUrl);

        // Schema.org NewsArticle JSON-LD
        const newsArticleSchema = {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': articleUrl
          },
          headline: cleanTitle,
          description: cleanSummary,
          image: [
            article.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&auto=format&fit=crop&q=80'
          ],
          datePublished: new Date(article.publishedAt).toISOString(),
          dateModified: new Date(article.updatedAt || article.publishedAt).toISOString(),
          author: {
            '@type': 'Person',
            name: article.authorName || 'Staff Reporter',
            url: `${base}/author/`
          },
          publisher: {
            '@type': 'Organization',
            name: siteSettings?.siteName || 'DeshReport',
            url: base,
            logo: {
              '@type': 'ImageObject',
              url: `${base}/logo.png`,
              width: 600,
              height: 60
            }
          },
          articleSection: cat?.nameBn || 'জাতীয়',
          keywords: article.tags?.join(', ') || 'Bangladesh News'
        };

        setJsonLd(newsArticleSchema);
        return;
      }
    }

    if (activeSection === 'category' && activeCategorySlug) {
      const cat = categories.find(c => c.slug === activeCategorySlug);
      const catName = cat?.nameBn || 'বিভাগ';
      const catUrl = `${base}/category/${activeCategorySlug}`;

      document.title = `${catName} সংবাদ - সর্বশেষ খবর ও আপডেট | ${siteSettings?.siteName || 'DeshReport'}`;
      setMeta('description', `${catName} বিভাগের সর্বশেষ সংবাদ, বিশ্লেষণ এবং ছবি। দেশরিপোর্ট ডিজিটাল সংস্করণ।`);
      setMeta('og:title', `${catName} সংবাদ | DeshReport`, true);
      setMeta('og:description', `${catName} বিভাগের সর্বশেষ সংবাদ ও ছবি।`, true);
      setMeta('og:type', 'website', true);
      setMeta('og:url', catUrl, true);
      setCanonical(catUrl);

      const categorySchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${catName} সংবাদ`,
        url: catUrl,
        publisher: {
          '@type': 'Organization',
          name: siteSettings?.siteName || 'DeshReport',
          url: base
        }
      };
      setJsonLd(categorySchema);
      return;
    }

    // Default / Homepage
    const siteTitle = `${siteSettings?.siteName || 'DeshReport'} | ${siteSettings?.taglineBn || 'দেশের খবর, সবার আগে'}`;
    const siteDesc = siteSettings?.siteDescription || 'বাংলাদেশের শীর্ষস্থানীয় ডিজিটাল সংবাদপত্র ও সংবাদ পোর্টাল।';

    document.title = siteTitle;
    setMeta('description', siteDesc);
    setMeta('og:title', siteTitle, true);
    setMeta('og:description', siteDesc, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', base, true);
    setCanonical(base);

    const homepageSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${base}/#organization`,
          name: siteSettings?.siteName || 'DeshReport',
          url: base,
          logo: {
            '@type': 'ImageObject',
            url: `${base}/logo.png`
          },
          sameAs: [
            siteSettings?.facebookUrl || 'https://facebook.com/deshreport',
            siteSettings?.telegramUrl || 'https://t.me/deshreport',
            siteSettings?.youtubeUrl || 'https://youtube.com/deshreport'
          ]
        },
        {
          '@type': 'WebSite',
          '@id': `${base}/#website`,
          url: base,
          name: siteSettings?.siteName || 'DeshReport',
          description: siteDesc,
          publisher: {
            '@id': `${base}/#organization`
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${base}/?s={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }
      ]
    };

    setJsonLd(homepageSchema);
  }, [activeSection, activeArticleId, activeCategorySlug, activePageSlug, articles, categories, siteSettings]);

  return null;
};
