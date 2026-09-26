"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Product } from "@/types/product.type";
import { BoardItem, CARD_HEIGHT, CARD_WIDTH, Scene } from "./moodboard/types";
import { SidebarItem } from "./moodboard/SidebarItem";
import { CanvasArea } from "./moodboard/CanvasArea";
import { DragOverlayItem } from "./moodboard/DragOverlayItem";
import { ExportDialog } from "./moodboard/ExportDialog";
import { ArrowDown, ArrowUp, Download, ImagePlus, Loader2, RotateCcw, RotateCw, Trash2, Upload, ZoomIn, ZoomOut } from "lucide-react";
import { exportToImage, ImageFormat } from "@/lib/util/exportToImage";
import { getImageProxyUrl } from "@/lib/util/imageProxy";
import { toast } from "sonner";

interface MoodboardProps { products: Product[]; loading?: boolean }
interface SavedBoard { items: BoardItem[]; scene: Scene; customBackground: string | null }
const STORAGE_KEY = "moodboard-studio-v1";
const SCENES: { id: Scene; label: string; swatch: string }[] = [
  { id: "studio", label: "Studio", swatch: "#f5f1e9" },
  { id: "kitchen", label: "Kitchen", swatch: "#aa9881" },
  { id: "bathroom", label: "Bathroom", swatch: "#c2d2cd" },
  { id: "living", label: "Living room", swatch: "#d4bda0" },
];

function clamp(value: number, min: number, max: number) { return Math.min(Math.max(value, min), Math.max(min, max)); }

async function prepareImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file");
  if (file.size > 8 * 1024 * 1024) throw new Error("Images must be under 8 MB");
  const url = URL.createObjectURL(file);
  try {
    const image = new window.Image();
    image.src = url;
    await image.decode();
    const ratio = Math.min(1, 1800 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * ratio));
    canvas.height = Math.max(1, Math.round(image.height * ratio));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not process image");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.78);
  } finally { URL.revokeObjectURL(url); }
}

export function Moodboard({ products, loading = false }: MoodboardProps) {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [scene, setScene] = useState<Scene>("studio");
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const storageWarningShown = useRef(false);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as SavedBoard;
        if (Array.isArray(saved.items)) setBoardItems(saved.items.filter((item) => item && typeof item.imageUrl === "string"));
        if (SCENES.some((entry) => entry.id === saved.scene) || saved.scene === "custom") setScene(saved.scene);
        if (typeof saved.customBackground === "string") setCustomBackground(saved.customBackground);
      }
    } catch { /* Invalid or unavailable storage starts a fresh board. */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: boardItems, scene, customBackground } satisfies SavedBoard)); }
    catch {
      if (!storageWarningShown.current) toast.error("This board is too large to save in this browser. Export an image to keep a copy.");
      storageWarningShown.current = true;
    }
  }, [boardItems, scene, customBackground, ready]);

  const selected = boardItems.find((item) => item.uniqueId === selectedId);
  const bounds = () => canvasRef.current?.getBoundingClientRect();
  const nextZ = () => Math.max(0, ...boardItems.map((item) => item.z || 0)) + 1;

  const addProduct = (product: Product, position?: { x: number; y: number }) => {
    const rect = bounds();
    const offset = (boardItems.length % 5) * 26;
    const item: BoardItem = {
      uniqueId: crypto.randomUUID(), productId: product.id, title: product.title,
      imageUrl: product.images?.[0]?.url ? getImageProxyUrl(product.images[0].url) : "",
      price: `${product.price} ${product.currency}`,
      x: clamp(position?.x ?? ((rect?.width || 800) - CARD_WIDTH) / 2 + offset, 0, (rect?.width || 800) - CARD_WIDTH),
      y: clamp(position?.y ?? ((rect?.height || 620) - CARD_HEIGHT) / 2 + offset, 0, (rect?.height || 620) - CARD_HEIGHT),
      scale: 1, rotation: 0, z: nextZ(),
    };
    setBoardItems((items) => [...items, item]);
    setSelectedId(item.uniqueId);
  };

  const handleDragEnd = ({ active, over, delta }: DragEndEvent) => {
    setActiveProduct(null);
    if (over?.id !== "canvas-area" || !active.data.current) return;
    const rect = bounds();
    if (!rect) return;
    if (active.data.current.type === "sidebar") {
      // dnd-kit already translated the source rectangle; the original click plus delta
      // placed cards incorrectly when the user grabbed them away from the top-left corner.
      const translated = active.rect.current.translated;
      if (!translated) return;
      addProduct(active.data.current.product as Product, { x: translated.left - rect.left, y: translated.top - rect.top });
    } else if (active.data.current.type === "board") {
      const id = active.data.current.uniqueId as string;
      setBoardItems((items) => items.map((item) => item.uniqueId === id ? {
        ...item,
        x: clamp(item.x + delta.x, 0, rect.width - CARD_WIDTH),
        y: clamp(item.y + delta.y, 0, rect.height - CARD_HEIGHT),
      } : item));
    }
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>, asBackground: boolean) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      for (const [index, file] of files.entries()) {
        const imageUrl = await prepareImage(file);
        if (asBackground) { setCustomBackground(imageUrl); setScene("custom"); break; }
        const rect = bounds();
        const item: BoardItem = {
          uniqueId: crypto.randomUUID(), title: file.name.replace(/\.[^.]+$/, ""), imageUrl, isUpload: true,
          x: clamp(((rect?.width || 800) - CARD_WIDTH) / 2 + (boardItems.length + index) * 18, 0, (rect?.width || 800) - CARD_WIDTH),
          y: clamp(((rect?.height || 620) - CARD_HEIGHT) / 2 + (boardItems.length + index) * 18, 0, (rect?.height || 620) - CARD_HEIGHT),
          scale: 1, rotation: 0, z: Date.now(),
        };
        setBoardItems((items) => [...items, item]);
        setSelectedId(item.uniqueId);
      }
    } catch (error) { toast.error(error instanceof Error ? error.message : "Could not add image"); }
    finally { setUploading(false); }
  };

  const updateSelected = (change: Partial<BoardItem>) => {
    if (!selectedId) return;
    setBoardItems((items) => items.map((item) => item.uniqueId === selectedId ? { ...item, ...change } : item));
  };

  const handleExport = async (format: ImageFormat, filename: string, quality: number) => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    const previousSelection = selectedId;
    try {
      setSelectedId(null);
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await exportToImage(canvasRef.current, { format, quality, backgroundColor: "#f5f1e9", scale: 2 }, filename);
      toast.success("Moodboard downloaded");
      setIsExportDialogOpen(false);
    } catch { toast.error("Could not export the board. One of the product images may block downloads."); }
    finally { setSelectedId(previousSelection); setIsExporting(false); }
  };

  if (loading) return <div className="flex items-center justify-center gap-3 py-20 text-stone-500"><Loader2 className="animate-spin" /> Loading your saved pieces...</div>;

  return <DndContext sensors={sensors} onDragStart={({ active }: DragStartEvent) => {
    if (active.data.current?.type === "sidebar") setActiveProduct(active.data.current.product as Product);
  }} onDragEnd={handleDragEnd} onDragCancel={() => setActiveProduct(null)}>
    <section className="mt-7 rounded-[28px] bg-[#f5f2ec] p-4 text-stone-900 sm:p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-800">Your design studio</p><h2 className="mt-1 font-serif text-3xl sm:text-4xl">The moodboard</h2><p className="mt-1 text-sm text-stone-500">Create a space around pieces you love.</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => photoInputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-stone-50"><ImagePlus size={16} /> Add photo</button>
          <button type="button" onClick={() => { if (boardItems.length) setIsExportDialogOpen(true); else toast.error("Add a piece or photo first"); }} className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-stone-700"><Download size={16} /> Export board</button>
        </div>
      </div>
      <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" aria-label="Upload inspiration photos" onChange={(event) => handleUpload(event, false)} />
      <input ref={backgroundInputRef} type="file" accept="image/*" className="hidden" aria-label="Upload room background" onChange={(event) => handleUpload(event, true)} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Set the scene</span>
        {SCENES.map((option) => <button key={option.id} type="button" onClick={() => setScene(option.id)} aria-pressed={scene === option.id} className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${scene === option.id ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white hover:border-stone-500"}`}><span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: option.swatch }} />{option.label}</button>)}
        <button type="button" onClick={() => backgroundInputRef.current?.click()} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${scene === "custom" ? "border-stone-900 bg-stone-900 text-white" : "border-stone-300 bg-white hover:border-stone-500"}`}><Upload size={13} /> Own background</button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[208px_minmax(0,1fr)]">
        <aside className="max-h-[620px] overflow-y-auto rounded-[22px] border border-stone-200 bg-white p-3">
          <div className="sticky top-0 z-10 mb-3 border-b border-stone-100 bg-white pb-3"><h3 className="font-serif text-lg">Saved pieces</h3><p className="text-xs text-stone-500">Drag or tap + to add · {products.length}</p></div>
          {products.length ? products.map((product) => <SidebarItem key={product.id} product={product} onAdd={addProduct} />) : <div className="rounded-xl bg-stone-50 p-4 text-center text-xs leading-5 text-stone-500">No saved products yet. Add your own photos to start.</div>}
        </aside>
        <div className="min-w-0">
          <CanvasArea ref={canvasRef} items={boardItems} scene={scene} customBackground={customBackground} selectedId={selectedId} onSelect={setSelectedId} onRemoveItem={(id) => { setBoardItems((items) => items.filter((item) => item.uniqueId !== id)); if (selectedId === id) setSelectedId(null); }} />
        </div>
      </div>

      <div className="mt-4 flex min-h-12 flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-xs text-stone-600">
        {selected ? <div className="flex flex-wrap items-center gap-2"><span className="max-w-36 truncate font-semibold text-stone-900">{selected.title}</span><span className="mx-1 h-5 w-px bg-stone-200" />
          <button type="button" aria-label="Make smaller" title="Make smaller" onClick={() => updateSelected({ scale: clamp(Number((selected.scale - 0.1).toFixed(1)), 0.6, 1.6) })} className="rounded-lg p-2 hover:bg-stone-100"><ZoomOut size={17} /></button>
          <span className="w-9 text-center tabular-nums">{Math.round(selected.scale * 100)}%</span>
          <button type="button" aria-label="Make larger" title="Make larger" onClick={() => updateSelected({ scale: clamp(Number((selected.scale + 0.1).toFixed(1)), 0.6, 1.6) })} className="rounded-lg p-2 hover:bg-stone-100"><ZoomIn size={17} /></button>
          <button type="button" aria-label="Rotate left" title="Rotate left" onClick={() => updateSelected({ rotation: selected.rotation - 5 })} className="rounded-lg p-2 hover:bg-stone-100"><RotateCcw size={17} /></button>
          <button type="button" aria-label="Rotate right" title="Rotate right" onClick={() => updateSelected({ rotation: selected.rotation + 5 })} className="rounded-lg p-2 hover:bg-stone-100"><RotateCw size={17} /></button>
          <button type="button" aria-label="Send backward" title="Send backward" onClick={() => updateSelected({ z: Math.min(...boardItems.map((item) => item.z)) - 1 })} className="rounded-lg p-2 hover:bg-stone-100"><ArrowDown size={17} /></button>
          <button type="button" aria-label="Bring to front" title="Bring to front" onClick={() => updateSelected({ z: nextZ() })} className="rounded-lg p-2 hover:bg-stone-100"><ArrowUp size={17} /></button>
        </div> : <p>Select a piece to resize, rotate or change its layer.</p>}
        {boardItems.length > 0 && <button type="button" onClick={() => { setBoardItems([]); setSelectedId(null); }} className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-stone-500 hover:bg-red-50 hover:text-red-700"><Trash2 size={15} /> Clear board</button>}
      </div>
    </section>
    <DragOverlay>{activeProduct ? <DragOverlayItem product={activeProduct} /> : null}</DragOverlay>
    <ExportDialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen} onExport={handleExport} loading={isExporting} />
  </DndContext>;
}
