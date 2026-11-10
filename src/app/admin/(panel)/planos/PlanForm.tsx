"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import type { Plan } from "@/lib/types";
import { BILLING_LABELS, parseBRL, toInputPrice } from "@/lib/money";
import { Checkbox, Field, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { PlanCard } from "@/components/site/PlanCard";

type Props = { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; plan?: Plan };

export function PlanForm({ action, plan }: Props) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  // Valor digitado (ou o salvo), convertido para número; inválido vira "Sob consulta" na prévia.
  const parsedPrice = parseBRL(v("price", toInputPrice(plan?.price ?? null)));
  const priceValue = parsedPrice === null || Number.isNaN(parsedPrice) ? null : parsedPrice;

  // Prévia ao vivo: mostra o cartão como aparecerá em /planos (usa os últimos valores válidos).
  const preview = {
    id: plan?.id ?? "novo",
    name: v("name", plan?.name ?? "Nome do plano"),
    description: v("description", plan?.description ?? "") || null,
    price: priceValue,
    billing_period: (v("billingPeriod", plan?.billing_period ?? "unico") as Plan["billing_period"]) || "unico",
    features: v("features", (plan?.features ?? []).join("\n")).split(/\r?\n/).map((f) => f.trim()).filter(Boolean),
    highlight: state.values ? state.values.highlight === "on" : plan?.highlight ?? false,
    cta_label: v("ctaLabel", plan?.cta_label ?? "Quero este plano") || "Quero este plano",
    published: true,
    sort_order: 0,
    created_at: "",
    updated_at: "",
  } satisfies Plan;

  return (
    <div className="grid gap-8 xl:grid-cols-[1fr_380px]">
      <form action={formAction} key={state.nonce ?? 0} className="grid content-start gap-8" noValidate>
        <FormAlert state={state} />

        <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
          <h2 className="text-lg font-black">Plano</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="name" label="Nome do plano *" error={e.name} help="Ex.: Site Essencial, Site Profissional">
              <input id="name" name="name" required defaultValue={v("name", plan?.name ?? "")} className={inputClass} />
            </Field>
            <Field id="sortOrder" label="Ordem de exibição" error={e.sortOrder} help="Menor número aparece primeiro.">
              <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={v("sortOrder", String(plan?.sort_order ?? 0))} className={inputClass} />
            </Field>
          </div>
          <Field id="description" label="Descrição curta" error={e.description}>
            <textarea id="description" name="description" rows={2} defaultValue={v("description", plan?.description ?? "")} className={inputClass} />
          </Field>
        </section>

        <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
          <h2 className="text-lg font-black">Preço</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <Field id="price" label="Valor (R$)" error={e.priceText} help="Ex.: 1.290,00. Deixe vazio para mostrar 'Sob consulta'.">
              <input id="price" name="price" inputMode="decimal" placeholder="Sob consulta" defaultValue={v("price", toInputPrice(plan?.price ?? null))} className={inputClass} />
            </Field>
            <Field id="billingPeriod" label="Cobrança *" error={e.billingPeriod}>
              <select id="billingPeriod" name="billingPeriod" required defaultValue={v("billingPeriod", plan?.billing_period ?? "unico")} className={inputClass}>
                {(Object.keys(BILLING_LABELS) as (keyof typeof BILLING_LABELS)[]).map((key) => (
                  <option key={key} value={key}>{BILLING_LABELS[key]}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
          <h2 className="text-lg font-black">O que está incluso</h2>
          <Field id="features" label="Um item por linha" error={e.features} help="Cada linha vira um item com ✓ no cartão. Máximo de 20 itens.">
            <textarea id="features" name="features" rows={8} defaultValue={v("features", (plan?.features ?? []).join("\n"))} className={inputClass} />
          </Field>
          <Field id="ctaLabel" label="Texto do botão" error={e.ctaLabel} help="Ao clicar, o visitante vai ao contato com este plano já selecionado.">
            <input id="ctaLabel" name="ctaLabel" defaultValue={v("ctaLabel", plan?.cta_label ?? "Quero este plano")} className={inputClass} />
          </Field>
        </section>

        <section className="grid gap-4 rounded-[14px] border border-line bg-surface p-6">
          <h2 className="text-lg font-black">Publicação</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Checkbox name="published" label="Publicado no site" defaultChecked={state.values ? state.values.published === "on" : plan?.published ?? false} help="Desmarcado = rascunho, invisível ao público." />
            <Checkbox name="highlight" label="Destacar como “Mais escolhido”" defaultChecked={state.values ? state.values.highlight === "on" : plan?.highlight ?? false} help="Apenas um plano pode ter o destaque; o anterior é desmarcado." />
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton>{plan ? "Salvar alterações" : "Criar plano"}</SubmitButton>
          <Link href="/admin/planos" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-white/80 hover:border-lime hover:text-lime">Cancelar</Link>
        </div>
      </form>

      <aside className="space-y-3 xl:sticky xl:top-8 xl:self-start">
        <p className="text-xs font-bold uppercase tracking-widest text-lime">Prévia no site</p>
        <PlanCard plan={preview} />
      </aside>
    </div>
  );
}
