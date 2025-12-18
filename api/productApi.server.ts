import { httpClientServer } from "./httpClient.server";
import { Product } from "@/types/product.type";

export const productsApiServer = {
  getAll: async (): Promise<Product[]> => {
    const response = await httpClientServer.get("/products");
    console.log(response.data);

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
    const response = await httpClientServer.post("/favorites", {
      productId,
    });
    return response.data;
  },

  removeFromFavorites: async (productId: string): Promise<Product> => {
    const response = await httpClientServer.delete("/favorites", {
      data: { productId },
    });
    return response.data;
  },

  checkIfFavorite: async (productId: string): Promise<boolean> => {
    try {
      const response = await httpClientServer.get(`/favorites/${productId}`);
      return response.data.isFavorite;
    } catch (error) {
      return false;
    }
  },

  deleteProduct: async (productId: string): Promise<void> => {
    try {
      await httpClientServer.delete(`products/${productId}`);
    } catch (error) {
      console.error(error);
    }
  },
};
