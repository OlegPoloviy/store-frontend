"use client";

import axios from "axios";
import { getBrowserSession } from "@/lib/supabase.client";

export const httpClient = axios.create({
  baseURL: "/api/backend",
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
