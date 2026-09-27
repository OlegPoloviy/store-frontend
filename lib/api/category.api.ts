import { httpClient } from "./httpClient";
import { Category } from "@/types/category.type";

function categoryPayload(name: string, image?: File): { name: string } | FormData {
  if (!image) return { name };
  const form = new FormData();
  form.append("name", name);
  form.append("categoryImage", image);
  return form;
}

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await httpClient.get("/categories");
    return response.data;
  },
  create: async (name: string, image?: File): Promise<Category> => {
    const response = await httpClient.post("/categories", categoryPayload(name, image));
    return response.data;
  },
  update: async (id: string, name: string, image?: File): Promise<Category> => {
    const response = await httpClient.patch(`/categories/${encodeURIComponent(id)}`, categoryPayload(name, image));
    return response.data;
  },
};
