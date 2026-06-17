export function getImageProxyUrl(src: string): string {
  if (
    !src ||
    src.startsWith("/") ||
    src.startsWith("data:") ||
    src.startsWith("blob:")
  ) {
    return src;
  }

  try {
    const url = new URL(src);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return src;
    }

    return `/api/image-proxy?url=${encodeURIComponent(src)}`;
  } catch {
    return src;
  }
}
