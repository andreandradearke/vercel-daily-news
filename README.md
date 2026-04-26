# Vercel Daily News

Next.js 16.2.3 news website with subscription paywall and optimized caching.

## Tech Stack

- **Next.js 16.2.3** (App Router, Turbopack)
- **React 19.2.4** (Server Components, Client Components)
- **TypeScript** (Strict mode)
- **Tailwind CSS** (Utility-first styling)
- **Cookie-based auth** (httpOnly, 15-day sessions)

## Cache Strategy

### Server-Side Caching (ISR)

**Individual Articles** (`/api/articles/[id]`)
- **Revalidate**: 3600s (1 hour)
- **Rationale**: Articles rarely change after publishing
- **Tags**: `['articles', 'article-${id}']` for on-demand invalidation

**Article Lists** (`/api/articles`)
- **Search queries**: 60s (1 minute)
- **Homepage/Featured**: 300s (5 minutes)
- **Rationale**: Search results need fresher data, static lists can cache longer
- **Tags**: `['articles']`

**Breaking News** (`/api/breaking-news`)
- **Revalidate**: 300s (5 minutes)
- **Rationale**: Balance between freshness and performance
- **Tags**: `['breaking-news']`

**Categories** (`/api/categories`)
- **Revalidate**: 3600s (1 hour)
- **Rationale**: Categories change infrequently
- **Tags**: `['categories']`

### Client-Side Caching (Cache-Control Headers)

**Articles**: `public, s-maxage=3600, stale-while-revalidate=7200`
- CDN caches for 1 hour
- Serves stale content for up to 2 additional hours while revalidating
- Users get instant responses, fresh data loads in background

**Article Lists**: `public, s-maxage=60-300, stale-while-revalidate=600`
- CDN caches for 1-5 minutes (depending on search vs list)
- Serves stale content for up to 10 additional minutes while revalidating

**Breaking News**: `public, s-maxage=300, stale-while-revalidate=600`
- CDN caches for 5 minutes
- Serves stale content for up to 10 additional minutes while revalidating

**Categories**: `public, s-maxage=3600, stale-while-revalidate=7200`
- CDN caches for 1 hour
- Serves stale content for up to 2 additional hours while revalidating

### No Cache (Subscription Endpoints)

**Subscription status/mutations** (`/api/subscription/*`)
- **Cache**: None
- **Rationale**: User-specific, real-time data
- **Alternative**: In-memory React Context caching for session duration

### Performance Impact

**Without caching**:
- Every request: 200-500ms server roundtrip
- High server load
- Slow user experience

**With caching**:
- First visit: 200-500ms (cache miss)
- Subsequent visits: 0ms (browser/CDN cache hit)
- After expiry: 0ms (stale-while-revalidate serves instantly)
- 99% of requests serve in 0ms

## Features

- Server-side rendered articles
- Cookie-based subscription system (15-day sessions)
- Paywall for non-subscribers (first paragraph teaser)
- Search with category filtering
- Breaking news banner
- Trending articles sidebar
- Persistent header with Vercel logo and subscribe button
- SEO-optimized metadata with Open Graph support
- Dynamic article metadata (title, description, author, tags, images)
- Custom 404 pages (global and article-specific with humor)

## Project Structure

```
app/
  api/                      # API proxy routes
    articles/               # Articles endpoints
    breaking-news/          # Breaking news endpoint
    categories/             # Categories endpoint
    subscription/           # Subscription endpoints
  articles/[...slug]/       # Article detail pages
    page.tsx                # Article page component
    not-found.tsx           # Article-specific 404
  search/                   # Search page
  layout.tsx                # Root layout with header/footer
  page.tsx                  # Homepage
  not-found.tsx             # Global 404 page
  error.tsx                 # Global 500 error page
components/
  breaking-news-banner/     # Breaking news banner
  buttons/                  # Reusable buttons (Subscribe, Link)
  featured-articles/        # Featured articles grid
  footers/                  # Footer component
  headers/                  # Header with logo and navigation
  heroes/                   # Hero components (Default, Article)
  paywall/                  # Subscription paywall
  providers/                # Context providers wrapper
  skeletons/                # Loading state components
  subscribe-cta/            # Subscription CTA section
  trending-articles/        # Trending sidebar
contexts/
  SubscriptionContext.tsx   # Global subscription state
lib/
  api-config.ts             # API configuration
  utils.ts                  # Shared utilities (formatCategory, formatDate)
page-components/
  Article.tsx               # Article page logic
  Home.tsx                  # Homepage logic
  Search.tsx                # Search page logic
```

## Setup

```bash
npm install
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Environment Variables

Configure API endpoint in `lib/api-config.ts`:
- `API_BASE_URL`: External API endpoint
- `API_HEADERS`: Headers including x-vercel-protection-bypass

## Pages & Routes

**Public Pages**
- `/` - Homepage with featured articles and breaking news
- `/search` - Search and filter articles by category
- `/articles/[slug]` - Individual article pages with paywall
- `/404` - Custom not found page (global)
- `/articles/*/404` - Article-specific 404 with humorous message

**API Routes**

All routes proxy to external API with caching:

- `GET /api/articles` - List/search articles
- `GET /api/articles/[id]` - Single article
- `GET /api/breaking-news` - Breaking news banner
- `GET /api/categories` - Category list
- `POST /api/subscription/create` - Create subscription token
- `GET /api/subscription` - Check subscription status
- `POST /api/subscription` - Activate subscription
- `DELETE /api/subscription` - Deactivate subscription

## Error Pages

**Global Error Pages**
- `404 (not-found.tsx)` - Page not found with navigation to home and search
- `500 (error.tsx)` - Server error with retry and home navigation

**Route-Specific Error Pages**
- `/articles/*/404` - Article-specific 404 with humorous message ("This Article Went to Print... In Another Universe")

## Key Components

**Header & Navigation**
- **DefaultHeader** - Persistent header with Vercel logo, navigation, and subscribe button
- **DefaultFooter** - Site footer

**Heroes**
- **DefaultHero** - Homepage hero with CTA button
- **ArticleHero** - Article header with category, title, author, date

**Content Display**
- **FeaturedArticles** - Grid of featured articles on homepage
- **BreakingNewsBanner** - Breaking news notification banner
- **TrendingArticles** - Sidebar with trending articles (excludes current article)
- **Paywall** - Teaser content with subscription prompt for non-subscribers

**Buttons & CTAs**
- **SubscribeButton** - Smart toggle button (subscribe/unsubscribe states)
- **LinkButton** - Styled link button with primary/secondary variants
- **SubscribeCTA** - Full subscription call-to-action section

**Loading States**
- **ArticleGridSkeleton** - Reusable skeleton grid with configurable count

**State Management**
- **SubscriptionContext** - Global subscription state with cookie persistence
- **Providers** - Wraps app with context providers

**Utilities**
- **formatCategory** - Formats category slugs (e.g., "web-dev" → "Web Dev")
- **formatDate** - Formats dates to localized short format
