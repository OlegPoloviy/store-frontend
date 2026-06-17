import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "example.com",
  "localhost",
  "internet-store-bucket.s3.amazonaws.com",
  "internet-store-bucket.s3.us-east-2.amazonaws.com",
]);

const IMAGE_CONTENT_TYPE = /^image\//i;

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("url");

  if (!src) {
    return new NextResponse("Missing image url", { status: 400 });
  }

  let url: URL;

  try {
    url = new URL(src);
  } catch {
    return new NextResponse("Invalid image url", { status: 400 });
  }

  if (
    (url.protocol !== "http:" && url.protocol !== "https:") ||
    !ALLOWED_HOSTS.has(url.hostname)
  ) {
    return new NextResponse("Image host is not allowed", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "force-cache",
    });

    if (!response.ok || !response.body) {
      return new NextResponse("Image fetch failed", { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!IMAGE_CONTENT_TYPE.test(contentType)) {
      return new NextResponse("Remote resource is not an image", {
        status: 415,
      });
    }

    return new NextResponse(response.body, {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "Content-Type": contentType,
      },
    });
  } catch {
    return new NextResponse("Image fetch failed", { status: 502 });
  }
}
