import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

/**
 * Category Types
 */
export interface Category {
    slug: string;
    name: string;
    articleCount: number;
}

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_CONFIG.REVALIDATE.CATEGORIES,
                tags: [CACHE_CONFIG.TAGS.CATEGORIES]
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
