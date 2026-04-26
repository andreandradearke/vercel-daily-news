'use client';

import Search from '@/page-components/Search';
import { Suspense } from 'react';

function SearchFallback() {
    return (
        <div className="py-12 px-4 md:px-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Search Articles</h1>
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-8" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border rounded-lg overflow-hidden shadow-sm">
                                <div className="w-full h-48 bg-gray-200" />
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded mb-2" />
                                    <div className="h-6 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchFallback />}>
            <Search />
        </Suspense>
    );
}