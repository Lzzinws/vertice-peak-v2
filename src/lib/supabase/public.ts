import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/env";

/**
 * Cliente público, sem sessão nem cookies. Só enxerga o que o RLS libera para visitantes
 * (conteúdo publicado e inserção de leads). Nunca lê contatos.
 */
let cached: SupabaseClient | null | undefined;

export function createPublicSupabaseClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const config = getSupabaseConfig();
  cached = config
    ? createClient(config.url, config.anonKey, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      })
    : null;
  return cached;
}
