"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/schemas";
import { getBoolean, getFiles, getFile, getString, invalid, zodErrorsToRecord, type ActionState } from "@/lib/action-state";
import { removeStorageUrls, revalidateSite } from "@/lib/admin";
import { uploadImage, validateImage } from "@/lib/storage";
import { slugify } from "@/lib/slug";

const MAX_GALLERY = 30;

async function saveProject(id: string | null, _prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();

  const slug = getString(formData, "slug") || slugify(getString(formData, "name"));
  const parsed = projectSchema.safeParse({
    name: getString(formData, "name"),
    slug,
    category: getString(formData, "category"),
    shortDescription: getString(formData, "shortDescription"),
    description: getString(formData, "description"),
    demoUrl: getString(formData, "demoUrl"),
    clientName: getString(formData, "clientName"),
    technologies: getString(formData, "technologies")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published: getBoolean(formData, "published"),
    featured: getBoolean(formData, "featured"),
    sortOrder: getString(formData, "sortOrder") || "0",
  });
  if (!parsed.success) return invalid(formData, zodErrorsToRecord(parsed.error));
  const data = parsed.data;

  // Imagens: capa e galeria.
  const coverFile = getFile(formData, "coverFile");
  const removeCover = getBoolean(formData, "removeCover");
  const currentCover = getString(formData, "currentCover") || null;

  const currentGallery = formData.getAll("galleryCurrent").map(String).filter(Boolean);
  const removedGallery = new Set(formData.getAll("galleryRemove").map(String));
  const keptGallery = currentGallery.filter((url) => !removedGallery.has(url));
  const newFiles = getFiles(formData, "galleryFiles");

  if (keptGallery.length + newFiles.length > MAX_GALLERY) {
    return invalid(formData, { galleryFiles: `A galeria aceita no máximo ${MAX_GALLERY} imagens.` });
  }
  for (const file of [coverFile, ...newFiles]) {
    if (!file) continue;
    const imageError = validateImage(file);
    if (imageError) return invalid(formData, { coverFile: imageError }, imageError);
  }

  const supabase = await createSupabaseServerClient();
  const folder = `projects/${data.slug}`;
  let coverUrl: string | null = removeCover ? null : currentCover;
  const gallery = [...keptGallery];

  try {
    if (coverFile) coverUrl = await uploadImage(supabase, coverFile, folder);
    for (const file of newFiles) gallery.push(await uploadImage(supabase, file, folder));
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Não foi possível enviar as imagens.", values: undefined };
  }

  const row = {
    name: data.name,
    slug: data.slug,
    category: data.category,
    short_description: data.shortDescription,
    description: data.description,
    demo_url: data.demoUrl || null,
    client_name: data.clientName || null,
    technologies: data.technologies,
    published: data.published,
    featured: data.featured,
    sort_order: data.sortOrder,
    cover_image_url: coverUrl,
    gallery,
  };

  const { error } = id
    ? await supabase.from("projects").update(row).eq("id", id)
    : await supabase.from("projects").insert(row);

  if (error) {
    if (error.code === "23505") return invalid(formData, { slug: "Já existe um projeto com este slug." });
    console.error("[projetos] erro ao salvar:", error.message);
    return { ok: false, message: "Não foi possível salvar o projeto. Tente novamente." };
  }

  // Limpa do Storage apenas arquivos que deixaram de ser usados.
  const replacedCover = currentCover && currentCover !== coverUrl ? currentCover : null;
  const droppedGallery = currentGallery.filter((url) => removedGallery.has(url));
  await removeStorageUrls(supabase, [replacedCover, ...droppedGallery]);

  revalidateSite();
  redirect(`/admin/projetos?saved=${id ? "atualizado" : "criado"}`);
}

export async function createProject(prev: ActionState, formData: FormData) {
  return saveProject(null, prev, formData);
}

export async function updateProject(id: string, prev: ActionState, formData: FormData) {
  return saveProject(id, prev, formData);
}

export async function deleteProject(id: string, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { data: current } = await supabase.from("projects").select("cover_image_url, gallery").eq("id", id).maybeSingle();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error("Não foi possível excluir o projeto.");
  await removeStorageUrls(supabase, [current?.cover_image_url, ...(current?.gallery ?? [])]);
  revalidateSite();
  redirect("/admin/projetos?saved=excluido");
}

export async function setProjectFlag(id: string, field: "published" | "featured", value: boolean, _formData?: FormData) {
  await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", id);
  if (error) throw new Error("Não foi possível atualizar o projeto.");
  revalidateSite();
  redirect("/admin/projetos?saved=atualizado");
}
