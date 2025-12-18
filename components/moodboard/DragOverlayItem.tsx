"use client";

import { Product } from "@/types/product.type";
import Image from "next/image";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface DragOverlayItemProps {
  product: Product;
}

export function DragOverlayItem({ product }: DragOverlayItemProps) {
  return (
    <div className="w-48 border-2 border-blue-500 rounded-lg overflow-hidden shadow-2xl bg-white opacity-90 cursor-grabbing">
      <div className="relative w-full aspect-square">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <ImagePlaceholder
            className="bg-gray-100 text-gray-300"
            textClassName="text-[10px]"
          />
        )}
      </div>
      <div className="p-2 bg-white">
        <p className="text-xs font-medium line-clamp-1">{product.title}</p>
        <p className="text-xs text-gray-500">
          {product.price} {product.currency}
        </p>
      </div>
    </div>
  );
}
