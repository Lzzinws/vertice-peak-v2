"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { serviceSchema } from "@/lib/schemas";
import { getBoolean, getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { removeStorageUrls, resolveImage, revalidateSite } from "@/lib/admin";

async function saveService(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse({
    title: getString(formData, "title"),
    description: getString(formData, "description"),
    icon: getString(formData, "icon"),
    published: getBoolean(formData, "published"),
    sortOrder: getString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));

  const supabase = await createSupabaseServerClient();
  const previous = getString(formData, "currentImage") || null;
  let imageUrl: string;
  try {
    imageUrl = await resolveImage(supabase, formData, {
      fileKey: "imageFile",
      currentKey: "currentImage",
      removeKey: "removeImage",
      folder: "services",
    });
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível enviar a imagem.", values: undefined };
  }

  const row = {
    title: parsed.data.title,
    description: parsed.data.description,
    icon: parsed.data.icon,
    published: parsed.data.published,
    sort_order: parsed.data.sortOrder,
    image_url: imageUrl || null,
  };
  const { error } = id
    ? await supabase.from("services").update(row).eq("id", id)
    : await supabase.from("services").insert(row);
  if (error) {
    console.error("[servicos] erro ao salvar:", error.message);
    return { ok: false, message: "Não foi possível salvar o serviço. Tente novamente." };
  }

  if (previous && previous !== imageUrl) await removeStorageUrls(supabase, [previous]);
  revalidateSite();
  redirect(`/admin/servicos?saved=${id ? "atualizado" : "criado"}`);
}

export async function createService(prev: ActionState, formData: FormData) {
  return saveService(null, prev, formData);
}

export async function updateService(id: string, prev: ActionState, formData: FormData) {
  return saveService(id, prev, formData);
}

export async function deleteService(id: string, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: current } = await supabase.from("services").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o serviço.");
  await removeStorageUrls(supabase, [current?.image_url]);
  revalidateSite();
  redirect("/admin/servicos?saved=excluido");
}

export async function setServicePublished(id: string, published: boolean, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("services").update({ published }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar o serviço.");
  revalidateSite();
  redirect("/admin/servicos?saved=atualizado");
}
