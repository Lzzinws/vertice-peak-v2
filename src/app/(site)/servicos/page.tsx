import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices, getSiteContent } from "@/lib/content";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { absoluteUrl } from "@/lib/seo";
import { btnPrimary } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Serviços",
  description: "Criação de sites, landing pages, catálogos digitais, marketing digital e identidade visual.",
  alternates: { canonical: absoluteUrl("/servicos") },
};

export default async function ServicosPage() {
  const [services, { home }] = await Promise.all([getPublishedServices(), getSiteContent()]);
  return (
    <>
      <section className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading kicker="Serviços" title={home.servicesHeading} subtitle={home.servicesSubtitle} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        {services.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p className="text-muted">Nossos serviços estão sendo atualizados.</p>
        )}
        <div className="mt-16 flex flex-col items-start gap-5 rounded-[14px] border border-lime/40 bg-olive p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
          <p className="max-w-xl text-lg font-bold">Não encontrou o que procura? Conte o seu desafio e montamos uma solução sob medida.</p>
          <Link href="/contato" className={btnPrimary}>Solicitar orçamento</Link>
        </div>
      </section>
    </>
  );
}
