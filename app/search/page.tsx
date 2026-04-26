import type { Metadata } from "next";
import Search from '@/page-components/Search';
import ArticleGridSkeleton from '@/components/skeletons/ArticleGridSkeleton';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "Search Articles",
    description: "Search and filter articles by category. Find the latest news and insights for web developers.",
    openGraph: {
        title: "Search Articles | Vercel Daily News",
        description: "Search and filter articles by category.",
        type: "website"
    }
};

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