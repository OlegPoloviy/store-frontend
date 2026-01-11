"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";
import { ChatModal } from "./ChatModal";

export function OpenChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg gap-2"
      >
        <MessageSquare className="w-5 h-5" />
        Looking for something?
      </Button>
      <ChatModal open={isOpen} onOpenChange={setIsOpen} />
    </>
  );
}
