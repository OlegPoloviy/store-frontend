import { httpClient } from "./httpClient";

export type SupportChatSender = "user" | "support";

export interface SupportChatMessage {
  id: string;
  text: string;
  sender: SupportChatSender;
  timestamp: Date;
}

export interface SupportChatConversation {
  id: string;
  status: "open" | "closed" | string;
  createdAt?: Date;
  updatedAt?: Date;
  customerName?: string;
  customerEmail?: string;
  lastMessage?: SupportChatMessage;
}

export interface SendSupportMessageResult {
  conversationId: string;
  message?: SupportChatMessage;
}

type ApiRecord = Record<string, unknown>;

const asRecord = (value: unknown): ApiRecord =>
  value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as ApiRecord)
    : {};

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value;
  const record = asRecord(value);
  if (Array.isArray(record.data)) return record.data;
  if (Array.isArray(record.items)) return record.items;
  if (Array.isArray(record.messages)) return record.messages;
  if (Array.isArray(record.conversations)) return record.conversations;
  return [];
};

const toDate = (value: unknown): Date => {
  const date = value instanceof Date
    ? value
    : new Date(typeof value === "string" || typeof value === "number" ? value : Date.now());
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const normalizeSender = (value: unknown): SupportChatSender => {
  const raw = asRecord(value);
  const sender = String(
    raw?.sender ??
      raw?.senderType ??
      raw?.role ??
      raw?.authorType ??
      raw?.authorRole ??
      raw?.direction ??
      raw?.type ??
      raw?.from ??
      ""
  ).toLowerCase();

  if (
    raw?.isAdmin === true ||
    raw?.isSupport === true ||
    raw?.fromAdmin === true ||
    raw?.sentByAdmin === true ||
    raw?.adminId ||
    raw?.supportId
  ) {
    return "support";
  }

  if (
    raw?.isAdmin === false ||
    raw?.isSupport === false ||
    raw?.fromAdmin === false ||
    raw?.sentByAdmin === false ||
    raw?.anonymousId ||
    raw?.customerId ||
    raw?.userId
  ) {
    return "user";
  }

  if (sender.includes("customer_to_admin")) {
    return "user";
  }

  if (sender.includes("admin_to_customer")) {
    return "support";
  }

  if (
    sender.includes("user") ||
    sender.includes("customer") ||
    sender.includes("buyer") ||
    sender.includes("client") ||
    sender.includes("anonymous") ||
    sender.includes("guest") ||
    sender.includes("visitor")
  ) {
    return "user";
  }

  return "support";
};

export const normalizeSupportChatMessage = (
  value: unknown,
  fallbackId = Date.now().toString()
): SupportChatMessage => {
  const raw = asRecord(value);
  return {
    id: String(raw.id ?? raw._id ?? fallbackId),
    text: String(raw.text ?? raw.message ?? raw.content ?? raw.body ?? ""),
    sender: normalizeSender(raw),
    timestamp: toDate(raw.timestamp ?? raw.createdAt ?? raw.sentAt),
  };
};

const normalizeConversation = (value: unknown): SupportChatConversation => {
  const raw = asRecord(value);
  const customer = asRecord(raw.customer);
  const lastRaw =
    raw.lastMessage ??
    raw.latestMessage ??
    (Array.isArray(raw.messages) ? raw.messages.at(-1) : null);
  const status = String(raw.status ?? (raw.closedAt ? "closed" : "open"));
  const customerName = raw.customerName ?? raw.name ?? customer.name;
  const customerEmail = raw.customerEmail ?? raw.email ?? customer.email;

  return {
    id: String(raw.id ?? raw._id ?? raw.conversationId ?? ""),
    status: status.toLowerCase(),
    createdAt: raw.createdAt ? toDate(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? toDate(raw.updatedAt) : undefined,
    customerName: customerName == null ? undefined : String(customerName),
    customerEmail: customerEmail == null ? undefined : String(customerEmail),
    lastMessage: lastRaw ? normalizeSupportChatMessage(lastRaw) : undefined,
  };
};

export const supportChatApi = {
  sendMessage: async (
    text: string,
    conversationId?: string | null
  ): Promise<SendSupportMessageResult> => {
    const response = await httpClient.post("/support-chat/messages", {
      message: text,
      conversationId: conversationId || undefined,
    });

    const data = response.data;
    const rawMessage = data?.message ?? data?.data?.message ?? data;
    const nextConversationId =
      data?.conversationId ??
      data?.data?.conversationId ??
      rawMessage?.conversationId ??
      data?.conversation?.id ??
      data?.data?.conversation?.id ??
      conversationId;

    return {
      conversationId: String(nextConversationId ?? ""),
      message: rawMessage ? normalizeSupportChatMessage(rawMessage) : undefined,
    };
  },

  getMessages: async (conversationId: string): Promise<SupportChatMessage[]> => {
    const response = await httpClient.get(
      `/support-chat/conversations/${conversationId}/messages`
    );

    return toArray(response.data).map((message, index) =>
      normalizeSupportChatMessage(message, `${conversationId}-${index}`)
    );
  },

  getConversations: async (): Promise<SupportChatConversation[]> => {
    const response = await httpClient.get("/support-chat/conversations");

    return toArray(response.data)
      .map(normalizeConversation)
      .filter((conversation) => conversation.id);
  },

  closeConversation: async (conversationId: string): Promise<void> => {
    await httpClient.post(
      `/support-chat/conversations/${conversationId}/close`
    );
  },
};
