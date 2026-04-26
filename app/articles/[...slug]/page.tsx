import Article from '@/pages/Article';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const articleSlug = slug.join('/');

    return <Article slug={articleSlug} />;
}