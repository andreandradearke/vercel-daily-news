import Image from 'next/image';
import Link from 'next/link';
import { formatCategory } from '@/lib/utils';
import { getTrendingArticles } from '@/lib/data';

interface TrendingArticlesProps {
    excludeSlug?: string;
}

export default async function TrendingArticles({ excludeSlug }: TrendingArticlesProps) {
    const allArticles = await getTrendingArticles(5); // Fetch 5 to ensure we have 4 after filtering

    // Filter out the current article if excludeSlug is provided
    const articles = excludeSlug
        ? allArticles.filter((article) => article.slug !== excludeSlug).slice(0, 4)
        : allArticles.slice(0, 4);

    return (
        <section className="py-12 px-4 md:px-24 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold mb-8">Trending Articles</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {articles.map((article) => (
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
                    ))}
                </div>
            </div>
        </section>
    );
}
