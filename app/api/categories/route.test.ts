/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/categories/route';
import { CACHE_PROFILES, CACHE_TAGS } from '@/lib/cache-config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

describe('Categories API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Status Codes', () => {
    it('should return 200 status code for successful requests', async () => {
      const mockCategories = {
        data: [
          { id: 1, name: 'Technology', slug: 'tech' },
          { id: 2, name: 'Sports', slug: 'sports' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
        status: 200,
      });

      const response = await GET();

      expect(response.status).toBe(200);
    });

    it('should return 500 status code when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET();

      expect(response.status).toBe(500);
    });

    it('should return upstream status code when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const response = await GET();

      expect(response.status).toBe(404);
    });
  });

  describe('Cache-Control Headers', () => {
    it('should return categories cache profile with correct values', async () => {
      const mockCategories = {
        data: [
          { id: 1, name: 'Technology', slug: 'tech' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
        status: 200,
      });

      const response = await GET();

      const cacheControl = response.headers.get('Cache-Control');
      const expectedCacheControl = `public, s-maxage=${CACHE_PROFILES.categories.revalidate}, stale-while-revalidate=${CACHE_PROFILES.categories.stale}`;
      
      expect(cacheControl).toBe(expectedCacheControl);
    });

    it('should not include cache headers for error responses', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const response = await GET();

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeNull();
    });
  });

  describe('API Integration', () => {
    it('should call upstream with correct config and cache tags', async () => {
      const mockCategories = { data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCategories,
        status: 200,
      });

      await GET();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/categories'),
        expect.objectContaining({
          headers: expect.any(Object),
          next: expect.objectContaining({
            revalidate: expect.any(Number),
            tags: expect.arrayContaining([CACHE_TAGS.CATEGORIES])
          })
        })
      );
    });
  });
});
