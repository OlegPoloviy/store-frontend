"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { ImageOff, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import { categoryApi } from "@/lib/api/category.api";
import type { Category } from "@/types/category.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function CategoriesManagementPage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCategories() {
    setLoading(true);
    setLoadError(false);
    try {
      setCategories(await categoryApi.getAll());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCategories(); }, []);

  function startCreate() {
    setEditing(null);
    setName("");
    setImage(null);
    setError("");
    setOpen(true);
  }

  function startEdit(category: Category) {
    setEditing(category);
    setName(category.name);
    setImage(null);
    setError("");
    setOpen(true);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError(t("Category name is required"));
      return;
    }
    if (image && !image.type.startsWith("image/")) {
      setError(t("Choose an image file"));
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await categoryApi.update(editing.id, cleanName, image ?? undefined);
      } else {
        await categoryApi.create(cleanName, image ?? undefined);
      }
      await loadCategories();
      setOpen(false);
      toast.success(t(editing ? "Category updated" : "Category created"));
    } catch {
      setError(t("Failed to save category"));
    } finally {
      setSaving(false);
    }
  }

  return <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
    <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{t("Catalog")}</p><h1 className="text-3xl font-semibold tracking-tight text-stone-950">{t("Manage categories")}</h1></div>
      <Button onClick={startCreate} className="rounded-full bg-stone-950 px-5 text-white hover:bg-stone-800"><Plus className="mr-2 h-4 w-4" />{t("Add category")}</Button>
    </header>
    {loading ? <p className="py-16 text-center text-stone-500">{t("Loading categories...")}</p> : loadError ? <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center"><p className="mb-4 text-stone-600">{t("Failed to load categories")}</p><Button variant="outline" onClick={() => void loadCategories()}>{t("Try again")}</Button></div> : categories.length === 0 ? <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-12 text-center text-stone-500">{t("No categories yet")}</div> :
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map((category) => <article key={category.id} className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-sm">
        <div className="relative aspect-[4/3] bg-[#f2eee8]">{category.categoryImage ? <Image src={category.categoryImage} alt={category.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /> : <div className="flex h-full flex-col items-center justify-center text-stone-400"><ImageOff className="h-8 w-8" /><span className="mt-2 text-sm">{t("No image yet")}</span></div>}</div>
        <div className="flex items-center justify-between gap-3 p-4"><h2 className="truncate text-lg font-semibold text-stone-950">{category.name}</h2><Button variant="outline" size="sm" onClick={() => startEdit(category)} aria-label={`${t("Edit category")}: ${category.name}`}><Pencil className="mr-2 h-4 w-4" />{t("Edit")}</Button></div>
      </article>)}</section>}
    <Dialog open={open} onOpenChange={(next) => { if (!saving) setOpen(next); }}>
      <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>{t(editing ? "Edit category" : "Add category")}</DialogTitle><DialogDescription>{t("Enter a name and optionally choose an image.")}</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-5">
          <div className="space-y-2"><Label htmlFor="category-name">{t("Category name")}</Label><Input id="category-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} required disabled={saving} autoFocus /></div>
          <div className="space-y-2"><Label htmlFor="category-image">{t("Category image")}</Label><Input id="category-image" type="file" accept="image/*" onChange={(event) => { setImage(event.target.files?.[0] ?? null); setError(""); }} disabled={saving} />{editing?.categoryImage && !image && <p className="text-xs text-stone-500">{t("Leave empty to keep the current image.")}</p>}</div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving}>{t("Cancel")}</Button><Button type="submit" disabled={saving} className="bg-stone-950 text-white hover:bg-stone-800">{saving ? t("Saving…") : t(editing ? "Save changes" : "Create category")}</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}
