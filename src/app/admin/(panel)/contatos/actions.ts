"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadStatusSchema } from "@/lib/schemas";
import { getString } from "@/lib/action-state";

/** Atualiza o status de atendimento de um contato. Recebe o status pelo formulário. */
export async function updateLeadStatus(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = leadStatusSchema.safeParse(getString(formData, "status"));
  if (!parsed.success) redirect(`/admin/contatos/${id}?saved=invalido`);

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("leads").update({ status: parsed.data }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar o status do contato.");
  redirect(`/admin/contatos/${id}?saved=status`);
}
