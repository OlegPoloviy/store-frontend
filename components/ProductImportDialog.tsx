"use client";

import { Check, Database, FileCheck, PackagePlus, Upload } from "lucide-react";
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
import { productsApi, type ProductImportProgress, type ProductImportReport } from "@/lib/api/productApi";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_PRODUCTS = 500;
const FILE_TOO_LARGE = "The JSON file and request must fit within 5 MiB.";
const IMPORT_STEPS = [
  { phase: "validating", label: "Validate", icon: FileCheck },
  { phase: "writing", label: "Prepare products", icon: PackagePlus },
  { phase: "committing", label: "Save batch", icon: Database },
] as const;

export function ProductImportDialog({ onImported }: { onImported: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ProductImportReport | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"validate" | "import" | null>(null);
  const [progress, setProgress] = useState<ProductImportProgress | null>(null);

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
    if (dryRun) setReport(null);
    setProgress(null);
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

      const result = await productsApi.importProducts(body, setProgress);
      setReport(result);
      if (!result.dryRun && result.imported > 0) onImported();
    } catch (err) {
      setError(t(err instanceof Error ? err.message : "The product import request failed."));
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

        {pending && (
          <ImportProgress progress={progress} validationOnly={pending === "validate"} />
        )}

        {report && !pending && (
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

function ImportProgress({ progress, validationOnly }: {
  progress: ProductImportProgress | null;
  validationOnly: boolean;
}) {
  const { t } = useTranslation();
  const steps = validationOnly ? IMPORT_STEPS.slice(0, 1) : IMPORT_STEPS;
  const activeIndex = steps.findIndex(({ phase }) => phase === progress?.phase);
  const Icon = steps[activeIndex]?.icon ?? Upload;
  const detail = progress && progress.phase !== "committing" ? progress : null;
  const fraction = detail ? Math.min(detail.processed / detail.total, 1) : null;
  const status = !progress
    ? t("Preparing import request…")
    : progress.phase === "committing"
      ? t("Committing the batch…")
      : t(progress.phase === "validating" ? "Validating products…" : "Preparing products…");
  const count = detail ? t("{{processed}} of {{total}} products", detail) : null;

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-card p-4 text-card-foreground dark:from-emerald-950/45 sm:p-5">
      <div className="flex items-center gap-4">
        <div
          role="progressbar"
          aria-labelledby="product-import-status"
          aria-valuemin={detail ? 0 : undefined}
          aria-valuemax={detail?.total}
          aria-valuenow={detail ? Math.min(detail.processed, detail.total) : undefined}
          aria-valuetext={count ?? undefined}
          className="relative grid size-16 shrink-0 place-items-center text-emerald-700 dark:text-emerald-300"
        >
          <div
            aria-hidden="true"
            className={`absolute inset-0 rounded-full bg-muted ${fraction === null ? "border-[3px] border-transparent border-t-current border-r-current motion-safe:animate-spin" : ""}`}
            style={fraction === null ? undefined : {
              backgroundImage: `conic-gradient(currentColor ${fraction}turn, transparent 0turn)`,
            }}
          />
          <div className="relative grid size-14 place-items-center rounded-full bg-card">
            <Icon aria-hidden="true" className="size-6" />
          </div>
        </div>
        <div className="min-w-0">
          <p id="product-import-status" role="status" className="text-sm font-semibold">{status}</p>
          {count && <p className="mt-1 text-sm text-muted-foreground tabular-nums">{count}</p>}
        </div>
      </div>

      {!validationOnly && (
        <ol className="grid grid-cols-3 gap-2 border-t border-border/70 pt-3">
          {steps.map(({ phase, label, icon: StepIcon }, index) => {
            const complete = index < activeIndex;
            const active = index === activeIndex;
            return (
              <li
                key={phase}
                aria-current={active ? "step" : undefined}
                className={`flex min-w-0 flex-col items-center gap-1.5 rounded-lg px-1 py-2 text-center text-xs leading-tight sm:flex-row sm:px-2 sm:text-left ${active ? "bg-emerald-100 font-semibold text-emerald-950 dark:bg-emerald-900/60 dark:text-emerald-100" : "text-muted-foreground"}`}
              >
                {complete
                  ? <Check aria-hidden="true" className="size-4 shrink-0 text-emerald-700 dark:text-emerald-300" />
                  : <StepIcon aria-hidden="true" className="size-4 shrink-0" />}
                <span>{t(label)}{complete && <span className="sr-only"> ({t("Complete")})</span>}</span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
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
      <ul className="mt-1 max-h-44 space-y-1 overflow-y-auto break-words">
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
