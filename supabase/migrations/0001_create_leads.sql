create table if not exists public.leads (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'new',
  customer_rating integer check (customer_rating between 1 and 5),
  email text not null,
  company_name text not null,
  input jsonb not null,
  result jsonb not null
);

alter table public.leads enable row level security;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_company_name_idx on public.leads (company_name);
