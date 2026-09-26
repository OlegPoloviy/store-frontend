"use client";

import { forwardRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { BoardItem, Scene } from "./types";
import { CanvasItem } from "./CanvasItem";
import { MoveUpRight } from "lucide-react";

interface CanvasAreaProps {
  items: BoardItem[];
  scene: Scene;
  customBackground: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onRemoveItem: (id: string) => void;
  expanded?: boolean;
}

export const CanvasArea = forwardRef<HTMLDivElement, CanvasAreaProps>(
  ({ items, scene, customBackground, selectedId, onSelect, onRemoveItem, expanded = false }, ref) => {
    const { setNodeRef, isOver } = useDroppable({ id: "canvas-area" });
    const scenePhoto = scene === "kitchen" ? "/images/moodboard/kitchen-empty.jpg" : scene === "bathroom" ? "/images/moodboard/bathroom-empty.jpg" : scene === "living" ? "/images/moodboard/living-empty.jpg" : null;
    const sceneAuthor = scene === "kitchen" ? "Alex Tyson" : scene === "bathroom" ? "Christa Grover" : scene === "living" ? "Lisa Anna" : null;

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onPointerDown={(event) => { if (event.target === event.currentTarget) onSelect(null); }}
        className={`relative w-full overflow-hidden rounded-[24px] border transition-all ${expanded ? "mx-auto" : "min-h-[620px]"} ${isOver ? "border-amber-700 ring-4 ring-amber-300/40" : "border-stone-200"}`}
        style={expanded ? {
          aspectRatio: scene === "bathroom" ? "2 / 3" : scene === "kitchen" || scene === "living" ? "1600 / 1067" : "16 / 9",
          maxWidth: scene === "bathroom" ? "min(1200px, calc((100dvh - 270px) * 0.6667))" : scene === "kitchen" || scene === "living" ? "min(1200px, calc((100dvh - 270px) * 1.5))" : "min(1200px, calc((100dvh - 270px) * 1.7778))",
        } : undefined}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {scene === "custom" && customBackground ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customBackground} alt="" className={`h-full w-full ${expanded ? "object-contain" : "object-cover"}`} />
          ) : scene === "studio" ? (
            <div className="h-full w-full bg-[#f5f1e9]" style={{ backgroundImage: "radial-gradient(#cfc7b9 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }} />
          ) : scenePhoto ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={scenePhoto} alt="" className={`h-full w-full ${expanded ? "object-contain" : "object-cover"}`} style={!expanded && scene === "bathroom" ? { objectPosition: "center 70%" } : undefined} />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-stone-950/15" />
            </>
          ) : (
            <div className="h-full w-full bg-[#f5f1e9]" style={{ backgroundImage: "radial-gradient(#cfc7b9 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }} />
          )}
        </div>
        <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-700 backdrop-blur-sm" data-export-ignore="true">Your space · {scene}</div>
        {scenePhoto && <div className="pointer-events-none absolute bottom-3 left-3 rounded bg-white/75 px-2 py-1 text-[9px] text-stone-700 backdrop-blur-sm">Photo: {sceneAuthor} / Unsplash</div>}
        {items.map((item) => <CanvasItem key={item.uniqueId} item={item} selected={selectedId === item.uniqueId} onSelect={onSelect} onRemove={onRemoveItem} />)}
        {items.length === 0 && <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-sm rounded-3xl border border-white/70 bg-white/85 px-8 py-9 text-center shadow-2xl backdrop-blur-md" data-export-ignore="true">
            <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-stone-900 text-white"><MoveUpRight size={20} /></div>
            <p className="font-serif text-2xl text-stone-900">Make it yours</p>
            <p className="mt-2 text-sm leading-6 text-stone-600">Drag a saved piece onto the scene, or add your own inspiration photo.</p>
          </div>
        </div>}
      </div>
    );
  }
);

CanvasArea.displayName = "CanvasArea";
