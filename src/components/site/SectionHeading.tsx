import { eyebrow } from "@/lib/ui";

type Props = { kicker?: string; title: string; highlight?: string; subtitle?: string; align?: "left" | "center" };

/** Título de seção no padrão da marca: frase em branco com a parte de destaque em lime. */
export function SectionHeading({ kicker, title, highlight, subtitle, align = "left" }: Props) {
  const center = align === "center";
  return (
    <div className={`max-w-3xl space-y-4 ${center ? "mx-auto text-center" : ""}`}>
      {kicker && <p className={eyebrow}>{kicker}</p>}
      <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
        {title}
        {highlight && <span className="text-lime"> {highlight}</span>}
      </h2>
      {subtitle && <p className="text-base leading-relaxed text-muted sm:text-lg">{subtitle}</p>}
    </div>
  );
}
