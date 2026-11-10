-- Vértice Peak: estrutura do banco
-- Executar no SQL Editor do Supabase (ou via supabase db push).

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Administradores: vínculo 1:1 com auth.users. Sem cadastro público.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 2 and 120),
  category text not null check (char_length(category) between 2 and 80),
  short_description text not null check (char_length(short_description) between 10 and 180),
  description text not null check (char_length(description) between 10 and 8000),
  cover_image_url text,
  gallery text[] not null default '{}',
  demo_url text check (demo_url is null or demo_url ~* '^https?://'),
  client_name text check (client_name is null or char_length(client_name) <= 120),
  technologies text[] not null default '{}',
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_public_idx on public.projects (published, sort_order, created_at desc);
create index if not exists projects_category_idx on public.projects (category) where published;
create index if not exists projects_featured_idx on public.projects (featured) where published;
create trigger projects_set_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  description text not null check (char_length(description) between 10 and 600),
  icon text not null default 'sparkles'
    check (icon in ('globe', 'target', 'book-open', 'megaphone', 'image', 'pen-tool', 'sparkles')),
  image_url text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists services_public_idx on public.services (published, sort_order);
create trigger services_set_updated_at before update on public.services
  for each row execute function public.set_updated_at();

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (char_length(client_name) between 2 and 120),
  company text check (company is null or char_length(company) <= 120),
  quote text not null check (char_length(quote) between 10 and 800),
  photo_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists testimonials_public_idx on public.testimonials (published, sort_order);
create trigger testimonials_set_updated_at before update on public.testimonials
  for each row execute function public.set_updated_at();

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  company text check (company is null or char_length(company) <= 120),
  email text not null check (char_length(email) between 5 and 160 and email like '%_@_%'),
  whatsapp text not null check (char_length(whatsapp) between 10 and 30),
  service text not null check (char_length(service) between 2 and 120),
  budget text check (budget is null or char_length(budget) <= 60),
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'novo'
    check (status in ('novo', 'em_atendimento', 'convertido', 'arquivado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads (status, created_at desc);
create trigger leads_set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- Configurações em chave/valor. Chaves usadas: branding, contact, socials, seo, footer, home, about.
-- Nunca guardar segredos aqui: a tabela é legível publicamente.
create table if not exists public.site_settings (
  key text primary key check (key ~ '^[a-z_]{2,40}$'),
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
create trigger site_settings_set_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();
