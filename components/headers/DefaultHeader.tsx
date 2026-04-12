'use client';
import Link from 'next/link';

export default function DefaultHeader() {
    const routes = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Search' }
    ]

    return (
        <header className="min-h-24 md:py-8 md:px-24 py-4 flex items-center md:gap-8 gap-4 flex-col md:flex-row">
            <div className="text-lg font-bold"><Link href="/">Vercel Daily News</Link></div>
            <nav className="flex gap-6">
                {routes.map(r => <Link key={r.href} href={r.href} className="hover:underline">{r.label}</Link>)}
            </nav>

        </header>
    );
}