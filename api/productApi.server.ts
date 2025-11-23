import { httpClientServer } from "./httpClient.server";
import { Product } from "@/types/product.type";

export const productsApiServer = {
  getAll: async (): Promise<Product[]> => {
    const response = await httpClientServer.get("/products");
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await httpClientServer.get(`/products/id/${id}`);
    return response.data;
  },

  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await httpClientServer.get(
      `/products/category/${category}`
    );
    return response.data;
  },
};
