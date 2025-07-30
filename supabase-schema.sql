/******************************************************************************
  JobConnect AI — Clean, Idempotent Supabase Schema (CORRECTED)
  (run as the "owner" role inside the SQL editor)
******************************************************************************/

/* ─────────────────────────── 1. EXTENSIONS ─────────────────────────────── */
create extension if not exists "uuid-ossp";
create extension if not exists "vector";

/* ─────────────────────────── 2. CLEAN-UP (SAFE) ────────────────────────── */
/* Drop ONLY if the object exists – keeps script idempotent */
drop trigger  if exists on_auth_user_created            on auth.users;
drop function if exists public.handle_new_user         cascade;
drop function if exists public.update_updated_at_column cascade;
drop function if exists public.calculate_relevance_score cascade;
drop function if exists public.update_job_relevance_scores cascade;
drop function if exists public.get_job_recommendations  cascade;

/* Tables (order doesn't matter because cascade above removes dependencies) */
drop table if exists job_search_logs        cascade;
drop table if exists networking_contacts    cascade;
drop table if exists cover_letters          cascade;
drop table if exists resumes                cascade;
drop table if exists applications           cascade;
drop table if exists jobs                   cascade;
drop table if exists user_job_preferences   cascade;
drop table if exists profiles               cascade;

/* ─────────────────────────── 3. TABLES ─────────────────────────────────── */

/*** 3.1 PROFILES ******************************************************/
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text unique not null,
  full_name   text,
  avatar_url  text,
  phone       text,
  location    text,
  experience_level text check (experience_level in ('entry','mid','senior','executive')),
  preferred_industries text[],
  salary_expectation  int,
  job_preferences     jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

/*** 3.2 USER JOB PREFERENCES *****************************************/
create table user_job_preferences (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  keywords    text[] not null,
  location    text     not null,
  experience_level text check (experience_level in ('entry','mid','senior','executive')),
  job_type    text[]  default array['full-time'],
  remote_preference text default 'hybrid',
  salary_min  int,
  salary_max  int,
  industries  text[],
  skills      text[],
  is_active   bool default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, location, keywords)
);

/*** 3.3 JOBS *********************************************************/
create table jobs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  title       varchar not null,
  company     varchar not null,
  location    text,
  job_url     text unique,
  description text,
  platform    varchar not null check (platform in ('linkedin','naukri','indeed')),
  posted_time timestamptz not null,
  discovered_at timestamptz default now(),

  keywords_matched text[],
  relevance_score  int check (relevance_score between 0 and 100),
  freshness_score  int check (freshness_score between 0 and 100),
  embedding        vector(384),

  experience_level text,
  job_type         text,
  salary_min       int,
  salary_max       int,
  is_remote        bool default false,
  is_urgent        bool default false,
  application_count int default 0,

  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

/*** 3.4 APPLICATIONS **************************************************/
create table applications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  job_id      uuid not null references jobs(id)        on delete cascade,
  status      text default 'applied'
               check (status in ('applied','interviewing','rejected','accepted','withdrawn')),
  applied_at  timestamptz default now(),
  cover_letter text,
  resume_version text,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (user_id, job_id)
);

/*** 3.5 RESUMES *******************************************************/
create table resumes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text not null,
  content     text,
  file_url    text,
  version     text default '1.0',
  is_active   bool default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

/*** 3.6 COVER LETTERS *************************************************/
create table cover_letters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  job_id      uuid references jobs(id) on delete cascade,
  title       text not null,
  content     text not null,
  company_name text,
  job_title    text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

/*** 3.7 NETWORKING CONTACTS *******************************************/
create table networking_contacts (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  company     text,
  position    text,
  email       text,
  phone       text,
  linkedin_url text,
  status      text default 'discovered'
              check (status in ('discovered','connected','messaged','meeting_scheduled')),
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

/*** 3.8 JOB SEARCH LOGS ***********************************************/
create table job_search_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  platform    text not null,
  search_query text not null,
  jobs_found  int  default 0,
  jobs_stored int  default 0,
  execution_time_ms int,
  status      text default 'success' check (status in ('success','error','partial')),
  error_message text,
  created_at  timestamptz default now()
);

/* ─────────────────────────── 4. RLS ENABLEMENT ───────────────────── */
alter table profiles              enable row level security;
alter table user_job_preferences  enable row level security;
alter table jobs                  enable row level security;
alter table applications          enable row level security;
alter table resumes               enable row level security;
alter table cover_letters         enable row level security;
alter table networking_contacts   enable row level security;
alter table job_search_logs       enable row level security;

/* ─────────────────────────── 5. RLS POLICIES ─────────────────────── */
/* 5.1 profiles */
create policy p_profiles_select on profiles
  for select using (auth.uid() = id);

create policy p_profiles_update on profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy p_profiles_insert_trigger on profiles
  for insert with check (true);  -- allow SECURITY DEFINER trigger

/* 5.2 user_job_preferences */
create policy p_prefs_all on user_job_preferences
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

/* 5.3 jobs */
create policy p_jobs_select on jobs
  for select using (true); -- public read

create policy p_jobs_insert on jobs
  for insert with check (auth.uid() = user_id or user_id is null);

create policy p_jobs_update on jobs
  for update using (auth.uid() = user_id);

/* 5.4 applications / resumes / cover_letters / contacts */
create policy p_applications_all      on applications        for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy p_resumes_all           on resumes             for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy p_cover_letters_all     on cover_letters       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy p_contacts_all          on networking_contacts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

/* 5.5 job_search_logs */
create policy p_logs_select on job_search_logs
  for select using (auth.uid() = user_id or user_id is null);

create policy p_logs_insert on job_search_logs
  for insert with check (true);

/* ─────────────────────────── 6. FUNCTIONS & TRIGGERS ─────────────── */

/* 6.1 GENERIC updated_at helper */
create or replace function public.update_updated_at_column ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

/* Apply to every table that has updated_at - CORRECTED SYNTAX */
do $$
declare
  t text;
begin
  foreach t in array array['profiles','user_job_preferences','jobs','applications','resumes','cover_letters','networking_contacts']
  loop
    execute format(
      'drop trigger if exists trg_%1$s_upd on %1$s;
       create trigger trg_%1$s_upd
       before update on %1$s
       for each row execute function public.update_updated_at_column();', t);
  end loop;
end$$;

/* 6.2 handle_new_user trigger */
create or replace function public.handle_new_user ()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  insert into profiles (id,email,full_name,avatar_url)
  values (new.id,
          coalesce(new.email,''),
          coalesce(new.raw_user_meta_data->>'full_name', new.email),
          coalesce(new.raw_user_meta_data->>'avatar_url',''))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

/* 6.3 relevance score helpers */
create or replace function public.calculate_relevance_score(
  job_title text,
  job_description text,
  job_location text,
  posted_time timestamptz,
  user_keywords text[],
  user_location text)
returns int
language plpgsql
as $$
declare
  kscore int := 0;
  lscore int := 0;
  fscore int := 0;
  total  int;
  hrs    int;
  kw     text;
begin
  if user_keywords is not null then
    foreach kw in array user_keywords loop
      if lower(job_title||' '||coalesce(job_description,'')) like '%'||lower(kw)||'%' then
        kscore := kscore + 10;
      end if;
    end loop;
    kscore := least(kscore,60);
  end if;

  if user_location is not null and job_location is not null
     and lower(job_location) like '%'||lower(user_location)||'%' then
     lscore := 20;
  end if;

  hrs := extract(epoch from (now() - posted_time))/3600;
  fscore := greatest(0, 20 - (hrs*0.5));

  total := kscore + lscore + fscore;
  return greatest(0, least(100,total));
end;
$$;

create or replace function public.update_job_relevance_scores ()
returns trigger
language plpgsql
as $$
begin
  update jobs
  set relevance_score = public.calculate_relevance_score(
        title, description, location, posted_time,
        keywords_matched,
       (select location
          from user_job_preferences
         where user_id = jobs.user_id and is_active)
  )
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists trg_jobs_score on jobs;
create trigger trg_jobs_score
after insert on jobs
for each row execute function public.update_job_relevance_scores();

/* 6.4 get_job_recommendations */
create or replace function public.get_job_recommendations(
  p_user_id uuid,
  p_limit   int default 20)
returns table(
  id uuid, title text, company text, location text,
  job_url text, description text, platform text,
  posted_time timestamptz, relevance_score int,
  freshness_score int)
language plpgsql
as $$
begin
  return query
  select j.id, j.title, j.company, j.location, j.job_url,
         j.description, j.platform, j.posted_time,
         j.relevance_score, j.freshness_score
  from jobs j
  where j.relevance_score >= 50
    and j.posted_time >= now() - interval '7 days'
  order by j.relevance_score desc, j.freshness_score desc
  limit p_limit;
end;
$$;

/* ─────────────────────────── 7. PRIVILEGES ────────────────────────── */
grant usage on schema public to authenticated, anon;
grant select, insert, update on all tables in schema public to authenticated;
grant select on profiles to anon;
grant execute on all functions in schema public to authenticated;

/* ─────────────────────────── 8. INDEXES ───────────────────────────── */
create index if not exists idx_profiles_email                 on profiles(email);
create index if not exists idx_prefs_user                     on user_job_preferences(user_id);
create index if not exists idx_prefs_active                   on user_job_preferences(is_active);
create index if not exists idx_jobs_platform                  on jobs(platform);
create index if not exists idx_jobs_posted_time               on jobs(posted_time);
create index if not exists idx_jobs_relevance                 on jobs(relevance_score);
create index if not exists idx_jobs_location                  on jobs(location);
create index if not exists idx_jobs_keywords                  on jobs using gin(keywords_matched);
create index if not exists idx_apps_user                      on applications(user_id);
create index if not exists idx_apps_job                       on applications(job_id);
create index if not exists idx_apps_status                    on applications(status);
create index if not exists idx_resumes_user                   on resumes(user_id);
create index if not exists idx_cover_letters_user             on cover_letters(user_id);
create index if not exists idx_contacts_user                  on networking_contacts(user_id);
create index if not exists idx_logs_user                      on job_search_logs(user_id);
create index if not exists idx_logs_created                   on job_search_logs(created_at);

/******************************************************************************
  ✅  CORRECTED: All syntax errors fixed. The key changes:
     - Line 237: Fixed array syntax to use proper 'array[...]' constructor
     - Added missing variable declaration (kw text) in calculate_relevance_score
     - All other syntax is now PostgreSQL compliant
******************************************************************************/ 