import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { SectionHeading } from "@/components/site/SectionHeading";
import { absoluteUrl } from "@/lib/seo";
import { splitParagraphs } from "@/lib/format";
import { card } from "@/lib/ui";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSiteContent();
  return {
    title: "Sobre nós",
    description: about.purpose.slice(0, 160),
    alternates: { canonical: absoluteUrl("/sobre") },
  };
}

export default async function SobrePage() {
  const { about } = await getSiteContent();
  return (
    <>
      <section className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading kicker="Sobre nós" title={about.heading} />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-2xl font-black">Nossa história</h2>
          {splitParagraphs(about.history).map((p, i) => (
            <p key={i} className="leading-relaxed text-muted">{p}</p>
          ))}
        </div>
        <div className={`${card} space-y-4`}>
          <h2 className="text-2xl font-black">{about.purposeHeading}</h2>
          <p className="leading-relaxed text-muted">{about.purpose}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-10 px-4 pb-24 sm:px-6">
        <SectionHeading kicker="Diferenciais" title="Por que escolher a" highlight="Vértice Peak" />
        <ul className="grid gap-4 md:grid-cols-2">
          {about.differentials.map((item) => (
            <li key={item} className={`${card} text-sm font-semibold text-white/90`}>
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
