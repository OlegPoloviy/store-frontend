"use client";

import axios from "axios";
import { createBrowserClient } from "@supabase/ssr";
import { getOrCreateAnonymousId } from "@/lib/util/anonymousId";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_DEPLOY_URL ||
  "http://localhost:3001";

export const httpClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(async (config) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Identify the client session even when user is not authorized.
  // Backend reads it from: @Headers('x-anonymous-id')
  const anonymousId = getOrCreateAnonymousId();
  if (anonymousId) {
    config.headers = config.headers ?? {};
    (config.headers as any)["x-anonymous-id"] = anonymousId;
  }

  if (config.data instanceof FormData) {
    config.headers = config.headers ?? {};
    delete (config.headers as any)["Content-Type"];
  }

  return config;
});
