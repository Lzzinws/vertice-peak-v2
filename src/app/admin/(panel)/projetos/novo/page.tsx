import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/app/admin/(panel)/projetos/ProjectForm";
import { createProject } from "@/app/admin/(panel)/projetos/actions";

export const metadata: Metadata = { title: "Novo projeto", robots: { index: false, follow: false } };

export default function NewProjectPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Novo projeto" description="Preencha as informações. Você pode salvar como rascunho e publicar depois." />
      <ProjectForm action={createProject} />
    </div>
  );
}
