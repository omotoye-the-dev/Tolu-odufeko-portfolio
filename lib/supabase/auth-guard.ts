import type { SupabaseClient, User } from "@supabase/supabase-js";

/**
 * Server-side authentication guard for Server Actions and API mutations.
 * Throws a descriptive 401 Unauthorized Error if no valid authenticated session is found.
 */
export async function requireAdminAuth(supabase: SupabaseClient): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized: You must be logged in as an administrator to perform this action.");
  }

  return user;
}
