'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

export default function SubscribeCTA() {
    const { subscribe } = useSubscription();
    const [isSubscribing, setIsSubscribing] = useState(false);

    const handleSubscribe = async () => {
        setIsSubscribing(true);
        try {
            await subscribe();
        } catch (error) {
            console.error('Failed to subscribe:', error);
            alert('Failed to subscribe. Please try again.');
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <section className="py-12 px-4 md:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="bg-black text-white rounded-lg p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Subscribe to get the latest news, updates, and insights delivered directly to your inbox.
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={handleSubscribe}
                            disabled={isSubscribing}
                            className="px-8 py-3 bg-white text-black rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {isSubscribing ? 'Subscribing...' : 'Subscribe Now'}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
