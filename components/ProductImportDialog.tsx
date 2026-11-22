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
const FILE_TOO_LARGE = "The file must fit within 5 MiB.";
const CATALOG_CSV = "sku,title,description,price,currency,category,images\r\nKM-001,Oak bench,Made from oak.,179.90,EUR,Benches,https://example.com/bench.jpg\r\n";
const IMPORT_STEPS = [
  { phase: "validating", label: "Validate", icon: FileCheck },
  { phase: "writing", label: "Prepare products", icon: PackagePlus },
  { phase: "committing", label: "Save batch", icon: Database },
] as const;

export function ProductImportDialog({ onImported }: { onImported: () => void }) {
  const { t, i18n } = useTranslation();
  const [convertCurrency, setConvertCurrency] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("auto");
  const [locale, setLocale] = useState("en-GB");
  const [report, setReport] = useState<ProductImportReport | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"validate" | "import" | null>(null);
  const [progress, setProgress] = useState<ProductImportProgress | null>(null);

  const isJson = file?.name.toLowerCase().endsWith(".json");
  const canValidate = Boolean(file && (isJson || locale.trim()));
  const canImport = report?.dryRun && report.valid === report.total && !report.errors.length;

  function handleOpenChange(nextOpen: boolean) {
    if (pending) return;
    setOpen(nextOpen);
    if (!nextOpen) {
      setFile(null);
      setConvertCurrency(false);
      setReport(null);
      setError("");
    }
  }

  async function submit(dryRun: boolean) {
    if (!file || !canValidate || pending || (!dryRun && !canImport)) return;
    setError("");
    if (dryRun) setReport(null);
    setProgress(null);
    setPending(dryRun ? "validate" : "import");

    try {
      const form = new FormData();
      form.set("file", file);
      const query = new URLSearchParams({ dryRun: String(dryRun) });
      if (!isJson) {
        query.set("format", format);
        query.set("locale", locale.trim());
      }
      if (convertCurrency) query.set("convertCurrency", "true");
      const result = await productsApi.importProducts(
        form, query, setProgress, dryRun ? undefined : report?.conversion?.token
      );
      setReport(result);
      if (!result.dryRun && result.imported > 0) onImported();
    } catch (err) {
      if (convertCurrency) setReport(null);
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
            {t("Upload Excel (.xlsx), CSV, TSV, XML or JSON. Each file can contain up to 500 products and be up to 5 MiB.")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label htmlFor="product-import-file" className="text-sm font-medium">
            {t("Product file")}
          </label>
          <Input
            id="product-import-file"
            type="file"
            accept=".xlsx,.csv,.tsv,.xml,.json"
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
            {t("For spreadsheets, use the first row for column names. Format SKUs and GTINs as text to preserve leading zeroes.")}
          </p>
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(CATALOG_CSV)}`}
            download="products-template.csv"
            className="inline-block text-sm font-medium underline underline-offset-4"
          >
            {t("Download CSV template")}
          </a>
        </div>

        {file && !isJson && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="product-import-format" className="text-sm font-medium">
                {t("Catalog format")}
              </label>
              <select
                id="product-import-format"
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs"
                value={format}
                disabled={Boolean(pending)}
                onChange={(event) => {
                  setFormat(event.target.value);
                  setReport(null);
                  setError("");
                }}
              >
                <option value="auto">{t("Detect automatically")}</option>
                <option value="catalog">{t("Catalog")}</option>
                <option value="horoshop">Horoshop</option>
                <option value="google-shopping">Google Shopping</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="product-import-locale" className="text-sm font-medium">
                {t("Product language")}
              </label>
              <Input
                id="product-import-locale"
                placeholder="uk, en-GB, de"
                value={locale}
                required
                disabled={Boolean(pending)}
                onChange={(event) => {
                  setLocale(event.target.value);
                  setReport(null);
                  setError("");
                }}
              />
            </div>
          </div>
        )}

        {file && (
          <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
            <input
              type="checkbox"
              checked={convertCurrency}
              disabled={Boolean(pending)}
              className="mt-0.5 size-4 shrink-0 accent-emerald-700"
              onChange={(event) => {
                setConvertCurrency(event.target.checked);
                setReport(null);
                setError("");
              }}
            />
            <span>
              <span className="block font-medium">{t("Add USD and EUR prices for UAH products")}</span>
              <span className="mt-1 block text-muted-foreground">{t("Uses the official NBU rate. The UAH price remains the checkout price.")}</span>
            </span>
          </label>
        )}

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
            {report.preview && <CatalogPreview preview={report.preview} />}
            {report.conversion && <CurrencyPreview conversion={report.conversion} locale={i18n.language} />}
            {convertCurrency && report.valid === report.total && !report.conversion && (
              <p className="text-muted-foreground">{t("The file has no UAH products to convert.")}</p>
            )}
            <ImportIssues label={t("Errors")} issues={report.errors} className="text-red-800" />
            <ImportIssues label={t("Warnings")} issues={report.warnings} className="text-amber-900" />
            {canImport && (
              <p className="text-stone-600">{t("Importing updates existing products with matching SKUs.")}</p>
            )}
          </section>
        )}

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" disabled={!canValidate || Boolean(pending)} onClick={() => void submit(true)}>
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

const fieldLabels: Record<string, string> = {
  price: "Price",
  originalPrice: "Original price",
  availability: "Availability",
  isPublished: "Published",
  isMadeToOrder: "Made to order",
  convertedPrices: "Converted USD/EUR prices",
  images: "Images",
  translations: "Translations",
};

const availabilityLabels: Record<string, string> = {
  IN_STOCK: "In stock",
  OUT_OF_STOCK: "Out of stock",
  PREORDER: "Preorder",
  BACKORDER: "Backorder",
};

function CatalogPreview({ preview }: {
  preview: NonNullable<ProductImportReport["preview"]>;
}) {
  const { t, i18n } = useTranslation();
  const stats = [
    ["New products", preview.newCount],
    ["Updated products", preview.updatedCount],
    ["Unchanged products", preview.unchangedCount],
  ] as const;
  const formatValue = (value: string | number | boolean | null, field: string) => {
    if (value === null) return "—";
    if (typeof value === "boolean") return t(value ? "Yes" : "No");
    if (field === "availability") return t(availabilityLabels[value] ?? String(value));
    return String(value);
  };

  return (
    <>
      <dl className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-3">
        {stats.map(([label, count]) => (
          <div key={label} className="min-w-0">
            <dt className="break-words text-xs text-muted-foreground">{t(label)}</dt>
            <dd className="mt-1 text-lg font-semibold tabular-nums">{count.toLocaleString(i18n.language)}</dd>
          </div>
        ))}
      </dl>
      {preview.updates.length > 0 && (
        <details className="rounded-lg border border-border p-3">
          <summary className="cursor-pointer font-medium">{t("Changes by product")}</summary>
          <ol className="mt-2 max-h-64 divide-y divide-border overflow-y-auto pr-2">
            {preview.updates.map(({ row, sku, title, changes }) => (
              <li key={row} className="space-y-1.5 py-2 first:pt-0">
                <p className="break-words font-medium">
                  {title} <span className="font-normal text-muted-foreground">· {t("Row {{row}}", { row })}{sku && ` · ${sku}`}</span>
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {changes.map(({ field, before, after }) => {
                    const label = fieldLabels[field] ?? field.replace(/([A-Z])/g, " $1").replace(/^./, (first) => first.toUpperCase());
                    return (
                      <li key={field} className="break-words">
                        {before === null && after === null ? t("{{field}} changed", { field: t(label) }) : (
                          <>
                            <span className="font-medium text-foreground">{t(label)}</span>
                            <span>{` · ${formatValue(before, field)} → ${formatValue(after, field)}`}</span>
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}

function CurrencyPreview({ conversion, locale }: {
  conversion: NonNullable<ProductImportReport["conversion"]>;
  locale: string;
}) {
  const { t } = useTranslation();
  const rateDate = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeZone: "UTC" })
    .format(new Date(conversion.rates.date));
  const formatPrice = (amount: string, currency: "UAH" | "USD" | "EUR") =>
    new Intl.NumberFormat(locale, { style: "currency", currency }).format(Number(amount));

  return (
    <section aria-label={t("Currency conversion")} className="space-y-2 rounded-lg bg-muted/60 p-3">
      <p className="font-medium">{t("Currency conversion")}</p>
      <p className="text-muted-foreground">
        {t("NBU rate on {{date}} · {{count}} UAH products", { date: rateDate, count: conversion.count })}
      </p>
      <p className="text-muted-foreground tabular-nums">
        1 USD = {conversion.rates.USD} UAH · 1 EUR = {conversion.rates.EUR} UAH
      </p>
      <ul className="divide-y divide-border">
        {conversion.sample.map(({ row, title, baseAmount, originalAmount, prices }) => (
          <li key={row} className="space-y-1 py-2">
            <p className="break-words font-medium">{title}</p>
            <p className="flex flex-wrap gap-x-2 tabular-nums">
              <span>{formatPrice(baseAmount, "UAH")}</span>
              <span aria-hidden="true">→</span>
              <span>{formatPrice(prices.USD.amount, "USD")}</span>
              <span>·</span>
              <span>{formatPrice(prices.EUR.amount, "EUR")}</span>
            </p>
            {originalAmount && prices.USD.originalAmount && prices.EUR.originalAmount && (
              <p className="text-xs text-muted-foreground tabular-nums">
                {t("Original price")}: {formatPrice(originalAmount, "UAH")} → {formatPrice(prices.USD.originalAmount, "USD")} · {formatPrice(prices.EUR.originalAmount, "EUR")}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
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
