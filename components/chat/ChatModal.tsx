"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, useEffect, useCallback } from "react";
import { Message, ChatModalProps } from "./types";
import { ChatMessage } from "./ChatMessage";
import { ChatSuggestions } from "./ChatSuggestions";
import { ChatInput } from "./ChatInput";
import { Headphones, MessageSquare, Sparkles } from "lucide-react";
import { supportChatApi } from "@/api/support-chat.api";

const SAMPLE_QUESTIONS = [
  "How long does delivery take?",
  "Do you offer custom furniture designs?",
  "What materials do you use for your tables?",
  "Where can I see your furniture in person?",
];

const CONVERSATION_STORAGE_KEY = "support-chat-conversation-id";

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [inputValue, setInputValue] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! How can I help you with our Carpathian furniture?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mergeMessages = useCallback((incomingMessages: Message[]) => {
    setMessages((prev) => {
      const draftMessages = prev.filter(
        (message) => message.status === "sending" || message.status === "error"
      );
      const nextMessages = incomingMessages.length ? incomingMessages : prev;
      const knownIds = new Set(nextMessages.map((message) => message.id));
      const pendingMessages = draftMessages.filter(
        (message) => !knownIds.has(message.id)
      );

      return [...nextMessages, ...pendingMessages];
    });
  }, []);

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

  useEffect(() => {
    if (!open) return;

    const storedConversationId = window.localStorage.getItem(
      CONVERSATION_STORAGE_KEY
    );

    if (storedConversationId) {
      setConversationId(storedConversationId);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !conversationId) return;

    let ignore = false;

    const fetchMessages = async () => {
      try {
        const conversationMessages = await supportChatApi.getMessages(
          conversationId
        );

        if (!ignore && conversationMessages.length) {
          mergeMessages(conversationMessages);
          setErrorMessage(null);
        }
      } catch (error) {
        if (!ignore) {
          console.error("Error fetching support chat messages:", error);
          setErrorMessage("Could not refresh support replies.");
        }
      }
    };

    fetchMessages();
    const intervalId = window.setInterval(fetchMessages, 5000);

    return () => {
      ignore = true;
      window.clearInterval(intervalId);
    };
  }, [conversationId, mergeMessages, open]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const trimmedText = text.trim();
    const optimisticId = `local-${Date.now()}`;
    const newUserMessage: Message = {
      id: optimisticId,
      text: trimmedText,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsSending(true);
    setErrorMessage(null);

    try {
      const result = await supportChatApi.sendMessage(
        trimmedText,
        conversationId
      );

      if (result.conversationId) {
        setConversationId(result.conversationId);
        window.localStorage.setItem(
          CONVERSATION_STORAGE_KEY,
          result.conversationId
        );
      }

      setMessages((prev) =>
        prev.map((message) =>
          message.id === optimisticId
            ? {
                ...(result.message ?? message),
                text: result.message?.text || message.text,
                sender: "user",
                status: undefined,
              }
            : message
        )
      );

      if (result.conversationId) {
        const conversationMessages = await supportChatApi.getMessages(
          result.conversationId
        );

        if (conversationMessages.length) {
          mergeMessages(conversationMessages);
        }
      }
    } catch (error) {
      console.error("Error sending support chat message:", error);
      setErrorMessage("Message was not sent. Please try again.");
      setMessages((prev) =>
        prev.map((message) =>
          message.id === optimisticId ? { ...message, status: "error" } : message
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="z-[120] flex w-full gap-0 overflow-hidden border-l border-stone-200 bg-[#f7f4ef] p-0 shadow-[0_24px_90px_rgba(70,61,50,0.22)] sm:w-[520px] sm:max-w-[520px]"
      >
        <SheetHeader className="border-b border-stone-200 bg-white/84 px-5 pb-5 pt-6 text-left backdrop-blur">
          <div className="flex items-start gap-4 pr-8">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-950 text-white shadow-sm">
              <Headphones className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-xl font-semibold tracking-tight text-stone-950">
                  Customer Support
                </SheetTitle>
                <Badge className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50">
                  Online
                </Badge>
              </div>
              <SheetDescription className="mt-2 text-sm leading-6 text-stone-600">
                Ask about delivery, custom orders, materials, or anything else
                you need before choosing your furniture.
              </SheetDescription>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-stone-200 bg-[#f7f4ef] px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-900">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-700" />
                Quick replies
              </div>
              <p className="mt-1 text-xs text-stone-500">Usually in minutes</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-[#f7f4ef] px-3 py-2">
              <div className="flex items-center gap-2 text-xs font-medium text-stone-900">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                Custom help
              </div>
              <p className="mt-1 text-xs text-stone-500">Furniture guidance</p>
            </div>
          </div>
        </SheetHeader>

        <div
          ref={scrollAreaRef}
          className="flex-1 space-y-4 overflow-y-auto px-5 py-5"
        >
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {errorMessage && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {errorMessage}
            </div>
          )}
        </div>

        {!inputValue && messages.length < 3 && (
          <ChatSuggestions
            questions={SAMPLE_QUESTIONS}
            onQuestionClick={handleQuestionClick}
          />
        )}

        <div className="border-t border-stone-200 bg-white/86 px-5 pb-5 pt-4 backdrop-blur">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSendMessage}
            disabled={isSending}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
