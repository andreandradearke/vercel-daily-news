import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-24 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                The page you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/"
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Go Home
                </Link>
                <Link
                    href="/search"
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Browse Articles
                </Link>
            </div>
        </div>
    );
}
