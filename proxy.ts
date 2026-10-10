import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_EXACT_PATHS = new Set([
  "/manifest.webmanifest",
  "/manifest.json",
  "/sw.js",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public PWA assets, icons, and static files without auth
  if (
    PUBLIC_EXACT_PATHS.has(pathname) ||
    pathname.startsWith("/icons/") ||
    pathname.startsWith("/_next/") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json|js)$/i.test(pathname)
  ) {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (pathname === "/setup") return NextResponse.next({ request });
    const target = request.nextUrl.clone();
    target.pathname = "/setup";
    return NextResponse.redirect(target);
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
        cookies.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !pathname.startsWith("/login")) {
    const target = request.nextUrl.clone();
    target.pathname = "/login";
    return NextResponse.redirect(target);
  }

  if (user && pathname === "/login") {
    const target = request.nextUrl.clone();
    target.pathname = "/dashboard";
    return NextResponse.redirect(target);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest\\.webmanifest|manifest\\.json|sw\\.js|icons/|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|json|js)$).*)",
  ],
};
