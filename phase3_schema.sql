-- Vanakam DSA — Phase 3: streaks, daily logs
-- Run in Supabase SQL Editor after supabase_schema.sql

-- ---------------------------------------------------------------------------
-- Profiles: longest streak
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists longest_streak integer not null default 0;

-- ---------------------------------------------------------------------------
-- Daily logs (one row per user per calendar day)
-- ---------------------------------------------------------------------------
create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  log_date date not null default (timezone('utc', now()))::date,
  hours_studied numeric not null default 0,
  goal_met boolean not null default false,
  unique (user_id, log_date)
);

create index if not exists daily_logs_user_id_log_date_idx
  on public.daily_logs (user_id, log_date desc);

comment on table public.daily_logs is 'Per-day study hours and 5-hour goal completion';

-- ---------------------------------------------------------------------------
-- Add study hours + apply streak / DSA day rules
-- ---------------------------------------------------------------------------
create or replace function public.update_daily_progress(
  user_uuid uuid,
  added_hours numeric
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  today date := (timezone('utc', now()))::date;
  log_row public.daily_logs%rowtype;
  prior_hours numeric := 0;
  goal_just_met boolean := false;
  new_streak integer;
begin
  if auth.uid() is distinct from user_uuid then
    raise exception 'Unauthorized';
  end if;

  if added_hours is null or added_hours <= 0 then
    raise exception 'added_hours must be positive';
  end if;

  select coalesce(hours_studied, 0)
  into prior_hours
  from public.daily_logs
  where user_id = user_uuid
    and log_date = today;

  insert into public.daily_logs (user_id, log_date, hours_studied, goal_met)
  values (user_uuid, today, added_hours, added_hours >= 5)
  on conflict (user_id, log_date)
  do update set
    hours_studied = public.daily_logs.hours_studied + excluded.hours_studied,
    goal_met = (public.daily_logs.hours_studied + excluded.hours_studied) >= 5
  returning * into log_row;

  goal_just_met := log_row.goal_met and prior_hours < 5;

  update public.profiles
  set
    total_hours = total_hours + added_hours,
    last_active_date = today
  where id = user_uuid;

  if goal_just_met then
    update public.profiles
    set
      dsa_days = dsa_days + 1,
      dsa_years = (dsa_days + 1)::numeric / 20,
      current_streak = current_streak + 1
    where id = user_uuid
    returning current_streak into new_streak;

    update public.profiles
    set longest_streak = greatest(longest_streak, new_streak)
    where id = user_uuid
      and new_streak > longest_streak;
  end if;

  return jsonb_build_object(
    'log_date', log_row.log_date,
    'hours_studied', log_row.hours_studied,
    'goal_met', log_row.goal_met,
    'goal_just_met', goal_just_met
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- On login: break streak if last goal day was before yesterday
-- ---------------------------------------------------------------------------
create or replace function public.validate_streak_on_login(user_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  last_goal_date date;
  yesterday date := (timezone('utc', now()))::date - 1;
begin
  if auth.uid() is distinct from user_uuid then
    raise exception 'Unauthorized';
  end if;

  select max(log_date)
  into last_goal_date
  from public.daily_logs
  where user_id = user_uuid
    and goal_met = true;

  if last_goal_date is null or last_goal_date < yesterday then
    update public.profiles
    set current_streak = 0
    where id = user_uuid
      and current_streak <> 0;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.daily_logs enable row level security;

drop policy if exists "Users can read own daily logs" on public.daily_logs;
create policy "Users can read own daily logs"
  on public.daily_logs
  for select
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant execute on function public.update_daily_progress(uuid, numeric) to authenticated;
grant execute on function public.validate_streak_on_login(uuid) to authenticated;
