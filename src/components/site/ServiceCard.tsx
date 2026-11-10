import { BookOpen, Globe, Image as ImageIcon, Megaphone, PenTool, Sparkles, Target, type LucideIcon } from "lucide-react";
import type { Service, ServiceIcon } from "@/lib/types";
import { card } from "@/lib/ui";

const ICONS: Record<ServiceIcon, LucideIcon> = {
  globe: Globe,
  target: Target,
  "book-open": BookOpen,
  megaphone: Megaphone,
  image: ImageIcon,
  "pen-tool": PenTool,
  sparkles: Sparkles,
};

export function ServiceCard({ service }: { service: Pick<Service, "title" | "description" | "icon" | "image_url"> }) {
  const Icon = ICONS[service.icon] ?? Sparkles;
  return (
    <article className={`${card} group flex h-full flex-col gap-5`}>
      {service.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem enviada pelo painel
        <img src={service.image_url} alt="" className="h-40 w-full rounded-[10px] object-cover" loading="lazy" />
      ) : (
        <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-lime text-ink transition group-hover:scale-110">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-black">{service.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{service.description}</p>
      </div>
    </article>
  );
}
