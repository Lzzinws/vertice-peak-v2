import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { PlanForm } from "@/app/admin/(panel)/planos/PlanForm";
import { updatePlan } from "@/app/admin/(panel)/planos/actions";
import type { Plan } from "@/lib/types";

export const metadata: Metadata = { title: "Editar plano", robots: { index: false, follow: false } };

export default async function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("plans").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const plan = data as Plan;
  return (
    <div className="space-y-6">
      <PageHeader title={plan.name} description={plan.published ? "Publicado" : "Rascunho, não visível ao público"} />
      <PlanForm action={updatePlan.bind(null, plan.id)} plan={plan} />
    </div>
  );
}
