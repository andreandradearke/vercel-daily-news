/**
 * Cache Configuration
 * 
 * Centralized cache settings for ISR and CDN caching.
 * Environment variables override defaults for different deployment environments.
 */

export const CACHE_CONFIG = {
    /**
     * ISR Revalidation Times (seconds)
     * How often Next.js regenerates cached pages
     */
    REVALIDATE: {
        /**
         * Individual article pages
         * @default 3600 (1 hour)
         * @env CACHE_REVALIDATE_ARTICLES_INDIVIDUAL
         */
        ARTICLES_INDIVIDUAL: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_INDIVIDUAL || '3600', 10),

        /**
         * Article lists (homepage, featured)
         * @default 300 (5 minutes)
         * @env CACHE_REVALIDATE_ARTICLES_LIST
         */
        ARTICLES_LIST: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_LIST || '300', 10),

        /**
         * Article search results
         * @default 60 (1 minute)
         * @env CACHE_REVALIDATE_ARTICLES_SEARCH
         */
        ARTICLES_SEARCH: parseInt(process.env.CACHE_REVALIDATE_ARTICLES_SEARCH || '60', 10),

        /**
         * Breaking news banner
         * @default 300 (5 minutes)
         * @env CACHE_REVALIDATE_BREAKING_NEWS
         */
        BREAKING_NEWS: parseInt(process.env.CACHE_REVALIDATE_BREAKING_NEWS || '300', 10),

        /**
         * Categories list
         * @default 3600 (1 hour)
         * @env CACHE_REVALIDATE_CATEGORIES
         */
        CATEGORIES: parseInt(process.env.CACHE_REVALIDATE_CATEGORIES || '3600', 10),
    },

    /**
     * CDN Cache-Control stale-while-revalidate times (seconds)
     * How long CDN serves stale content while fetching fresh data
     */
    STALE: {
        /**
         * Individual articles stale window
         * @default 7200 (2 hours)
         * @env CACHE_STALE_ARTICLES
         */
        ARTICLES: parseInt(process.env.CACHE_STALE_ARTICLES || '7200', 10),

        /**
         * Article lists and search results stale window
         * @default 600 (10 minutes)
         * @env CACHE_STALE_LISTS
         */
        LISTS: parseInt(process.env.CACHE_STALE_LISTS || '600', 10),

        /**
         * Breaking news stale window
         * @default 600 (10 minutes)
         * @env CACHE_STALE_BREAKING_NEWS
         */
        BREAKING_NEWS: parseInt(process.env.CACHE_STALE_BREAKING_NEWS || '600', 10),

        /**
         * Categories stale window
         * @default 7200 (2 hours)
         * @env CACHE_STALE_CATEGORIES
         */
        CATEGORIES: parseInt(process.env.CACHE_STALE_CATEGORIES || '7200', 10),
    },

    /**
     * Cache tags for on-demand revalidation
     * Used with Next.js revalidateTag() API
     */
    TAGS: {
        ARTICLES: 'articles',
        BREAKING_NEWS: 'breaking-news',
        CATEGORIES: 'categories',
        /**
         * Generate article-specific tag
         * @param id Article ID
         * @returns Tag string like 'article-123'
         */
        article: (id: string) => `article-${id}`,
    },
} as const;
