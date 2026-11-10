import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Flash, LeadStatusBadge, PageHeader, Panel } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { LEAD_STATUSES, type Lead } from "@/lib/types";
import { btnGhost } from "@/lib/ui";

export const metadata: Metadata = { title: "Contatos", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = { novo: "Novos", em_atendimento: "Em atendimento", convertido: "Convertidos", arquivado: "Arquivados" };

type SP = Promise<{ q?: string; status?: string }>;

export default async function LeadsPage({ searchParams }: { searchParams: SP }) {
  const { q = "", status = "todos" } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(500);
  if ((LEAD_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  const { data, error } = await query;

  const term = q.trim().toLowerCase();
  const leads = ((data ?? []) as Lead[]).filter(
    (l) =>
      !term ||
      [l.name, l.email, l.company ?? "", l.service, l.whatsapp].some((field) => field.toLowerCase().includes(term)),
  );

  const chips = [{ value: "todos", label: "Todos" }, ...LEAD_STATUSES.map((s) => ({ value: s, label: STATUS_LABEL[s] }))];

  return (
    <div className="space-y-6">
      <PageHeader title="Contatos" description="Solicitações enviadas pelo formulário do site. Os visitantes não conseguem ver esta lista." />

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => {
          const active = status === c.value || (c.value === "todos" && !(LEAD_STATUSES as readonly string[]).includes(status));
          const href = `/admin/contatos${c.value === "todos" ? "" : `?status=${c.value}`}`;
          return (
            <Link
              key={c.value}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`rounded-full border px-4 py-2 text-sm font-semibold ${active ? "border-lime bg-lime text-ink" : "border-line text-white/80 hover:border-lime hover:text-lime"}`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      <form role="search" className="flex flex-wrap gap-3">
        {status !== "todos" && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Buscar por nome, e-mail, empresa, serviço ou WhatsApp" className="min-w-0 flex-1 rounded-full border border-line bg-ink-2 px-4 py-2.5 text-sm focus:border-lime focus:outline-none" />
        <button type="submit" className={btnGhost}>Buscar</button>
      </form>

      {error && <p className="text-sm text-red-300">Não foi possível carregar os contatos.</p>}

      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Contato</th>
              <th className="px-5 py-4 font-bold">Serviço</th>
              <th className="px-5 py-4 font-bold">Recebido em</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 text-right font-bold">Abrir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-lime/5">
                <td className="px-5 py-4">
                  <span className="block font-semibold">{l.name}</span>
                  <span className="text-xs text-muted">{l.company ? `${l.company} · ` : ""}{l.email}</span>
                </td>
                <td className="px-5 py-4 text-white/80">{l.service}</td>
                <td className="px-5 py-4 text-muted">{formatDate(l.created_at)}</td>
                <td className="px-5 py-4"><LeadStatusBadge status={l.status} /></td>
                <td className="px-5 py-4 text-right">
                  <Link href={`/admin/contatos/${l.id}`} className={btnGhost}>Detalhes</Link>
                </td>
              </tr>
            ))}
            {leads.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Nenhum contato encontrado.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
