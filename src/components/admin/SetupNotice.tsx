export function SetupNotice() {
  return (
    <div className="max-w-xl space-y-4 rounded-[14px] border border-lime/40 bg-surface p-8">
      <h1 className="text-xl font-black">Configure o Supabase</h1>
      <p className="text-sm leading-relaxed text-muted">
        O painel precisa de <code className="text-lime">NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
        <code className="text-lime">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Copie <code>.env.example</code> para{" "}
        <code>.env.local</code>, preencha os valores e reinicie o servidor. As instruções completas estão no README.
      </p>
    </div>
  );
}
