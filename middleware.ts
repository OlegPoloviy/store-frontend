import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "./lib/supabase.server";
import { decodeJWT } from "./lib/util/JWTUtil";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient(req, res);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
  const path = req.nextUrl.pathname;

  const isAdminRoute =
    path === "/dashboard" ||
    path.startsWith("/dashboard/") ||
    path === "/products-managment" ||
    path.startsWith("/products-managment/") ||
    path.startsWith("/admin");

  if (!user && (path.startsWith("/user") || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const jwtPayload = session?.access_token
    ? decodeJWT(session.access_token)
    : null;
  const role = jwtPayload?.user_role || "USER";

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/user/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/products-managment/:path*",
  ],
};
