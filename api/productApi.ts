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

  createProduct: async (formData: FormData): Promise<Product> => {
    const response = await httpClient.post("/products", formData);
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
