import { httpClient } from "./httpClient";
import { Category } from "@/types/category.type";

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await httpClient.get("/categories");
    return response.data;
  },
};
