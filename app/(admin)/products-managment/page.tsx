"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ImageOff, PackagePlus, Pencil, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { productsApi } from "@/api/productApi";
import { categoryApi } from "@/api/category.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { type Product, type ProductCategory } from "@/types/product.type";
import { toast } from "sonner";

type SortOption = "newest" | "oldest" | "price-high" | "price-low";

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Recently" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
};

export default function ProductsManagmentPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => { void getAllProducts(); }, []);

  async function getAllProducts() {
    setIsLoading(true);
    try { setProducts(await productsApi.getAll()); }
    catch (error) { console.error("Error fetching products:", error); toast.error("Failed to load products"); }
    finally { setIsLoading(false); }
  }

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category?.name).filter(Boolean)))], [products]);
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => selectedCategory === "All" || product.category?.name === selectedCategory)
      .filter((product) => !normalizedQuery || [product.title, product.description, product.material, product.category?.name].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        if (sort === "price-high") return Number.parseFloat(b.price) - Number.parseFloat(a.price);
        if (sort === "price-low") return Number.parseFloat(a.price) - Number.parseFloat(b.price);
        const direction = sort === "newest" ? -1 : 1;
        return direction * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      });
  }, [products, query, selectedCategory, sort]);

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete “${product.title}”? This action cannot be undone.`)) return;
    try { await productsApi.deleteProduct(product.id); setProducts((current) => current.filter((item) => item.id !== product.id)); toast.success("Product deleted"); }
    catch (error) { console.error("Error deleting product:", error); toast.error("Failed to delete product"); }
  }

  return <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-9" onClickCapture={(event) => { const link = (event.target as HTMLElement).closest('a[href*="/edit"]'); if (!link) return; const product = products.find((item) => link.getAttribute("href")?.includes(item.id)); if (product) { event.preventDefault(); setEditingProduct(product); } }}>
    <header className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Catalog</p><h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">Product management</h1><p className="mt-2 text-sm leading-6 text-stone-500 sm:text-base">Keep your catalog clear, current, and ready for customers.</p></div><Button asChild className="rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"><Link href="/products-managment/create"><PackagePlus className="mr-2 h-4 w-4" />Add product</Link></Button></header>

    <section className="rounded-[26px] border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative min-w-0 flex-1 lg:max-w-xl"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, category or material…" className="h-12 rounded-full border-stone-200 bg-stone-50 pl-11 pr-4 shadow-none focus-visible:ring-stone-400" /></div><div className="flex items-center gap-3"><span className="hidden text-sm text-stone-500 sm:inline">{visibleProducts.length} of {products.length} products</span><div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" /><select value={sort} onChange={(event) => setSort(event.target.value as SortOption)} className="h-12 appearance-none rounded-full border border-stone-200 bg-white py-0 pl-10 pr-9 text-sm font-medium text-stone-700 outline-none transition focus:border-stone-400"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="price-high">Price: high to low</option><option value="price-low">Price: low to high</option></select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" /></div></div></div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{categories.map((category) => <button key={category} type="button" onClick={() => setSelectedCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${selectedCategory === category ? "bg-stone-950 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}>{category}</button>)}</div>
    </section>

    {isLoading ? <div className="grid min-h-80 place-items-center text-sm text-stone-500"><span className="rounded-full bg-stone-100 px-4 py-2">Loading catalog…</span></div> : visibleProducts.length ? <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">{visibleProducts.map((product) => {
      const image = product.images?.find((item) => item.isMain) || product.images?.[0];
      const price = Number.parseFloat(product.price || "0");
      return <article key={product.id} className="group overflow-hidden rounded-[24px] border border-stone-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-24px_rgba(49,39,27,0.45)]"><Link href={`/products-managment/${product.id}/edit`} className="block"><div className="relative aspect-[4/3] overflow-hidden bg-[#f2eee8]">{image ? <Image src={image.url} alt={image.altText || product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-stone-400"><div className="text-center"><ImageOff className="mx-auto h-7 w-7" /><p className="mt-2 text-xs font-medium">No image yet</p></div></div>}<Badge className="absolute left-3 top-3 rounded-full border-0 bg-white/90 px-3 py-1 text-xs font-medium text-stone-700 shadow-sm backdrop-blur">{product.category?.name || "Uncategorized"}</Badge></div></Link><div className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={`/products-managment/${product.id}/edit`} className="block truncate text-lg font-semibold tracking-tight text-stone-950 hover:underline">{product.title}</Link><p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-stone-500">{product.description || "No description added yet."}</p></div><p className="shrink-0 text-sm font-semibold text-stone-950">{product.currency || "USD"} {Number.isFinite(price) ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</p></div><div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3"><p className="text-xs text-stone-400">Added {formatDate(product.createdAt)}</p><div className="flex gap-1"><Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-full text-stone-600 hover:bg-stone-100"><Link href={`/products-managment/${product.id}/edit`} aria-label={`Edit ${product.title}`}><Pencil className="h-4 w-4" /></Link></Button><Button variant="ghost" size="icon" onClick={() => handleDelete(product)} className="h-9 w-9 rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700" aria-label={`Delete ${product.title}`}><Trash2 className="h-4 w-4" /></Button></div></div></div></article>;
    })}</section> : <section className="mt-6 grid min-h-80 place-items-center rounded-[26px] border border-dashed border-stone-300 bg-white text-center"><div><ImageOff className="mx-auto h-8 w-8 text-stone-400" /><p className="mt-4 font-semibold text-stone-900">No matching products</p><p className="mt-1 text-sm text-stone-500">Try another search or clear your category filter.</p><Button variant="outline" onClick={() => { setQuery(""); setSelectedCategory("All"); }} className="mt-4 rounded-full">Clear filters</Button></div></section>}
    <QuickEditor product={editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)} onSaved={() => { setEditingProduct(null); void getAllProducts(); }} />
  </div>;
}

function QuickEditor({ product, onOpenChange, onSaved }: { product: Product | null; onOpenChange: (open: boolean) => void; onSaved: () => void }) {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  useEffect(() => { if (product) setValues({ title: product.title || "", description: product.description || "", price: product.price || "", currency: product.currency || "USD", categoryId: product.categoryId || product.category?.id || "", material: product.material || "", color: product.color || "", width: product.width || "", height: product.height || "", depth: product.depth || "", unitOfMeasure: product.unitOfMeasure || "cm", uniqueIdentifier: product.uniqueIdentifier || "" }); }, [product]);
  useEffect(() => { void categoryApi.getAll().then((data) => setCategories(data as ProductCategory[])).catch(() => toast.error("Failed to load categories")); }, []);
  const setValue = (key: string, value: string) => setValues((current) => ({ ...current, [key]: value }));
  async function save() {
    if (!product || !values.title.trim() || !values.description.trim() || !values.price || !values.categoryId) { toast.error("Title, description, price and category are required"); return; }
    const category = categories.find((item) => item.id === values.categoryId);
    if (!category) { toast.error("Please select a category"); return; }
    setSaving(true);
    try { const data = new FormData(); data.append("data", JSON.stringify({ ...values, category: category.name })); await productsApi.updateProduct(product.id, data); toast.success("Product updated"); onSaved(); }
    catch (error) { console.error("Product update error:", error); toast.error("Failed to update product"); }
    finally { setSaving(false); }
  }
  return <Sheet open={Boolean(product)} onOpenChange={onOpenChange}><SheetContent side="right" className="w-full gap-0 overflow-y-auto border-stone-200 bg-[#fbfaf8] p-0 sm:max-w-xl"><SheetHeader className="border-b border-stone-200 bg-white px-6 py-6 text-left"><SheetTitle className="pr-8 text-xl tracking-tight">Edit product</SheetTitle><SheetDescription className="truncate">{product?.title || "Update catalog details"}</SheetDescription></SheetHeader><div className="space-y-6 px-6 py-6"><section className="space-y-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Essentials</p><Field label="Product title"><Input value={values.title || ""} onChange={(e) => setValue("title", e.target.value)} /></Field><Field label="Description"><textarea value={values.description || ""} onChange={(e) => setValue("description", e.target.value)} className="min-h-24 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-stone-400" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Price"><Input value={values.price || ""} onChange={(e) => setValue("price", e.target.value)} inputMode="decimal" /></Field><Field label="Currency"><select value={values.currency || "USD"} onChange={(e) => setValue("currency", e.target.value)} className="h-9 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"><option>USD</option><option>EUR</option><option>GBP</option></select></Field></div><Field label="Category"><select value={values.categoryId || ""} onChange={(e) => setValue("categoryId", e.target.value)} className="h-9 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"><option value="">Select category</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field></section><section className="space-y-4 border-t border-stone-200 pt-6"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Details</p><div className="grid grid-cols-2 gap-3"><Field label="Material"><Input value={values.material || ""} onChange={(e) => setValue("material", e.target.value)} /></Field><Field label="Color"><Input value={values.color || ""} onChange={(e) => setValue("color", e.target.value)} /></Field></div><div className="grid grid-cols-4 gap-2"><Field label="Width"><Input value={values.width || ""} onChange={(e) => setValue("width", e.target.value)} /></Field><Field label="Height"><Input value={values.height || ""} onChange={(e) => setValue("height", e.target.value)} /></Field><Field label="Depth"><Input value={values.depth || ""} onChange={(e) => setValue("depth", e.target.value)} /></Field><Field label="Unit"><select value={values.unitOfMeasure || "cm"} onChange={(e) => setValue("unitOfMeasure", e.target.value)} className="h-9 w-full rounded-md border border-stone-200 bg-white px-2 text-sm"><option>cm</option><option>in</option></select></Field></div><Field label="SKU / product code"><Input value={values.uniqueIdentifier || ""} onChange={(e) => setValue("uniqueIdentifier", e.target.value)} /></Field></section></div><SheetFooter className="sticky bottom-0 border-t border-stone-200 bg-white p-4 sm:flex-row"><Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">Cancel</Button><Button onClick={save} disabled={saving} className="rounded-full bg-stone-950 text-white hover:bg-stone-800">{saving ? "Saving…" : "Save changes"}</Button></SheetFooter></SheetContent></Sheet>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block space-y-1.5 text-sm font-medium text-stone-700"><span>{label}</span>{children}</label>; }
