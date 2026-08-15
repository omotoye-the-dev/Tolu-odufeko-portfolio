/**
 * Environment configuration and runtime validation.
 * Fails loudly at the boundary with clear messages if critical secrets or URLs are missing.
 */

function getEnvVariable(name: string, isRequired: boolean = true): string {
  const value = process.env[name];
  if (!value && isRequired) {
    throw new Error(
      `[Env Config] Missing required environment variable: "${name}". Check your .env.local or deployment configuration.`
    );
  }
  return value ?? "";
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: getEnvVariable("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVariable("SUPABASE_SERVICE_ROLE_KEY", false),
  NODE_ENV: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;
