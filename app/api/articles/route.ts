import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';
import { CACHE_PROFILES, CACHE_TAGS } from '@/lib/cache-config';
import { sortArticlesByDate } from '@/lib/utils';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const queryString = searchParams.toString();
        const url = `${API_BASE_URL}/articles${queryString ? `?${queryString}` : ''}`;

        const isSearch = searchParams.get('search') || searchParams.get('category');
        const cacheProfile = isSearch ? CACHE_PROFILES.search : CACHE_PROFILES.articleList;

        const response = await fetch(url, {
            headers: API_HEADERS,
            next: { 
                revalidate: cacheProfile.revalidate,
                tags: [CACHE_TAGS.ARTICLES]
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch articles' },
                { status: response.status }
            );
        }

        const data = await response.json();
        
        // Sort articles by publishedAt date (most recent first)
        if (data.data && Array.isArray(data.data)) {
            sortArticlesByDate(data.data);
        }
        
        return NextResponse.json(data, {
            headers: {
                'Cache-Control': `public, s-maxage=${cacheProfile.revalidate}, stale-while-revalidate=${cacheProfile.stale}`
            }
        });
    } catch (error) {
        // Suppress Next.js prerender interruption errors during build
        const isPreRenderError = error && typeof error === 'object' && 'digest' in error && 
                                 error.digest === 'NEXT_PRERENDER_INTERRUPTED';
        
        if (!isPreRenderError) {
            console.error('API proxy error:', error);
        }
        
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
