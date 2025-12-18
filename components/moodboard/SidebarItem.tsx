"use client";

import { useDraggable } from "@dnd-kit/core";
import { Product } from "@/types/product.type";
import Image from "next/image";
import { Heart } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface SidebarItemProps {
  product: Product;
}

export function SidebarItem({ product }: SidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${product.id}`,
    data: { type: "sidebar", product },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-2 mb-3 bg-white border-2 rounded-lg cursor-grab active:cursor-grabbing hover:shadow-lg transition-all ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <div className="relative w-full aspect-square bg-gray-50 rounded overflow-hidden mb-2">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
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
    </div>
  );
}
