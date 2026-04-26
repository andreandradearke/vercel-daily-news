'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import ArticleHero from '@/components/heroes/ArticleHero';
import TrendingArticles from '@/components/trending-articles/TrendingArticles';
import Paywall from '@/components/paywall/Paywall';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface ContentBlock {
    type: string;
    text?: string;
    items?: string[];
}

interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: ContentBlock[];
    category: string;
    author: {
        name: string;
        avatar: string;
    };
    image: string;
    publishedAt: string;
    featured: boolean;
    tags: string[];
}

interface ArticleProps {
    slug: string;
}

function parseMarkdown(text: string): string {
    // Convert markdown links [text](url) to HTML
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    // Convert bold **text** to HTML
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
}

function renderContentBlock(block: ContentBlock, index: number) {
    switch (block.type) {
        case 'paragraph':
            return (
                <p
                    key={index}
                    className="mb-4 text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(block.text || '') }}
                />
            );
        case 'unordered-list':
            return (
                <ul key={index} className="mb-4 list-disc list-inside space-y-2">
                    {block.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }} />
                        </li>
                    ))}
                </ul>
            );
        case 'ordered-list':
            return (
                <ol key={index} className="mb-4 list-decimal list-inside space-y-2">
                    {block.items?.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-700">
                            <span dangerouslySetInnerHTML={{ __html: parseMarkdown(item) }} />
                        </li>
                    ))}
                </ol>
            );
        default:
            return null;
    }
}

export default function Article({ slug }: ArticleProps) {
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [articleNotFound, setArticleNotFound] = useState(false);
    const { isSubscribed, isLoading: isSubscriptionLoading } = useSubscription();

    useEffect(() => {
        async function loadArticle() {
            try {
                const response = await fetch(`/api/articles/${slug}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        setArticleNotFound(true);
                        return;
                    }
                    throw new Error('Failed to fetch article');
                }
                const data = await response.json();
                setArticle(data.data);
            } catch (error) {
                console.error('Failed to fetch article:', error);
                setArticleNotFound(true);
            } finally {
                setIsLoading(false);
            }
        }
        loadArticle();
    }, [slug]);

    if (articleNotFound) {
        notFound();
    }

    if (isLoading || isSubscriptionLoading) {
        return (
            <div className="animate-pulse">
                <section className="py-8 px-4 md:px-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
                        <div className="h-12 bg-gray-200 rounded mb-6" />
                        <div className="h-4 bg-gray-200 rounded w-48" />
                    </div>
                </section>
                <section className="px-4 md:px-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="w-full h-96 bg-gray-200 rounded-lg" />
                    </div>
                </section>
            </div>
        );
    }

    if (!article) {
        return null;
    }

    // Extract teaser from first paragraph for paywall
    const teaser = article.content.find(block => block.type === 'paragraph')?.text || article.excerpt;

    return (
        <>
            <ArticleHero
                title={article.title}
                author={article.author}
                publishedAt={article.publishedAt}
                category={article.category}
            />

            <section className="px-4 md:px-24 mb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="relative w-full h-96 rounded-lg overflow-hidden mb-8">
                        <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            {isSubscribed ? (
                <>
                    <section className="px-4 md:px-24 mb-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="prose prose-lg max-w-none">
                                {article.content.map((block, index) => renderContentBlock(block, index))}
                            </div>
                        </div>
                    </section>

                    <TrendingArticles excludeSlug={article.slug} />
                </>
            ) : (
                <>
                    <Paywall teaser={teaser} />
                    <TrendingArticles excludeSlug={article.slug} />
                </>
            )}
        </>
    );
}
