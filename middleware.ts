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

  if (!user && (path.startsWith("/user") || path.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const jwtPayload = session?.access_token
    ? decodeJWT(session.access_token)
    : null;
  const role = jwtPayload?.user_role || "USER";

  console.log("User role:", role);

  if (path.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
