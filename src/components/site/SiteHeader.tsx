import Link from "next/link";
import { Logo } from "@/components/site/Logo";
import { btnPrimary } from "@/lib/ui";

const NAV = [
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/portfolio", label: "Portfólio" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader({ logoUrl }: { logoUrl?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="Vértice Peak, página inicial" className="rounded-md">
          <Logo logoUrl={logoUrl} />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 text-sm font-semibold text-white/80 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-lime">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/contato" className={`${btnPrimary} hidden sm:inline-flex`}>
            Fale conosco
          </Link>
          <details className="relative md:hidden">
            <summary
              aria-label="Abrir menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line text-lime marker:hidden [&::-webkit-details-marker]:hidden"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ≡
              </span>
            </summary>
            <nav
              aria-label="Menu mobile"
              className="absolute right-0 mt-3 flex w-56 flex-col rounded-[14px] border border-line bg-surface p-2 shadow-2xl"
            >
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-4 py-3 text-sm font-semibold hover:bg-lime/10 hover:text-lime">
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
