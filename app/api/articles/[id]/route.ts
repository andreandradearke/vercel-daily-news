import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_CONFIG } from '@/lib/cache-config';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            headers: API_HEADERS,
            next: { 
                revalidate: CACHE_CONFIG.REVALIDATE.ARTICLES_INDIVIDUAL,
                tags: [CACHE_CONFIG.TAGS.ARTICLES, CACHE_CONFIG.TAGS.article(id)]
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch article' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': `public, s-maxage=${CACHE_CONFIG.REVALIDATE.ARTICLES_INDIVIDUAL}, stale-while-revalidate=${CACHE_CONFIG.STALE.ARTICLES}`
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
