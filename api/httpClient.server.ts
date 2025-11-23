import axios from "axios";
import { cookies } from "next/headers";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_DEPLOY_URL ||
  "http://localhost:3001";

export const httpClientServer = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Server-side interceptor to add auth token from cookies
httpClientServer.interceptors.request.use(async (config) => {
  try {
    const cookieStore = await cookies();

    // Get Supabase session from cookies
    const accessToken = cookieStore.get("sb-access-token")?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }

  return config;
});
