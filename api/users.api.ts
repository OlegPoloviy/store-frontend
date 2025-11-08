import { httpClient } from "./httpClient";

export const userApi = {
  getAll: async () => {
    const users = await httpClient.get("/user");
    return users;
  },

  deleteUser: async (userId: string) => {
    await httpClient.delete("/user/delete", {
      data: {
        userId,
      },
    });
  },
};
