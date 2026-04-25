import { NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/kyc", "/admin"];
const authRoutes = ["/login", "/register"];

function getRoleFromToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])).role;
  } catch {
    return null;
  }
}

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const role = token ? getRoleFromToken(token) : null;

  // ✅ Always allow landing page for guests
  if (pathname === "/") {
    if (!token) return NextResponse.next();

    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  const isProtected = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAuthPage = authRoutes.includes(pathname);

  // 🚫 Not logged in → block protected routes
  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  // 🚫 Logged in → block login/register pages
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL(
        role === "admin" ? "/admin" : "/dashboard",
        request.url
      )
    );
  }

  // 🚫 Admin cannot access dashboard
  if (role === "admin" && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(
      new URL("/admin", request.url)
    );
  }

  // 🚫 Users cannot access admin panel
  if (token && role !== "admin" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
};