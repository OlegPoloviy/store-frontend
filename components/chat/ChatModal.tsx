"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useState, useRef, useEffect } from "react";
import { Message, ChatModalProps } from "./types";
import { ChatMessage } from "./ChatMessage";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatInput } from "./ChatInput";

const SAMPLE_QUESTIONS = [
  "How long does delivery take?",
  "Do you offer custom furniture designs?",
  "What materials do you use for your tables?",
  "Where can I see your furniture in person?",
];

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with our Carpathian furniture?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (open) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, open]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");

    // Simulate support response
    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your question! One of our team members will get back to you soon.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
    }, 1000);
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex z-100 flex-col w-[400px] sm:w-[540px]"
      >
        <SheetHeader className="border-b pb-4">
          <SheetTitle>Support Chat</SheetTitle>
          <SheetDescription>
            How can we help you today? Our team usually responds within a few
            minutes.
          </SheetDescription>
        </SheetHeader>

        <div
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto py-4 space-y-4 px-1"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
        </div>

        {!inputValue && messages.length < 3 && (
          <ChatSuggestions
            questions={SAMPLE_QUESTIONS}
            onQuestionClick={handleQuestionClick}
          />
        )}

        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
        />
      </SheetContent>
    </Sheet>
  );
}
