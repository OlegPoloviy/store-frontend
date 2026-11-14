"use client";

import type { ReactNode } from "react";

export function SupportLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("support:open"))}>
      {children}
    </button>
  );
}
