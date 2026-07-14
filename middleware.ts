import { NextResponse, type NextRequest } from "next/server";

// Maintenance / "coming soon" mode.
//
// When MAINTENANCE_MODE=true (set as a Netlify env var, not NEXT_PUBLIC_ —
// it's only read server-side here), every request is redirected to
// /coming-soon. A real redirect (not a rewrite) is used deliberately so the
// browser's URL actually updates — usePathname() in Nav/Footer relies on
// that to hide site chrome on the splash page; a rewrite would leave the
// original pathname in place and the check would never match.
//
// A bypass exists so the site owner/developer can still preview the real
// site while it's "under construction" for everyone else: visiting any page
// with ?preview=<MAINTENANCE_BYPASS_KEY> sets a 30-day cookie that skips the
// redirect on this and future requests from that browser.
const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
const BYPASS_KEY = process.env.MAINTENANCE_BYPASS_KEY;
const BYPASS_COOKIE = "klk_bypass";

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  // Always allow the coming-soon page itself, plus static assets, so the
  // splash page and its images/fonts can actually load.
  if (
    pathname.startsWith("/coming-soon") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const providedKey = searchParams.get("preview");
  const hasBypassCookie =
    Boolean(BYPASS_KEY) && request.cookies.get(BYPASS_COOKIE)?.value === BYPASS_KEY;

  if (BYPASS_KEY && (providedKey === BYPASS_KEY || hasBypassCookie)) {
    const response = NextResponse.next();
    if (providedKey === BYPASS_KEY) {
      response.cookies.set(BYPASS_COOKIE, BYPASS_KEY, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
