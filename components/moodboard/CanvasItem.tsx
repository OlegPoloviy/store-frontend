"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BoardItem } from "./types";
import Image from "next/image";
import { X, Heart } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface CanvasItemProps {
  item: BoardItem;
  onRemove: (uniqueId: string) => void;
}

export function CanvasItem({ item, onRemove }: CanvasItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: item.uniqueId,
      data: { type: "board", uniqueId: item.uniqueId },
    });

  const style = {
    position: "absolute" as const,
    left: item.x,
    top: item.y,
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : 1,
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(item.uniqueId);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`absolute cursor-move group ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="relative w-48 border-2 border-transparent group-hover:border-blue-500 rounded-lg overflow-hidden shadow-lg bg-white">
        <div className="relative w-full aspect-square">
          {item.product.images && item.product.images.length > 0 ? (
            <Image
              src={item.product.images[0].url}
              alt={item.product.title}
              fill
              className="object-cover pointer-events-none"
              sizes="200px"
            />
          ) : (
            <ImagePlaceholder
              className="bg-gray-100 text-gray-300"
              textClassName="text-[10px]"
            />
          )}

          {/* Favorite indicator */}
          {item.product.isFavorite && (
            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            </div>
          )}
        </div>

        {/* Info Bar */}
        <div className="p-2 bg-white">
          <p className="text-xs font-medium line-clamp-1 text-gray-800">
            {item.product.title}
          </p>
          <p className="text-xs text-gray-500">
            {item.product.price} {item.product.currency}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
