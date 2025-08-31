import { httpClient } from "./httpClient";
import { Product } from "@/types/product.type";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await httpClient.get("/products");
    return response.data;
  },
};
