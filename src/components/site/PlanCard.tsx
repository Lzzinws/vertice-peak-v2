import Link from "next/link";
import { Check } from "lucide-react";
import type { Plan } from "@/lib/types";
import { formatBRL, BILLING_LABELS } from "@/lib/money";
import { btnPrimary, btnSecondary } from "@/lib/ui";

export function PlanCard({ plan }: { plan: Plan }) {
  const href = `/contato?servico=${encodeURIComponent(plan.name)}`;
  return (
    <article
      className={`relative flex h-full flex-col gap-6 rounded-[14px] border p-7 transition hover:-translate-y-1 ${
        plan.highlight ? "border-lime bg-olive shadow-[0_20px_60px_-20px_rgb(182_255_0/0.45)]" : "border-line bg-surface hover:border-lime/50"
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-7 rounded-full bg-lime px-3 py-1 text-xs font-bold text-ink">Mais escolhido</span>
      )}
      <header className="space-y-2">
        <h3 className="text-xl font-black">{plan.name}</h3>
        {plan.description && <p className="text-sm leading-relaxed text-muted">{plan.description}</p>}
      </header>
      <p className="space-y-1">
        <span className="font-display text-4xl text-lime">{formatBRL(plan.price)}</span>
        {plan.price !== null && (
          <span className="block text-xs text-muted">{BILLING_LABELS[plan.billing_period]}</span>
        )}
      </p>
      {plan.features.length > 0 && (
        <ul className="flex flex-1 flex-col gap-3">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-white/85">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-lime" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      )}
      <Link href={href} className={plan.highlight ? btnPrimary : btnSecondary}>
        {plan.cta_label}
      </Link>
    </article>
  );
}
