import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "guest_cart_token";
const allowedRoutes: Record<string, RegExp[]> = {
  GET: [/^cart$/, /^checkout\/quote$/, /^checkout\/orders\/[^/]+$/],
  POST: [/^cart\/session$/, /^cart\/items$/, /^checkout$/, /^checkout\/orders\/[^/]+\/(retry|mock-payment)$/],
  PATCH: [/^cart\/items\/[^/]+\/quantity$/],
  DELETE: [/^cart\/items\/[^/]+$/],
};

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const route = path.join("/");
  if (!allowedRoutes[request.method]?.some((pattern) => pattern.test(route))) {
    return NextResponse.json({ message: "Route not found" }, { status: 404 });
  }

  if (request.method !== "GET") {
    const origin = request.headers.get("origin");
    if (origin && origin !== request.nextUrl.origin) {
      return NextResponse.json({ message: "Invalid origin" }, { status: 403 });
    }
  }

  if (route === "cart/session" && request.cookies.has(COOKIE_NAME)) {
    return NextResponse.json({ ok: true });
  }

  const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_DEPLOY_URL ?? "http://127.0.0.1:3001";
  const url = new URL(`${base.replace(/\/$/, "")}/${route}`);
  if (route === "checkout/quote") {
    url.searchParams.set("country", request.nextUrl.searchParams.get("country") ?? "");
  }

  const headers = new Headers({ "Content-Type": "application/json" });
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) {
    headers.set("Authorization", authorization);
  } else if (route !== "cart/session") {
    const cartToken = request.cookies.get(COOKIE_NAME)?.value;
    if (cartToken) headers.set("x-cart-token", cartToken);
  }
  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey && route === "checkout") headers.set("Idempotency-Key", idempotencyKey);

  try {
    const upstream = await fetch(url, {
      method: request.method,
      headers,
      body: request.method === "GET" ? undefined : await request.text() || undefined,
      cache: "no-store",
    });
    const raw = await upstream.text();
    let payload: unknown;
    try { payload = raw ? JSON.parse(raw) : null; } catch { payload = { message: "Invalid API response" }; }

    if (route === "cart/session" && upstream.ok) {
      const token = (payload as { cartToken?: unknown })?.cartToken;
      if (typeof token !== "string" || !token) {
        return NextResponse.json({ message: "Cart session response missing token" }, { status: 502 });
      }
      const response = NextResponse.json({ ok: true });
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/store",
      });
      return response;
    }
    return NextResponse.json(payload, { status: upstream.status });
  } catch {
    return NextResponse.json({ message: "Store API unavailable" }, { status: 502 });
  }
}

export { handler as GET, handler as POST, handler as PATCH, handler as DELETE };
