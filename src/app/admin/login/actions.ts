"use server";

import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getString, type ActionState } from "@/lib/action-state";

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = getString(formData, "email").toLowerCase();
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  if (!email || !password) return { ok: false, message: "Informe e-mail e senha." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  // Mensagem genérica: não revela se o e-mail existe.
  if (error) return { ok: false, message: "E-mail ou senha inválidos." };

  // Login válido no Auth não basta: a conta precisa estar cadastrada em `admins`.
  const admin = await getCurrentAdmin();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, message: "Esta conta não tem acesso ao painel." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
