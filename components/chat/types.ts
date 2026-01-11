export interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

export interface ChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
