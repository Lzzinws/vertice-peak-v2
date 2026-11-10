"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { planSchema } from "@/lib/schemas";
import { getBoolean, getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { revalidateSite } from "@/lib/admin";
import { parseBRL } from "@/lib/money";

function readPlan(formData: FormData) {
  return planSchema.safeParse({
    name: getString(formData, "name"),
    description: getString(formData, "description"),
    priceText: getString(formData, "price"),
    billingPeriod: getString(formData, "billingPeriod"),
    features: getString(formData, "features")
      .split(/\r?\n/)
      .map((f) => f.trim())
      .filter(Boolean),
    highlight: getBoolean(formData, "highlight"),
    ctaLabel: getString(formData, "ctaLabel") || "Quero este plano",
    published: getBoolean(formData, "published"),
    sortOrder: getString(formData, "sortOrder") || "0",
  });
}

async function savePlan(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = readPlan(formData);
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));
  const data = parsed.data;

  const supabase = await createSupabaseServerClient();
  const row = {
    name: data.name,
    description: data.description || null,
    price: parseBRL(data.priceText),
    billing_period: data.billingPeriod,
    features: data.features,
    highlight: data.highlight,
    cta_label: data.ctaLabel,
    published: data.published,
    sort_order: data.sortOrder,
  };

  // Só um plano pode ser "Mais escolhido": ao destacar um, remove o destaque dos outros.
  if (row.highlight) {
    let clear = supabase.from("plans").update({ highlight: false }).eq("highlight", true);
    if (id) clear = clear.neq("id", id);
    const { error: clearError } = await clear;
    if (clearError) return { ok: false, message: "Não foi possível atualizar o destaque. Tente novamente." };
  }

  const { error } = id
    ? await supabase.from("plans").update(row).eq("id", id)
    : await supabase.from("plans").insert(row);
  if (error) {
    console.error("[planos] erro ao salvar:", error.message);
    return { ok: false, message: "Não foi possível salvar o plano. Tente novamente." };
  }

  revalidateSite();
  redirect(`/admin/planos?saved=${id ? "atualizado" : "criado"}`);
}

export async function createPlan(prev: ActionState, formData: FormData) {
  return savePlan(null, prev, formData);
}

export async function updatePlan(id: string, prev: ActionState, formData: FormData) {
  return savePlan(id, prev, formData);
}

export async function deletePlan(id: string, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o plano.");
  revalidateSite();
  redirect("/admin/planos?saved=excluido");
}

export async function setPlanPublished(id: string, published: boolean, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("plans").update({ published }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar o plano.");
  revalidateSite();
  redirect("/admin/planos?saved=atualizado");
}
