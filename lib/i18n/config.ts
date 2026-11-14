export const supportedLocales = ["en", "de"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";
export const localeCookie = "site-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "de";
}
