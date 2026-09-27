"use client";

import axios from "axios";
import { getBrowserSession } from "@/lib/supabase.client";

export const storeClient = axios.create({ baseURL: "/api/store" });
let sessionRequest: Promise<void> | null = null;
let guestSessionReady = false;

storeClient.interceptors.request.use(async (config) => {
  const session = await getBrowserSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  } else if (config.url !== "/cart/session" && !guestSessionReady) {
    sessionRequest ??= axios.post("/api/store/cart/session").then(() => undefined).finally(() => {
      sessionRequest = null;
    });
    await sessionRequest;
    guestSessionReady = true;
  }
  return config;
});
