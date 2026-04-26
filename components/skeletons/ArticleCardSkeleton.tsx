export default function ArticleCardSkeleton() {
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="w-full h-48 bg-gray-200" />
            <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-6 bg-gray-200 rounded" />
            </div>
        </div>
    );
}
