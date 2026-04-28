import { formatCategory } from '@/lib/utils';
import { getBreakingNews } from '@/lib/data';
import { ICONS } from '@/lib/icons';

export default async function BreakingNewsBanner() {
    const breakingNews = await getBreakingNews();

    if (!breakingNews) {
        return null;
    }

    return (
        <div className="md:py-4 md:px-24 p-2 bg-black text-white">
            <p className="flex gap-2 leading-tight text-sm items-center">
                {breakingNews.urgent && <span>{ICONS.WARNING}</span>}
                <span className="bg-white text-black px-2 py-1 rounded font-bold leading-none content-center text-sm">
                    {formatCategory(breakingNews.category)}
                </span>
                {breakingNews.headline}
            </p>
        </div>
    );
}