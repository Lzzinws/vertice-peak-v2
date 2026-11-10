import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LeadStatusBadge, PageHeader, Panel, StatCard } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { btnGhost } from "@/lib/ui";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const [projectsTotal, projectsPublished, projectsDraft, leadsTotal, leadsPending, recentLeads] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", false),
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase.from("leads").select("id", { count: "exact", head: true }).in("status", ["novo", "em_atendimento"]),
    supabase.from("leads").select("id, name, service, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader title="Dashboard" description="Visão geral do site e dos contatos recebidos." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Projetos" value={projectsTotal.count ?? 0} />
        <StatCard label="Publicados" value={projectsPublished.count ?? 0} />
        <StatCard label="Rascunhos" value={projectsDraft.count ?? 0} />
        <StatCard label="Contatos" value={leadsTotal.count ?? 0} />
        <StatCard label="Pendentes" value={leadsPending.count ?? 0} hint="Novos e em atendimento" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Shortcut href="/admin/projetos/novo" title="Novo projeto" text="Cadastrar um trabalho do portfólio." />
        <Shortcut href="/admin/servicos/novo" title="Novo serviço" text="Adicionar um serviço à página de serviços." />
        <Shortcut href="/admin/depoimentos/novo" title="Novo depoimento" text="Registrar um depoimento autorizado." />
        <Shortcut href="/admin/contatos?status=novo" title="Ver contatos novos" text="Responder às solicitações recebidas." />
      </div>

      <Panel className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black">Últimos contatos</h2>
          <Link href="/admin/contatos" className={btnGhost}>Ver todos</Link>
        </div>
        {recentLeads.error && <p className="text-sm text-red-300">Não foi possível carregar os contatos.</p>}
        {recentLeads.data && recentLeads.data.length === 0 && <p className="text-sm text-muted">Nenhum contato recebido ainda.</p>}
        <ul className="divide-y divide-line">
          {(recentLeads.data ?? []).map((lead) => (
            <li key={lead.id}>
              <Link href={`/admin/contatos/${lead.id}`} className="flex flex-wrap items-center justify-between gap-3 py-3 hover:text-lime">
                <span>
                  <span className="block font-semibold">{lead.name}</span>
                  <span className="text-xs text-muted">{lead.service} · {formatDate(lead.created_at)}</span>
                </span>
                <LeadStatusBadge status={lead.status} />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Shortcut({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="rounded-[14px] border border-line bg-surface p-5 transition hover:border-lime">
      <p className="font-black">{title}</p>
      <p className="mt-1 text-sm text-muted">{text}</p>
    </Link>
  );
}
