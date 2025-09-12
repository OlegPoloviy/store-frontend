"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function CopyButton() {
  const pathName = usePathname();

  const handleCopy = async () => {
    const url = window.location.origin + pathName;

    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link has been copied to clipboard");
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("We have troubles with copying this link");
    }
  };

  return (
    <Button variant="outline" size="lg" className="px-4" onClick={handleCopy}>
      <Share2 className="w-5 h-5" />
    </Button>
  );
}
