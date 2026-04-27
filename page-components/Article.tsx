import Image from 'next/image';
import { Suspense } from 'react';
import ArticleHero from '@/components/heroes/ArticleHero';
import ArticleContent from '@/components/article/ArticleContent';
import TrendingArticles from '@/components/trending-articles/TrendingArticles';
import Paywall from '@/components/paywall/Paywall';
import type { Article as ArticleType } from '@/lib/data';

interface ArticleProps {
    article: ArticleType;
}

function TrendingArticlesSkeleton() {
    return (
        <section className="py-12 px-4 md:px-24 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Trending Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white border rounded-lg overflow-hidden shadow-sm animate-pulse">
                            <div className="w-full h-40 bg-gray-200" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded mb-2" />
                                <div className="h-3 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Article({ article }: ArticleProps) {
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

            <ArticleContent
                content={article.content}
                teaser={teaser}
                paywallComponent={<Paywall teaser={teaser} />}
            />

            <Suspense fallback={<TrendingArticlesSkeleton />}>
                <TrendingArticles excludeSlug={article.slug} />
            </Suspense>
        </>
    );
}
