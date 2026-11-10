import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getPublishedProjects, getPublishedServices, getPublishedTestimonials, getSiteContent } from "@/lib/content";
import { PROCESS_STEPS } from "@/lib/defaults";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ProjectCard } from "@/components/site/ProjectCard";
import { TestimonialCard } from "@/components/site/TestimonialCard";
import { btnPrimary, btnSecondary, card, eyebrow } from "@/lib/ui";
import { absoluteUrl } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSiteContent();
  return { title: seo.siteTitle, description: seo.siteDescription, alternates: { canonical: absoluteUrl("/") } };
}

export default async function HomePage() {
  const [content, services, projects, testimonials] = await Promise.all([
    getSiteContent(),
    getPublishedServices(),
    getPublishedProjects(),
    getPublishedTestimonials(),
  ]);
  const { home, about, contact, branding } = content;
  const featured = projects.filter((p) => p.featured);
  const teaser = (featured.length ? featured : projects).slice(0, 3);
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, "Olá! Gostaria de conversar sobre um projeto.");
  const showBanner = home.bannerEnabled && (home.bannerTitle || home.bannerText);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-line bg-grid">
        <div aria-hidden="true" className="glow pointer-events-none absolute -right-40 -top-40 -z-10 h-[620px] w-[620px] rounded-full opacity-70" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1.25fr_1fr]">
          <div className="animate-rise space-y-7">
            {home.eyebrow && <p className={eyebrow}>{home.eyebrow}</p>}
            <h1 className="text-4xl font-black sm:text-6xl lg:text-7xl">
              {home.heroTitle} {home.heroHighlight && <span className="text-lime">{home.heroHighlight}</span>}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{home.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3">
              {home.primaryCta && (
                <Link href="/portfolio" className={btnPrimary}>
                  {home.primaryCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
              {home.secondaryCta && (
                <Link href="/contato" className={btnSecondary}>
                  {home.secondaryCta}
                </Link>
              )}
            </div>
            <ul className="flex flex-wrap gap-2 pt-2 text-xs font-semibold text-white/80">
              {["Sites profissionais", "Design e identidade visual", "Conteúdo e materiais criativos"].map((t) => (
                <li key={t} className="rounded-full border border-line bg-ink-2/70 px-4 py-2">
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-rise-delay relative hidden lg:block" aria-hidden="true">
            <svg viewBox="0 0 400 400" className="w-full drop-shadow-[0_0_60px_rgb(182_255_0/0.25)]">
              <path d="M40 360 200 60l160 300h-70L200 210 110 360z" fill="#B6FF00" />
              <path d="M200 60l160 300h-70L200 210z" fill="#8fd000" />
              <path d="M0 360h400" stroke="#B6FF00" strokeOpacity="0.35" />
            </svg>
          </div>
        </div>
        {home.positioning && (
          <div className="border-t border-line bg-ink-2/60">
            <p className="mx-auto max-w-6xl px-4 py-5 text-sm font-semibold text-lime sm:px-6">{home.positioning}</p>
          </div>
        )}
      </section>

      {/* Quem somos */}
      <section className="reveal mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <SectionHeading kicker="Quem somos" title={about.heading} />
        <div className="space-y-5 text-base leading-relaxed text-muted">
          {about.history.split(/\n\s*\n/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <Link href="/sobre" className="inline-flex items-center gap-2 font-bold text-lime hover:underline">
            Conheça a Vértice Peak <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Serviços */}
      <section className="border-y border-line bg-ink-2/50 py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          <SectionHeading kicker="Nossos serviços" title={home.servicesHeading} subtitle={home.servicesSubtitle} />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <div key={service.id} className="reveal">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          <Link href="/servicos" className={btnSecondary}>
            Ver todos os serviços
          </Link>
        </div>
      </section>

      {showBanner && (
        <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
          <div className="relative overflow-hidden rounded-[14px] border border-lime/40 bg-olive p-8 sm:p-12">
            {home.bannerImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- banner enviado pelo painel
              <img src={home.bannerImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
            )}
            <div className="relative max-w-2xl space-y-4">
              <h2 className="text-3xl font-black">{home.bannerTitle}</h2>
              <p className="text-white/80">{home.bannerText}</p>
              {home.bannerLinkUrl && home.bannerLinkLabel && (
                <a href={home.bannerLinkUrl} target="_blank" rel="noopener noreferrer" className={btnPrimary}>
                  {home.bannerLinkLabel}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Portfólio */}
      <section className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6">
        <SectionHeading kicker="Portfólio" title={home.portfolioHeading} subtitle={home.portfolioSubtitle} />
        {teaser.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teaser.map((project) => (
              <div key={project.id} className="reveal">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <p className={`${card} text-muted`}>Os projetos publicados aparecerão aqui em breve.</p>
        )}
        {projects.length > 0 && (
          <Link href="/portfolio" className={btnSecondary}>
            Ver portfólio completo
          </Link>
        )}
      </section>

      {/* Diferenciais */}
      <section className="border-t border-line py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <SectionHeading kicker="Diferenciais" title={about.purposeHeading} subtitle={about.purpose} />
          <ul className="grid gap-3 self-center">
            {about.differentials.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-[14px] border border-line bg-surface p-5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-white/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Processo */}
      <section className="border-t border-line bg-ink-2/50 py-20">
        <div className="mx-auto max-w-6xl space-y-12 px-4 sm:px-6">
          <SectionHeading kicker="Processo" title="Da ideia" highlight="ao digital." />
          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step.title} className={`${card} reveal space-y-3`}>
                <span className="font-display text-3xl text-lime">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-black">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Depoimentos: somente conteúdo publicado no painel. Nunca são inventados. */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6">
          <SectionHeading kicker="Depoimentos" title="O que dizem sobre" highlight="nosso trabalho." />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.id} className="reveal">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-[14px] border border-lime/40 bg-olive px-8 py-14 text-center sm:px-14">
          <div aria-hidden="true" className="glow pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <div className="relative mx-auto max-w-2xl space-y-6">
            <h2 className="text-3xl font-black sm:text-4xl">{home.ctaTitle}</h2>
            <p className="text-white/80">{home.ctaText}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contato" className={btnPrimary}>Solicitar orçamento</Link>
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={btnSecondary}>
                  Falar pelo WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
