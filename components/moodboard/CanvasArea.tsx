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
}

export const CanvasArea = forwardRef<HTMLDivElement, CanvasAreaProps>(
  ({ items, scene, customBackground, selectedId, onSelect, onRemoveItem }, ref) => {
    const { setNodeRef, isOver } = useDroppable({ id: "canvas-area" });

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        onPointerDown={(event) => { if (event.target === event.currentTarget) onSelect(null); }}
        className={`relative min-h-[620px] w-full overflow-hidden rounded-[24px] border transition-all ${isOver ? "border-amber-700 ring-4 ring-amber-300/40" : "border-stone-200"}`}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {scene === "custom" && customBackground ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={customBackground} alt="" className="h-full w-full object-cover" />
          ) : scene === "studio" ? (
            <div className="h-full w-full bg-[#f5f1e9]" style={{ backgroundImage: "radial-gradient(#cfc7b9 0.8px, transparent 0.8px)", backgroundSize: "24px 24px" }} />
          ) : (
            <>
              <div className={`absolute inset-x-0 top-0 h-[71%] ${scene === "kitchen" ? "bg-[#e8e4da]" : scene === "bathroom" ? "bg-[#d8e0dc]" : "bg-[#e9dfd1]"}`} />
              {scene === "kitchen" && <>
                <div className="absolute left-[8%] top-[11%] h-[42%] w-[21%] rounded-t-[100px] border-[12px] border-[#ede9df] bg-gradient-to-br from-[#a9b9b8] to-[#e3e0d1] shadow-[inset_12px_12px_30px_#a6aaa4,12px_12px_30px_#a09b8b55]" />
                <div className="absolute inset-x-0 top-[52%] h-[3%] bg-[#ccc3b0] shadow-lg" />
                <div className="absolute inset-x-0 top-[55%] h-[17%] bg-[repeating-linear-gradient(90deg,#9c8c72_0%,#a9987b_16%,#786e5d_16.3%,#a89980_33%)]" />
              </>}
              {scene === "bathroom" && <>
                <div className="absolute inset-x-0 top-0 h-[72%] opacity-40" style={{ backgroundImage: "linear-gradient(90deg, transparent 98.5%, #abb8b4 99%), linear-gradient(transparent 98.5%, #abb8b4 99%)", backgroundSize: "100px 100px" }} />
                <div className="absolute left-[8%] top-[10%] h-[43%] w-[22%] rounded-t-full border-[10px] border-[#c4b9a8] bg-gradient-to-br from-[#afc0bb] to-[#eceddf] shadow-xl" />
                <div className="absolute inset-x-0 top-[62%] h-[4%] bg-[#d4c9b8] shadow-xl" />
              </>}
              {scene === "living" && <>
                <div className="absolute left-[6%] top-[9%] h-[48%] w-[22%] border-[14px] border-[#f1eadc] bg-gradient-to-br from-[#b8c4b8] via-[#d4d4bb] to-[#a5b29f] shadow-2xl" />
                <div className="absolute right-[7%] top-[12%] h-[31%] w-[18%] rounded-t-full border-[12px] border-[#ad9679] bg-[#d5c4a9] shadow-lg" />
                <div className="absolute inset-x-0 top-[70%] h-[2%] bg-[#c4b29c]" />
              </>}
              <div className={`absolute inset-x-0 bottom-0 h-[29%] ${scene === "bathroom" ? "bg-[repeating-linear-gradient(100deg,#d0d3cb_0%,#eeeee7_22%,#c7cec7_23%,#e6e7df_45%)]" : "bg-[repeating-linear-gradient(100deg,#a48f74_0%,#cbb89c_18%,#997e61_18.2%,#c9b597_36%)]"}`} />
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-stone-950/10" />
            </>
          )}
        </div>
        <div className="pointer-events-none absolute left-5 top-5 rounded-full border border-white/70 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-700 backdrop-blur-sm" data-export-ignore="true">Your space · {scene}</div>
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
