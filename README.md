# Toluwanimi Odufeko — Portfolio & CMS Platform

An enterprise-grade, high-performance personal portfolio and content management system (CMS) built with Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, and Supabase.

---

## 🌟 Features & Highlights

- **Dynamic Content Management**: Full admin panel to create, edit, reorder, and delete projects, articles, and timeline items in real-time.
- **Enterprise Security**:
  - Session authentication with Supabase Auth.
  - Server Action authentication guards (`requireAdminAuth`) preventing unauthorized database and storage mutations.
  - Automatic session inactivity timeout (5-minute inactivity sign-out guard).
  - Rate-limited login attempts with exponential backoff and lockout protection.
  - Production HTTP security headers (HSTS, X-Frame-Options, CSP-ready, nosniff, Referrer-Policy).
- **Automated Media Lifecycle**:
  - Direct uploads to Supabase Storage with drag-and-drop and multi-image gallery support.
  - Automated storage cleanup: removing previous images or deleted resources from storage buckets when edited or deleted.
- **Performance & SEO Ready**:
  - Server-side rendering (SSR) and Incremental Static Revalidation (`revalidatePath`).
  - Dynamic `sitemap.xml` and `robots.txt` generation.
  - Zero-shift skeleton loading states across all routes.
  - Next.js image optimization with AVIF and WebP remote patterns.
  - Database performance indexing on timestamps, slugs, and sort orders.
- **Production Monitoring**:
  - Live `/api/health` diagnostic endpoint reporting uptime and system status.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **UI Library** | React 19 (Server & Client Components) |
| **Language** | TypeScript 5 (Strict Mode) |
| **Styling** | Tailwind CSS v4 |
| **Database & Auth** | Supabase (PostgreSQL + Auth + Storage) |
| **Validation** | Zod v4 |
| **Typography** | Google Fonts (Madimi One & JetBrains Mono) |

---

## 📁 Architecture & Directory Structure

```text
├── app/
│   ├── (admin)/               # Authenticated admin routes
│   │   ├── admin/             # Dashboard, management views
│   │   │   ├── articles/      # Article management & editor
│   │   │   ├── now/           # Focus items manager
│   │   │   ├── projects/      # Project portfolio manager
│   │   │   ├── settings/      # CV, social profiles, contacts
│   │   │   └── login/         # Secure admin login interface
│   ├── (public)/              # Public portfolio routes
│   │   ├── about/             # Biography, mission & NGO impact
│   │   ├── articles/          # Technical writing & reflections
│   │   │   └── [slug]/        # Deep article reading view & gallery
│   │   ├── contact/           # Contact form & social connections
│   │   ├── now/               # Current priorities & focus log
│   │   └── projects/          # Interactive project showcase
│   │       └── [slug]/        # Detailed project overview
│   ├── actions/               # Server Actions (with auth guards & revalidation)
│   ├── api/                   # API routes (e.g. /api/health)
│   ├── layout.tsx             # Root HTML layout with Google fonts & Toast
│   ├── robots.ts              # Search engine robots configuration
│   └── sitemap.ts             # Dynamic XML sitemap generator
├── component/
│   ├── admin/                 # Admin forms, uploaders, sidebar & shell
│   ├── common/                # Shared header, navigation & footer
│   ├── sections/              # Homepage & landing page sections
│   └── UI/                    # Design system primitives (Button, Input, Card, Toast, Skeleton)
├── hooks/                     # Custom React hooks (useToast)
├── lib/
│   ├── env.ts                 # Validated environment configuration
│   ├── constants.ts           # Client-safe static constants & fallbacks
│   ├── data.ts                # Data access layer & Supabase queries
│   └── supabase/              # Client, server, storage helpers & auth guards
├── supabase/
│   └── migrations/            # SQL schemas, RLS policies, and performance indexes
└── types/                     # Central TypeScript models & interfaces
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v20.x or higher
- **npm** or **pnpm**
- A **Supabase** project ([supabase.com](https://supabase.com))

### 2. Environment Variables Setup

Copy the sample environment file:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your Supabase credentials:

```env
# Supabase API Credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# Optional Service Role (Server operations only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site URL for metadata & sitemaps (default fallback: https://toluodufeko.com)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Database & Storage Initialization

In your Supabase Dashboard SQL Editor, run the migrations in order:

1. `supabase/migrations/001_initial_schema.sql` (Creates `projects`, `articles`, `now_items`, RLS policies, seed data)
2. `supabase/migrations/002_site_settings.sql` (Creates `site_settings` table for CV and profiles)
3. `supabase/migrations/003_add_gallery_images.sql` (Adds multi-image gallery support)
4. `supabase/migrations/004_performance_indexes.sql` (Adds optimized B-tree indexes)

#### Storage Bucket Configuration
Create a public storage bucket named **`portfolio-media`** in Supabase Storage:
- **Bucket Name**: `portfolio-media`
- **Public**: `true`
- Add an RLS storage policy permitting authenticated users to upload and delete files.

### 4. Install Dependencies & Run

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portfolio.
Visit [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin CMS.

---

## 🔒 Security Best Practices

- **Zero Client Secret Leaks**: Only `NEXT_PUBLIC_` prefixed keys are accessible on the client.
- **Server Action Auth Guard**: Every mutating action (`createArticle`, `updateProject`, `deleteArticle`, etc.) calls `requireAdminAuth(supabase)` to verify the admin session before executing database queries or deleting media from storage.
- **Inactivity Timeout**: Client-side event tracking resets a 5-minute inactivity timer, triggering automatic session termination and signout upon idle.

---

## 🧪 Verification & Build

To run linting and compile the production build:

```bash
npm run lint
npm run build
```

---

## 📄 License

Private & Proprietary &copy; Toluwanimi Odufeko. All rights reserved.
