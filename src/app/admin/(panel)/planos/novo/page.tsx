import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { PlanForm } from "@/app/admin/(panel)/planos/PlanForm";
import { createPlan } from "@/app/admin/(panel)/planos/actions";

export const metadata: Metadata = { title: "Novo plano", robots: { index: false, follow: false } };

export default function NewPlanPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Novo plano" description="Preencha os dados e veja a prévia ao lado." />
      <PlanForm action={createPlan} />
    </div>
  );
}
