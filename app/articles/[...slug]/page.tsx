import type { Metadata } from 'next';
import Article from '@/page-components/Article';
import { API_BASE_URL, API_HEADERS } from '@/lib/api-config';

async function getArticle(slug: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/articles/${slug}`, {
            headers: API_HEADERS,
            next: { revalidate: 3600 }
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.data;
    } catch {
        return null;
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

    return <Article slug={articleSlug} />;
}