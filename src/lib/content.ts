import "server-only";
import { cache } from "react";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { DEFAULT_SERVICES, DEFAULT_SITE_CONTENT } from "@/lib/defaults";
import type { Project, Service, SiteContent, Testimonial } from "@/lib/types";

/**
 * Leituras do site público. Usam apenas o cliente anon: o RLS garante que só conteúdo
 * publicado aparece. Se o banco não estiver configurado ou falhar, retornam o conteúdo
 * padrão (serviços e textos) ou listas vazias (portfólio e depoimentos), sem quebrar a página.
 */

function logFailure(scope: string, error: unknown) {
  console.error(`[conteudo:${scope}]`, error instanceof Error ? error.message : error);
}

/** Mescla o conteúdo salvo com o padrão, para que chaves novas nunca quebrem o site. */
export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const client = createPublicSupabaseClient();
  if (!client) return DEFAULT_SITE_CONTENT;
  try {
    const { data, error } = await client.from("site_settings").select("key, value");
    if (error) throw error;
    const stored = Object.fromEntries((data ?? []).map((row) => [row.key, row.value]));
    return {
      branding: { ...DEFAULT_SITE_CONTENT.branding, ...stored.branding },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...stored.contact },
      socials: { ...DEFAULT_SITE_CONTENT.socials, ...stored.socials },
      seo: { ...DEFAULT_SITE_CONTENT.seo, ...stored.seo },
      footer: { ...DEFAULT_SITE_CONTENT.footer, ...stored.footer },
      home: { ...DEFAULT_SITE_CONTENT.home, ...stored.home },
      about: { ...DEFAULT_SITE_CONTENT.about, ...stored.about },
    };
  } catch (error) {
    logFailure("settings", error);
    return DEFAULT_SITE_CONTENT;
  }
});

export const getPublishedServices = cache(async (): Promise<Service[]> => {
  const client = createPublicSupabaseClient();
  const fallback = DEFAULT_SERVICES.map((s, i) => ({
    id: `default-${i}`,
    image_url: null,
    published: true,
    sort_order: i,
    created_at: "",
    updated_at: "",
    ...s,
  }));
  if (!client) return fallback;
  try {
    const { data, error } = await client
      .from("services")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Service[];
  } catch (error) {
    logFailure("services", error);
    return fallback;
  }
});

export const getPublishedProjects = cache(async (category?: string): Promise<Project[]> => {
  const client = createPublicSupabaseClient();
  if (!client) return [];
  try {
    let query = client.from("projects").select("*").eq("published", true);
    if (category) query = query.eq("category", category);
    const { data, error } = await query.order("sort_order", { ascending: true }).order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Project[];
  } catch (error) {
    logFailure("projects", error);
    return [];
  }
});

export const getProjectBySlug = cache(async (slug: string): Promise<Project | null> => {
  const client = createPublicSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
    if (error) throw error;
    return (data as Project | null) ?? null;
  } catch (error) {
    logFailure("project", error);
    return null;
  }
});

export const getPublishedTestimonials = cache(async (): Promise<Testimonial[]> => {
  const client = createPublicSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []) as Testimonial[];
  } catch (error) {
    logFailure("testimonials", error);
    return [];
  }
});
