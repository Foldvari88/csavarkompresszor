create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',
  email text not null,
  company_name text not null,
  input jsonb not null,
  result jsonb not null
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_company_name_idx on public.leads (company_name);
