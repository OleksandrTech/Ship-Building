import { createBrowserClient } from "@supabase/ssr";
import { assertSupabaseEnv, SUPABASE_ANON_KEY, SUPABASE_URL } from "./env";

export function createSupabaseBrowserClient() {
  assertSupabaseEnv();
  return createBrowserClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}

