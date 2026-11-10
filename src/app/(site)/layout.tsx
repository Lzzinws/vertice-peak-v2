import type { ReactNode } from "react";
import { getSiteContent } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const { branding, contact, socials, footer } = await getSiteContent();
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, "Olá! Vim pelo site da Vértice Peak e gostaria de conversar.");
  const logoUrl = branding.logoUrl || undefined;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:text-ink"
      >
        Pular para o conteúdo
      </a>
      <SiteHeader logoUrl={logoUrl} />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter footer={footer} contact={contact} socials={socials} logoUrl={logoUrl} />
      <WhatsAppFloat url={whatsappUrl} />
    </>
  );
}
