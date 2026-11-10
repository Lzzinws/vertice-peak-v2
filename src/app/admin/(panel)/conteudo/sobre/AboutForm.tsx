"use client";

import { useActionState, useMemo } from "react";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import type { AboutContent } from "@/lib/types";
import { Field, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export function AboutForm({ action, about }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; about: AboutContent }) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />
      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">História</h2>
        <Field id="heading" label="Título da página *" error={e.heading}>
          <input id="heading" name="heading" required defaultValue={v("heading", about.heading)} className={inputClass} />
        </Field>
        <Field id="history" label="História da empresa *" error={e.history} help="Use linhas em branco para separar parágrafos.">
          <textarea id="history" name="history" rows={8} required defaultValue={v("history", about.history)} className={inputClass} />
        </Field>
      </section>
      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Propósito e posicionamento</h2>
        <Field id="purposeHeading" label="Título do propósito" error={e.purposeHeading}>
          <input id="purposeHeading" name="purposeHeading" defaultValue={v("purposeHeading", about.purposeHeading)} className={inputClass} />
        </Field>
        <Field id="purpose" label="Texto do propósito" error={e.purpose}>
          <textarea id="purpose" name="purpose" rows={4} defaultValue={v("purpose", about.purpose)} className={inputClass} />
        </Field>
      </section>
      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Diferenciais</h2>
        <Field id="differentials" label="Um diferencial por linha" error={e.differentials} help="Cada linha vira um cartão na página Sobre e na home.">
          <textarea id="differentials" name="differentials" rows={7} defaultValue={v("differentials", about.differentials.join("\n"))} className={inputClass} />
        </Field>
      </section>
      <div>
        <SubmitButton>Salvar textos de Sobre nós</SubmitButton>
      </div>
    </form>
  );
}
