import LinkButton from '../buttons/LinkButton';
import SubscribeButton from '../buttons/SubscribeButton';
import Image from 'next/image';

interface DefaultHeroProps {
    eyebrow: string;
    headline: string;
    description: string;
    ctaButtonText: string;
    ctaButtonHref: string;
    backgroundImage?: string;
}

export default function DefaultHero({
    eyebrow,
    headline,
    description,
    ctaButtonText,
    ctaButtonHref,
    backgroundImage
}: DefaultHeroProps) {

    return (
        <section className="relative flex flex-col md:py-4 md:px-24 px-2 py-4 overflow-hidden min-h-[400px] justify-center">
            {backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <Image
                        src={backgroundImage}
                        alt="Hero background"
                        fill
                        className="object-cover sm:rounded-xl"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/60 to-transparent" />
                </div>
            )}
            <div className="relative z-10 flex flex-col gap-4 lg:max-w-[34%] md:max-w-[60%]">
                <p className="text-sm text-gray-400 uppercase font-bold">{eyebrow}</p>
                <h1 className="text-3xl lg:text-4xl font-bold">{headline}</h1>
                <p className="text-sm text-gray-400">{description}</p>
                <div className="flex gap-4">
                    <LinkButton text={ctaButtonText} type="secondary" href={ctaButtonHref} />
                    <SubscribeButton size="md" />
                </div>
            </div>
        </section>
    )
}