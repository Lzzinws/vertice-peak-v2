"use server";

import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { leadSchema } from "@/lib/schemas";
import { getBoolean, getString, zodErrorsToRecord, type ActionState } from "@/lib/action-state";

/**
 * Recebe o formulário público. O cliente anon só tem permissão de INSERT em `leads`
 * com status 'novo' (RLS), então um visitante não consegue ler nem alterar contatos.
 */
export async function submitLead(_prev: ActionState, formData: FormData): Promise<ActionState> {
  // Honeypot: campo oculto que humanos não preenchem. Finge sucesso para não ensinar o bot.
  if (getString(formData, "website") !== "") {
    return { ok: true, message: "Recebemos sua mensagem! Nossa equipe entrará em contato em breve." };
  }
  if (getBoolean(formData, "consent") === false) {
    return { ok: false, errors: { consent: "Confirme que podemos entrar em contato com você." }, message: "Revise os campos destacados." };
  }

  const parsed = leadSchema.safeParse({
    name: getString(formData, "name"),
    company: getString(formData, "company"),
    email: getString(formData, "email"),
    whatsapp: getString(formData, "whatsapp"),
    service: getString(formData, "service"),
    budget: getString(formData, "budget"),
    message: getString(formData, "message"),
  });
  if (!parsed.success) {
    return { ok: false, errors: zodErrorsToRecord(parsed.error), message: "Revise os campos destacados." };
  }

  const client = createPublicSupabaseClient();
  if (!client) {
    return { ok: false, message: "Não foi possível enviar agora. Tente novamente em instantes ou fale pelo WhatsApp." };
  }

  const { error } = await client.from("leads").insert({
    name: parsed.data.name,
    company: parsed.data.company || null,
    email: parsed.data.email,
    whatsapp: parsed.data.whatsapp,
    service: parsed.data.service,
    budget: parsed.data.budget || null,
    message: parsed.data.message,
  });

  if (error) {
    console.error("[contato] falha ao salvar lead:", error.message);
    return { ok: false, message: "Não foi possível enviar agora. Tente novamente em instantes ou fale pelo WhatsApp." };
  }

  return { ok: true, message: "Recebemos sua mensagem! Nossa equipe entrará em contato em breve." };
}
