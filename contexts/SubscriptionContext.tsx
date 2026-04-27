'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    getSubscriptionStatus,
    subscribe as subscribeAction,
    unsubscribe as unsubscribeAction
} from '@/app/actions/subscription';

interface SubscriptionContextType {
    isSubscribed: boolean;
    isLoading: boolean;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkStatus = async () => {
        console.log('[Context] Checking subscription status...');
        try {
            const result = await getSubscriptionStatus();
            console.log('[Context] Status check result:', result);
            if (result.success && result.data) {
                console.log('[Context] Setting isSubscribed to:', result.data.status === 'active');
                setIsSubscribed(result.data.status === 'active');
            } else {
                console.log('[Context] No valid status, setting to false. Error:', result.error);
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('[Context] Failed to check subscription status:', error);
            setIsSubscribed(false);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribe = async () => {
        console.log('[Context] Subscribe called');
        try {
            setIsLoading(true);

            console.log('[Context] Calling subscribeAction...');
            const result = await subscribeAction();
            console.log('[Context] Subscribe action result:', result);

            if (!result.success) {
                console.error('[Context] Subscribe failed:', result.error);
                throw new Error(result.error || 'Failed to subscribe');
            }

            console.log('[Context] Subscribe successful, setting isSubscribed to true');
            setIsSubscribed(true);
        } catch (error) {
            console.error('[Context] Subscribe error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        console.log('[Context] Unsubscribe called');
        try {
            setIsLoading(true);

            console.log('[Context] Calling unsubscribeAction...');
            const result = await unsubscribeAction();
            console.log('[Context] Unsubscribe action result:', result);

            if (!result.success) {
                console.error('[Context] Unsubscribe failed:', result.error);
                throw new Error(result.error || 'Failed to unsubscribe');
            }

            console.log('[Context] Unsubscribe successful, setting isSubscribed to false');
            setIsSubscribed(false);
        } catch (error) {
            console.error('[Context] Unsubscribe error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{
                isSubscribed,
                isLoading,
                subscribe,
                unsubscribe
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
