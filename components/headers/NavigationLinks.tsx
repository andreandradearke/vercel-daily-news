'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavigationLinks() {
    const pathname = usePathname();

    const routes = [
        { href: '/', label: 'Home' },
        { href: '/search', label: 'Search' }
    ];

    const visibleRoutes = routes.filter(r => r.href !== pathname);

    return (
        <nav className="flex gap-6">
            {visibleRoutes.map(r => (
                <Link key={r.href} href={r.href} className="hover:underline">
                    {r.label}
                </Link>
            ))}
        </nav>
    );
}
