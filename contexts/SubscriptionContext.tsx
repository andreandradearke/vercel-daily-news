'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

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
            const response = await fetch('/api/subscription');
            if (response.ok) {
                const data = await response.json();
                setIsSubscribed(data.data?.status === 'active');
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

            // Get current token if it exists
            const statusResponse = await fetch('/api/subscription');

            if (statusResponse.ok) {
                const statusData = await statusResponse.json();
                if (statusData.data?.status === 'active') {
                    setIsSubscribed(true);
                    return;
                }

            } else if (statusResponse.status !== 400) { // no token exists
                const createResponse = await fetch('/api/subscription/create', {
                    method: 'POST'
                });

                if (!createResponse.ok) {
                    throw new Error('Failed to create subscription');
                }
            }

            // Activate the subscription (either new or inactive)
            const response = await fetch('/api/subscription', {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error('Failed to activate subscription');
            }

            setIsSubscribed(true);
        } catch (error) {
            console.error('Failed to subscribe:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const unsubscribe = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/subscription', {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to unsubscribe');
            }

            setIsSubscribed(false);
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
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
