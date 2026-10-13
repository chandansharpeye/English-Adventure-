-- Run once in Supabase: SQL Editor > New query > Run
create table if not exists push_subs (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  hour int not null,
  offset int not null,
  last_sent text
);
create table if not exists scores (
  nick text primary key,
  xp int not null,
  updated_at timestamptz default now()
);
alter table push_subs enable row level security;
alter table scores enable row level security;
