import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { AboutForm } from "@/app/admin/(panel)/conteudo/sobre/AboutForm";
import { saveAbout } from "@/app/admin/(panel)/conteudo/actions";

export const metadata: Metadata = { title: "Sobre nós", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AboutSettingsPage() {
  const { about } = await getSiteContent();
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Sobre nós" description="História, propósito e diferenciais exibidos em /sobre." />
      <AboutForm action={saveAbout} about={about} />
    </div>
  );
}
