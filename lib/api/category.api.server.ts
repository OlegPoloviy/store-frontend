import {
  getServerApiErrorMessage,
  httpClientServer,
} from "./httpClient.server";
import { Category } from "@/types/category.type";

export const categoryApiServer = {
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await httpClientServer.get("/categories");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching categories on server:",
        getServerApiErrorMessage(error)
      );
      return [];
    }
  },
};
