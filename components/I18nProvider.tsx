"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createInstance, type i18n } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { resources } from "@/lib/i18n/messages";

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const [instance] = useState<i18n>(() => {
    const next = createInstance();
    void next.use(initReactI18next).init({
      lng: locale,
      fallbackLng: defaultLocale,
      resources,
      initAsync: false,
      keySeparator: false,
      nsSeparator: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return next;
  });

  useEffect(() => {
    if (instance.language !== locale) void instance.changeLanguage(locale);
  }, [instance, locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
