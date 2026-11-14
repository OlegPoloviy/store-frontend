"use client";

import { isAxiosError } from "axios";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Input } from "@/components/ui/input";
import { productsApi, type ProductImportReport } from "@/lib/api/productApi";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_PRODUCTS = 500;
const FILE_TOO_LARGE = "The JSON file and request must fit within 5 MiB.";

export function ProductImportDialog({ onImported }: { onImported: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ProductImportReport | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"validate" | "import" | null>(null);

  const canImport = report?.dryRun && report.valid === report.total && !report.errors.length;

  function handleOpenChange(nextOpen: boolean) {
    if (pending) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setFile(null);
      setReport(null);
      setError("");
    }
  }

  async function submit(dryRun: boolean) {
    if (!file || pending || (!dryRun && !canImport)) return;
    setError("");
    setReport(null);
    setPending(dryRun ? "validate" : "import");

    try {
      let payload: unknown;
      try {
        const contents = new TextDecoder("utf-8", { fatal: true }).decode(await file.arrayBuffer());
        payload = JSON.parse(contents, (_key, value: unknown) => {
          if (typeof value === "number" && !Number.isFinite(value)) {
            throw new Error("Non-finite JSON number");
          }
          return value;
        });
      } catch {
        setError(t("Choose a valid UTF-8 JSON file with finite numbers."));
        return;
      }

      if (!payload || typeof payload !== "object" || !("products" in payload)) {
        setError(t("Use a JSON object containing a products array."));
        return;
      }

      const { products } = payload;
      if (!Array.isArray(products) || products.length < 1 || products.length > MAX_PRODUCTS) {
        setError(t("The products array must contain 1 to 500 entries."));
        return;
      }

      const body = JSON.stringify({ ...payload, dryRun });
      if (new TextEncoder().encode(body).byteLength > MAX_BYTES) {
        setError(t(FILE_TOO_LARGE));
        return;
      }

      const result = await productsApi.importProducts(body);
      setReport(result);
      if (!result.dryRun && result.imported > 0) onImported();
    } catch (err) {
      const response = isAxiosError<{ message?: unknown }>(err) ? err.response : undefined;
      if (response?.status === 401 || response?.status === 403) {
        setError(t("Sign in with an admin account to import products."));
      } else if (response?.status === 413) {
        setError(t("The server rejected this upload as too large. Try a smaller batch."));
      } else {
        const message = response?.data?.message;
        setError(typeof message === "string" ? message : t("The product import request failed."));
      }
    } finally {
      setPending(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full px-5">
          <Upload />
          {t("Batch import")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] gap-5 overflow-y-auto rounded-2xl sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("Batch import")}</DialogTitle>
          <DialogDescription>
            {t("Upload a UTF-8 JSON file with up to 500 products and a maximum size of 5 MiB.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="product-import-file" className="text-sm font-medium">
            {t("Product JSON file")}
          </label>
          <Input
            id="product-import-file"
            type="file"
            accept=".json,application/json"
            disabled={Boolean(pending)}
            onChange={(event) => {
              const selected = event.target.files?.[0] ?? null;
              const oversized = selected !== null && selected.size > MAX_BYTES;
              setFile(oversized ? null : selected);
              setError(oversized ? t(FILE_TOO_LARGE) : "");
              setReport(null);
              if (oversized) event.target.value = "";
            }}
          />
          <p className="text-sm text-stone-600">
            {t("Include format (catalog, horoshop or google-shopping), locale and products. Keep SKUs and GTINs as strings.")}
          </p>
        </div>

        {error && <p role="alert" className="break-words text-sm text-red-800">{error}</p>}

        {report && (
          <section aria-label={t("Import report")} className="min-w-0 space-y-4 rounded-xl border border-stone-200 p-4 text-sm">
            <div role="status">
              <h3 className="font-semibold">
                {report.errors.length
                  ? t("Fix the errors and validate a new file.")
                  : report.dryRun ? t("Validation complete") : t("Import complete")}
              </h3>
              <p className="mt-1 text-stone-600">
                {t("{{total}} total · {{valid}} valid · {{imported}} imported", report)}
              </p>
            </div>
            <ImportIssues label={t("Errors")} issues={report.errors} className="text-red-800" />
            <ImportIssues label={t("Warnings")} issues={report.warnings} className="text-amber-900" />
            {canImport && (
              <p className="text-stone-600">{t("Importing updates existing products with matching SKUs.")}</p>
            )}
          </section>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" disabled={!file || Boolean(pending)} onClick={() => void submit(true)}>
            {pending === "validate" ? t("Validating…") : t("Validate file")}
          </Button>
          <Button type="button" disabled={!canImport || Boolean(pending)} onClick={() => void submit(false)}>
            {pending === "import" ? t("Importing…") : t("Import batch")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImportIssues({ label, issues, className }: {
  label: string;
  issues: ProductImportReport["errors"];
  className: string;
}) {
  const { t } = useTranslation();
  if (!issues.length) return null;

  return (
    <div className={className}>
      <h4 className="font-semibold">{label} ({issues.length})</h4>
      <ul className="mt-1 space-y-1 break-words">
        {issues.map(({ row, sku, message }, index) => (
          <li key={`${row}-${index}`}>
            <span className="font-medium">{t("Row {{row}}", { row })}{sku && ` (${sku})`}</span>
            {` · ${message}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
