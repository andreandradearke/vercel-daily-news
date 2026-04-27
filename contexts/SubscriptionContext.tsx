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
        try {
            const result = await getSubscriptionStatus();
            if (result.success && result.data) {
                setIsSubscribed(result.data.status === 'active');
            } else {
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error('Failed to check subscription status:', error);
            setIsSubscribed(false);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribe = async () => {
        try {
            setIsLoading(true);
            const result = await subscribeAction();

            if (!result.success) {
                throw new Error(result.error || 'Failed to subscribe');
            }

            setIsSubscribed(true);
        } catch (error) {
            console.error('Subscribe error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        try {
            setIsLoading(true);
            const result = await unsubscribeAction();

            if (!result.success) {
                throw new Error(result.error || 'Failed to unsubscribe');
            }

            setIsSubscribed(false);
        } catch (error) {
            console.error('Unsubscribe error:', error);
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
