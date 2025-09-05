import { httpClient } from "./httpClient";
import { Product } from "@/types/product.type";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await httpClient.get("/products");
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
};
