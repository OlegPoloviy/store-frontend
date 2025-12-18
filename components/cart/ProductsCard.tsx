"use client";

import Image from "next/image";
import { Trash2, Clock, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItemVM } from "@/types/cart-item.type";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

function formatPrice(amount: number | null, currency: string | null) {
  if (amount == null) return "";
  const cur = currency ?? "";
  return cur ? `${amount.toLocaleString()} ${cur}` : amount.toLocaleString();
}

export function CartItemsList({
  items,
  onRemove,
  className,
}: {
  items: CartItemVM[];
  onRemove?: (id: string) => void | Promise<void>;
  className?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <Card className={className}>
        <div className="px-6 py-8 text-stone-600">Cart is empty</div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="divide-y divide-stone-100">
        {items.map((it) => (
          <div key={it.id} className="flex gap-5 px-6 py-5">
            <div className="relative h-[86px] w-[120px] overflow-hidden rounded-lg bg-stone-100">
              {it.imageUrl ? (
                <Image
                  src={it.imageUrl}
                  alt={it.title}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : (
                <ImagePlaceholder className="bg-stone-100 text-stone-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-stone-900 truncate">
                    {it.title}
                  </div>
                  <div className="text-sm text-stone-500 truncate">
                    {it.materials?.length ? it.materials.join(" / ") : ""}
                  </div>
                </div>

                <div className="text-right font-semibold text-stone-900 whitespace-nowrap">
                  {formatPrice(it.price, it.currency)}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-sm text-stone-600">
                  {it.productionTime && (
                    <span className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-2 py-1 text-orange-700">
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

                {onRemove && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-stone-500 hover:text-red-600"
                    onClick={() => onRemove(it.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
