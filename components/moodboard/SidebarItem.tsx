"use client";

import { useDraggable } from "@dnd-kit/core";
import { Product } from "@/types/product.type";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { getImageProxyUrl } from "@/lib/util/imageProxy";
import { Plus } from "lucide-react";

interface SidebarItemProps {
  product: Product;
  onAdd?: (product: Product) => void;
}

export function SidebarItem({ product, onAdd }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${product.id}`,
    data: { type: "sidebar", product },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative p-2 mb-3 bg-white border border-stone-200 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-lg transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden mb-2">
        {product.images && product.images.length > 0 ? (
          <Image
            src={getImageProxyUrl(product.images[0].url)}
            alt={product.title}
            fill
            className="object-cover"
            sizes="150px"
          />
        ) : (
          <ImagePlaceholder
            className="bg-gray-50 text-gray-300"
            iconClassName="w-6 h-6 mb-1"
            textClassName="text-[10px]"
          />
        )}

        {/* Favorite indicator */}
        {product.isFavorite && (
          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
            <Heart className="w-3 h-3 fill-red-500 text-red-500" />
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-center line-clamp-2 text-gray-700">
        {product.title}
      </p>
      <p className="text-xs text-center text-gray-500 mt-1">
        {product.price} {product.currency}
      </p>
      <button type="button" aria-label={`Add ${product.title} to board`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); onAdd?.(product); }} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white text-stone-900 opacity-0 shadow-md transition-opacity group-hover:opacity-100 focus:opacity-100"><Plus size={17} /></button>
    </div>
  );
}
