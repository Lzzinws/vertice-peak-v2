"use client";

import { useActionState, useMemo } from "react";
import Link from "next/link";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import { Checkbox, Field, GalleryInput, ImageInput, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";
import type { Project } from "@/lib/types";

type Props = {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  project?: Project;
};

export function ProjectForm({ action, project }: Props) {
  // Remonta os campos após um erro (via nonce) para exibir os valores digitados.
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />

      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Informações</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="name" label="Nome do projeto *" error={e.name}>
            <input id="name" name="name" required defaultValue={v("name", project?.name ?? "")} className={inputClass} />
          </Field>
          <Field id="slug" label="Slug (endereço)" error={e.slug} help="Deixe vazio para gerar a partir do nome. Ex.: amora-beauty-studio">
            <input id="slug" name="slug" defaultValue={v("slug", project?.slug ?? "")} className={inputClass} />
          </Field>
          <Field id="category" label="Categoria *" error={e.category} help="Ex.: Beleza e estética, Automotivo, Saúde e odontologia">
            <input id="category" name="category" list="categorias" required defaultValue={v("category", project?.category ?? "")} className={inputClass} />
          </Field>
          <Field id="sortOrder" label="Ordem de exibição" error={e.sortOrder} help="Menor número aparece primeiro.">
            <input id="sortOrder" name="sortOrder" type="number" min={0} max={9999} defaultValue={v("sortOrder", String(project?.sort_order ?? 0))} className={inputClass} />
          </Field>
          <Field id="clientName" label="Cliente (opcional)" error={e.clientName}>
            <input id="clientName" name="clientName" defaultValue={v("clientName", project?.client_name ?? "")} className={inputClass} />
          </Field>
          <Field id="demoUrl" label="Link de demonstração" error={e.demoUrl} help="Endereço completo com https://">
            <input id="demoUrl" name="demoUrl" type="url" defaultValue={v("demoUrl", project?.demo_url ?? "")} className={inputClass} />
          </Field>
        </div>
        <Field id="technologies" label="Tecnologias utilizadas" error={e.technologies} help="Separe por vírgulas. Ex.: Next.js, Tailwind CSS">
          <input id="technologies" name="technologies" defaultValue={v("technologies", (project?.technologies ?? []).join(", "))} className={inputClass} />
        </Field>
        <datalist id="categorias">
          {["Beleza e estética", "Automotivo", "Saúde e odontologia"].map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </section>

      <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Textos</h2>
        <Field id="shortDescription" label="Descrição curta *" error={e.shortDescription} help="Até 180 caracteres. Aparece nos cards do portfólio.">
          <textarea id="shortDescription" name="shortDescription" rows={2} required defaultValue={v("shortDescription", project?.short_description ?? "")} className={inputClass} />
        </Field>
        <Field id="description" label="Descrição completa *" error={e.description} help="Use linhas em branco para separar parágrafos.">
          <textarea id="description" name="description" rows={8} required defaultValue={v("description", project?.description ?? "")} className={inputClass} />
        </Field>
      </section>

      <section className="grid gap-6 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Imagens</h2>
        <ImageInput
          label="Imagem de capa"
          fileName="coverFile"
          currentName="currentCover"
          removeName="removeCover"
          current={project?.cover_image_url}
          error={e.coverFile}
          help="Recomendado: 1600 × 1000 px (proporção 16:10)."
        />
        <GalleryInput current={project?.gallery ?? []} error={e.galleryFiles} />
      </section>

      <section className="grid gap-4 rounded-[14px] border border-line bg-surface p-6">
        <h2 className="text-lg font-black">Publicação</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Checkbox name="published" label="Publicado no site" defaultChecked={state.values ? state.values.published === "on" : project?.published ?? false} help="Desmarcado = rascunho, invisível ao público." />
          <Checkbox name="featured" label="Destaque na página inicial" defaultChecked={state.values ? state.values.featured === "on" : project?.featured ?? false} help="Projetos em destaque aparecem primeiro na home." />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{project ? "Salvar alterações" : "Cadastrar projeto"}</SubmitButton>
        <Link href="/admin/projetos" className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-white/80 hover:border-lime hover:text-lime">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
