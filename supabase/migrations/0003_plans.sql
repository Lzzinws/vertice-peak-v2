-- Vértice Peak: planos e preços. Executar depois de 0001 e 0002.

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  description text check (description is null or char_length(description) <= 300),
  -- null = "sob consulta"
  price numeric(10, 2) check (price is null or (price >= 0 and price <= 1000000)),
  billing_period text not null default 'unico'
    check (billing_period in ('unico', 'mensal', 'anual')),
  features text[] not null default '{}',
  highlight boolean not null default false,
  cta_label text not null default 'Quero este plano'
    check (char_length(cta_label) between 2 and 40),
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists plans_public_idx on public.plans (published, sort_order);

create trigger plans_set_updated_at before update on public.plans
  for each row execute function public.set_updated_at();

alter table public.plans enable row level security;

create policy plans_public_read on public.plans
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));
create policy plans_admin_insert on public.plans
  for insert to authenticated with check ((select public.is_admin()));
create policy plans_admin_update on public.plans
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy plans_admin_delete on public.plans
  for delete to authenticated using ((select public.is_admin()));

grant select on public.plans to anon;
