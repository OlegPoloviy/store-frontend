import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={`flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-950 text-[11px] font-semibold text-white shadow-sm">
          CF
        </div>
      )}
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? "rounded-br-md bg-stone-950 text-white"
            : "rounded-bl-md border border-stone-200 bg-white text-stone-800"
        }`}
      >
        <p>{message.text}</p>
        <div
          className={`mt-1 text-[10px] font-medium ${
            isUser ? "text-right text-white/62" : "text-left text-stone-400"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {message.status === "sending" ? " · Sending" : ""}
          {message.status === "error" ? " · Not sent" : ""}
        </div>
      </div>
    </div>
  );
}
