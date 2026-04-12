import BreakingNewsBanner from "@/components/breaking-news-banner/BreakingNewsBanner";
export default function Home() {
    return (
        <>
            <BreakingNewsBanner />
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-6">Welcome to Vercel Daily News</h1>
                <p className="text-lg mb-4">
                    Stay updated with the latest news and articles from the tech world.
                </p>
            </div>

        </>
    );
}