import { Product } from "@/types/product.type";
import { httpClient } from "./httpClient";
import { Collection, CollectionItem } from "@/types/collection.type";

export const collectionApi = {
  createCollection: async (collectionInput: {
    name: string;
    isPrivate: boolean;
  }): Promise<Collection> => {
    const response = await httpClient.post("/collections", collectionInput);
    return response.data;
  },

  getCollections: async (): Promise<Collection[]> => {
    const response = await httpClient.get("/collections");
    return response.data;
  },

  addToCollection: async (
    collectionId: string,
    itemId: string
  ): Promise<void> => {
    const response = await httpClient.post("/collections/item", {
      collectionId,
      itemId,
    });
  },

  getItemsByCollection: async (collectionId: string): Promise<Product[]> => {
    const response = await httpClient.get<CollectionItem[]>(
      `/collections/${collectionId}/items`
    );
    // Витягуємо продукти з CollectionItem
    return response.data.map((item) => item.product);
  },
};
