import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/app/admin/(panel)/servicos/ServiceForm";
import { updateService } from "@/app/admin/(panel)/servicos/actions";
import type { Service } from "@/lib/types";

export const metadata: Metadata = { title: "Editar serviço", robots: { index: false, follow: false } };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const service = data as Service;
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title={service.title} />
      <ServiceForm action={updateService.bind(null, service.id)} service={service} />
    </div>
  );
}
