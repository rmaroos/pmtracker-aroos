create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'Asia/Colombo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) between 1 and 160),
  client_name text,
  description text,
  status text not null default 'Active' check (status in ('Active','On Hold','Completed','Archived')),
  start_date date,
  target_end_date date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  unique (id, user_id)
);
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid,
  title text not null check (char_length(trim(title)) between 1 and 240),
  category text not null check (category in ('Project Planning','Client Follow-up','Team Coordination','Meeting','Documentation','Progress Monitoring','Review','Reporting','Administration','Other')),
  priority text not null default 'Medium' check (priority in ('High','Medium','Low')),
  status text not null default 'Planned' check (status in ('Planned','In Progress','Waiting','Completed')),
  planned_date date not null default current_date,
  deadline date,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (id, user_id),
  constraint task_project_owner_fk foreign key (project_id, user_id) references public.projects(id, user_id) on delete restrict
);
create table if not exists public.task_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null,
  event_type text not null check (event_type in ('created','updated','status_changed','completed','reopened')),
  old_status text,
  new_status text,
  summary text,
  created_at timestamptz not null default now(),
  constraint activity_task_owner_fk foreign key (task_id, user_id) references public.tasks(id, user_id) on delete cascade
);
create index if not exists tasks_user_status_idx on public.tasks(user_id, status) where deleted_at is null;
create index if not exists tasks_user_planned_idx on public.tasks(user_id, planned_date) where deleted_at is null;
create index if not exists tasks_user_deadline_idx on public.tasks(user_id, deadline) where deleted_at is null;
create index if not exists tasks_user_priority_idx on public.tasks(user_id, priority) where deleted_at is null;
create index if not exists tasks_project_idx on public.tasks(project_id);
create index if not exists tasks_completed_idx on public.tasks(user_id, completed_at desc) where status = 'Completed' and deleted_at is null;
create index if not exists activity_task_time_idx on public.task_activity(task_id, created_at desc);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create or replace function public.set_task_completion() returns trigger language plpgsql as $$
begin
  if new.status = 'Completed' then
    if tg_op = 'INSERT' and new.completed_at is null then new.completed_at = now();
    elsif tg_op = 'UPDATE' and old.status is distinct from 'Completed' then new.completed_at = now();
    elsif tg_op = 'UPDATE' and old.status = 'Completed' then new.completed_at = old.completed_at;
    end if;
  else
    new.completed_at = null;
  end if;
  return new;
end; $$;
create or replace function public.log_task_activity() returns trigger language plpgsql security definer set search_path = public as $$
declare kind text; note text;
begin
  if tg_op = 'INSERT' then
    insert into public.task_activity(user_id, task_id, event_type, new_status, summary) values (new.user_id, new.id, 'created', new.status, 'Task created');
    if new.status = 'Completed' then insert into public.task_activity(user_id, task_id, event_type, new_status, summary) values (new.user_id, new.id, 'completed', new.status, 'Task completed'); end if;
    return new;
  end if;
  if old.status is distinct from new.status then
    if new.status = 'Completed' then kind := 'completed'; note := 'Task completed';
    elsif old.status = 'Completed' then kind := 'reopened'; note := 'Task reopened';
    else kind := 'status_changed'; note := 'Status changed from ' || old.status || ' to ' || new.status; end if;
  elsif (old.title, old.category, old.priority, old.planned_date, old.deadline, old.notes, old.project_id) is distinct from (new.title, new.category, new.priority, new.planned_date, new.deadline, new.notes, new.project_id) then
    kind := 'updated'; note := 'Task details updated';
  else return new;
  end if;
  insert into public.task_activity(user_id, task_id, event_type, old_status, new_status, summary) values (new.user_id, new.id, kind, old.status, new.status, note);
  return new;
end; $$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
create trigger tasks_completion before insert or update on public.tasks for each row execute function public.set_task_completion();
create trigger tasks_touch before update on public.tasks for each row execute function public.touch_updated_at();
create trigger tasks_activity after insert or update on public.tasks for each row execute function public.log_task_activity();

create or replace function public.create_profile_for_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into public.profiles(id, display_name) values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))) on conflict (id) do nothing; return new; end; $$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute function public.create_profile_for_user();

create or replace function public.set_task_status(p_task_id uuid, p_status text) returns void language plpgsql security invoker set search_path = public as $$
begin
  if p_status not in ('Planned','In Progress','Waiting','Completed') then raise exception 'Invalid task status'; end if;
  update public.tasks set status = p_status where id = p_task_id and user_id = auth.uid() and deleted_at is null;
  if not found then raise exception 'Task not found'; end if;
end; $$;
revoke all on function public.set_task_status(uuid, text) from public;
grant execute on function public.set_task_status(uuid, text) to authenticated;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_activity enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "projects_select_own" on public.projects for select to authenticated using (user_id = auth.uid());
create policy "projects_insert_own" on public.projects for insert to authenticated with check (user_id = auth.uid());
create policy "projects_update_own" on public.projects for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "projects_delete_own" on public.projects for delete to authenticated using (user_id = auth.uid() and not exists (select 1 from public.tasks where tasks.project_id = projects.id));
create policy "tasks_select_own" on public.tasks for select to authenticated using (user_id = auth.uid());
create policy "tasks_insert_own" on public.tasks for insert to authenticated with check (user_id = auth.uid());
create policy "tasks_update_own" on public.tasks for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks_delete_own" on public.tasks for delete to authenticated using (user_id = auth.uid());
create policy "activity_select_own" on public.task_activity for select to authenticated using (user_id = auth.uid());
grant select, insert, update, delete on public.profiles, public.projects, public.tasks, public.task_activity to authenticated;
revoke all on public.profiles, public.projects, public.tasks, public.task_activity from anon;
