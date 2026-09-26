import "server-only";
import { cookies } from "next/headers";
import { createInstance } from "i18next";
import { defaultLocale, isLocale, localeCookie } from "./config";
import { resources } from "./messages";

export async function getServerTranslation() {
  const cookieStore = await cookies();
  const candidate = cookieStore.get(localeCookie)?.value;
  const locale = isLocale(candidate) ? candidate : defaultLocale;
  const instance = createInstance();
  await instance.init({
    lng: locale,
    fallbackLng: defaultLocale,
    resources,
    initAsync: false,
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
  });
  return { t: instance.getFixedT(locale), locale };
}
