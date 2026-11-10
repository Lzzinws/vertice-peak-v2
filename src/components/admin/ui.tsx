import Link from "next/link";
import { btnGhost, card } from "@/lib/ui";
import type { ActionState } from "@/lib/action-state";

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: { href: string; label: string } }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-black sm:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted">{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center justify-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-bold text-ink hover:bg-white">
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function FormAlert({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return state.ok ? (
    <p role="status" className="rounded-[10px] border border-lime/50 bg-lime/10 px-4 py-3 text-sm text-lime">
      {state.message}
    </p>
  ) : (
    <p role="alert" className="rounded-[10px] border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
      {state.message}
    </p>
  );
}

export function Flash({ value }: { value?: string }) {
  const messages: Record<string, string> = {
    criado: "Cadastro criado com sucesso.",
    atualizado: "Alterações salvas. O site público já foi atualizado.",
    excluido: "Registro excluído.",
    status: "Status atualizado.",
  };
  if (!value || !messages[value]) return null;
  return (
    <p role="status" className="rounded-[10px] border border-lime/50 bg-lime/10 px-4 py-3 text-sm text-lime">
      {messages[value]}
    </p>
  );
}

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`${card} ${className}`}>{children}</section>;
}

export function StatCard({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="rounded-[14px] border border-line bg-surface p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 font-display text-4xl text-lime">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

const PUBLISH = { published: "Publicado", draft: "Rascunho" } as const;

export function PublishBadge({ published }: { published: boolean }) {
  const label = published ? PUBLISH.published : PUBLISH.draft;
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
        published ? "bg-lime text-ink" : "border border-line text-muted"
      }`}
    >
      {label}
    </span>
  );
}

const LEAD_LABEL: Record<string, string> = {
  novo: "Novo",
  em_atendimento: "Em atendimento",
  convertido: "Convertido",
  arquivado: "Arquivado",
};

export function LeadStatusBadge({ status }: { status: string }) {
  const tone =
    status === "novo"
      ? "bg-lime text-ink"
      : status === "convertido"
        ? "border border-lime text-lime"
        : "border border-line text-white/80";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{LEAD_LABEL[status] ?? status}</span>;
}

export { btnGhost };
