import LinkButton from '../buttons/LinkButton';

export default function SubscribeCTA() {
    return (
        <section className="py-12 px-4 md:px-24">
            <div className="max-w-4xl mx-auto">
                <div className="bg-black text-white rounded-lg p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                        Subscribe to get the latest news, updates, and insights delivered directly to your inbox.
                    </p>
                    <div className="flex justify-center">
                        <LinkButton
                            text="Subscribe Now"
                            type="primary"
                            href="/subscribe"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
