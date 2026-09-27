"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className, fullWidth = false }: { className?: string; fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const transitionInProgress = useRef(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";
  const label = isDark ? t("Switch to light mode") : t("Switch to dark mode");

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (transitionInProgress.current) return;

    const nextTheme = isDark ? "light" : "dark";
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(nextTheme);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );
    const root = document.documentElement;
    root.style.setProperty("--theme-reveal-x", `${x}px`);
    root.style.setProperty("--theme-reveal-y", `${y}px`);
    root.style.setProperty("--theme-reveal-radius", `${radius}px`);

    transitionInProgress.current = true;
    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(nextTheme));
      });
      const finishTransition = () => {
        transitionInProgress.current = false;
        root.style.removeProperty("--theme-reveal-x");
        root.style.removeProperty("--theme-reveal-y");
        root.style.removeProperty("--theme-reveal-radius");
      };
      void transition.finished.then(finishTransition, finishTransition);
    } catch {
      transitionInProgress.current = false;
      root.style.removeProperty("--theme-reveal-x");
      root.style.removeProperty("--theme-reveal-y");
      root.style.removeProperty("--theme-reveal-radius");
      setTheme(nextTheme);
    }
  };

  return (
    <button
      type="button"
      disabled={!mounted}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-full border border-stone-300/75 bg-white/65 px-3 text-stone-700 transition-colors hover:border-stone-400 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/50 disabled:cursor-wait",
        fullWidth && "w-full justify-start px-4",
        className,
      )}
    >
      <span key={isDark ? "sun" : "moon"} className="theme-toggle-icon" aria-hidden="true">
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </span>
      {fullWidth && <span className="text-sm font-medium">{isDark ? t("Light mode") : t("Dark mode")}</span>}
    </button>
  );
}
