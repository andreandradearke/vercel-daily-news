import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_PROFILES, CACHE_TAGS } from '@/lib/cache-config';

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
 * Uses 'categories' cache profile: 1hr revalidate, 2hr stale
 */
export async function getCategories(): Promise<Category[]> {
    'use cache';
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_PROFILES.categories.revalidate,
                tags: [CACHE_TAGS.CATEGORIES]
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
