"use client";

import axios from "axios";
import { getBrowserSession } from "@/lib/supabase.client";

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
  const session = await getBrowserSession();

  const token = session?.access_token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    config.headers = config.headers ?? {};
    config.headers.delete("Content-Type");
  }

  return config;
});
