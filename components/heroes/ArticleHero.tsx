import { formatCategory, formatDate } from '@/lib/utils';

interface ArticleHeroProps {
    title: string;
    author: {
        name: string;
    };
    publishedAt: string;
    category: string;
}

export default function ArticleHero({
    title,
    author,
    publishedAt,
    category
}: ArticleHeroProps) {
    return (
        <section className="py-8 px-4 md:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                    <span className="text-sm font-semibold text-gray-600">
                        {formatCategory(category)}
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                    <span className="font-medium">{author.name}</span>
                    <span>•</span>
                    <span>{formatDate(publishedAt)}</span>
                </div>
            </div>
        </section>
    );
}
