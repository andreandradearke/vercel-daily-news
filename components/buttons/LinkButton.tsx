import Link from 'next/link';

interface LinkButtonProps {
    text: string;
    type: 'primary' | 'secondary';
    href: string;
}

export default function LinkButton({ text, type, href }: LinkButtonProps) {
    const baseClasses = "px-4 py-2 rounded inline-block";
    const typeClasses = type === 'primary'
        ? "bg-black text-white"
        : "bg-white text-black border border-black";

    return (
        <Link href={href} className={`${baseClasses} ${typeClasses} cursor-pointer`}>
            {text}
            {type === 'secondary' && <span> &#129106;</span>}
        </Link>
    );
}
