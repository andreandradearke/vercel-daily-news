'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { formatCategory, formatDate } from '@/lib/utils';
import { SEARCH_CONFIG } from '@/lib/search-config';
import ArticleGridSkeleton from '@/components/skeletons/ArticleGridSkeleton';

interface Article {
    id: string;
    title: string;
    excerpt: string;
    image?: string;
    slug: string;
    category: string;
    publishedAt: string;
}

interface Category {
    slug: string;
    name: string;
    articleCount: number;
}

export default function Search() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [articles, setArticles] = useState<Article[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch categories for the dropdown
    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await fetch('/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        loadCategories();
    }, []);

    const updateURL = useCallback((search: string, cat: string) => {
        const params = new URLSearchParams();
        if (search) params.set('q', search);
        if (cat) params.set('category', cat);

        const newURL = params.toString() ? `/search?${params.toString()}` : '/search';
        router.push(newURL, { scroll: false });
    }, [router]);

    const performSearch = useCallback(async (search: string, cat: string) => {
        setIsLoading(true);
        setHasSearched(true);

        try {
            const params = new URLSearchParams();
            params.set('limit', String(SEARCH_CONFIG.LIMIT));
            if (search) params.set('search', search);
            if (cat) params.set('category', cat);

            const response = await fetch(`/api/articles?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch articles');
            }

            const data = await response.json();
            setArticles(data.data || []);
        } catch (error) {
            console.error('Failed to search articles:', error);
            setArticles([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        const urlSearch = searchParams.get('q') || '';
        const urlCategory = searchParams.get('category') || '';
        performSearch(urlSearch, urlCategory);
    }, [searchParams, performSearch]);

    // Auto-search after minimum characters
    useEffect(() => {
        if (searchTerm.length >= SEARCH_CONFIG.MIN_SEARCH_LENGTH || searchTerm.length === 0) {
            const timeoutId = setTimeout(() => {
                updateURL(searchTerm, category);
                performSearch(searchTerm, category);
            }, SEARCH_CONFIG.DEBOUNCE_MS);

            return () => clearTimeout(timeoutId);
        }
    }, [searchTerm, category, updateURL, performSearch]);

    const handleSearchSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateURL(searchTerm, category);
        performSearch(searchTerm, category);
    };

    const handleCategoryChange = (newCategory: string) => {
        setCategory(newCategory);
        updateURL(searchTerm, newCategory);
        performSearch(searchTerm, newCategory);
    };

    return (
        <div className="py-12 px-4 md:px-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Search Articles</h1>

                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search articles..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.slug} value={cat.slug}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {/* Results Header */}
                {!isLoading && (
                    <div className="mb-6">
                        <p className="text-gray-600">
                            {!searchTerm && !category
                                ? 'Recent Articles'
                                : `Found ${articles.length} result${articles.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <ArticleGridSkeleton count={5} />
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && articles.length === 0 && hasSearched && (
                    <div className="text-center py-12">
                        <svg
                            className="w-16 h-16 mx-auto text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Results Found</h2>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search terms or category filter
                        </p>
                    </div>
                )}

                {/* Results Grid */}
                {!isLoading && articles.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <Link
                                key={article.id}
                                href={`/articles/${article.slug}`}
                                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="relative w-full h-48">
                                    <Image
                                        src={article.image || "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"}
                                        alt={article.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <span className="font-semibold">{formatCategory(article.category)}</span>
                                        <span>•</span>
                                        <span>{formatDate(article.publishedAt)}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{article.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
