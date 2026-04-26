'use client';

import Search from '@/page-components/Search';
import ArticleGridSkeleton from '@/components/skeletons/ArticleGridSkeleton';
import { Suspense } from 'react';

function SearchFallback() {
    return (
        <div className="py-12 px-4 md:px-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Search Articles</h1>
                <div className="animate-pulse">
                    <div className="h-12 bg-gray-200 rounded mb-8" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <ArticleGridSkeleton count={3} />
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