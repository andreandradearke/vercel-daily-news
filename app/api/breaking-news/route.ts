import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/breaking-news`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_CONFIG.REVALIDATE.BREAKING_NEWS,
                tags: [CACHE_CONFIG.TAGS.BREAKING_NEWS]
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch breaking news' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_CONFIG.REVALIDATE.BREAKING_NEWS}, stale-while-revalidate=${CACHE_CONFIG.STALE.BREAKING_NEWS}`
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
