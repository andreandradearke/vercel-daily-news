import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

/**
 * Article Types
 */
export interface ContentBlock {
    type: string;
    text?: string;
    items?: string[];
}

export interface Author {
    name: string;
    avatar: string;
}

export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: ContentBlock[];
    category: string;
    author: Author;
    image: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
}

export interface ArticleListItem {
    id: string;
    title: string;
    excerpt: string;
    image?: string;
    slug: string;
    category: string;
    publishedAt: string;
}

/**
 * Fetch a single article by slug
 */
export async function getArticle(slug: string): Promise<Article | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_CONFIG.REVALIDATE.ARTICLES_INDIVIDUAL,
                tags: [CACHE_CONFIG.TAGS.ARTICLES, CACHE_CONFIG.TAGS.article(slug)]
            }
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch article: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

/**
 * Fetch articles with optional filters
 */
export async function getArticles(params?: {
    featured?: boolean;
    trending?: boolean;
    search?: string;
    category?: string;
    limit?: number;
}): Promise<ArticleListItem[]> {
    try {
        const searchParams = new URLSearchParams();
        
        if (params?.featured) searchParams.set('featured', 'true');
        if (params?.trending) searchParams.set('trending', 'true');
        if (params?.search) searchParams.set('search', params.search);
        if (params?.category) searchParams.set('category', params.category);
        if (params?.limit) searchParams.set('limit', String(params.limit));

        const url = `${API_BASE_URL}/articles${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
        
        // Determine cache strategy based on query type
        const isSearch = params?.search || params?.category;
        const revalidateTime = isSearch 
            ? CACHE_CONFIG.REVALIDATE.ARTICLES_SEARCH 
            : CACHE_CONFIG.REVALIDATE.ARTICLES_LIST;

        const response = await fetch(url, {
            headers: API_HEADERS,
            next: { 
                revalidate: revalidateTime,
                tags: [CACHE_CONFIG.TAGS.ARTICLES]
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch articles: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching articles:', error);
        return [];
    }
}

/**
 * Fetch featured articles (for homepage)
 */
export async function getFeaturedArticles(limit: number = 3): Promise<ArticleListItem[]> {
    return getArticles({ featured: true, limit });
}

/**
 * Fetch trending articles
 */
export async function getTrendingArticles(limit: number = 4): Promise<ArticleListItem[]> {
    return getArticles({ trending: true, limit });
}
