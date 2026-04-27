/**
 * Cache Configuration for Next.js 16
 * 
 * Defines cache profiles using the modern "use cache" directive and cacheLife() API.
 * These profiles control both server-side and CDN caching behavior.
 */

/**
 * Cache Life Profiles
 * Define revalidation and stale-while-revalidate times for different content types
 */
export const CACHE_PROFILES = {
    /**
     * Individual article pages - Long-lived content
     * revalidate: 1 hour, stale: 2 hours
     */
    article: {
        revalidate: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_INDIVIDUAL || '3600', 10),
        stale: parseInt(process.env.CACHE_STALE_ARTICLES || '7200', 10),
    },

    /**
     * Article lists (homepage, featured, trending) - Frequently updated
     * revalidate: 5 minutes, stale: 10 minutes
     */
    articleList: {
        revalidate: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_LIST || '300', 10),
        stale: parseInt(process.env.CACHE_STALE_LISTS || '600', 10),
    },

    /**
     * Search results - Short-lived, highly dynamic
     * revalidate: 1 minute, stale: 10 minutes
     */
    search: {
        revalidate: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_SEARCH || '60', 10),
        stale: parseInt(process.env.CACHE_STALE_LISTS || '600', 10),
    },

    /**
     * Breaking news - Time-sensitive content
     * revalidate: 5 minutes, stale: 10 minutes
     */
    breakingNews: {
        revalidate: parseInt(process.env.CACHE_REVALIDATE_BREAKING_NEWS || '300', 10),
        stale: parseInt(process.env.CACHE_STALE_BREAKING_NEWS || '600', 10),
    },

    /**
     * Categories - Stable reference data
     * revalidate: 1 hour, stale: 2 hours
     */
    categories: {
        revalidate: parseInt(process.env.CACHE_REVALIDATE_CATEGORIES || '3600', 10),
        stale: parseInt(process.env.CACHE_STALE_CATEGORIES || '7200', 10),
    },
} as const;

/**
 * Cache tags for on-demand revalidation
 * Used with Next.js revalidateTag() API
 */
export const CACHE_TAGS = {
    ARTICLES: 'articles',
    BREAKING_NEWS: 'breaking-news',
    CATEGORIES: 'categories',
    /**
     * Generate article-specific tag
     * @param id Article ID or slug
     * @returns Tag string like 'article-123'
     */
    article: (id: string) => `article-${id}`,
} as const;
