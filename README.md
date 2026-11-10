# Vértice Peak — site institucional + painel administrativo

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres, Storage) · Vercel.

- **Site público:** `/`, `/sobre`, `/servicos`, `/portfolio`, `/portfolio/[slug]`, `/contato`.
- **Painel:** `/admin` (somente administradores cadastrados na tabela `admins`).
- **Conteúdo dinâmico:** tudo que é salvo no painel aparece no site imediatamente (cada páginas é renderizada no servidor e o cache é invalidado após cada alteração). Não há deploy manual para atualizar conteúdo.

## 1. Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev
```

Sem as variáveis do Supabase, o site público continua no ar com o conteúdo padrão (textos extraídos do site atual), e o painel mostra a tela de configuração.

## 2. Configurar o Supabase

1. **Crie um projeto** em https://supabase.com/dashboard.
2. **Desative o cadastro público**: *Authentication → Sign In / Providers → Email* e desmarque **Allow new users to sign up**. Assim ninguém cria conta sozinho.
3. **Rode as migrações** no *SQL Editor*, nesta ordem:
   1. `supabase/migrations/0001_schema.sql` (tabelas e índices)
   2. `supabase/migrations/0002_rls.sql` (funções, políticas RLS e bucket `media`)
   3. `supabase/seed.sql` (configurações iniciais, serviços e os 3 modelos do site atual). Pode rodar de novo sem duplicar nada.
4. **Crie o administrador**: em *Authentication → Users → Add user → Create new user*, informe o e-mail e uma senha forte. Depois rode no *SQL Editor* (troque o e-mail):

   ```sql
   insert into public.admins (user_id, email)
   select id, email from auth.users where email = 'seu-email@exemplo.com'
   on conflict (user_id) do nothing;
   ```

   Só contas listadas em `admins` acessam o painel, mesmo que façam login.
5. **Copie as chaves**: *Project Settings → API* → `Project URL` e `anon public` para `.env.local` e para a Vercel.

Bucket `media`: é criado pela migração 0002, público para leitura, com limite de 5 MB e tipos de imagem permitidos. Só admins enviam arquivos.

### Modelo de segurança

- **Visitantes** leem apenas conteúdo publicado, podem inserir leads com status `novo` e não leem contatos.
- **Admins** (`public.is_admin()`) têm acesso completo, validado pelo RLS no banco.
- **Server actions** verificam `requireAdmin()` e validam dados com zod antes de gravar.
- **Proxy** (`src/proxy.ts`) redireciona `/admin/*` para o login sem sessão.
- Só a chave `anon` é usada no frontend. Nenhuma service role é lida pelo projeto.

## 3. Deploy na Vercel

1. Importe o repositório em https://vercel.com/new.
2. Em *Environment Variables*, cadastre as três variáveis do `.env.example`. Use o domínio final em `NEXT_PUBLIC_SITE_URL`, por exemplo `https://www.verticepeak.com.br`.
3. Faça o deploy. Não há etapa de build com banco, então o deploy não depende do Supabase estar no ar.
4. Em *Authentication → URL Configuration* do Supabase, adicione o domínio da Vercel em *Site URL* e em *Redirect URLs*.

## 4. Itens a configurar no painel depois do deploy

- **WhatsApp e e-mail comercial** ficam como "a configurar" (*Configurações → Contato comercial*). Quando preencher o WhatsApp, o botão flutuante e os botões de contato aparecem automaticamente.
- **Logo, favicon e imagem de compartilhamento** (*Configurações → Identidade e SEO*).
- **Capas e galerias** dos três modelos de demonstração (*Projetos*). Eles aparecem como rascunho visual até receberem imagens.
- **Depoimentos**: só cadastre os que o cliente autorizou. A seção não aparece enquanto não houver depoimento publicado.

## 5. Testes

```bash
npm test          # testes unitários: validação, WhatsApp, slugs, uploads
npm run lint
npm run build
```

As permissões do banco foram testadas com um Postgres 16 local, com um shim do schema `auth` e `storage`, em 38 cenários (visitante, usuário logado sem ser admin e admin). Reexecute esses testes no projeto Supabase real antes de ir ao ar.

## Estrutura

```
src/
  app/
    (site)/         páginas públicas (com cabeçalho e rodapé)
    admin/          login e painel (rotas protegidas)
    layout.tsx      html/body e metadados dinâmicos
    sitemap.ts, robots.ts
  components/       site/ (público) e admin/ (painel)
  lib/              acesso ao Supabase, validação (zod), conteúdo, uploads, SEO
  proxy.ts          renovação de sessão e proteção de /admin
supabase/
  migrations/       0001_schema.sql, 0002_rls.sql
  seed.sql
tests/              testes unitários (vitest)
```

## Limitações conhecidas

- As páginas públicas são renderizadas a cada requisição, para que as alterações do painel apareçam sem demora. Se o tráfego crescer, dá para migrar para cache com revalidação por tag.
- Imagens removidas de projetos, serviços e depoimentos são apagadas do Storage. Uploads cancelados por erro de banco podem deixar arquivos órfãos.
- A validação do formulário de contato tem honeypot, mas não tem limite de envios por IP. Se houver spam, a próxima etapa é adicionar um CAPTCHA.
