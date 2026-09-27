"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { isLocale, localeCookie, type Locale } from "@/lib/i18n/config";

const languages: { locale: Locale; name: string; code: string }[] = [
  { locale: "en", name: "English", code: "EN" },
  { locale: "de", name: "Deutsch", code: "DE" },
];

export function LanguageSwitcher({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const { i18n, t } = useTranslation();
  const router = useRouter();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Partial<Record<Locale, HTMLButtonElement | null>>>({});
  const [open, setOpen] = useState(false);
  const locale: Locale = isLocale(i18n.language) ? i18n.language : "en";
  const currentLanguage = languages.find((language) => language.locale === locale)!;

  useEffect(() => {
    if (!open) return;
    optionRefs.current[locale]?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, locale]);

  const changeLanguage = (next: Locale) => {
    setOpen(false);
    triggerRef.current?.focus();
    if (next === locale) return;
    document.cookie = `${localeCookie}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = next;
    void i18n.changeLanguage(next);
    router.refresh();
  };

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const currentIndex = languages.findIndex(
      (language) => optionRefs.current[language.locale] === document.activeElement,
    );
    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex = (currentIndex + direction + languages.length) % languages.length;
    optionRefs.current[languages[nextIndex].locale]?.focus();
  };

  return (
    <div ref={rootRef} className={cn("relative z-[110] inline-flex", fullWidth && "w-full", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`${t("Language")}: ${currentLanguage.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "group inline-flex h-10 items-center gap-2 rounded-full border border-stone-300/75 bg-white/65 px-3.5 text-stone-700 shadow-[0_2px_8px_rgba(70,61,50,0.04)] transition-colors duration-200 hover:border-stone-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/45 focus-visible:ring-offset-2",
          open && "border-stone-400 bg-white",
          fullWidth && "w-full",
        )}
      >
        <Globe2 size={17} strokeWidth={1.7} className="shrink-0 text-stone-500 group-hover:text-stone-700" aria-hidden="true" />
        <span className="text-[13px] font-medium tracking-tight">{currentLanguage.name}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className={cn("shrink-0 text-stone-400 transition-transform duration-200", fullWidth && "ml-auto", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("Language")}
          onKeyDown={moveFocus}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false);
          }}
          className={cn(
            "absolute right-0 top-full z-[120] mt-2 min-w-48 rounded-2xl border border-stone-200/90 bg-[#f7f4ef] p-1.5 shadow-[0_18px_45px_rgba(70,61,50,0.16)]",
            fullWidth && "left-0",
          )}
        >
          {languages.map((language) => (
            <button
              key={language.locale}
              ref={(node) => { optionRefs.current[language.locale] = node; }}
              type="button"
              role="menuitemradio"
              aria-checked={language.locale === locale}
              onClick={() => changeLanguage(language.locale)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm text-stone-700 outline-none transition-colors hover:bg-white focus-visible:bg-white",
                language.locale === locale && "bg-white text-stone-950",
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-[#ede7de] text-[10px] font-semibold tracking-wider text-stone-600">
                {language.code}
              </span>
              <span className="flex-1 font-medium">{language.name}</span>
              {language.locale === locale && <Check size={15} className="text-emerald-700" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
