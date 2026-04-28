import ArticleCardSkeleton from '@/components/skeletons/ArticleCardSkeleton';

interface ArticleGridSkeletonProps {
    count?: number;
}

export default function ArticleGridSkeleton({ count = 3 }: ArticleGridSkeletonProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </>
    );
}
