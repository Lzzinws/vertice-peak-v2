import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { extensionFor, validateImage } from "@/lib/upload-rules";

export const MEDIA_BUCKET = "media";

export { validateImage, MAX_IMAGE_BYTES } from "@/lib/upload-rules";

/** Envia o arquivo para o bucket público `media` usando a sessão do admin (RLS valida). */
export async function uploadImage(
  supabase: SupabaseClient,
  file: File,
  folder: string,
  options: { allowSvg?: boolean } = {},
): Promise<string> {
  const error = validateImage(file, options);
  if (error) throw new Error(error);

  const ext = extensionFor(file.type);
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "");
  const path = `${safeFolder}/${randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage.from(MEDIA_BUCKET).upload(path, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) throw new Error("Não foi possível enviar a imagem. Tente novamente.");

  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}
