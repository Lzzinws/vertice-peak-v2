import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPlans, getSiteContent } from "@/lib/content";
import { SectionHeading } from "@/components/site/SectionHeading";
import { PlanCard } from "@/components/site/PlanCard";
import { absoluteUrl } from "@/lib/seo";
import { btnSecondary } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Planos e preços",
  description: "Conheça os planos e preços para criação de sites, landing pages e identidades visuais.",
  alternates: { canonical: absoluteUrl("/planos") },
};

export default async function PlanosPage() {
  const [plans] = await Promise.all([getPublishedPlans(), getSiteContent()]);
  return (
    <>
      <section className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading kicker="Planos e preços" title="Escolha o plano" highlight="ideal para a sua marca." subtitle="Preços transparentes, com entrega planejada. Não encontrou o que procura? Fale com a gente e montamos uma proposta sob medida." />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        {plans.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="space-y-6 text-center">
            <p className="text-muted">Os planos serão publicados em breve.</p>
            <Link href="/contato" className={btnSecondary}>Solicitar uma proposta</Link>
          </div>
        )}
      </section>
    </>
  );
}
