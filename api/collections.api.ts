import { httpClient } from "./httpClient";
import { Collection } from "@/types/collection.type";

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
};
