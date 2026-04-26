import Link from 'next/link';

export default function ArticleNotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-24 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                This Article Went to Print... In Another Universe
            </h2>
            <p className="text-gray-600 mb-2 max-w-md text-lg">
                Our reporters searched high and low, but this article seems to have disappeared into the void.
            </p>
            <p className="text-gray-500 mb-8 max-w-md">
                Maybe it was fake news after all?
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Back to Reality (Homepage)
                </Link>
                <Link
                    href="/search"
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Search for Real News
                </Link>
            </div>
        </div>
    );
}
