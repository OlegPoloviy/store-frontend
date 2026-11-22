import { isAxiosError } from "axios";
import { httpClient } from "./httpClient";
import { Product } from "@/types/product.type";
import { z } from "zod";
import { getBrowserSession } from "@/lib/supabase.client";

const importIssueSchema = z.object({
  row: z.number().int().positive(),
  sku: z.string().optional(),
  message: z.string(),
});

const convertedAmountSchema = z.object({
  amount: z.string(),
  originalAmount: z.string().nullable(),
  rate: z.string(),
});

const importReportSchema = z.object({
  total: z.number().int().nonnegative(),
  valid: z.number().int().nonnegative(),
  imported: z.number().int().nonnegative(),
  dryRun: z.boolean(),
  errors: z.array(importIssueSchema),
  warnings: z.array(importIssueSchema),
  preview: z.object({
    newCount: z.number().int().nonnegative(),
    updatedCount: z.number().int().nonnegative(),
    unchangedCount: z.number().int().nonnegative(),
    updates: z.array(z.object({
      row: z.number().int().positive(),
      sku: z.string().optional(),
      title: z.string(),
      changes: z.array(z.object({
        field: z.string(),
        before: z.union([z.string(), z.number(), z.boolean(), z.null()]),
        after: z.union([z.string(), z.number(), z.boolean(), z.null()]),
      })),
    })),
  }).optional(),
  conversion: z.object({
    count: z.number().int().positive(),
    token: z.string().optional(),
    rates: z.object({ date: z.string(), USD: z.string(), EUR: z.string() }),
    sample: z.array(z.object({
      row: z.number().int().positive(),
      sku: z.string().optional(),
      title: z.string(),
      baseAmount: z.string(),
      originalAmount: z.string().nullable(),
      prices: z.object({ USD: convertedAmountSchema, EUR: convertedAmountSchema }),
    })),
  }).optional(),
});

export type ProductImportReport = z.infer<typeof importReportSchema>;
const importProgressSchema = z.object({
  type: z.literal("progress"),
  phase: z.enum(["validating", "writing", "committing"]),
  processed: z.number().int().nonnegative(),
  total: z.number().int().positive(),
});
export type ProductImportProgress = z.infer<typeof importProgressSchema>;

const importEventSchema = z.discriminatedUnion("type", [
  importProgressSchema,
  z.object({ type: z.literal("report"), report: importReportSchema }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);

async function importProducts(
  body: FormData,
  query: URLSearchParams,
  onProgress: (progress: ProductImportProgress) => void,
  conversionToken?: string,
): Promise<ProductImportReport> {
  const session = await getBrowserSession();
  const headers = new Headers({
    Accept: "application/x-ndjson",
  });
  if (session?.access_token) headers.set("Authorization", `Bearer ${session.access_token}`);
  if (conversionToken) headers.set("X-Product-Conversion-Token", conversionToken);
  const response = await fetch(`/api/backend/products/import?${query}`, { method: "POST", headers, body });
  const contentType = response.headers.get("Content-Type") ?? "";
  if (!contentType.includes("application/x-ndjson") || !response.ok) {
    const data: unknown = await response.json().catch(() => null);
    if (response.ok || response.status === 422) {
      const report = importReportSchema.safeParse(data);
      if (report.success) return report.data;
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error("Sign in with an admin account to import products.");
    }
    if (response.status === 413) {
      throw new Error("The server rejected this upload as too large. Try a smaller batch.");
    }
    const message = z.object({ message: z.string() }).safeParse(data);
    throw new Error(message.success ? message.data.message : "The product import request failed.");
  }

  const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();
  if (!reader) throw new Error("The import ended before a result was received.");
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const lines = (buffer + value).split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const result = importEventSchema.safeParse(JSON.parse(line));
        if (!result.success) throw new Error("The product import request failed.");
        const event = result.data;
        if (event.type === "report") return event.report;
        if (event.type === "error") throw new Error(event.message);
        onProgress(event);
      }
    }
    throw new Error("The import ended before a result was received.");
  } finally {
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}

export type ProductExportFormat = "json" | "csv" | "xlsx";

async function exportProducts(format: ProductExportFormat): Promise<Blob> {
  try {
    const response = await httpClient.get<Blob>("/products/export", {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 422 && format === "xlsx") {
      throw new Error("The catalog exceeds Excel limits. Export as JSON or CSV.");
    }
    throw new Error("The product export failed.");
  }
}

export const productsApi = {
  exportProducts,
  getAll: async (): Promise<Product[]> => {
    const response = await httpClient.get("/products");
    console.log(response.data);
    return response.data;
  },

  getLatest: async (limit = 10): Promise<Product[]> => {
    const response = await httpClient.get("/products/latest", {
      params: { limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await httpClient.get(`/products/id/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await httpClient.get(`/products/category/${encodeURIComponent(category)}`);
    return response.data;
  },

  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await httpClient.post("/products", formData);
    return response.data;
  },

  importProducts,

  updateProduct: async (
    productId: string,
    formData: FormData
  ): Promise<Product> => {
    const response = await httpClient.patch(
      `/products/id/${productId}`,
      formData
    );
    return response.data;
  },

  getAllFavorites: async (): Promise<Product[]> => {
    const response = await httpClient.get("/favorites");
    return response.data;
  },

  addToFavorite: async (productId: string): Promise<Product> => {
    const response = await httpClient.post("/favorites", { productId });
    return response.data;
  },

  removeFromFavorites: async (productId: string): Promise<Product> => {
    const response = await httpClient.delete("/favorites", {
      data: { productId },
    });
    return response.data;
  },

  checkIfFavorite: async (productId: string): Promise<boolean> => {
    try {
      const response = await httpClient.get(`/favorites/status/${productId}`);
      return response.data.isFavorite;
    } catch (error) {
      return false;
    }
  },

  deleteProduct: async (productId: string): Promise<void> => {
    await httpClient.delete(`/products/id/${productId}`);
  },
};
