'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatCategory } from '@/lib/utils';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    image?: string;
    slug: string;
    category: string;
    publishedAt: string;
}

interface TrendingArticlesProps {
    excludeSlug?: string;
}

export default function TrendingArticles({ excludeSlug }: TrendingArticlesProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadArticles() {
            try {
                const response = await fetch('/api/articles?trending=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch trending articles');
                }
                const data = await response.json();
                const allArticles = data.data || [];
                // Filter out the current article if excludeSlug is provided
                const filtered = excludeSlug
                    ? allArticles.filter((article: Article) => article.slug !== excludeSlug)
                    : allArticles;
                setArticles(filtered.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch trending articles:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadArticles();
    }, [excludeSlug]);

    return (
        <section className="py-12 px-4 md:px-24 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Trending Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm animate-pulse">
                                <div className="w-full h-40 bg-gray-200" />
                                <div className="p-4">
                                    <div className="h-4 bg-gray-200 rounded mb-2" />
                                    <div className="h-3 bg-gray-200 rounded" />
                                </div>
                            </div>
                        ))
                    ) : (
                        articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative w-full h-40">
                                    <Image
                                        src={article.image || "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <span className="font-semibold">{formatCategory(article.category)}</span>
                                    </div>
                                    <h3 className="text-sm font-semibold line-clamp-2">{article.title}</h3>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
}
