import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Article from '@/page-components/Article';
import { getArticle, getArticles } from '@/lib/data';

/**
 * Generate static paths for popular articles at build time
 */
export async function generateStaticParams() {
    try {
        // Fetch featured and trending articles to pre-render them
        const [featured, trending] = await Promise.all([
            getArticles({ featured: true, limit: 20 }),
            getArticles({ trending: true, limit: 30 })
        ]);

        // Combine and deduplicate
        const articlesMap = new Map();
        [...featured, ...trending].forEach(article => {
            articlesMap.set(article.slug, article);
        });

        // Return array of slug params
        return Array.from(articlesMap.values()).map(article => ({
            slug: article.slug.split('/') // Convert "slug" to ["slug"] or ["category/slug"] to ["category", "slug"]
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return []; // Return empty array on error to allow dynamic rendering
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
    const { slug } = await params;
    const articleSlug = slug.join('/');
    const article = await getArticle(articleSlug);

    if (!article) {
        return {
            title: 'Article Not Found'
        };
    }

    return {
        title: article.title,
        description: article.excerpt,
        authors: [{ name: article.author?.name }],
        keywords: article.tags,
        openGraph: {
            title: article.title,
            description: article.excerpt,
            type: 'article',
            publishedTime: article.publishedAt,
            authors: [article.author?.name],
            tags: article.tags,
            images: article.image ? [{ url: article.image, alt: article.title }] : []
        }
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const articleSlug = slug.join('/');

    const article = await getArticle(articleSlug);

    if (!article) {
        notFound();
    }

    return <Article article={article} />;
}