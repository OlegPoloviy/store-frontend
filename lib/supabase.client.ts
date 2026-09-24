import { createBrowserClient } from "@supabase/ssr";
import type { Session } from "@supabase/supabase-js";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { autoRefreshToken: false } }
);

let sessionRequest: Promise<Session | null> | null = null;

export function getBrowserSession(): Promise<Session | null> {
  sessionRequest ??= supabase.auth.getSession().then(({ data, error }) => {
    if (error) throw error;
    return data.session;
  }).finally(() => { sessionRequest = null; });
  return sessionRequest;
}
