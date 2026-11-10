import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { getPublishedServices, getSiteContent } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LeadForm } from "./LeadForm";
import { absoluteUrl } from "@/lib/seo";
import { card, btnSecondary } from "@/lib/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contato",
  description: "Solicite um orçamento para o seu site, landing page, catálogo digital ou identidade visual.",
  alternates: { canonical: absoluteUrl("/contato") },
};

export default async function ContatoPage({ searchParams }: { searchParams: Promise<{ servico?: string }> }) {
  const { servico } = await searchParams;
  const [{ contact, socials }, services] = await Promise.all([getSiteContent(), getPublishedServices()]);
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, "Olá! Gostaria de conversar sobre um projeto.");
  const activeSocials = Object.entries(socials).filter(([, url]) => url) as [string, string][];

  const infos = [
    { icon: Mail, label: "E-mail", value: contact.email },
    { icon: Phone, label: "Telefone", value: contact.phone },
    { icon: MapPin, label: "Endereço", value: contact.address },
    { icon: Clock, label: "Horário", value: contact.hours },
  ].filter((i) => i.value);

  return (
    <>
      <section className="border-b border-line bg-grid">
        <div className="mx-auto max-w-6xl space-y-6 px-4 py-20 sm:px-6 md:py-28">
          <SectionHeading kicker="Contato" title="Vamos" highlight="conversar." subtitle="Fale direto com a gente e conte o que você deseja construir." />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <LeadForm services={services.map((s) => s.title)} initialService={servico?.slice(0, 120)} />

        <aside className="space-y-5">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${card} flex items-center gap-4 hover:bg-lime/5`}>
              <MessageCircle className="h-7 w-7 text-lime" aria-hidden="true" />
              <span>
                <span className="block font-black">Falar pelo WhatsApp</span>
                <span className="text-sm text-muted">Atendimento mais rápido</span>
              </span>
            </a>
          )}

          {infos.map((item) => (
            <div key={item.label} className={`${card} flex items-start gap-4`}>
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-lime">{item.label}</p>
                <p className="mt-1 text-sm text-white/85">{item.value}</p>
              </div>
            </div>
          ))}

          {!whatsappUrl && infos.length === 0 && (
            <p className={`${card} text-sm text-muted`}>As informações de contato serão divulgadas em breve.</p>
          )}

          {activeSocials.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {activeSocials.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className={btnSecondary.replace("px-6 py-3", "px-4 py-2")}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </a>
              ))}
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
