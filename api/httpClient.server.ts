import axios from "axios";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

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

    // Create Supabase client with proper cookie handling
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Get session from Supabase (reads from cookies automatically)
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error("Error getting auth token:", error);
  }

  return config;
});
