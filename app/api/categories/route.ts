import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_PROFILES, CACHE_TAGS } from '@/lib/cache-config';

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_PROFILES.categories.revalidate,
                tags: [CACHE_TAGS.CATEGORIES]
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_PROFILES.categories.revalidate}, stale-while-revalidate=${CACHE_PROFILES.categories.stale}`
            }
        });
    } catch (error) {
        console.error('API proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
