import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/app/admin/(panel)/projetos/ProjectForm";
import { updateProject } from "@/app/admin/(panel)/projetos/actions";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Editar projeto", robots: { index: false, follow: false } };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const project = data as Project;

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title={project.name} description={project.published ? "Publicado" : "Rascunho, não visível ao público"} />
      <ProjectForm action={updateProject.bind(null, project.id)} project={project} />
    </div>
  );
}
