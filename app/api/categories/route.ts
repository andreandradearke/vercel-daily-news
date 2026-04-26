import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

export async function GET() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: API_HEADERS,
            next: { revalidate: 3600 } // Cache for 1 hour since categories don't change frequently
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch categories' },
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
