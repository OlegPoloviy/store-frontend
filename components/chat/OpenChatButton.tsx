"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Headphones } from "lucide-react";
import { ChatModal } from "./ChatModal";

interface OpenChatButtonProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function OpenChatButton({ open, onOpenChange }: OpenChatButtonProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setIsOpen = onOpenChange ?? setInternalOpen;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full border border-white/60 bg-stone-950 px-0 text-white shadow-[0_18px_45px_rgba(54,47,39,0.28)] transition hover:bg-stone-800 sm:bottom-6 sm:right-6 sm:w-auto sm:px-5"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 sm:mr-2">
          <Headphones className="h-4 w-4" />
        </span>
        <span className="hidden text-sm font-medium sm:inline">
          Customer support
        </span>
      </Button>
      <ChatModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
