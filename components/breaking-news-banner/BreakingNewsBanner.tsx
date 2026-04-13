interface BreakingNewsBannerProps {
    headline: string;
    featuredText: string;
}
export default function BreakingNewsBanner({ headline, featuredText }: BreakingNewsBannerProps) {
    return (
        <div className="md:py-4 md:px-24 p-2 bg-black text-white">
            <p className="flex gap-2 leading-tight text-sm items-center">
                <span>&#9888;</span>
                <span className="bg-white text-black px-2 py-1 rounded font-bold leading-none content-center text-sm">{featuredText}</span>
                {headline}
            </p>
        </div>
    );
}