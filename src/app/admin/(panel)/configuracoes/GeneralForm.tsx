"use client";

import { useActionState, useMemo } from "react";
import { INITIAL_STATE, withNonce, type ActionState } from "@/lib/action-state";
import type { SiteContent } from "@/lib/types";
import { Field, ImageInput, inputClass } from "@/components/admin/fields";
import { FormAlert } from "@/components/admin/ui";
import { SubmitButton } from "@/components/admin/buttons";

export function GeneralForm({ action, content }: { action: (prev: ActionState, formData: FormData) => Promise<ActionState>; content: SiteContent }) {
  const wrapped = useMemo(() => withNonce(action), [action]);
  const [state, formAction] = useActionState(wrapped, INITIAL_STATE);
  const v = (name: string, initial: string) => (state.values ? (state.values[name] ?? "") : initial);
  const e = state.errors ?? {};
  const { branding, contact, socials, seo, footer } = content;

  return (
    <form action={formAction} key={state.nonce ?? 0} className="grid gap-8" noValidate>
      <FormAlert state={state} />

      <Section title="Identidade">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageInput label="Logo" fileName="logoFile" currentName="currentLogo" removeName="removeLogo" current={branding.logoUrl || null} allowSvg help="Use PNG com fundo transparente ou SVG. Se vazio, o site usa a marca padrão." error={e.logo} />
          <ImageInput label="Favicon" fileName="faviconFile" currentName="currentFavicon" removeName="removeFavicon" current={branding.faviconUrl || null} allowSvg help="Quadrado, 512 × 512 px (PNG ou SVG)." error={e.favicon} />
        </div>
      </Section>

      <Section title="Contato comercial">
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="whatsapp" label="WhatsApp" error={e["contact.whatsapp"]} help="Número com DDD, ex.: (11) 91234-5678. Deixe vazio para ocultar o botão.">
            <input id="whatsapp" name="whatsapp" type="tel" defaultValue={v("whatsapp", contact.whatsapp)} placeholder="A configurar" className={inputClass} />
          </Field>
          <Field id="email" label="E-mail comercial" error={e["contact.email"]}>
            <input id="email" name="email" type="email" defaultValue={v("email", contact.email)} placeholder="A configurar" className={inputClass} />
          </Field>
          <Field id="phone" label="Telefone (opcional)" error={e["contact.phone"]}>
            <input id="phone" name="phone" defaultValue={v("phone", contact.phone)} className={inputClass} />
          </Field>
          <Field id="hours" label="Horário de atendimento" error={e["contact.hours"]}>
            <input id="hours" name="hours" defaultValue={v("hours", contact.hours)} className={inputClass} />
          </Field>
        </div>
        <Field id="address" label="Endereço (opcional)" error={e["contact.address"]}>
          <input id="address" name="address" defaultValue={v("address", contact.address)} className={inputClass} />
        </Field>
      </Section>

      <Section title="Redes sociais (links completos com https://)">
        <div className="grid gap-5 md:grid-cols-2">
          <Field id="instagram" label="Instagram" error={e["socials.instagram"]}><input id="instagram" name="instagram" type="url" defaultValue={v("instagram", socials.instagram)} className={inputClass} /></Field>
          <Field id="facebook" label="Facebook" error={e["socials.facebook"]}><input id="facebook" name="facebook" type="url" defaultValue={v("facebook", socials.facebook)} className={inputClass} /></Field>
          <Field id="linkedin" label="LinkedIn" error={e["socials.linkedin"]}><input id="linkedin" name="linkedin" type="url" defaultValue={v("linkedin", socials.linkedin)} className={inputClass} /></Field>
          <Field id="tiktok" label="TikTok" error={e["socials.tiktok"]}><input id="tiktok" name="tiktok" type="url" defaultValue={v("tiktok", socials.tiktok)} className={inputClass} /></Field>
          <Field id="youtube" label="YouTube" error={e["socials.youtube"]}><input id="youtube" name="youtube" type="url" defaultValue={v("youtube", socials.youtube)} className={inputClass} /></Field>
        </div>
      </Section>

      <Section title="SEO">
        <Field id="siteTitle" label="Título do site *" error={e["seo.siteTitle"]} help="Aparece na aba do navegador e nos resultados de busca.">
          <input id="siteTitle" name="siteTitle" required defaultValue={v("siteTitle", seo.siteTitle)} className={inputClass} />
        </Field>
        <Field id="siteDescription" label="Descrição do site *" error={e["seo.siteDescription"]} help="Entre 20 e 320 caracteres.">
          <textarea id="siteDescription" name="siteDescription" rows={3} required defaultValue={v("siteDescription", seo.siteDescription)} className={inputClass} />
        </Field>
        <Field id="keywords" label="Palavras-chave" error={e["seo.keywords"]} help="Separe por vírgulas.">
          <input id="keywords" name="keywords" defaultValue={v("keywords", seo.keywords)} className={inputClass} />
        </Field>
        <ImageInput label="Imagem de compartilhamento (Open Graph)" fileName="ogFile" currentName="currentOgImage" removeName="removeOgImage" current={seo.ogImageUrl || null} help="Recomendado: 1200 × 630 px." error={e["seo.ogImageUrl"]} />
      </Section>

      <Section title="Rodapé">
        <Field id="footerText" label="Texto do rodapé" error={e["footer.text"]}>
          <textarea id="footerText" name="footerText" rows={2} defaultValue={v("footerText", footer.text)} className={inputClass} />
        </Field>
        <Field id="copyright" label="Linha de copyright" error={e["footer.copyright"]} help="O ano é preenchido automaticamente.">
          <input id="copyright" name="copyright" defaultValue={v("copyright", footer.copyright)} className={inputClass} />
        </Field>
      </Section>

      <div>
        <SubmitButton>Salvar configurações</SubmitButton>
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

