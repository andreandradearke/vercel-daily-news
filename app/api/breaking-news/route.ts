import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/breaking-news`, {
            headers: API_HEADERS,
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch breaking news' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
