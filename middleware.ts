import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect all /admin routes except the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }

    // Inactivity check
    const lastActivityCookie = request.cookies.get("admin_last_activity");
    if (lastActivityCookie?.value) {
      const lastActivityTime = parseInt(lastActivityCookie.value, 10);
      if (!Number.isNaN(lastActivityTime) && Date.now() - lastActivityTime > INACTIVITY_TIMEOUT_MS) {
        // Session expired due to 5 minutes of inactivity
        await supabase.auth.signOut();
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/admin/login";
        loginUrl.searchParams.set("reason", "inactivity");

        const redirectResponse = NextResponse.redirect(loginUrl);
        redirectResponse.cookies.delete("admin_last_activity");
        return redirectResponse;
      }
    }

    // Refresh activity timestamp on active navigation
    supabaseResponse.cookies.set("admin_last_activity", Date.now().toString(), {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Redirect authenticated user away from login page if active
  if (pathname === "/admin/login" && user) {
    const lastActivityCookie = request.cookies.get("admin_last_activity");
    const isInactive =
      lastActivityCookie?.value &&
      Date.now() - parseInt(lastActivityCookie.value, 10) > INACTIVITY_TIMEOUT_MS;

    if (!isInactive) {
      const dashboardUrl = request.nextUrl.clone();
      dashboardUrl.pathname = "/admin";
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
