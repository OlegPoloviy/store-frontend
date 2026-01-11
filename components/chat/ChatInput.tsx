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
    <div className="border-t mb-4 pt-4 flex gap-2">
      <Input
        placeholder="Type your message..."
        className="flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSend(value);
        }}
      />
      <Button
        size="icon"
        className="rounded-full"
        onClick={() => onSend(value)}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
}
