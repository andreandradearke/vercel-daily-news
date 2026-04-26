import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const url = `${API_BASE_URL}/articles${queryString ? `?${queryString}` : ''}`;

        const isSearch = searchParams.get('search') || searchParams.get('category');
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
            return NextResponse.json(
                { error: 'Failed to fetch articles' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': `public, s-maxage=${revalidateTime}, stale-while-revalidate=${CACHE_CONFIG.STALE.LISTS}`
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
