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

  addToFavorite: async (productId: string): Promise<Product> => {
    const response = await httpClientServer.post("/products/favorite", {
      productId,
    });
    return response.data;
  },

  removeFromFavorites: async (productId: string): Promise<Product> => {
    const response = await httpClientServer.delete("/products/favorite", {
      data: { productId },
    });
    return response.data;
  },

  checkIfFavorite: async (productId: string): Promise<boolean> => {
    try {
      const response = await httpClientServer.get(
        `/products/favorite/${productId}`
      );
      return response.data.isFavorite;
    } catch (error) {
      return false;
    }
  },
};
