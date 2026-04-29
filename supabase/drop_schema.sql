-- Drop policies (if you want a completely clean slate, though dropping the tables also drops their policies)
drop policy if exists "Applicants can view own onboarding tasks" on public.onboarding_tasks;
drop policy if exists "Admins can manage all onboarding tasks" on public.onboarding_tasks;

drop policy if exists "Applicants can view own applications" on public.applications;
drop policy if exists "Applicants can create applications" on public.applications;
drop policy if exists "Admins can manage all applications" on public.applications;

drop policy if exists "Applicants can view and update own profile" on public.applicants;
drop policy if exists "Admins can view all applicants" on public.applicants;

drop policy if exists "Anyone can view open jobs" on public.jobs;
drop policy if exists "Admins can manage jobs" on public.jobs;

drop policy if exists "Users can view own profile" on public.users;
drop policy if exists "Admins can view all profiles" on public.users;

-- Drop tables in the correct order to avoid Foreign Key constraint errors
drop table if exists public.onboarding_tasks cascade;
drop table if exists public.applications cascade;
drop table if exists public.applicants cascade;
drop table if exists public.jobs cascade;
drop table if exists public.users cascade;

-- Optional: Drop the pgvector extension if you don't need it anymore
-- drop extension if exists vector;
