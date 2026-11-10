"use server";

import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { aboutSettingsSchema, homeSettingsSchema } from "@/lib/schemas";
import { getBoolean, getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { removeStorageUrls, resolveImage, revalidateSite, saveSetting } from "@/lib/admin";
import { splitLines } from "@/lib/format";

const OK_MESSAGE = "Alterações salvas. O site público já foi atualizado.";

export async function saveHome(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = homeSettingsSchema.safeParse({
    eyebrow: getString(formData, "eyebrow"),
    heroTitle: getString(formData, "heroTitle"),
    heroHighlight: getString(formData, "heroHighlight"),
    heroSubtitle: getString(formData, "heroSubtitle"),
    positioning: getString(formData, "positioning"),
    primaryCta: getString(formData, "primaryCta"),
    secondaryCta: getString(formData, "secondaryCta"),
    servicesHeading: getString(formData, "servicesHeading"),
    servicesSubtitle: getString(formData, "servicesSubtitle"),
    portfolioHeading: getString(formData, "portfolioHeading"),
    portfolioSubtitle: getString(formData, "portfolioSubtitle"),
    ctaTitle: getString(formData, "ctaTitle"),
    ctaText: getString(formData, "ctaText"),
    bannerEnabled: getBoolean(formData, "bannerEnabled"),
    bannerTitle: getString(formData, "bannerTitle"),
    bannerText: getString(formData, "bannerText"),
    bannerLinkLabel: getString(formData, "bannerLinkLabel"),
    bannerLinkUrl: getString(formData, "bannerLinkUrl"),
    bannerImageUrl: getString(formData, "currentBannerImage"),
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));

  const supabase = await createSupabaseServerClient();
  const previous = getString(formData, "currentBannerImage") || null;
  try {
    const bannerImageUrl = await resolveImage(supabase, formData, {
      fileKey: "bannerFile",
      currentKey: "currentBannerImage",
      removeKey: "removeBannerImage",
      folder: "banners",
    });
    await saveSetting(supabase, "home", { ...parsed.data, bannerImageUrl });
    if (previous && previous !== bannerImageUrl) await removeStorageUrls(supabase, [previous]);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível salvar.", values: undefined };
  }

  revalidateSite();
  return { ok: true, message: OK_MESSAGE };
}

export async function saveAbout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = aboutSettingsSchema.safeParse({
    heading: getString(formData, "heading"),
    history: getString(formData, "history"),
    purposeHeading: getString(formData, "purposeHeading"),
    purpose: getString(formData, "purpose"),
    differentials: splitLines(getString(formData, "differentials")),
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));

  try {
    const supabase = await createSupabaseServerClient();
    await saveSetting(supabase, "about", parsed.data);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível salvar.", values: undefined };
  }
  revalidateSite();
  return { ok: true, message: OK_MESSAGE };
}
