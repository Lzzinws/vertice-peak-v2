import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { TestimonialForm } from "@/app/admin/(panel)/depoimentos/TestimonialForm";
import { createTestimonial } from "@/app/admin/(panel)/depoimentos/actions";

export const metadata: Metadata = { title: "Novo depoimento", robots: { index: false, follow: false } };

export default function NewTestimonialPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Novo depoimento" />
      <TestimonialForm action={createTestimonial} />
    </div>
  );
}
