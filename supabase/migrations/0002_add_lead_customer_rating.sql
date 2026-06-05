alter table public.leads
  add column if not exists customer_rating integer check (customer_rating between 1 and 5);
