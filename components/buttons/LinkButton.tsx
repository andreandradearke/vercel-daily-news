import Link from 'next/link';
import { ICONS } from '@/lib/icons';

interface LinkButtonProps {
    text: string;
    href: string;
}

export default function LinkButton({ text, href }: LinkButtonProps) {
    const baseClasses = "px-4 py-2 rounded inline-block";
    const colorClasses = "bg-white text-black border border-black";

    return (
        <Link href={href} className={`${baseClasses} ${colorClasses} cursor-pointer`}>
            {text}
            <span> {ICONS.RIGHT_ARROW}</span>
        </Link>
    );
}
