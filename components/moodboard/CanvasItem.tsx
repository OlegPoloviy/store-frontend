"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { BoardItem, CARD_WIDTH } from "./types";
import { Grip, X } from "lucide-react";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

interface CanvasItemProps {
  item: BoardItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CanvasItem({ item, selected, onSelect, onRemove }: CanvasItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.uniqueId,
    data: { type: "board", uniqueId: item.uniqueId },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: item.x,
        top: item.y,
        width: CARD_WIDTH,
        transform: `${CSS.Translate.toString(transform) || ""} rotate(${item.rotation}deg) scale(${item.scale})`,
        transformOrigin: "center center",
        zIndex: isDragging ? 1000 : item.z,
      }}
      onPointerDown={() => onSelect(item.uniqueId)}
      className={`group touch-none rounded-xl p-1.5 transition-shadow ${item.originalImageUrl ? "bg-transparent" : "bg-white shadow-[0_15px_40px_rgba(40,32,23,.2)]"} ${selected ? "ring-2 ring-amber-700" : item.originalImageUrl ? "hover:ring-1 hover:ring-white/70" : "hover:shadow-2xl"} ${isDragging ? "opacity-70" : ""}`}
    >
      <div {...listeners} {...attributes} aria-label={`Move ${item.title}`} className="relative cursor-grab active:cursor-grabbing">
        <div className={`relative overflow-hidden rounded-lg ${item.originalImageUrl ? "h-[202px]" : "h-[158px] bg-stone-100"}`}>
          {item.imageUrl ? <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} draggable={false} className={`h-full w-full pointer-events-none ${item.originalImageUrl ? "object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,.3)]" : "object-cover"}`} />
          </> : <ImagePlaceholder className="bg-stone-100 text-stone-400" textClassName="text-[10px]" />}
          <span className="absolute bottom-2 left-2 rounded-full bg-white/85 p-1 text-stone-700 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100"><Grip size={13} /></span>
        </div>
        {!item.originalImageUrl && <div className="px-1 pb-1 pt-2">
          <p className="truncate text-[11px] font-semibold text-stone-900">{item.title}</p>
          <p className="mt-0.5 text-[10px] text-stone-500">{item.price || (item.isUpload ? "Your image" : "")}</p>
        </div>}
      </div>
      <button type="button" aria-label={`Remove ${item.title}`} data-export-ignore="true"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => { event.stopPropagation(); onRemove(item.uniqueId); }}
        className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-stone-900 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 focus:opacity-100"><X size={14} /></button>
    </div>
  );
}
