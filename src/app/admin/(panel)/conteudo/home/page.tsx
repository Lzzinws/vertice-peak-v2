import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { PageHeader } from "@/components/admin/ui";
import { HomeForm } from "@/app/admin/(panel)/conteudo/home/HomeForm";
import { saveHome } from "@/app/admin/(panel)/conteudo/actions";

export const metadata: Metadata = { title: "Textos da home", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function HomeSettingsPage() {
  const { home } = await getSiteContent();
  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Textos da home" description="Títulos, subtítulos, chamadas e banner da página inicial." />
      <HomeForm action={saveHome} home={home} />
    </div>
  );
}
