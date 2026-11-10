import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/admin/buttons";
import { Flash, PageHeader, PublishBadge, Panel } from "@/components/admin/ui";
import { btnGhost } from "@/lib/ui";
import { deleteTestimonial, setTestimonialPublished } from "@/app/admin/(panel)/depoimentos/actions";
import type { Testimonial } from "@/lib/types";

export const metadata: Metadata = { title: "Depoimentos", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
  const items = (data ?? []) as Testimonial[];

  return (
    <div className="space-y-6">
      <PageHeader title="Depoimentos" description="Só aparecem no site quando publicados. Não cadastre avaliações que o cliente não autorizou." action={{ href: "/admin/depoimentos/novo", label: "+ Novo depoimento" }} />
      <Flash value={saved} />
      {error && <p className="text-sm text-red-300">Não foi possível carregar os depoimentos.</p>}
      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Cliente</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Ordem</th>
              <th className="px-5 py-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-4">
                  <span className="block font-semibold">{t.client_name}</span>
                  <span className="text-xs text-muted">{t.company ?? "—"}</span>
                </td>
                <td className="px-5 py-4">
                  <form action={setTestimonialPublished.bind(null, t.id, !t.published)}>
                    <button type="submit" className="cursor-pointer" aria-label={t.published ? "Despublicar" : "Publicar"}>
                      <PublishBadge published={t.published} />
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4 text-muted">{t.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/depoimentos/${t.id}`} className={btnGhost}>Editar</Link>
                    <form action={deleteTestimonial.bind(null, t.id)}>
                      <ConfirmDeleteButton message={`Excluir o depoimento de "${t.client_name}"?`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-muted">Nenhum depoimento cadastrado.</td></tr>}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
