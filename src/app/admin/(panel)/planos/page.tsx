import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/admin/buttons";
import { Flash, PageHeader, PublishBadge, Panel } from "@/components/admin/ui";
import { btnGhost } from "@/lib/ui";
import { formatBRL, BILLING_LABELS } from "@/lib/money";
import { deletePlan, setPlanPublished } from "@/app/admin/(panel)/planos/actions";
import type { Plan } from "@/lib/types";

export const metadata: Metadata = { title: "Planos e preços", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PlansPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("plans").select("*").order("sort_order", { ascending: true });
  const plans = (data ?? []) as Plan[];

  return (
    <div className="space-y-6">
      <PageHeader title="Planos e preços" description="Montados aqui e exibidos em /planos. Rascunhos não aparecem no site." action={{ href: "/admin/planos/novo", label: "+ Novo plano" }} />
      <Flash value={saved} />
      {error && <p className="text-sm text-red-300">Não foi possível carregar os planos.</p>}
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Plano</th>
              <th className="px-5 py-4 font-bold">Preço</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Ordem</th>
              <th className="px-5 py-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {plans.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-4">
                  <span className="block font-semibold">
                    {p.name} {p.highlight && <span className="ml-2 rounded-full bg-lime/15 px-2 py-0.5 text-xs font-bold text-lime">Destaque</span>}
                  </span>
                  <span className="text-xs text-muted">{p.features.length} itens incluídos</span>
                </td>
                <td className="px-5 py-4 text-white/85">
                  {formatBRL(p.price)}
                  {p.price !== null && <span className="block text-xs text-muted">{BILLING_LABELS[p.billing_period]}</span>}
                </td>
                <td className="px-5 py-4">
                  <form action={setPlanPublished.bind(null, p.id, !p.published)}>
                    <button type="submit" className="cursor-pointer" aria-label={p.published ? "Despublicar" : "Publicar"}>
                      <PublishBadge published={p.published} />
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4 text-muted">{p.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/planos/${p.id}`} className={btnGhost}>Editar</Link>
                    <form action={deletePlan.bind(null, p.id)}>
                      <ConfirmDeleteButton message={`Excluir o plano "${p.name}"?`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-muted">Nenhum plano cadastrado ainda. Crie o primeiro para exibi-lo em /planos.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
