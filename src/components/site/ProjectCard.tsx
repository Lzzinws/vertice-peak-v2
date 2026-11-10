import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-surface transition hover:-translate-y-1 hover:border-lime/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-olive">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={`Capa do projeto ${project.name}`}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="bg-grid flex h-full items-center justify-center p-6">
            <span className="font-display text-center text-2xl text-lime/90">{project.name}</span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-ink/80 px-3 py-1 text-xs font-bold text-lime backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-xl font-black">{project.name}</h3>
        <p className="flex-1 text-sm leading-relaxed text-muted">{project.short_description}</p>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-lime">
          Ver projeto <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
