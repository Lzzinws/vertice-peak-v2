import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getProjectBySlug } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { splitParagraphs } from "@/lib/format";
import { btnPrimary, btnSecondary, card } from "@/lib/ui";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projeto não encontrado" };
  return {
    title: project.name,
    description: project.short_description,
    alternates: { canonical: absoluteUrl(`/portfolio/${project.slug}`) },
    openGraph: {
      title: project.name,
      description: project.short_description,
      images: project.cover_image_url ? [{ url: project.cover_image_url }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article>
      <header className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-16 sm:px-6 md:py-24">
          <Link href="/portfolio" className="text-sm font-semibold text-lime hover:underline">
            ← Voltar ao portfólio
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-lime">{project.category}</p>
          <h1 className="text-4xl font-black sm:text-6xl">{project.name}</h1>
          <p className="max-w-2xl text-lg leading-relaxed text-white/75">{project.short_description}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                Visualizar projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <Link href="/contato" className={btnSecondary}>Quero um site assim</Link>
          </div>
        </div>
      </header>

      {project.cover_image_url && (
        <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
          <div className="relative aspect-video overflow-hidden rounded-[14px] border border-line bg-olive">
            <Image
              src={project.cover_image_url}
              alt={`Capa do projeto ${project.name}`}
              fill
              priority
              sizes="(min-width: 1024px) 1152px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5">
          <h2 className="text-2xl font-black">Sobre o projeto</h2>
          {splitParagraphs(project.description).map((p, i) => (
            <p key={i} className="leading-relaxed text-muted">{p}</p>
          ))}
        </div>
        <aside className={`${card} h-fit space-y-6`}>
          {project.client_name && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lime">Cliente</p>
              <p className="mt-1 font-semibold">{project.client_name}</p>
            </div>
          )}
          {project.technologies.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-lime">Tecnologias</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-white/80">{t}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {project.gallery.length > 0 && (
        <section className="mx-auto max-w-6xl space-y-6 px-4 pb-24 sm:px-6">
          <h2 className="text-2xl font-black">Galeria</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((src, i) => (
              <div key={src} className="relative aspect-video overflow-hidden rounded-[14px] border border-line bg-olive">
                <Image src={src} alt={`${project.name}, imagem ${i + 1}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
