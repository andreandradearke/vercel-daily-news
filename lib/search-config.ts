/**
 * Search Configuration
 * 
 * Centralized search settings with environment variable overrides.
 * Falls back to sensible defaults if env vars are not set.
 */

export const SEARCH_CONFIG = {
    /**
     * Maximum number of results to return per search
     * @default 5
     * @env NEXT_PUBLIC_SEARCH_LIMIT
     */
    LIMIT: parseInt(process.env.NEXT_PUBLIC_SEARCH_LIMIT || '5', 10),

    /**
     * Minimum characters required before triggering auto-search
     * @default 3
     * @env NEXT_PUBLIC_SEARCH_MIN_LENGTH
     */
    MIN_SEARCH_LENGTH: parseInt(process.env.NEXT_PUBLIC_SEARCH_MIN_LENGTH || '3', 10),

    /**
     * Debounce delay in milliseconds before executing search
     * Prevents excessive API calls while user is typing
     * @default 500
     * @env NEXT_PUBLIC_SEARCH_DEBOUNCE_MS
     */
    DEBOUNCE_MS: parseInt(process.env.NEXT_PUBLIC_SEARCH_DEBOUNCE_MS || '500', 10),
} as const;
