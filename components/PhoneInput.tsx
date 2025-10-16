"use client";

import { PhoneInput as PhoneInputLib } from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  defaultCountry?: string;
};

export function PhoneInput({
  value,
  onChange,
  className,
  defaultCountry = "ua",
}: PhoneInputProps) {
  return (
    <PhoneInputLib
      defaultCountry={defaultCountry}
      value={value || ""}
      onChange={(phone) => onChange?.(phone)}
      inputClassName={cn(
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      countrySelectorStyleProps={{
        buttonClassName:
          "!border-none !bg-transparent !p-2 !rounded-l-md !border-r !border-input !hover:bg-gray-50 !transition-colors",
        dropdownStyleProps: {
          className:
            "!bg-white !text-gray-900 !border !border-gray-200 !rounded-md !shadow-lg !z-50",
          style: {
            outline: "none",
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
      }}
      inputStyle={{
        outline: "none",
      }}
    />
  );
}
