import { NextResponse } from 'next/server';

const API_BASE_URL = 'https://vercel-daily-news-api.vercel.app/api';
const API_HEADERS = {
    'accept': 'application/json',
    'x-vercel-protection-bypass': 'OykROcuULI6YJwAwk3VnWv4gMMbpAq6q'
};

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        
        const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
            headers: API_HEADERS,
            next: { revalidate: 300 }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch article' },
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
