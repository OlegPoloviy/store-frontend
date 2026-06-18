"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Clock,
  Ruler,
  ShoppingCart,
  ArrowRight,
  Minus,
  Plus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItemVM } from "@/types/cart-item.type";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { cn } from "@/lib/utils";

function formatPrice(amount: number | null, currency: string | null) {
  if (amount == null) return "";
  const cur = currency ?? "";
  return cur ? `${amount.toLocaleString()} ${cur}` : amount.toLocaleString();
}

export function CartItemsList({
  items,
  onRemove,
  onQuantityChange,
  pendingItems,
  className,
}: {
  items: CartItemVM[];
  onRemove?: (id: string) => void | Promise<void>;
  onQuantityChange?: (id: string, action: "increment" | "decrement") => void;
  pendingItems?: Record<string, boolean>;
  className?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <Card
        className={cn(
          "overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] backdrop-blur",
          className
        )}
      >
        <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee7] text-stone-900 shadow-sm sm:h-16 sm:w-16">
            <ShoppingCart className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <h3 className="mt-5 text-2xl font-medium tracking-tight text-stone-950 sm:mt-6">
            Your cart is empty
          </h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-stone-500">
            Add some items to your cart to see them here.
          </p>

          <Button
            asChild
            className="group mt-6 h-12 w-full max-w-[220px] rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800 sm:mt-7 sm:max-w-sm"
          >
            <Link href="/products">
              Browse products
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden rounded-[28px] border border-white/70 bg-white/85 p-0 shadow-[0_18px_50px_rgba(84,72,57,0.08)] backdrop-blur",
        className
      )}
    >
      <div className="divide-y divide-stone-100/80">
        {items.map((it) => {
          const isPending = pendingItems?.[it.id] ?? false;

          return (
            <div
              key={it.id}
              className={cn(
                "grid gap-4 px-4 py-5 transition-opacity sm:grid-cols-[148px_minmax(0,1fr)] sm:gap-5 sm:px-6 lg:px-7",
                isPending && "opacity-70"
              )}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[#f0ebe4] sm:h-[112px] sm:w-[148px]">
                {it.imageUrl ? (
                  <Image
                    src={it.imageUrl}
                    alt={it.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 148px"
                  />
                ) : (
                  <ImagePlaceholder className="bg-[#f0ebe4] text-stone-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-stone-400">
                      Cart item
                    </p>
                    <div className="mt-2 line-clamp-2 text-xl font-medium tracking-tight text-stone-950">
                      {it.title}
                    </div>
                    <div className="mt-2 line-clamp-1 text-sm text-stone-500">
                      {it.materials?.length ? it.materials.join(" / ") : ""}
                    </div>
                  </div>

                  <div className="whitespace-nowrap rounded-full bg-[#f3eee7] px-4 py-2 text-sm font-semibold text-stone-800 sm:text-right">
                    {formatPrice(it.price, it.currency)}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                    {it.productionTime && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-amber-700">
                        <Clock className="h-4 w-4" />
                        {it.productionTime}
                      </span>
                    )}
                    {it.dimensions && (
                      <span className="inline-flex items-center gap-2 text-stone-500">
                        <Ruler className="h-4 w-4" />
                        {it.dimensions}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {onQuantityChange && (
                      <div className="flex items-center rounded-full border border-stone-200 bg-white shadow-sm">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-stone-700 hover:text-stone-900"
                          onClick={() => onQuantityChange(it.id, "decrement")}
                          disabled={isPending || (it.quantity ?? 1) <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="min-w-9 px-2 text-center text-sm font-semibold text-stone-950">
                          {it.quantity ?? 1}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-stone-700 hover:text-stone-900"
                          onClick={() => onQuantityChange(it.id, "increment")}
                          disabled={isPending}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    {onRemove && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full text-stone-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => onRemove(it.id)}
                        disabled={isPending}
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
