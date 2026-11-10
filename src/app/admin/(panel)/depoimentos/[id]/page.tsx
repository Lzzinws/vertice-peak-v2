import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/ui";
import { TestimonialForm } from "@/app/admin/(panel)/depoimentos/TestimonialForm";
import { updateTestimonial } from "@/app/admin/(panel)/depoimentos/actions";
import type { Testimonial } from "@/lib/types";

export const metadata: Metadata = { title: "Editar depoimento", robots: { index: false, follow: false } };

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const testimonial = data as Testimonial;
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title={testimonial.client_name} />
      <TestimonialForm action={updateTestimonial.bind(null, testimonial.id)} testimonial={testimonial} />
    </div>
  );
}
