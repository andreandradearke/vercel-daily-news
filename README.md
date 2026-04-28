# Vercel Daily News

Next.js 16 news website with ISR caching, paywall, and cookie-based subscriptions.

🔗 **Live Demo**: https://vercel-daily-news-three.vercel.app

## Tech Stack

- Next.js 16.2.3 (App Router)
- React 19.2.4 (Server Components)
- TypeScript
- Tailwind CSS 4
- Vitest (Testing)

## Setup

```bash
npm install
cp .env.sample .env.local  # Optional: customize cache/search config
npm run dev
```

## Scripts

```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run start         # Start production server
npm run lint          # Run ESLint
npm test              # Run tests (watch mode)
npm run test:run      # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## Testing

Integration tests for API routes using Vitest:

- **Articles API** (`/api/articles`) - 8 tests
  - Status codes (200, 500, 404)
  - Cache-Control headers (regular, search, category)
  - Cache tags and upstream integration

- **Categories API** (`/api/categories`) - 6 tests
  - Status codes (200, 500, 404)
  - Cache-Control headers
  - Cache tags and upstream integration

Run tests: `npm test`

## Project Structure

```
app/
  api/              # API routes (proxy to upstream)
  articles/         # Article pages
  search/           # Search page
  actions/          # Server Actions (subscription)
components/         # React components
contexts/           # React Context (subscription state)
lib/
  data/             # Data fetching ('use cache')
  cache-config.ts   # Cache profiles & tags
  api-config.ts     # Upstream API config
```

## Cache Configuration

Centralized in `lib/cache-config.ts`:

| Profile | Revalidate | Stale | Use Case |
|---------|-----------|-------|----------|
| `article` | 1h | 2h | Individual articles |
| `articleList` | 5m | 10m | Homepage, featured, trending |
| `search` | 1m | 10m | Search/category results |
| `breakingNews` | 5m | 10m | Breaking news banner |
| `categories` | 1h | 2h | Category dropdown |

Override via environment variables (see `.env.sample`).

## Features

- **Static generation**: Top 50 articles pre-rendered at build time
- **ISR**: Automatic revalidation with stale-while-revalidate
- **Paywall**: First paragraph visible, full content requires subscription
- **Subscription**: httpOnly cookies, Server Actions, 15-day expiration
- **Search**: Real-time with URL persistence and debouncing
- **Cache tags**: On-demand revalidation support

## API

Upstream API: `https://vercel-daily-news-api.vercel.app/api`

All API routes in `/api/*` are proxies with caching.
