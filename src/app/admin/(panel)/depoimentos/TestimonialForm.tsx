"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import type { Testimonial } from "@/lib/types";
import { Checkbox, Field, ImageInput, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export function TestimonialForm({ action, testimonial }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; testimonial?: Testimonial }) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />
      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <p className="text-sm text-muted">Cadastre apenas depoimentos autorizados pelo cliente. Nada é criado automaticamente.</p>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="clientName" label="Nome do cliente *" error={e.clientName}>
            <input id="clientName" name="clientName" required defaultValue={v("clientName", testimonial?.client_name ?? "")} className={inputClass} />
          </Field>
          <Field id="company" label="Empresa" error={e.company}>
            <input id="company" name="company" defaultValue={v("company", testimonial?.company ?? "")} className={inputClass} />
          </Field>
        </div>
        <Field id="quote" label="Depoimento *" error={e.quote}>
          <textarea id="quote" name="quote" rows={5} required defaultValue={v("quote", testimonial?.quote ?? "")} className={inputClass} />
        </Field>
        <Field id="sortOrder" label="Ordem de exibição" error={e.sortOrder} help="Menor número aparece primeiro.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={v("sortOrder", String(testimonial?.sort_order ?? 0))} className={inputClass} />
        </Field>
      </section>
      <section className="grid gap-6 rounded-[14px] border border-line bg-surface p-6">
        <ImageInput label="Foto (opcional)" fileName="photoFile" currentName="currentPhoto" removeName="removePhoto" current={testimonial?.photo_url} error={e.photoFile} />
        <Checkbox name="published" label="Publicado no site" defaultChecked={state.values ? state.values.published === "on" : testimonial?.published ?? false} />
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{testimonial ? "Salvar alterações" : "Cadastrar depoimento"}</SubmitButton>
        <Link href="/admin/depoimentos" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-white/80 hover:border-lime hover:text-lime">Cancelar</Link>
      </div>
    </form>
  );
}
