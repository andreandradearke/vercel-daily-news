import Link from 'next/link';
import SubscribeButton from '@/components/buttons/SubscribeButton';
import NavigationLinks from '@/components/headers/NavigationLinks';

export default function DefaultHeader() {
    return (
        <header className="min-h-24 md:py-8 md:px-24 py-4 flex items-center md:gap-8 gap-4 flex-col md:flex-row">
            <div className="text-lg font-bold flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <svg aria-label="Vercel logomark" height="18" role="img" viewBox="0 0 74 64">
                        <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>
                    </svg>
                    <span>Vercel Daily News</span>
                </Link>
            </div>
            <NavigationLinks />
            <div className="md:ml-auto">
                <SubscribeButton size="sm" />
            </div>
        </header>
    );
}