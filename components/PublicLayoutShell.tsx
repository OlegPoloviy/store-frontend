"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

interface PublicLayoutShellProps {
  children: ReactNode;
}

export function PublicLayoutShell({ children }: PublicLayoutShellProps) {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      <Navbar supportDrawerOpen={isSupportOpen} />
      {children}
      <OpenChatButton open={isSupportOpen} onOpenChange={setIsSupportOpen} />
    </>
  );
}
