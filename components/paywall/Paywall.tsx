'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

interface PaywallProps {
    articleTitle: string;
    teaser: string;
}

export default function Paywall({ articleTitle, teaser }: PaywallProps) {
    const { subscribe } = useSubscription();
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async () => {
        setIsSubscribing(true);
        try {
            await subscribe();
            // The page will re-render with full content automatically
        } catch (error) {
            console.error('Failed to subscribe:', error);
            alert('Failed to subscribe. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <div className="px-4 md:px-24 mb-12">
            <div className="max-w-3xl mx-auto">
                <div className="relative">
                    {/* Teaser content with fade effect */}
                    <div className="prose prose-lg max-w-none mb-8">
                        <p className="text-gray-700 leading-relaxed">{teaser}</p>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                </div>

                {/* Paywall CTA */}
                <div className="mt-12 bg-gray-50 border-2 border-gray-200 rounded-lg p-8 md:p-12 text-center">
                    <div className="mb-4">
                        <svg
                            className="w-16 h-16 mx-auto text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Subscribe to Continue Reading</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Get unlimited access to all articles and insights from Vercel Daily News.
                    </p>
                    <button
                        onClick={handleSubscribe}
                        disabled={isSubscribing}
                        className="px-8 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                    </button>
                </div>
            </div>
        </div>
    );
}
