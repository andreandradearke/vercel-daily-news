'use client';

import { useEffect, useState } from 'react';
import { formatCategory } from '@/lib/utils';

interface BreakingNews {
    id: string;
    headline: string;
    summary: string;
    articleId: string;
    category: string;
    publishedAt: string;
    urgent: boolean;
}

export default function BreakingNewsBanner() {
    const [breakingNews, setBreakingNews] = useState<BreakingNews | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadBreakingNews() {
            try {
                const response = await fetch('/api/breaking-news');
                if (!response.ok) {
                    throw new Error('Failed to fetch breaking news');
                }
                const data = await response.json();
                setBreakingNews(data.data);
            } catch (error) {
                console.error('Failed to fetch breaking news:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadBreakingNews();
    }, []);

    if (isLoading || !breakingNews) {
        return (
            <div className="md:py-4 md:px-24 p-2 bg-black text-white">
                <p className="flex gap-2 leading-tight text-sm items-center">
                    <span className="w-48 h-4 bg-gray-700 rounded animate-pulse" />
                </p>
            </div>
        );
    }

    return (
        <div className="md:py-4 md:px-24 p-2 bg-black text-white">
            <p className="flex gap-2 leading-tight text-sm items-center">
                {breakingNews.urgent && <span>&#9888;</span>}
                <span className="bg-white text-black px-2 py-1 rounded font-bold leading-none content-center text-sm">
                    {formatCategory(breakingNews.category)}
                </span>
                {breakingNews.headline}
            </p>
        </div>
    );
}