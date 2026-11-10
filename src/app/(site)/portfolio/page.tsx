import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedProjects, getSiteContent } from "@/lib/content";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProjectCard } from "@/components/site/ProjectCard";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfólio",
  description: "Projetos e modelos de sites, landing pages e identidades visuais desenvolvidos pela Vértice Peak.",
  alternates: { canonical: absoluteUrl("/portfolio") },
};

export default async function PortfolioPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const [allProjects, { home }] = await Promise.all([getPublishedProjects(), getSiteContent()]);
  const categories = Array.from(new Set(allProjects.map((p) => p.category))).sort();
  const selected = categoria && categories.includes(categoria) ? categoria : null;
  const projects = selected ? allProjects.filter((p) => p.category === selected) : allProjects;

  return (
    <>
      <section className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading kicker="Portfólio" title={home.portfolioHeading} subtitle={home.portfolioSubtitle} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 py-16 sm:px-6">
        {categories.length > 0 && (
          <nav aria-label="Filtrar por categoria" className="flex flex-wrap gap-2">
            <FilterChip href="/portfolio" active={!selected} label="Todos" />
            {categories.map((c) => (
              <FilterChip key={c} href={`/portfolio?categoria=${encodeURIComponent(c)}`} active={selected === c} label={c} />
            ))}
          </nav>
        )}

        {projects.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Nenhum projeto publicado nesta categoria ainda.</p>
        )}
      </section>
    </>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-lime bg-lime text-ink" : "border-line text-white/80 hover:border-lime hover:text-lime"
      }`}
    >
      {label}
    </Link>
  );
}
