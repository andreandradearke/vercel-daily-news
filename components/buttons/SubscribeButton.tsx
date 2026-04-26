'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

interface SubscribeButtonProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function SubscribeButton({
    size = 'md',
    className = ''
}: SubscribeButtonProps) {
    const { isSubscribed, isLoading, subscribe, unsubscribe } = useSubscription();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClick = async () => {
        setIsProcessing(true);
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
        } catch (error) {
            console.error('Subscription action failed:', error);
            alert('Failed to process subscription. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg'
    };

    if (isLoading) {
        return (
            <div className={`${sizeClasses[size]} text-gray-400 ${className}`}>
                Loading...
            </div>
        );
    }

    // Subscribed state
    if (isSubscribed) {
        return (
            <button
                onClick={handleClick}
                disabled={isProcessing}
                className={`${sizeClasses[size]} bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                {isProcessing ? 'Unsubscribing...' : '\u2713 Subscribed'}
            </button>
        );
    }

    // Default subscribe button
    return (
        <button
            onClick={handleClick}
            disabled={isProcessing}
            className={`${sizeClasses[size]} bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {isProcessing ? 'Subscribing...' : 'Subscribe'}
        </button>
    );
}
