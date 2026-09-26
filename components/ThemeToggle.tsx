"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";
  const label = isDark ? t("Switch to light mode") : t("Switch to dark mode");

  return (
    <button
      type="button"
      disabled={!mounted}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-stone-300/75 bg-white/65 px-3 text-stone-700 transition-colors hover:border-stone-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 disabled:cursor-wait",
        fullWidth && "w-full justify-start px-4",
        className,
      )}
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
      {fullWidth && <span className="text-sm font-medium">{isDark ? t("Light mode") : t("Dark mode")}</span>}
    </button>
  );
}
