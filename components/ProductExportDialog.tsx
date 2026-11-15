"use client";

import { Download } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { productsApi, type ProductExportFormat } from "@/lib/api/productApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProductExportDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ProductExportFormat>("xlsx");
  const [pending, setPending] = useState(false);

  async function download(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      const file = await productsApi.exportProducts(format);
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = "products." + format;
      document.body.append(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
      setOpen(false);
    } catch (error) {
      toast.error(t(error instanceof Error ? error.message : "The product export failed."));
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !pending && setOpen(nextOpen)}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full px-5">
          <Download />
          {t("Export products")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] rounded-2xl sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("Export products")}</DialogTitle>
          <DialogDescription>
            {t("Download the full catalog, including unpublished products.")}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={(event) => void download(event)}>
          <div className="space-y-2">
            <label htmlFor="product-export-format" className="text-sm font-medium">
              {t("File format")}
            </label>
            <select
              id="product-export-format"
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={format}
              disabled={pending}
              onChange={(event) => setFormat(event.target.value as ProductExportFormat)}
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? t("Preparing download…") : t("Download")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
