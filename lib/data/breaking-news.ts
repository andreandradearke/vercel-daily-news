import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

/**
 * Breaking News Types
 */
export interface BreakingNews {
    id: string;
    headline: string;
    summary: string;
    articleId: string;
    category: string;
    publishedAt: string;
    urgent: boolean;
}

/**
 * Fetch the current breaking news item
 */
export async function getBreakingNews(): Promise<BreakingNews | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/breaking-news`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_CONFIG.REVALIDATE.BREAKING_NEWS,
                tags: [CACHE_CONFIG.TAGS.BREAKING_NEWS]
            }
        });

        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Failed to fetch breaking news: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        return null;
    }
}
