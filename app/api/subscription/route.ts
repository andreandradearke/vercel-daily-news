import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('subscription-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'No subscription token found' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to get subscription status' },
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

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('subscription-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'No subscription token found' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to activate subscription' },
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

export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('subscription-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'No subscription token found' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'DELETE',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to deactivate subscription' },
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
