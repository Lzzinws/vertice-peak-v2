import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { GeneralForm } from "@/app/admin/(panel)/configuracoes/GeneralForm";
import { saveGeneral } from "@/app/admin/(panel)/configuracoes/actions";

export const metadata: Metadata = { title: "Configurações", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const content = await getSiteContent();
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Configurações gerais" description="Logo, WhatsApp, redes sociais, SEO e rodapé do site." />
      <GeneralForm action={saveGeneral} content={content} />
    </div>
  );
}
