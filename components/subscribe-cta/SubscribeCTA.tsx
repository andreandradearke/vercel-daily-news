'use client';

import SubscribeButton from '@/components/buttons/SubscribeButton';

export default function SubscribeCTA() {

    return (
        <div className="mt-12 bg-gray-50 border-2 border-gray-200 rounded-lg p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Subscribe to Continue Reading</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Get unlimited access to all articles and insights from Vercel Daily News.
            </p>
            <SubscribeButton size="lg" className="rounded-md" />
        </div>
    );
}
