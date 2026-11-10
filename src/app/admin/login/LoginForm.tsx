"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/login/actions";
import { INITIAL_STATE } from "@/lib/action-state";
import { btnPrimary, input, label } from "@/lib/ui";
import { FormAlert } from "@/components/admin/ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, INITIAL_STATE);
  return (
    <form action={formAction} className="grid gap-5">
      <FormAlert state={state} />
      <div className="grid gap-2">
        <label htmlFor="email" className={label}>E-mail</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={input} />
      </div>
      <div className="grid gap-2">
        <label htmlFor="password" className={label}>Senha</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={input} />
      </div>
      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
