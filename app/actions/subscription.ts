'use server';

import { cookies } from 'next/headers';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

/**
 * Subscription Response Types
 */
interface SubscriptionStatus {
    status: 'active' | 'inactive';
    expiresAt: string;
}

interface SubscriptionResponse {
    success: boolean;
    data?: SubscriptionStatus;
    error?: string;
    token?: string;
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionResponse> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('subscription-token')?.value;

        if (!token) {
            return {
                success: false,
                error: 'No subscription token found'
            };
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        // If subscription not found (404), treat it as no token
        if (response.status === 404) {
            return {
                success: false,
                error: 'Subscription not found'
            };
        }

        if (!response.ok) {
            return {
                success: false,
                error: 'Failed to get subscription status'
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Error getting subscription status:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Create a new subscription token
 */
export async function createSubscription(): Promise<SubscriptionResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/subscription/create`, {
            method: 'POST',
            headers: API_HEADERS
        });

        if (!response.ok) {
            return {
                success: false,
                error: 'Failed to create subscription'
            };
        }

        const data = await response.json();
        const token = response.headers.get('x-subscription-token');

        if (!token) {
            return {
                success: false,
                error: 'No subscription token received'
            };
        }

        // Set the cookie
        const cookieStore = await cookies();
        cookieStore.set('subscription-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 15
        });

        return {
            success: true,
            data: data.data,
            token: token
        };
    } catch (error) {
        console.error('Error creating subscription:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Activate an existing subscription
 */
export async function activateSubscription(providedToken?: string): Promise<SubscriptionResponse> {
    try {
        let token = providedToken;
        
        if (!token) {
            const cookieStore = await cookies();
            token = cookieStore.get('subscription-token')?.value;
        }

        if (!token) {
            return {
                success: false,
                error: 'No subscription token found'
            };
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        if (!response.ok) {
            return {
                success: false,
                error: `Failed to activate subscription: ${response.status}`
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Error activating subscription:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Deactivate subscription
 */
export async function deactivateSubscription(): Promise<SubscriptionResponse> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('subscription-token')?.value;

        if (!token) {
            return {
                success: false,
                error: 'No subscription token found'
            };
        }

        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'DELETE',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        if (!response.ok) {
            return {
                success: false,
                error: 'Failed to deactivate subscription'
            };
        }

        const data = await response.json();
        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('Error deactivating subscription:', error);
        return {
            success: false,
            error: 'Internal server error'
        };
    }
}

/**
 * Complete subscribe flow: create token if needed, then activate
 */
export async function subscribe(): Promise<SubscriptionResponse> {
    const statusResult = await getSubscriptionStatus();

    if (statusResult.success && statusResult.data?.status === 'active') {
        return statusResult;
    }

    // If no token OR subscription not found (404), create new subscription
    if (!statusResult.success && 
        (statusResult.error === 'No subscription token found' || statusResult.error === 'Subscription not found')) {
        
        // Delete invalid token if it exists
        if (statusResult.error === 'Subscription not found') {
            const cookieStore = await cookies();
            cookieStore.delete('subscription-token');
        }
        
        const createResult = await createSubscription();
        
        if (!createResult.success) {
            return createResult;
        }
        
        if (createResult.data?.status === 'active') {
            return createResult;
        }
        
        const activateResult = await activateSubscription(createResult.token);
        return activateResult;
    }

    const activateResult = await activateSubscription();
    return activateResult;
}

/**
 * Complete unsubscribe flow
 */
export async function unsubscribe(): Promise<SubscriptionResponse> {
    return await deactivateSubscription();
}
