/**
 * Environment configuration and runtime validation.
 * Provides safe fallback defaults during build time so that static page generation
 * and CI/CD pipelines (e.g. Vercel) succeed without requiring live credentials during build.
 */

const FALLBACK_SUPABASE_URL = "https://placeholder-project.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "placeholder-anon-key";

export const env = {
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  NEXT_PUBLIC_SITE_URL:
    process.env.NEXT_PUBLIC_SITE_URL || "https://toluwanimiodufeko.com",
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  isSupabaseConfigured: Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
} as const;
