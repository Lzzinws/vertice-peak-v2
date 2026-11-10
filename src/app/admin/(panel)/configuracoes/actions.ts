"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { generalSettingsSchema } from "@/lib/schemas";
import { getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { removeStorageUrls, resolveImage, revalidateSite, saveSetting } from "@/lib/admin";
import type { Seo } from "@/lib/types";

export async function saveGeneral(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  // Valida primeiro (com as URLs atuais), para não enviar arquivos quando o formulário está inválido.
  const parsed = generalSettingsSchema.safeParse({
    branding: { logoUrl: getString(formData, "currentLogo"), faviconUrl: getString(formData, "currentFavicon") },
    contact: {
      whatsapp: getString(formData, "whatsapp"),
      email: getString(formData, "email"),
      phone: getString(formData, "phone"),
      address: getString(formData, "address"),
      hours: getString(formData, "hours"),
    },
    socials: {
      instagram: getString(formData, "instagram"),
      facebook: getString(formData, "facebook"),
      linkedin: getString(formData, "linkedin"),
      tiktok: getString(formData, "tiktok"),
      youtube: getString(formData, "youtube"),
    },
    seo: {
      siteTitle: getString(formData, "siteTitle"),
      siteDescription: getString(formData, "siteDescription"),
      keywords: getString(formData, "keywords"),
      ogImageUrl: getString(formData, "currentOgImage"),
    },
    footer: { text: getString(formData, "footerText"), copyright: getString(formData, "copyright") },
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));
  const data = parsed.data;

  const supabase = await createSupabaseServerClient();
  try {
    const logoUrl = await resolveImage(supabase, formData, {
      fileKey: "logoFile", currentKey: "currentLogo", removeKey: "removeLogo", folder: "brand", allowSvg: true,
    });
    const faviconUrl = await resolveImage(supabase, formData, {
      fileKey: "faviconFile", currentKey: "currentFavicon", removeKey: "removeFavicon", folder: "brand", allowSvg: true,
    });
    const ogImageUrl = await resolveImage(supabase, formData, {
      fileKey: "ogFile", currentKey: "currentOgImage", removeKey: "removeOgImage", folder: "brand",
    });

    const previous = [getString(formData, "currentLogo"), getString(formData, "currentFavicon"), getString(formData, "currentOgImage")];
    const replaced = [
      previous[0] !== logoUrl ? previous[0] : null,
      previous[1] !== faviconUrl ? previous[1] : null,
      previous[2] !== ogImageUrl ? previous[2] : null,
    ];

    const seo: Seo = { ...data.seo, ogImageUrl };
    await saveSetting(supabase, "branding", { logoUrl, faviconUrl });
    await saveSetting(supabase, "contact", data.contact);
    await saveSetting(supabase, "socials", data.socials);
    await saveSetting(supabase, "seo", seo);
    await saveSetting(supabase, "footer", data.footer);

    await removeStorageUrls(supabase, replaced);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível salvar.", values: undefined };
  }

  revalidateSite();
  return { ok: true, message: "Configurações salvas. O site público já foi atualizado." };
}
