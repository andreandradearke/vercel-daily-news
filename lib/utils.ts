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
