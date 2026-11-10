import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { SetupNotice } from "@/components/admin/SetupNotice";
import { Logo } from "@/components/site/Logo";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Entrar", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (!isSupabaseConfigured()) {
    return <main className="grid min-h-screen place-items-center p-6"><SetupNotice /></main>;
  }
  if (await getCurrentAdmin()) redirect("/admin");

  return (
    <main className="grid min-h-screen place-items-center bg-grid px-4 py-16">
      <div className="w-full max-w-sm space-y-8 rounded-[14px] border border-line bg-surface p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="text-xl font-black">Painel administrativo</h1>
            <p className="mt-1 text-sm text-muted">Acesso restrito à equipe Vértice Peak.</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
