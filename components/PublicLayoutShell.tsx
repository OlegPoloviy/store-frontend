"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

interface PublicLayoutShellProps {
  children: ReactNode;
}

export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  useEffect(() => {
    const openSupport = () => setIsSupportOpen(true);
    window.addEventListener("support:open", openSupport);
    return () => window.removeEventListener("support:open", openSupport);
  }, []);

  return (
    <>
      <Navbar supportDrawerOpen={isSupportOpen} />
      {children}
      <OpenChatButton open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </>
  );
}
