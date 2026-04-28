export function formatCategory(category: string): string {
    return category.replace(/-/g, ' ').toUpperCase();
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

export function sortArticlesByDate<T extends { publishedAt: string }>(articles: T[]): T[] {
    return articles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
