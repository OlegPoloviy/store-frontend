"use client";

const ANONYMOUS_ID_STORAGE_KEY = "anonymousId";

function generateAnonymousId(): string {
  // Prefer UUID v4 when available (modern browsers).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback: still unique enough for anonymous session identification.
  return `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function getOrCreateAnonymousId(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
    if (existing) return existing;

    const id = generateAnonymousId();
    window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, id);
    return id;
  } catch {
    // localStorage can be unavailable (privacy mode, disabled storage, etc.)
    return null;
  }
}
