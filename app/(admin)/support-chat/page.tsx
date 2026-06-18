"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  supportChatApi,
  SupportChatConversation,
  SupportChatMessage,
} from "@/api/support-chat.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

const formatDate = (date?: Date) => {
  if (!date) return "No date";

  return date.toLocaleString([], {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SupportChatAdminPage() {
  const [conversations, setConversations] = useState<
    SupportChatConversation[]
  >([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const selectedConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === selectedConversationId
      ),
    [conversations, selectedConversationId]
  );

  const loadConversations = useCallback(async () => {
    try {
      setLoadingConversations(true);
      const nextConversations = await supportChatApi.getConversations();

      setConversations(nextConversations);
      setSelectedConversationId((currentId) => {
        if (currentId && nextConversations.some(({ id }) => id === currentId)) {
          return currentId;
        }

        return nextConversations[0]?.id ?? null;
      });
    } catch (error) {
      console.error("Error fetching support conversations:", error);
      toast.error("Failed to load support conversations");
    } finally {
      setLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setLoadingMessages(true);
      const nextMessages = await supportChatApi.getMessages(conversationId);
      setMessages(nextMessages);
    } catch (error) {
      console.error("Error fetching support messages:", error);
      toast.error("Failed to load conversation messages");
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const handleCloseConversation = async (conversationId: string) => {
    try {
      await supportChatApi.closeConversation(conversationId);
      toast.success("Conversation closed");
      await loadConversations();
    } catch (error) {
      console.error("Error closing support conversation:", error);
      toast.error("Failed to close conversation");
    }
  };

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    loadMessages(selectedConversationId);
  }, [loadMessages, selectedConversationId]);

  return (
    <div className="mx-auto w-full max-w-[1800px] px-4 py-5 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
            Support Chat
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Review shopper conversations and close resolved requests.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full border-stone-200 bg-white sm:w-auto"
          onClick={loadConversations}
          disabled={loadingConversations}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid min-h-[640px] grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        <Card className="overflow-hidden rounded-lg border-stone-200 bg-white py-0 shadow-sm">
          <CardHeader className="border-b border-stone-200 px-5 py-4">
            <CardTitle className="flex items-center gap-2 text-base text-stone-950">
              <MessageCircle className="h-4 w-4" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[590px] overflow-y-auto p-0">
            {loadingConversations ? (
              <div className="px-5 py-6 text-sm text-stone-500">
                Loading conversations...
              </div>
            ) : conversations.length ? (
              <div className="divide-y divide-stone-100">
                {conversations.map((conversation) => {
                  const isSelected = conversation.id === selectedConversationId;

                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      className={`block w-full px-5 py-4 text-left transition ${
                        isSelected
                          ? "bg-stone-100"
                          : "bg-white hover:bg-stone-50"
                      }`}
                      onClick={() => setSelectedConversationId(conversation.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-stone-950">
                            {conversation.customerName ||
                              conversation.customerEmail ||
                              conversation.id}
                          </p>
                          <p className="mt-1 truncate text-xs text-stone-500">
                            {conversation.lastMessage?.text || "No messages yet"}
                          </p>
                        </div>
                        <Badge
                          className={
                            conversation.status === "closed"
                              ? "border-stone-200 bg-stone-100 text-stone-600 hover:bg-stone-100"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
                          }
                        >
                          {conversation.status}
                        </Badge>
                      </div>
                      <p className="mt-2 text-xs text-stone-400">
                        {formatDate(conversation.updatedAt)}
                      </p>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-6 text-sm text-stone-500">
                No support conversations yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-lg border-stone-200 bg-white py-0 shadow-sm">
          <CardHeader className="border-b border-stone-200 px-5 py-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <CardTitle className="text-base text-stone-950">
                  {selectedConversation
                    ? selectedConversation.customerName ||
                      selectedConversation.customerEmail ||
                      selectedConversation.id
                    : "Conversation"}
                </CardTitle>
                {selectedConversation && (
                  <p className="mt-1 text-xs text-stone-500">
                    Updated {formatDate(selectedConversation.updatedAt)}
                  </p>
                )}
              </div>
              {selectedConversation &&
                selectedConversation.status !== "closed" && (
                  <Button
                    variant="outline"
                    className="w-full border-stone-200 bg-white text-stone-700 sm:w-auto"
                    onClick={() =>
                      handleCloseConversation(selectedConversation.id)
                    }
                  >
                    <XCircle className="h-4 w-4" />
                    Close
                  </Button>
                )}
            </div>
          </CardHeader>
          <CardContent className="h-[590px] overflow-y-auto bg-[#f7f4ef] p-5">
            {!selectedConversationId ? (
              <div className="flex h-full items-center justify-center text-sm text-stone-500">
                Select a conversation to read messages.
              </div>
            ) : loadingMessages ? (
              <div className="text-sm text-stone-500">Loading messages...</div>
            ) : messages.length ? (
              <div className="space-y-4">
                {messages.map((message) => {
                  const isUser = message.sender === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          isUser
                            ? "rounded-bl-md border border-stone-200 bg-white text-stone-800"
                            : "rounded-br-md bg-stone-950 text-white"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`mt-1 text-[10px] font-medium ${
                            isUser ? "text-stone-400" : "text-right text-white/60"
                          }`}
                        >
                          {formatDate(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-stone-500">
                This conversation has no messages.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
