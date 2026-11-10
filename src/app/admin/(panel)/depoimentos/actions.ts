"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/schemas";
import { getBoolean, getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { removeStorageUrls, resolveImage, revalidateSite } from "@/lib/admin";

async function saveTestimonial(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse({
    clientName: getString(formData, "clientName"),
    company: getString(formData, "company"),
    quote: getString(formData, "quote"),
    published: getBoolean(formData, "published"),
    sortOrder: getString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));

  const supabase = await createSupabaseServerClient();
  const previous = getString(formData, "currentPhoto") || null;
  let photoUrl: string;
  try {
    photoUrl = await resolveImage(supabase, formData, {
      fileKey: "photoFile",
      currentKey: "currentPhoto",
      removeKey: "removePhoto",
      folder: "testimonials",
    });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível enviar a foto.", values: undefined };
  }

  const row = {
    client_name: parsed.data.clientName,
    company: parsed.data.company || null,
    quote: parsed.data.quote,
    published: parsed.data.published,
    sort_order: parsed.data.sortOrder,
    photo_url: photoUrl || null,
  };
  const { error } = id
    ? await supabase.from("testimonials").update(row).eq("id", id)
    : await supabase.from("testimonials").insert(row);
  if (error) {
    console.error("[depoimentos] erro ao salvar:", error.message);
    return { ok: false, message: "Não foi possível salvar o depoimento. Tente novamente." };
  }

  if (previous && previous !== photoUrl) await removeStorageUrls(supabase, [previous]);
  revalidateSite();
  redirect(`/admin/depoimentos?saved=${id ? "atualizado" : "criado"}`);
}

export async function createTestimonial(prev: ActionState, formData: FormData) {
  return saveTestimonial(null, prev, formData);
}

export async function updateTestimonial(id: string, prev: ActionState, formData: FormData) {
  return saveTestimonial(id, prev, formData);
}

export async function deleteTestimonial(id: string, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: current } = await supabase.from("testimonials").select("photo_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o depoimento.");
  await removeStorageUrls(supabase, [current?.photo_url]);
  revalidateSite();
  redirect("/admin/depoimentos?saved=excluido");
}

export async function setTestimonialPublished(id: string, published: boolean, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar o depoimento.");
  revalidateSite();
  redirect("/admin/depoimentos?saved=atualizado");
}
