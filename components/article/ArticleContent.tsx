'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import type { Article } from '@/lib/data';

interface ArticleContentProps {
    content: Article['content'];
    paywallComponent: React.ReactNode;
}

function parseMarkdown(text: string): string {
    // Convert markdown links [text](url) to HTML
    let html = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
    // Convert bold **text** to HTML
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
}

function renderContentBlock(block: Article['content'][0], index: number) {
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

export default function ArticleContent({ content, paywallComponent }: ArticleContentProps) {
    const { isSubscribed } = useSubscription();

    if (isSubscribed) {
        return (
            <section className="px-4 md:px-24 mb-12">
                <div className="max-w-3xl mx-auto">
                    <div className="prose prose-lg max-w-none">
                        {content.map((block, index) => renderContentBlock(block, index))}
                    </div>
                </div>
            </section>
        );
    }

    return <>{paywallComponent}</>;
}
