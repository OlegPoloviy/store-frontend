import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (text: string) => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-[#f7f4ef] p-2 shadow-sm">
      <div className="min-w-0 flex-1">
        <Input
          placeholder="Type your message..."
          className="h-11 border-0 bg-transparent px-3 text-sm text-stone-900 shadow-none placeholder:text-stone-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSend(value);
          }}
        />
      </div>
      <Button
        size="icon"
        className="h-11 w-11 shrink-0 rounded-full bg-stone-950 text-white shadow-sm hover:bg-stone-800"
        onClick={() => onSend(value)}
        aria-label="Send message"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
