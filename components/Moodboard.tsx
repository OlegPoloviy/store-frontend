"use client";

import { useState, useRef } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
} from "@dnd-kit/core";
import { Product } from "@/types/product.type";
import { BoardItem } from "./moodboard/types";
import { SidebarItem } from "./moodboard/SidebarItem";
import { CanvasArea } from "./moodboard/CanvasArea";
import { DragOverlayItem } from "./moodboard/DragOverlayItem";
import { ExportDialog } from "./moodboard/ExportDialog";
import { Loader2 } from "lucide-react";
import { exportToImage, ImageFormat } from "@/lib/util/exportToImage";
import { toast } from "sonner";

interface MoodboardProps {
  products: Product[];
  loading?: boolean;
}

export function Moodboard({ products, loading = false }: MoodboardProps) {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const [dropPosition, setDropPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeType = active.data.current?.type;

    if (activeType === "sidebar" && active.data.current) {
      setActiveProduct(active.data.current.product);
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (over?.id === "canvas-area" && active.data.current?.type === "sidebar") {
      // Зберігаємо поточну позицію для відображення
      const canvasElement = canvasRef.current;
      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();
        const x =
          event.activatorEvent instanceof MouseEvent
            ? event.activatorEvent.clientX
            : 0;
        const y =
          event.activatorEvent instanceof MouseEvent
            ? event.activatorEvent.clientY
            : 0;

        setDropPosition({
          x: x - rect.left,
          y: y - rect.top,
        });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over, delta } = event;

    setActiveProduct(null);
    setDropPosition(null);

    if (!over || !active.data.current) return;

    const activeType = active.data.current.type;

    // СЦЕНАРІЙ 1: Додаємо новий продукт з сайдбару
    if (activeType === "sidebar" && over.id === "canvas-area") {
      const product = active.data.current.product as Product;
      const canvasElement = canvasRef.current;

      if (canvasElement) {
        const rect = canvasElement.getBoundingClientRect();

        const clientX = (event.activatorEvent as MouseEvent).clientX || 0;
        const clientY = (event.activatorEvent as MouseEvent).clientY || 0;

        const x = clientX - rect.left + delta.x;
        const y = clientY - rect.top + delta.y;

        const newItem: BoardItem = {
          uniqueId: `${product.id}-${Date.now()}`,
          productId: product.id,
          product: product,
          x: Math.max(0, x - 96),
          y: Math.max(0, y - 96),
        };
        setBoardItems((prev) => [...prev, newItem]);
      }
    }

    // СЦЕНАРІЙ 2: Рухаємо продукт на канвасі
    if (activeType === "board" && over.id === "canvas-area") {
      const uniqueId = active.data.current.uniqueId;
      setBoardItems((prev) =>
        prev.map((item) => {
          if (item.uniqueId === uniqueId) {
            return {
              ...item,
              x: Math.max(0, item.x + delta.x),
              y: Math.max(0, item.y + delta.y),
            };
          }
          return item;
        })
      );
    }
  };

  const handleRemoveItem = (uniqueId: string) => {
    setBoardItems((prev) => prev.filter((item) => item.uniqueId !== uniqueId));
  };

  const handleExportClick = () => {
    if (boardItems.length === 0) {
      toast.error("Add some products to the canvas first");
      return;
    }
    setIsExportDialogOpen(true);
  };

  const handleExport = async (
    format: ImageFormat,
    filename: string,
    quality: number
  ) => {
    if (!canvasAreaRef.current) {
      toast.error("Canvas not found");
      return;
    }

    try {
      setIsExporting(true);

      await exportToImage(
        canvasAreaRef.current,
        {
          format,
          quality,
          backgroundColor: "#ffffff",
          scale: 2,
        },
        filename
      );

      toast.success(`Moodboard exported as ${format.toUpperCase()}`);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Export error:", error);

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes("CORS") ||
        errorMessage.includes("cross-origin") ||
        errorMessage.includes("NetworkError")
      ) {
        toast.error(
          "Export failed due to CORS restrictions. Please ensure your S3 bucket allows cross-origin requests.",
          { duration: 5000 }
        );
      } else {
        toast.error("Failed to export moodboard");
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearCanvas = () => {
    setBoardItems([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-12 h-12 animate-spin text-gray-400" />
        <p className="ml-4 text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 py-4 mt-8">
        {/* Sidebar з продуктами */}
        <div className="w-64 bg-white shadow-xl rounded-2xl p-4 overflow-y-auto max-h-[calc(100vh-280px)] border border-gray-100 flex-shrink-0 ">
          <div className="sticky top-0 bg-white p-4 mb-3  z-100 rounded-2xl border border-gray-100">
            <h2 className="font-bold text-lg text-gray-900 ">Products</h2>
            <p className="text-xs text-gray-500 mt-1">
              Drag to canvas ({products.length})
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">No products available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <SidebarItem key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={canvasRef} className="flex-1">
          <CanvasArea
            ref={canvasAreaRef}
            items={boardItems}
            onRemoveItem={handleRemoveItem}
            onRemoveItems={handleClearCanvas}
            onExportClick={handleExportClick}
          />
        </div>
      </div>

      {/* DragOverlay для візуалізації перетягування */}
      <DragOverlay>
        {activeProduct ? <DragOverlayItem product={activeProduct} /> : null}
      </DragOverlay>

      {/* Export Dialog */}
      <ExportDialog
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        onExport={handleExport}
        loading={isExporting}
      />
    </DndContext>
  );
}
