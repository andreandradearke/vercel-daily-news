/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/articles/route';
import { NextRequest } from 'next/server';
import { CACHE_PROFILES, CACHE_TAGS } from '@/lib/cache-config';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

const BASE_URL = 'http://localhost:3000';

describe('Articles API Route', () => {
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
      const mockArticles = {
        data: [
          { id: 1, title: 'Test Article', publishedAt: '2026-04-28T12:00:00Z' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
        status: 200,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      const response = await GET(request);

      expect(response.status).toBe(200);
    });

    it('should return 500 status code when fetch fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      const response = await GET(request);

      expect(response.status).toBe(500);
    });

    it('should return upstream status code when API returns error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      const response = await GET(request);

      expect(response.status).toBe(404);
    });
  });

  describe('Cache-Control Headers', () => {
    it('should return article list cache profile for regular requests', async () => {
      const mockArticles = {
        data: [
          { id: 1, title: 'Test Article', publishedAt: '2026-04-28T12:00:00Z' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
        status: 200,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      const response = await GET(request);

      const cacheControl = response.headers.get('Cache-Control');
      const expectedCacheControl = `public, s-maxage=${CACHE_PROFILES.articleList.revalidate}, stale-while-revalidate=${CACHE_PROFILES.articleList.stale}`;
      
      expect(cacheControl).toBe(expectedCacheControl);
    });

    it('should return search cache profile for search requests', async () => {
      const mockArticles = {
        data: [
          { id: 1, title: 'Search Result', publishedAt: '2026-04-28T12:00:00Z' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
        status: 200,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles?search=test`);
      const response = await GET(request);

      const cacheControl = response.headers.get('Cache-Control');
      const expectedCacheControl = `public, s-maxage=${CACHE_PROFILES.search.revalidate}, stale-while-revalidate=${CACHE_PROFILES.search.stale}`;
      
      expect(cacheControl).toBe(expectedCacheControl);
    });

    it('should return search cache profile for category filter requests', async () => {
      const mockArticles = {
        data: [
          { id: 1, title: 'Category Article', publishedAt: '2026-04-28T12:00:00Z' }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
        status: 200,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles?category=tech`);
      const response = await GET(request);

      const cacheControl = response.headers.get('Cache-Control');
      const expectedCacheControl = `public, s-maxage=${CACHE_PROFILES.search.revalidate}, stale-while-revalidate=${CACHE_PROFILES.search.stale}`;
      
      expect(cacheControl).toBe(expectedCacheControl);
    });

    it('should not include cache headers for error responses', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      const response = await GET(request);

      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeNull();
    });
  });

  describe('API Integration', () => {
    it('should call upstream with correct config and cache tags', async () => {
      const mockArticles = { data: [] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockArticles,
        status: 200,
      });

      const request = new NextRequest(`${BASE_URL}/api/articles`);
      await GET(request);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/articles'),
        expect.objectContaining({
          headers: expect.any(Object),
          next: expect.objectContaining({
            revalidate: expect.any(Number),
            tags: expect.arrayContaining([CACHE_TAGS.ARTICLES])
          })
        })
      );
    });
  });
});
