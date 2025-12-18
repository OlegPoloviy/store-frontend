"use client";

import { Box } from "lucide-react";
import { cn } from "@/lib/utils";

export function ImagePlaceholder({
  className,
  text = "No image available",
  iconClassName,
  textClassName,
}: {
  className?: string;
  text?: string;
  iconClassName?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cn(
        "w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400",
        className
      )}
    >
      <Box className={cn("w-8 h-8 mb-2", iconClassName)} />
      <p className={cn("text-xs font-medium", textClassName)}>{text}</p>
    </div>
  );
}
