-- Enable the pgvector extension for embedding
create extension if not exists vector;

-- Users table
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text not null check (role in ('applicant', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  department text not null,
  description text not null,
  requirements text[] not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  embedding vector(1536),
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Applicants profile table
create table public.applicants (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) unique not null,
  cv_text text not null,
  skills jsonb,
  experience_years integer,
  strengths text[],
  weaknesses text[],
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Applications table
create table public.applications (
  id uuid default gen_random_uuid() primary key,
  applicant_id uuid references public.applicants(id) not null,
  job_id uuid references public.jobs(id) not null,
  match_score integer,
  missing_skills jsonb,
  upskill_roadmap jsonb,
  stage text not null default 'applied' check (stage in ('applied', 'screening', 'interview', 'hired')),
  interview_questions jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(applicant_id, job_id)
);

-- Onboarding tasks table
create table public.onboarding_tasks (
  id uuid default gen_random_uuid() primary key,
  application_id uuid references public.applications(id) not null,
  tasks jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.jobs enable row level security;
alter table public.applicants enable row level security;
alter table public.applications enable row level security;
alter table public.onboarding_tasks enable row level security;

-- Policies for users
create policy "Users can view own profile" on public.users for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.users for insert with check (auth.uid() = id);
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users 
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Admins can view all profiles" on public.users for select using (public.is_admin());

-- Policies for jobs
create policy "Anyone can view open jobs" on public.jobs for select using (status = 'open');
create policy "Admins can manage jobs" on public.jobs for all using (
  public.is_admin()
);

-- Policies for applicants
create policy "Applicants can view and update own profile" on public.applicants for all using (auth.uid() = user_id);
create policy "Admins can view all applicants" on public.applicants for select using (
  public.is_admin()
);

-- Policies for applications
create policy "Applicants can view own applications" on public.applications for select using (
  exists (select 1 from public.applicants where id = public.applications.applicant_id and user_id = auth.uid())
);
create policy "Applicants can create applications" on public.applications for insert with check (
  exists (select 1 from public.applicants where id = public.applications.applicant_id and user_id = auth.uid())
);
create policy "Admins can manage all applications" on public.applications for all using (
  public.is_admin()
);

-- Policies for onboarding_tasks
create policy "Applicants can view own onboarding tasks" on public.onboarding_tasks for select using (
  exists (
    select 1 from public.applications 
    join public.applicants on public.applications.applicant_id = public.applicants.id 
    where public.onboarding_tasks.application_id = public.applications.id and public.applicants.user_id = auth.uid()
  )
);
create policy "Admins can manage all onboarding tasks" on public.onboarding_tasks for all using (
  public.is_admin()
);
