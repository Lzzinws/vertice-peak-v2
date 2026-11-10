"use client";

import { useActionState, useMemo } from "react";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import type { HomeContent } from "@/lib/types";
import { Checkbox, Field, ImageInput, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export function HomeForm({ action, home }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; home: HomeContent }) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />

      <Section title="Topo (hero)">
        <Field id="eyebrow" label="Linha de destaque (acima do título)" error={e.eyebrow}>
          <input id="eyebrow" name="eyebrow" defaultValue={v("eyebrow", home.eyebrow)} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="heroTitle" label="Título principal *" error={e.heroTitle}>
            <input id="heroTitle" name="heroTitle" required defaultValue={v("heroTitle", home.heroTitle)} className={inputClass} />
          </Field>
          <Field id="heroHighlight" label="Trecho em destaque (lime)" error={e.heroHighlight}>
            <input id="heroHighlight" name="heroHighlight" defaultValue={v("heroHighlight", home.heroHighlight)} className={inputClass} />
          </Field>
        </div>
        <Field id="heroSubtitle" label="Subtítulo *" error={e.heroSubtitle}>
          <textarea id="heroSubtitle" name="heroSubtitle" rows={3} required defaultValue={v("heroSubtitle", home.heroSubtitle)} className={inputClass} />
        </Field>
        <Field id="positioning" label="Frase de posicionamento" error={e.positioning} help="Faixa abaixo do hero.">
          <input id="positioning" name="positioning" defaultValue={v("positioning", home.positioning)} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="primaryCta" label="Botão principal" error={e.primaryCta}>
            <input id="primaryCta" name="primaryCta" defaultValue={v("primaryCta", home.primaryCta)} className={inputClass} />
          </Field>
          <Field id="secondaryCta" label="Botão secundário" error={e.secondaryCta}>
            <input id="secondaryCta" name="secondaryCta" defaultValue={v("secondaryCta", home.secondaryCta)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Seções">
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="servicesHeading" label="Título da seção de serviços" error={e.servicesHeading}>
            <input id="servicesHeading" name="servicesHeading" defaultValue={v("servicesHeading", home.servicesHeading)} className={inputClass} />
          </Field>
          <Field id="portfolioHeading" label="Título da seção de portfólio" error={e.portfolioHeading}>
            <input id="portfolioHeading" name="portfolioHeading" defaultValue={v("portfolioHeading", home.portfolioHeading)} className={inputClass} />
          </Field>
        </div>
        <Field id="servicesSubtitle" label="Subtítulo de serviços" error={e.servicesSubtitle}>
          <textarea id="servicesSubtitle" name="servicesSubtitle" rows={2} defaultValue={v("servicesSubtitle", home.servicesSubtitle)} className={inputClass} />
        </Field>
        <Field id="portfolioSubtitle" label="Subtítulo de portfólio" error={e.portfolioSubtitle}>
          <textarea id="portfolioSubtitle" name="portfolioSubtitle" rows={2} defaultValue={v("portfolioSubtitle", home.portfolioSubtitle)} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="ctaTitle" label="Título da chamada final" error={e.ctaTitle}>
            <input id="ctaTitle" name="ctaTitle" defaultValue={v("ctaTitle", home.ctaTitle)} className={inputClass} />
          </Field>
          <Field id="ctaText" label="Texto da chamada final" error={e.ctaText}>
            <input id="ctaText" name="ctaText" defaultValue={v("ctaText", home.ctaText)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Banner promocional">
        <Checkbox
          name="bannerEnabled"
          label="Exibir banner na home"
          defaultChecked={state.values ? state.values.bannerEnabled === "on" : home.bannerEnabled}
          help="Aparece entre os serviços e o portfólio."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="bannerTitle" label="Título do banner" error={e.bannerTitle}>
            <input id="bannerTitle" name="bannerTitle" defaultValue={v("bannerTitle", home.bannerTitle)} className={inputClass} />
          </Field>
          <Field id="bannerText" label="Texto do banner" error={e.bannerText}>
            <input id="bannerText" name="bannerText" defaultValue={v("bannerText", home.bannerText)} className={inputClass} />
          </Field>
          <Field id="bannerLinkLabel" label="Texto do botão" error={e.bannerLinkLabel}>
            <input id="bannerLinkLabel" name="bannerLinkLabel" defaultValue={v("bannerLinkLabel", home.bannerLinkLabel)} className={inputClass} />
          </Field>
          <Field id="bannerLinkUrl" label="Link do botão" error={e.bannerLinkUrl} help="Com https://">
            <input id="bannerLinkUrl" name="bannerLinkUrl" defaultValue={v("bannerLinkUrl", home.bannerLinkUrl)} className={inputClass} />
          </Field>
        </div>
        <ImageInput label="Imagem de fundo do banner" fileName="bannerFile" currentName="currentBannerImage" removeName="removeBannerImage" current={home.bannerImageUrl || null} error={e.bannerFile} />
      </Section>

      <div>
        <SubmitButton>Salvar textos da home</SubmitButton>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-5 rounded-[14px] border border-line bg-surface p-6">
      <h2 className="text-lg font-black">{title}</h2>
      {children}
    </section>
  );
}
