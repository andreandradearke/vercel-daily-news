'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useState } from 'react';

export default function DefaultHeader() {
    const pathname = usePathname();
    const { isSubscribed, isLoading, subscribe, unsubscribe } = useSubscription();
    const [isProcessing, setIsProcessing] = useState(false);

    const routes = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Search' }
    ]

    const visibleRoutes = routes.filter(r => r.href !== pathname);

    const handleSubscriptionToggle = async () => {
        setIsProcessing(true);
        try {
            if (isSubscribed) {
                await unsubscribe();
            } else {
                await subscribe();
            }
        } catch (error) {
            console.error('Subscription action failed:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <header className="min-h-24 md:py-8 md:px-24 py-4 flex items-center md:gap-8 gap-4 flex-col md:flex-row">
            <div className="text-lg font-bold"><Link href="/">Vercel Daily News</Link></div>
            <nav className="flex gap-6">
                {visibleRoutes.map(r => <Link key={r.href} href={r.href} className="hover:underline">{r.label}</Link>)}
            </nav>
            <div className="md:ml-auto">
                {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-400">Loading...</div>
                ) : isSubscribed ? (
                    <button
                        onClick={handleSubscriptionToggle}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : '✓ Subscribed'}
                    </button>
                ) : (
                    <button
                        onClick={handleSubscriptionToggle}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {isProcessing ? 'Processing...' : 'Subscribe'}
                    </button>
                )}
            </div>
        </header>
    );
}