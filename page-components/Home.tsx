import { Suspense } from "react";
import BreakingNewsBanner from "@/components/breaking-news-banner/BreakingNewsBanner";
import FeaturedArticles from "@/components/featured-articles/featured-articles";
import DefaultHero from "@/components/heroes/DefaultHero";
import ArticleGridSkeleton from '@/components/skeletons/ArticleGridSkeleton';

function BreakingNewsSkeleton() {
    return (
        <div className="md:py-4 md:px-24 p-2 bg-black text-white">
            <p className="flex gap-2 leading-tight text-sm items-center">
                <span className="w-48 h-4 bg-gray-700 rounded animate-pulse" />
            </p>
        </div>
    );
}

function FeaturedArticlesSkeleton() {
    return (
        <section className="py-12 px-4 md:px-24">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <p className="text-gray-600 mb-8">Hand-picked stories from the team</p>
            <div className="grid gap-8 md:grid-cols-3">
                <ArticleGridSkeleton count={3} />
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <>
            <Suspense fallback={<BreakingNewsSkeleton />}>
                <BreakingNewsBanner />
            </Suspense>
            <DefaultHero
                eyebrow="The Vercel Daily"
                headline="News and Insights for modern web developers."
                description="Changelogs, engineering deep-dives, customer stories and community updates - all in one place."
                primaryButtonText="Browse Articles"
                primaryButtonHref="/search"
                secondaryButtonText="Subscribe"
                secondaryButtonHref="/subscribe"
            // backgroundImage="https://images.pexels.com/photos/29491832/pexels-photo-29491832.jpeg"
            />
            <Suspense fallback={<FeaturedArticlesSkeleton />}>
                <FeaturedArticles />
            </Suspense>
        </>
    );
}