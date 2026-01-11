import { Message } from "./types";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-3 rounded-lg max-w-[85%] text-sm ${
          isUser
            ? "bg-emerald-600 text-white rounded-br-none"
            : "bg-stone-100 text-stone-800 rounded-bl-none"
        }`}
      >
        {message.text}
        <div
          className={`text-[10px] mt-1 opacity-70 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

