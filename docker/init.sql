-- Roles for PostgREST
create role anon nologin;
create role authenticator noinherit login password 'password';
grant anon to authenticator;

-- Whitelist table
create table public.whitelist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  status text not null default 'waiting',
  created_at timestamptz default now()
);

-- Events table
create table public.events (
  id          uuid        default gen_random_uuid() primary key,
  user_email  text        not null,
  event_type  text        not null,
  params      jsonb,
  created_at  timestamptz default now()
);

-- Grant anon access
grant usage on schema public to anon;
grant select, insert, update, delete on public.whitelist to anon;
grant select, insert on public.events to anon;
