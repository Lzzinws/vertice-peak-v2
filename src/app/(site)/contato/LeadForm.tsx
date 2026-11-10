"use client";

import { useActionState } from "react";
import { submitLead } from "./actions";
import { INITIAL_STATE } from "@/lib/action-state";
import { btnPrimary, errorText, hint, input, label } from "@/lib/ui";

const BUDGETS = ["Prefiro não informar", "Até R$ 2.000", "R$ 2.000 a R$ 5.000", "Acima de R$ 5.000"];

export function LeadForm({ services }: { services: string[] }) {
  const [state, formAction, pending] = useActionState(submitLead, INITIAL_STATE);

  if (state.ok) {
    return (
      <div role="status" className="rounded-[14px] border border-lime bg-olive p-8 text-center">
        <p className="text-lg font-black text-lime">Mensagem enviada!</p>
        <p className="mt-2 text-sm text-white/80">{state.message}</p>
      </div>
    );
  }

  const err = state.errors ?? {};

  return (
    <form action={formAction} noValidate className="grid gap-5 rounded-[14px] border border-line bg-surface p-6 sm:p-8">
      {/* Honeypot: oculto para visitantes reais */}
      <div className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.message && !state.ok && (
        <p role="alert" className="rounded-[10px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Nome *" error={err.name}>
          <input id="name" name="name" autoComplete="name" className={input} aria-invalid={!!err.name} required />
        </Field>
        <Field id="company" label="Empresa" error={err.company}>
          <input id="company" name="company" autoComplete="organization" className={input} />
        </Field>
        <Field id="email" label="E-mail *" error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" className={input} aria-invalid={!!err.email} required />
        </Field>
        <Field id="whatsapp" label="WhatsApp com DDD *" error={err.whatsapp} hint="Ex.: (11) 91234-5678">
          <input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" className={input} aria-invalid={!!err.whatsapp} required />
        </Field>
        <Field id="service" label="Serviço desejado *" error={err.service}>
          <select id="service" name="service" className={input} aria-invalid={!!err.service} required defaultValue="">
            <option value="" disabled>Escolha uma opção</option>
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
            <option value="Outro">Outro</option>
          </select>
        </Field>
        <Field id="budget" label="Orçamento (opcional)" error={err.budget}>
          <select id="budget" name="budget" className={input} defaultValue={BUDGETS[0]}>
            {BUDGETS.map((b) => (
              <option key={b} value={b === BUDGETS[0] ? "" : b}>{b}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label="Mensagem *" error={err.message} hint="Conte o que você deseja construir.">
        <textarea id="message" name="message" rows={5} className={input} aria-invalid={!!err.message} required />
      </Field>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" value="true" className="mt-1 h-4 w-4 accent-lime" required />
        <span>Autorizo a Vértice Peak a entrar em contato sobre minha solicitação.</span>
      </label>
      {err.consent && <p className={errorText}>{err.consent}</p>}

      <button type="submit" disabled={pending} className={`${btnPrimary} justify-self-start`}>
        {pending ? "Enviando..." : "Enviar mensagem"}
      </button>
    </form>
  );
}

function Field({
  id,
  label: text,
  error,
  hint: help,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className={label}>{text}</label>
      {children}
      {help && !error && <span className={hint}>{help}</span>}
      {error && <span className={errorText}>{error}</span>}
    </div>
  );
}
