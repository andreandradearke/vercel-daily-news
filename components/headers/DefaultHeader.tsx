'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SubscribeButton from '@/components/buttons/SubscribeButton';

export default function DefaultHeader() {
    const pathname = usePathname();

    const routes = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Search' }
    ]

    const visibleRoutes = routes.filter(r => r.href !== pathname);

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
            <nav className="flex gap-6">
                {visibleRoutes.map(r => <Link key={r.href} href={r.href} className="hover:underline">{r.label}</Link>)}
            </nav>
            <div className="md:ml-auto">
                <SubscribeButton size="sm" />
            </div>
        </header>
    );
}