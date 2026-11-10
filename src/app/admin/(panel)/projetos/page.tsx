import Link from "next/link";
import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ConfirmDeleteButton } from "@/components/admin/buttons";
import { Flash, PageHeader, PublishBadge, Panel } from "@/components/admin/ui";
import { btnGhost } from "@/lib/ui";
import { deleteProject, setProjectFlag } from "@/app/admin/(panel)/projetos/actions";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Projetos", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type SP = Promise<{ q?: string; status?: string; saved?: string }>;

export default async function ProjectsPage({ searchParams }: { searchParams: SP }) {
  const { q = "", status = "todos", saved } = await searchParams;
  const supabase = await createSupabaseServerClient();

  let query = supabase.from("projects").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false });
  if (status === "publicados") query = query.eq("published", true);
  if (status === "rascunhos") query = query.eq("published", false);
  const { data, error } = await query;

  const term = q.trim().toLowerCase();
  const projects = ((data ?? []) as Project[]).filter(
    (p) => !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term),
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Projetos" description="Portfólio exibido em /portfolio. Rascunhos não aparecem no site." action={{ href: "/admin/projetos/novo", label: "+ Novo projeto" }} />
      <Flash value={saved} />

      <form className="flex flex-wrap gap-3" role="search">
        <input name="q" defaultValue={q} placeholder="Buscar por nome ou categoria" className="min-w-0 flex-1 rounded-full border border-line bg-ink-2 px-4 py-2.5 text-sm focus:border-lime focus:outline-none" />
        <select name="status" defaultValue={status} aria-label="Filtrar por status" className="rounded-full border border-line bg-ink-2 px-4 py-2.5 text-sm focus:border-lime focus:outline-none">
          <option value="todos">Todos</option>
          <option value="publicados">Publicados</option>
          <option value="rascunhos">Rascunhos</option>
        </select>
        <button type="submit" className={btnGhost}>Filtrar</button>
      </form>

      {error && <p className="text-sm text-red-300">Não foi possível carregar os projetos.</p>}

      <Panel className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-muted">
            <tr>
              <th className="px-5 py-4 font-bold">Projeto</th>
              <th className="px-5 py-4 font-bold">Categoria</th>
              <th className="px-5 py-4 font-bold">Status</th>
              <th className="px-5 py-4 font-bold">Destaque</th>
              <th className="px-5 py-4 font-bold">Ordem</th>
              <th className="px-5 py-4 text-right font-bold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {projects.map((p) => (
              <tr key={p.id} className="align-middle">
                <td className="px-5 py-4">
                  <span className="block font-semibold">{p.name}</span>
                  <span className="text-xs text-muted">/portfolio/{p.slug}</span>
                </td>
                <td className="px-5 py-4 text-white/80">{p.category}</td>
                <td className="px-5 py-4">
                  <form action={setProjectFlag.bind(null, p.id, "published", !p.published)}>
                    <button type="submit" className="cursor-pointer" aria-label={p.published ? "Despublicar" : "Publicar"}>
                      <PublishBadge published={p.published} />
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4">
                  <form action={setProjectFlag.bind(null, p.id, "featured", !p.featured)}>
                    <button type="submit" className={`rounded-full border px-3 py-1 text-xs font-bold ${p.featured ? "border-lime bg-lime/10 text-lime" : "border-line text-muted hover:text-white"}`}>
                      {p.featured ? "★ Em destaque" : "Destacar"}
                    </button>
                  </form>
                </td>
                <td className="px-5 py-4 text-muted">{p.sort_order}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/projetos/${p.id}`} className={btnGhost}>Editar</Link>
                    <form action={deleteProject.bind(null, p.id)}>
                      <ConfirmDeleteButton message={`Excluir o projeto "${p.name}"? Esta ação não pode ser desfeita.`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-muted">Nenhum projeto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
