'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    image?: string;
    slug: string;
    category: string;
    publishedAt: string;
}

function formatCategory(category: string): string {
    return category.replace(/-/g, ' ').toUpperCase();
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export default function FeaturedArticles() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadArticles() {
            try {
                const response = await fetch('/api/articles?featured=true');
                if (!response.ok) {
                    throw new Error('Failed to fetch articles');
                }
                const data = await response.json();
                setArticles(data.data || []);
            } catch (error) {
                console.error('Failed to fetch articles:', error);
            } finally {
                setIsLoading(false);
            }
        }
        loadArticles();
    }, []);

    if (isLoading) {
        return (
            <section className="py-12 px-4 md:px-24">
                <h2 className="text-2xl font-bold mb-6">Featured</h2>
                <div className="flex items-center justify-between mb-8">
                    <p className="text-gray-600">Hand-picked stories from the team</p>
                    <Link href="/search" className="text-gray-600 hover:underline font-medium">View All</Link>
                </div>
                <div className="grid gap-8 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
                            <div className="w-full h-48 bg-gray-200" />
                            <div className="p-4">
                                <div className="h-6 bg-gray-200 rounded mb-2" />
                                <div className="h-4 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 px-4 md:px-24">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">Hand-picked stories from the team</p>
                <Link href="/search" className="text-gray-600 font-normal">View All</Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                {articles.map((article, index) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative w-full h-48">
                            <Image
                                src={article.image || "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"}
                                alt={article.title}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                <span className="font-semibold">{formatCategory(article.category)}</span>
                                <span>•</span>
                                <span>{formatDate(article.publishedAt)}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                            <p className="text-gray-600 text-sm">{article.excerpt}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}