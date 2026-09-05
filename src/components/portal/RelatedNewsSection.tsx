import React, { useMemo, useState } from 'react';
import { Article, Category } from '../../types';
import { toBengaliNumber, formatRelativeBanglaTime } from '../../utils/helpers';
import { Tag, Clock, ChevronRight, Sparkles, BookOpen, Flame } from 'lucide-react';

interface RelatedNewsSectionProps {
  currentArticle: Article;
  articles: Article[];
  categories: Category[];
  onSelectArticle: (articleId: string) => void;
}

export const RelatedNewsSection: React.FC<RelatedNewsSectionProps> = ({
  currentArticle,
  articles,
  categories,
  onSelectArticle
}) => {
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);

  // Normalize string for case-insensitive and whitespace-clean tag comparison
  const normalizeTag = (t: string) => t.trim().toLowerCase();

  const currentTags = useMemo(() => {
    return (currentArticle.tags || []).map(t => t.trim()).filter(Boolean);
  }, [currentArticle.tags]);

  // Compute tag-based relevance score for all other published articles
  const scoredArticles = useMemo(() => {
    const publishedOther = articles.filter(
      a => a.id !== currentArticle.id && a.status === 'published'
    );

    const normCurrentTags = currentTags.map(normalizeTag);

    const withRelevance = publishedOther.map(a => {
      const aTags = (a.tags || []).map(t => t.trim()).filter(Boolean);
      const matchingTags = aTags.filter(t => normCurrentTags.includes(normalizeTag(t)));
      
      const isSameCategory = a.categoryId === currentArticle.categoryId;
      const isSameSubcategory = a.subcategory && currentArticle.subcategory && a.subcategory === currentArticle.subcategory;
      
      // Relevance score:
      // - 20 points per matched tag
      // - 5 points if same category
      // - 3 points if same subcategory
      // - viewCount factor for engagement tie-breaking
      const tagScore = matchingTags.length * 20;
      const catScore = isSameCategory ? 5 : 0;
      const subcatScore = isSameSubcategory ? 3 : 0;
      const totalScore = tagScore + catScore + subcatScore;

      return {
        article: a,
        matchingTags,
        totalScore,
        hasTagMatch: matchingTags.length > 0,
        primaryDisplayTag: matchingTags.length > 0 ? matchingTags[0] : (aTags[0] || null)
      };
    });

    // If a tag filter is clicked by the reader, filter by that specific tag
    if (selectedTagFilter) {
      const filtered = withRelevance.filter(item =>
        (item.article.tags || []).some(t => normalizeTag(t) === normalizeTag(selectedTagFilter))
      );
      if (filtered.length > 0) {
        return filtered.slice(0, 4);
      }
    }

    // Sort primarily by tag relevance score descending, then publication time
    withRelevance.sort((a, b) => {
      if (b.totalScore !== a.totalScore) {
        return b.totalScore - a.totalScore;
      }
      return new Date(b.article.publishedAt).getTime() - new Date(a.article.publishedAt).getTime();
    });

    // Take top 4 most relevant articles
    return withRelevance.slice(0, 4);
  }, [articles, currentArticle, currentTags, selectedTagFilter]);

  if (scoredArticles.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 pt-8 border-t-2 border-gray-200 dark:border-slate-800" aria-label="সম্পর্কিত সংবাদ">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Tag className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-bn text-gray-950 dark:text-white tracking-tight">
              সম্পর্কিত সংবাদ
            </h3>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60">
              <Sparkles className="w-3 h-3" />
              <span>ট্যাগ ভিত্তিক সুপারিশ</span>
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            এই প্রতিবেদনের বিষয়ের সাথে মিল রেখে আপনার জন্য বাছাইকৃত সংবাদসমূহ
          </p>
        </div>

        {/* Interactive Tag Selector Chips to filter or explore */}
        {currentTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mr-1">
              ট্যাগ ফিল্টার:
            </span>
            <button
              type="button"
              onClick={() => setSelectedTagFilter(null)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedTagFilter === null
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              সবগুলো
            </button>
            {currentTags.slice(0, 3).map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  selectedTagFilter === tag
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700'
                }`}
              >
                <span>#{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3 to 4 Relevant Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {scoredArticles.map(({ article: rel, matchingTags, primaryDisplayTag, hasTagMatch }) => {
          const cat = categories.find(c => c.id === rel.categoryId);
          
          return (
            <article
              key={rel.id}
              onClick={() => onSelectArticle(rel.id)}
              className="group cursor-pointer bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-red-500/60 dark:hover:border-red-600/60 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Tag Badge */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                  <img
                    src={rel.featuredImage}
                    alt={rel.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                    referrerPolicy="no-referrer"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70 group-hover:opacity-80 transition-opacity pointer-events-none" />

                  {/* Matched Tag / Category Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                    {hasTagMatch && primaryDisplayTag ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-sm">
                        <Tag className="w-3 h-3" />
                        <span>#{primaryDisplayTag}</span>
                      </span>
                    ) : (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: cat?.color || '#c00612' }}
                      >
                        {cat?.nameBn || 'সংবাদ'}
                      </span>
                    )}

                    {rel.isTrending && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
                        <Flame className="w-2.5 h-2.5" />
                        <span>ট্রেন্ডিং</span>
                      </span>
                    )}
                  </div>

                  {/* Estimated Reading Time on bottom corner */}
                  {rel.readingTimeMinutes && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-red-300" />
                      <span>{toBengaliNumber(rel.readingTimeMinutes)} মিনিট পড়া</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4">
                  {/* Headline */}
                  <h4 className="font-bold font-serif-bn text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-red-600 transition-colors leading-snug line-clamp-2">
                    {rel.title}
                  </h4>

                  {/* Excerpt / Summary */}
                  {rel.summary && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                      {rel.summary}
                    </p>
                  )}

                  {/* Matched Tags Pill Row if multiple tags matched */}
                  {matchingTags.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                      <span className="text-[10px] text-gray-400">মিলিত বিষয়:</span>
                      {matchingTags.map(mt => (
                        <span
                          key={mt}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40"
                        >
                          #{mt}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Metadata & Call to Action */}
              <div className="px-4 pb-3.5 pt-2 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="text-[11px]">
                    {formatRelativeBanglaTime(rel.publishedAt)}
                  </span>
                  {rel.authorName && (
                    <>
                      <span>•</span>
                      <span className="text-[11px] truncate max-w-[110px] text-gray-600 dark:text-gray-300 font-medium">
                        {rel.authorName}
                      </span>
                    </>
                  )}
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform">
                  <span>পড়ুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
