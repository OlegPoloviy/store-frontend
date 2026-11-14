import { httpClient } from "./httpClient";
import { Product } from "@/types/product.type";
import { z } from "zod";

const importIssueSchema = z.object({
  row: z.number().int().positive(),
  sku: z.string().optional(),
  message: z.string(),
});

const importReportSchema = z.object({
  total: z.number().int().nonnegative(),
  valid: z.number().int().nonnegative(),
  imported: z.number().int().nonnegative(),
  dryRun: z.boolean(),
  errors: z.array(importIssueSchema),
  warnings: z.array(importIssueSchema),
});

export type ProductImportReport = z.infer<typeof importReportSchema>;

export const productsApi = {
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
    const response = await httpClient.get(`/products/category/${category}`);
    return response.data;
  },

  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await httpClient.post("/products", formData);
    return response.data;
  },

  importProducts: async (body: string): Promise<ProductImportReport> => {
    const response = await httpClient.post<unknown>("/products/import", body, {
      headers: { "Content-Type": "application/json" },
      validateStatus: (status) => (status >= 200 && status < 300) || status === 422,
    });
    return importReportSchema.parse(response.data);
  },

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
    try {
      await httpClient.delete(`products/${productId}`);
    } catch (error) {
      console.error(error);
    }
  },
};
