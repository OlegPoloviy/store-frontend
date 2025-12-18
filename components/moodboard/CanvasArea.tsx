"use client";

import { forwardRef } from "react";
import { useDroppable } from "@dnd-kit/core";
import { BoardItem } from "./types";
import { CanvasItem } from "./CanvasItem";
import { ImagePlus, Download, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface CanvasAreaProps {
  items: BoardItem[];
  onRemoveItem: (uniqueId: string) => void;
  onExportClick?: () => void;
  onRemoveItems: () => void;
}

export const CanvasArea = forwardRef<HTMLDivElement, CanvasAreaProps>(
  ({ items, onRemoveItem, onExportClick, onRemoveItems }, ref) => {
    const { setNodeRef, isOver } = useDroppable({
      id: "canvas-area",
    });

    return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`flex-1 min-h-[calc(100vh-280px)] bg-white relative border-2 rounded-xl transition-all ${
          isOver
            ? "border-blue-500 border-dashed bg-blue-50/50"
            : "border-gray-200 border-dashed"
        }`}
        style={{
          backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          overflow: "clip",
        }}
      >
        {/* Export Button */}
        {items.length > 0 && (
          <div className="absolute flex justify-between w-[11%] top-4 right-4 z-10 export-button-exclude">
            <Button
              onClick={onExportClick}
              className="bg-gray-900 hover:bg-gray-800 shadow-lg"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              onClick={onRemoveItems}
              className="bg-gray-900 hover:bg-gray-800 shadow-lg"
            >
              Clear canvas
              <Trash2 />
            </Button>
          </div>
        )}

        {items.map((item) => (
          <CanvasItem key={item.uniqueId} item={item} onRemove={onRemoveItem} />
        ))}

        {items.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <ImagePlus className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium">Your Moodboard Canvas</p>
            <p className="text-sm mt-2">
              Drag and drop products here to create your design
            </p>
          </div>
        )}
      </div>
    );
  }
);

CanvasArea.displayName = "CanvasArea";
