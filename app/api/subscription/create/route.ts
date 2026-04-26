import { NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

export async function POST() {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/create`, {
            method: 'POST',
            headers: API_HEADERS
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to create subscription' },
                { status: response.status }
            );
        }

        const data = await response.json();
        const token = response.headers.get('x-subscription-token');

        if (!token) {
            return NextResponse.json(
                { error: 'No subscription token received' },
                { status: 500 }
            );
        }

        const nextResponse = NextResponse.json(data);
        nextResponse.cookies.set('subscription-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 15 // cookie expires in 15 days
        });

        return nextResponse;
    } catch (error) {
        console.error('API proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
