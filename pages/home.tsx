import BreakingNewsBanner from "@/components/breaking-news-banner/BreakingNewsBanner";
import DefaultHero from "@/components/heroes/DefaultHero";
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

        </>
    );
}