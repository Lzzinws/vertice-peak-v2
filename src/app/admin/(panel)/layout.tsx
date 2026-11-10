import type { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, FolderKanban, Briefcase, Quote, Inbox, FileText, Settings, LogOut, Home as HomeIcon } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { signOut } from "@/app/admin/login/actions";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { Logo } from "@/components/site/Logo";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/contatos", label: "Contatos", icon: Inbox },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/servicos", label: "Serviços", icon: Briefcase },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
  { href: "/admin/conteudo/home", label: "Textos da home", icon: HomeIcon },
  { href: "/admin/conteudo/sobre", label: "Sobre nós", icon: FileText },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <main className="grid min-h-screen place-items-center p-6"><SetupNotice /></main>;
  }
  const admin = await requireAdmin();

  return (
    <div className="min-h-screen bg-ink md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-ink-2 md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-4 p-5">
          <Link href="/admin" aria-label="Dashboard do painel">
            <Logo showWord={false} />
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-lime">Painel</span>
        </div>
        <nav aria-label="Painel" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-lime/10 hover:text-lime"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden space-y-3 border-t border-line p-4 md:block">
          <p className="truncate text-xs text-muted" title={admin.email}>{admin.email}</p>
          <div className="flex gap-2">
            <Link href="/" className="flex-1 rounded-full border border-line px-3 py-2 text-center text-xs font-semibold hover:border-lime hover:text-lime">Ver site</Link>
            <form action={signOut}>
              <button type="submit" className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-2 text-xs font-semibold hover:border-red-400 hover:text-red-300">
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sair
              </button>
            </form>
          </div>
        </div>
        <form action={signOut} className="px-3 pb-3 md:hidden">
          <button type="submit" className="text-xs font-semibold text-muted hover:text-red-300">Sair da conta</button>
        </form>
      </aside>
      <main className="min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
