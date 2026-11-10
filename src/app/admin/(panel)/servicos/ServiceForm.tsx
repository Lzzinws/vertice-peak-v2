"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import { SERVICE_ICONS } from "@/lib/types";
import type { Service } from "@/lib/types";
import { Checkbox, Field, ImageInput, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

const ICON_LABELS: Record<string, string> = {
  globe: "Globo (sites)",
  target: "Alvo (landing pages)",
  "book-open": "Livro (catálogos)",
  megaphone: "Megafone (marketing)",
  image: "Imagem (conteúdo)",
  "pen-tool": "Caneta (identidade visual)",
  sparkles: "Brilho (soluções personalizadas)",
};

export function ServiceForm({ action, service }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; service?: Service }) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />
      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <Field id="title" label="Título *" error={e.title}>
          <input id="title" name="title" required defaultValue={v("title", service?.title ?? "")} className={inputClass} />
        </Field>
        <Field id="description" label="Descrição *" error={e.description}>
          <textarea id="description" name="description" rows={4} required defaultValue={v("description", service?.description ?? "")} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="icon" label="Ícone *" error={e.icon}>
            <select id="icon" name="icon" required defaultValue={v("icon", service?.icon ?? "sparkles")} className={inputClass}>
              {SERVICE_ICONS.map((icon) => (
                <option key={icon} value={icon}>{ICON_LABELS[icon]}</option>
              ))}
            </select>
          </Field>
          <Field id="sortOrder" label="Ordem de exibição" error={e.sortOrder} help="Menor número aparece primeiro.">
            <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={v("sortOrder", String(service?.sort_order ?? 0))} className={inputClass} />
          </Field>
        </div>
      </section>
      <section className="grid gap-6 rounded-[14px] border border-line bg-surface p-6">
        <ImageInput
          label="Imagem (opcional, substitui o ícone)"
          fileName="imageFile"
          currentName="currentImage"
          removeName="removeImage"
          current={service?.image_url}
          error={e.imageFile}
        />
        <Checkbox name="published" label="Publicado no site" defaultChecked={state.values ? state.values.published === "on" : service?.published ?? true} />
      </section>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{service ? "Salvar alterações" : "Criar serviço"}</SubmitButton>
        <Link href="/admin/servicos" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-white/80 hover:border-lime hover:text-lime">Cancelar</Link>
      </div>
    </form>
  );
}
