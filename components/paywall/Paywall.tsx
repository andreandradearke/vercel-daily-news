'use client';

import SubscribeCTA from '@/components/subscribe-cta/SubscribeCTA';

interface PaywallProps {
    teaser: string;
}

export default function Paywall({ teaser }: PaywallProps) {

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

                <SubscribeCTA />
            </div>
        </div>
    );
}
