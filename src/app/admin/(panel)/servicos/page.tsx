import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/admin/buttons";
import { Flash, PageHeader, PublishBadge, Panel } from "@/components/admin/ui";
import { btnGhost } from "@/lib/ui";
import { deleteService, setServicePublished } from "@/app/admin/(panel)/servicos/actions";
import type { Service } from "@/lib/types";

export const metadata: Metadata = { title: "Serviços", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("services").select("*").order("sort_order", { ascending: true });
  const services = (data ?? []) as Service[];

  return (
    <div className="space-y-6">
      <PageHeader title="Serviços" description="Exibidos na home e em /servicos. Arraste a ordem pelo campo 'Ordem de exibição'." action={{ href: "/admin/servicos/novo", label: "+ Novo serviço" }} />
      <Flash value={saved} />
      {error && <p className="text-sm text-red-300">Não foi possível carregar os serviços.</p>}
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Serviço</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Ordem</th>
              <th className="px-5 py-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {services.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4">
                  <span className="block font-semibold">{s.title}</span>
                  <span className="line-clamp-1 text-xs text-muted">{s.description}</span>
                </td>
                <td className="px-5 py-4">
                  <form action={setServicePublished.bind(null, s.id, !s.published)}>
                    <button type="submit" className="cursor-pointer" aria-label={s.published ? "Despublicar" : "Publicar"}>
                      <PublishBadge published={s.published} />
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4 text-muted">{s.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/servicos/${s.id}`} className={btnGhost}>Editar</Link>
                    <form action={deleteService.bind(null, s.id)}>
                      <ConfirmDeleteButton message={`Excluir o serviço "${s.title}"?`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nenhum serviço cadastrado. Os serviços padrão aparecem no site até você cadastrar os seus.</td></tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
