'use client';

import Article from '@/page-components/Article';
import { use } from 'react';

export default function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = use(params);
    const articleSlug = slug.join('/');

    return <Article slug={articleSlug} />;
}