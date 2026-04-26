import { Suspense } from "react";
import BreakingNewsBanner from "@/components/breaking-news-banner/BreakingNewsBanner";
import FeaturedArticles from "@/components/featured-articles/featured-articles";
import DefaultHero from "@/components/heroes/DefaultHero";

function FeaturedArticlesSkeleton() {
    return (
        <section className="py-12 px-4 md:px-24">
            <h2 className="text-2xl font-bold mb-6">Featured</h2>
            <p className="text-gray-600 mb-8">Hand-picked stories from the team</p>
            <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
                        <div className="w-full h-48 bg-gray-200" />
                        <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded mb-2" />
                            <div className="h-4 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function Home() {
    return (
        <>
            <BreakingNewsBanner headline="Vercel CDN Node Collapses Over 3M Requests Per Day" featuredText="Breaking" />
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