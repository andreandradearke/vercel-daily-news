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
    console.log('[Action] getSubscriptionStatus called');
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('subscription-token')?.value;

        console.log('[Action] Token from cookie:', token ? `${token.substring(0, 10)}...` : 'null');

        if (!token) {
            console.log('[Action] No token found');
            return {
                success: false,
                error: 'No subscription token found'
            };
        }

        console.log('[Action] Fetching status from API...');
        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        console.log('[Action] API response status:', response.status);

        // If subscription not found (404), treat it as no token
        if (response.status === 404) {
            console.log('[Action] Subscription not found (404), treating as no token');
            return {
                success: false,
                error: 'Subscription not found'
            };
        }

        if (!response.ok) {
            console.log('[Action] API returned error');
            return {
                success: false,
                error: 'Failed to get subscription status'
            };
        }

        const data = await response.json();
        console.log('[Action] API response data:', data);
        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('[Action] Error getting subscription status:', error);
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
    console.log('[Action] createSubscription called');
    try {
        console.log('[Action] Calling API to create subscription...');
        const response = await fetch(`${API_BASE_URL}/subscription/create`, {
            method: 'POST',
            headers: API_HEADERS
        });

        console.log('[Action] Create API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.log('[Action] Create API error:', errorText);
            return {
                success: false,
                error: 'Failed to create subscription'
            };
        }

        const data = await response.json();
        const token = response.headers.get('x-subscription-token');

        console.log('[Action] Token from response header:', token ? `${token.substring(0, 10)}...` : 'null');
        console.log('[Action] Response data:', data);

        if (!token) {
            console.log('[Action] No token in response header');
            return {
                success: false,
                error: 'No subscription token received'
            };
        }

        // Set the cookie
        console.log('[Action] Setting cookie...');
        const cookieStore = await cookies();
        cookieStore.set('subscription-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 15
        });
        console.log('[Action] Cookie set successfully');

        return {
            success: true,
            data: data.data,
            token: token
        };
    } catch (error) {
        console.error('[Action] Error creating subscription:', error);
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
    console.log('[Action] activateSubscription called with providedToken:', providedToken ? 'yes' : 'no');
    try {
        let token = providedToken;
        
        if (!token) {
            console.log('[Action] No provided token, reading from cookie...');
            const cookieStore = await cookies();
            token = cookieStore.get('subscription-token')?.value;
            console.log('[Action] Token from cookie:', token ? `${token.substring(0, 10)}...` : 'null');
        } else {
            console.log('[Action] Using provided token:', `${token.substring(0, 10)}...`);
        }

        if (!token) {
            console.error('[Action] No token found when trying to activate');
            return {
                success: false,
                error: 'No subscription token found'
            };
        }

        console.log('[Action] Calling API to activate subscription...');
        const response = await fetch(`${API_BASE_URL}/subscription`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'x-subscription-token': token
            }
        });

        console.log('[Action] Activate API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Action] Activation failed:', response.status, errorText);
            return {
                success: false,
                error: `Failed to activate subscription: ${response.status}`
            };
        }

        const data = await response.json();
        console.log('[Action] Activation response data:', data);
        return {
            success: true,
            data: data.data
        };
    } catch (error) {
        console.error('[Action] Error activating subscription:', error);
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
    console.log('[Action] deactivateSubscription called');
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
        console.error('[Action] Error deactivating subscription:', error);
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
    console.log('[Subscribe] Starting subscription flow');
    
    const statusResult = await getSubscriptionStatus();
    console.log('[Subscribe] Status check:', statusResult);

    if (statusResult.success && statusResult.data?.status === 'active') {
        console.log('[Subscribe] Already active');
        return statusResult;
    }

    // If no token OR subscription not found (404), create new subscription
    if (!statusResult.success && 
        (statusResult.error === 'No subscription token found' || statusResult.error === 'Subscription not found')) {
        
        // Delete invalid token if it exists
        if (statusResult.error === 'Subscription not found') {
            console.log('[Subscribe] Deleting invalid token');
            const cookieStore = await cookies();
            cookieStore.delete('subscription-token');
        }
        
        console.log('[Subscribe] Creating new subscription');
        const createResult = await createSubscription();
        console.log('[Subscribe] Create result:', createResult);
        
        if (!createResult.success) {
            return createResult;
        }
        
        if (createResult.data?.status === 'active') {
            console.log('[Subscribe] Subscription already active after creation');
            return createResult;
        }
        
        console.log('[Subscribe] Activating subscription with new token');
        const activateResult = await activateSubscription(createResult.token);
        console.log('[Subscribe] Activate result:', activateResult);
        return activateResult;
    }

    console.log('[Subscribe] Activating existing subscription');
    const activateResult = await activateSubscription();
    console.log('[Subscribe] Activate result:', activateResult);
    return activateResult;
}

/**
 * Complete unsubscribe flow
 */
export async function unsubscribe(): Promise<SubscriptionResponse> {
    return await deactivateSubscription();
}
