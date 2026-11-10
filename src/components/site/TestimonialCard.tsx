import { Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { card } from "@/lib/ui";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.client_name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <figure className={`${card} flex h-full flex-col gap-5`}>
      <Quote className="h-8 w-8 text-lime" aria-hidden="true" />
      <blockquote className="flex-1 text-sm leading-relaxed text-white/85">“{testimonial.quote}”</blockquote>
      <figcaption className="flex items-center gap-3">
        {testimonial.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- foto enviada pelo painel
          <img src={testimonial.photo_url} alt="" className="h-11 w-11 rounded-full object-cover" loading="lazy" />
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lime font-black text-ink">{initials}</span>
        )}
        <span>
          <span className="block text-sm font-bold">{testimonial.client_name}</span>
          {testimonial.company && <span className="block text-xs text-muted">{testimonial.company}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
