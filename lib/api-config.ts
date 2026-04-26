export const API_BASE_URL = 'https://vercel-daily-news-api.vercel.app/api';

export const API_HEADERS = {
    'accept': 'application/json',
    'x-vercel-protection-bypass': 'OykROcuULI6YJwAwk3VnWv4gMMbpAq6q'
};

export async function fetchAPI(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...API_HEADERS,
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.json();
}
