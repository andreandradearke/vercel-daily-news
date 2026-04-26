'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error details to console for debugging
        console.error('Error boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 md:px-24 text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something Went Wrong</h2>
            <p className="text-gray-600 mb-8 max-w-md">
                An unexpected error occurred. We&apos;re working to fix the issue.
            </p>
            {error.digest && (
                <p className="text-xs text-gray-400 mb-4">Error ID: {error.digest}</p>
            )}
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
