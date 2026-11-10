import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle, Mail } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildLeadWhatsAppUrl } from "@/lib/whatsapp";
import { Flash, LeadStatusBadge, PageHeader, Panel } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import { formatDate } from "@/lib/format";
import { LEAD_STATUSES, type Lead } from "@/lib/types";
import { btnPrimary, btnSecondary, input, label } from "@/lib/ui";
import { updateLeadStatus } from "@/app/admin/(panel)/contatos/actions";

export const metadata: Metadata = { title: "Contato", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const lead = data as Lead;

  const whatsappUrl = buildLeadWhatsAppUrl(lead.whatsapp, lead.name);

  const fields: [string, string | null][] = [
    ["Empresa", lead.company],
    ["E-mail", lead.email],
    ["WhatsApp", lead.whatsapp],
    ["Serviço desejado", lead.service],
    ["Orçamento", lead.budget],
    ["Recebido em", formatDate(lead.created_at)],
  ];

  return (
    <div className="space-y-6">
      <Link href="/admin/contatos" className="text-sm font-semibold text-lime hover:underline">← Voltar aos contatos</Link>
      <PageHeader title={lead.name} description={`Solicitação de ${lead.service.toLowerCase()}`} />
      <Flash value={saved} />
      {saved === "invalido" && <p role="alert" className="text-sm text-red-300">Status inválido.</p>}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-lime">Mensagem</p>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-white/85">{lead.message}</p>
          </div>
          <dl className="grid gap-4 border-t border-line pt-6 sm:grid-cols-2">
            {fields.map(([term, value]) => (
              <div key={term}>
                <dt className="text-xs font-bold uppercase tracking-widest text-muted">{term}</dt>
                <dd className="mt-1 text-sm text-white/90">{value || "Não informado"}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <aside className="space-y-6">
          <Panel className="space-y-4">
            <p className="text-sm font-bold">Atendimento</p>
            <div className="flex flex-col gap-3">
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  <MessageCircle className="h-4 w-4" aria-hidden="true" /> Iniciar conversa no WhatsApp
                </a>
              )}
              <a href={`mailto:${lead.email}`} className={btnSecondary}>
                <Mail className="h-4 w-4" aria-hidden="true" /> Enviar e-mail
              </a>
            </div>
          </Panel>

          <Panel className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Status</p>
              <LeadStatusBadge status={lead.status} />
            </div>
            <form action={updateLeadStatus.bind(null, lead.id)} className="grid gap-3">
              <label htmlFor="status" className={label}>Alterar para</label>
              <select id="status" name="status" defaultValue={lead.status} className={input}>
                {LEAD_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {{ novo: "Novo", em_atendimento: "Em atendimento", convertido: "Convertido", arquivado: "Arquivado" }[s]}
                  </option>
                ))}
              </select>
              <SubmitButton pendingText="Atualizando...">Salvar status</SubmitButton>
            </form>
          </Panel>
        </aside>
      </div>
    </div>
  );
}
