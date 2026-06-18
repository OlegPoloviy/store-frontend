export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

export interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
