/** Regras de upload (puras, sem dependência de servidor). Usadas no servidor e testadas em tests/. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const RASTER_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
// SVG só é aceito em logo e favicon; nunca em galerias, para reduzir superfície de ataque.
export const BRAND_TYPES: Record<string, string> = { "image/svg+xml": "svg" };

/** Valida tipo e tamanho. Retorna mensagem de erro ou null. */
export function validateImage(file: { type: string; size: number }, options: { allowSvg?: boolean } = {}): string | null {
  const allowed = options.allowSvg ? { ...RASTER_TYPES, ...BRAND_TYPES } : RASTER_TYPES;
  if (!allowed[file.type]) {
    return options.allowSvg
      ? "Envie uma imagem JPG, PNG, WebP, AVIF ou SVG."
      : "Envie uma imagem JPG, PNG, WebP ou AVIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) return "A imagem deve ter no máximo 5 MB.";
  return null;
}

export function extensionFor(type: string): string | undefined {
  return RASTER_TYPES[type] ?? BRAND_TYPES[type];
}
