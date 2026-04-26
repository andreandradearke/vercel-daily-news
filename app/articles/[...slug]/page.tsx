export default async function Article({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;
    const articleSlug = slug.join('/');

    return (
        <div className="py-12 px-4 md:px-24 max-w-4xl mx-auto">
            <article>
                <header className="mb-8">
                    <h1 className="text-4xl font-bold mb-4">
                        Article: {articleSlug}
                    </h1>
                    <p className="text-gray-600">
                        This is a placeholder article page. The full article content will be loaded here.
                    </p>
                </header>
                <div className="prose prose-lg">
                    <p>Article slug: <code className="bg-gray-100 px-2 py-1 rounded">{articleSlug}</code></p>
                </div>
            </article>
        </div>
    );
}