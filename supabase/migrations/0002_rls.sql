-- Vértice Peak: funções, políticas RLS e bucket de imagens.

-- Verifica se o usuário autenticado é administrador.
-- SECURITY DEFINER evita recursão de RLS; search_path fixo evita sequestro de schema.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.leads enable row level security;
alter table public.site_settings enable row level security;

-- admins: cada admin só enxerga o próprio registro. Nenhuma escrita pela API;
-- novos admins são criados pelo SQL Editor (service role), nunca por um formulário público.
create policy admins_select_self on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- projects: visitantes veem só publicados; admins veem e escrevem tudo.
create policy projects_public_read on public.projects
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));
create policy projects_admin_insert on public.projects
  for insert to authenticated with check ((select public.is_admin()));
create policy projects_admin_update on public.projects
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy projects_admin_delete on public.projects
  for delete to authenticated using ((select public.is_admin()));

-- services
create policy services_public_read on public.services
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));
create policy services_admin_insert on public.services
  for insert to authenticated with check ((select public.is_admin()));
create policy services_admin_update on public.services
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy services_admin_delete on public.services
  for delete to authenticated using ((select public.is_admin()));

-- testimonials
create policy testimonials_public_read on public.testimonials
  for select to anon, authenticated
  using (published = true or (select public.is_admin()));
create policy testimonials_admin_insert on public.testimonials
  for insert to authenticated with check ((select public.is_admin()));
create policy testimonials_admin_update on public.testimonials
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy testimonials_admin_delete on public.testimonials
  for delete to authenticated using ((select public.is_admin()));

-- leads: visitantes apenas INSEREM, e só com status inicial 'novo'.
-- Não existe SELECT para anon: contatos privados nunca são lidos pelo público.
create policy leads_public_insert on public.leads
  for insert to anon, authenticated
  with check (status = 'novo');
create policy leads_admin_select on public.leads
  for select to authenticated
  using ((select public.is_admin()));
create policy leads_admin_update on public.leads
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy leads_admin_delete on public.leads
  for delete to authenticated using ((select public.is_admin()));

-- site_settings: leitura pública (nada sensível aqui), escrita só por admin.
create policy settings_public_read on public.site_settings
  for select to anon, authenticated
  using (true);
create policy settings_admin_insert on public.site_settings
  for insert to authenticated with check ((select public.is_admin()));
create policy settings_admin_update on public.site_settings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy settings_admin_delete on public.site_settings
  for delete to authenticated using ((select public.is_admin()));

-- Storage: bucket público para leitura de imagens; upload, troca e remoção só por admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy media_admin_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy media_admin_update on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy media_admin_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
-- Leitura de objetos: o bucket é público, então as URLs públicas funcionam sem política de SELECT.
-- Não criamos SELECT amplo para evitar que visitantes listem todos os arquivos.

-- Garantias de privilégio: anon só recebe o mínimo.
revoke all on public.admins from anon;
revoke all on public.leads from anon;
grant select on public.projects, public.services, public.testimonials, public.site_settings to anon;
grant insert on public.leads to anon;
