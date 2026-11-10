import "server-only";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBoolean, getFile, getString } from "@/lib/action-state";
import { MEDIA_BUCKET, uploadImage } from "@/lib/storage";

/** Invalida o cache de todo o site público. Chamado após cada alteração no painel. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/**
 * Resolve o valor de uma imagem de um formulário:
 * arquivo novo → envia e usa a nova URL; "remover" → vazio; senão mantém a atual.
 */
export async function resolveImage(
  supabase: SupabaseClient,
  formData: FormData,
  options: { fileKey: string; currentKey: string; removeKey: string; folder: string; allowSvg?: boolean },
): Promise<string> {
  const file = getFile(formData, options.fileKey);
  if (file) return uploadImage(supabase, file, options.folder, { allowSvg: options.allowSvg });
  if (getBoolean(formData, options.removeKey)) return "";
  return getString(formData, options.currentKey);
}

/** Remove do Storage os arquivos que deixaram de ser usados. Falhas são registradas, não bloqueiam. */
export async function removeStorageUrls(supabase: SupabaseClient, urls: (string | null | undefined)[]) {
  const marker = `/storage/v1/object/public/${MEDIA_BUCKET}/`;
  const paths = urls
    .filter((u): u is string => Boolean(u) && u!.includes(marker))
    .map((u) => decodeURIComponent(u.slice(u.indexOf(marker) + marker.length)));
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.error("[storage] falha ao remover arquivos antigos:", error.message);
}

/** Grava uma seção de configurações (chave/valor em site_settings). */
export async function saveSetting(supabase: SupabaseClient, key: string, value: unknown) {
  const { error } = await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error("Não foi possível salvar. Verifique sua permissão e tente novamente.");
}
