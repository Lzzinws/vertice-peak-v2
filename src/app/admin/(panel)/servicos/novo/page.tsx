import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/app/admin/(panel)/servicos/ServiceForm";
import { createService } from "@/app/admin/(panel)/servicos/actions";

export const metadata: Metadata = { title: "Novo serviço", robots: { index: false, follow: false } };

export default function NewServicePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Novo serviço" />
      <ServiceForm action={createService} />
    </div>
  );
}
