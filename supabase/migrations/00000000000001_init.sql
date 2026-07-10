-- Baranwal Associates platform — core schema
-- Roles, projects, drawings + versions, messaging, AI chat, credits/payments,
-- blog, enquiries, invites, system settings, telemetry events.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.app_role as enum (
  'system_admin',   -- the owner/principal architect (full access)
  'employee',       -- staff architect
  'accountant',     -- staff, can record cash payments
  'collaborator',   -- invited external engineer, scoped to projects
  'client'
);

create type public.project_status as enum (
  'enquiry', 'onboarded', 'design', 'construction', 'completed', 'on_hold'
);

create type public.drawing_kind as enum (
  'dwg_2d', 'sketchup_3d', 'max_3d', 'image', 'document'
);

create type public.preview_kind as enum ('gltf', 'pdf', 'image', 'none');

create type public.approval_status as enum (
  'pending', 'approved', 'changes_requested'
);

create type public.thread_kind as enum (
  'project_chat', 'drawing_feedback', 'ai_chat'
);

create type public.payment_method as enum ('razorpay', 'cash');

create type public.payment_status as enum (
  'created', 'paid', 'failed', 'refunded'
);

create type public.credit_reason as enum (
  'purchase', 'cash_payment', 'trial_grant', 'generation_spend',
  'admin_adjustment', 'refund'
);

create type public.enquiry_status as enum (
  'new', 'contacted', 'onboarded', 'closed'
);

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  phone text,
  role public.app_role not null default 'client',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile when a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers used throughout RLS policies.
create function public.current_app_role()
returns public.app_role
language sql stable security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_staff()
returns boolean
language sql stable
as $$
  select public.current_app_role() in ('system_admin', 'employee', 'accountant');
$$;

create function public.is_admin()
returns boolean
language sql stable
as $$
  select public.current_app_role() = 'system_admin';
$$;

-- ---------------------------------------------------------------------------
-- Projects
-- ---------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  location text,
  client_id uuid references public.profiles (id) on delete set null,
  status public.project_status not null default 'enquiry',
  progress smallint not null default 0 check (progress between 0 and 100),
  budget_min_inr bigint,
  budget_max_inr bigint,
  cover_image_url text,
  is_public boolean not null default false, -- shown on the portfolio
  starts_on date,
  ends_on date,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  member_role text not null default 'member', -- lead, engineer, viewer...
  added_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create function public.is_project_member(p_project uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.project_members
    where project_id = p_project and user_id = auth.uid()
  ) or exists (
    select 1 from public.projects
    where id = p_project and client_id = auth.uid()
  );
$$;

create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  description text not null default '',
  due_on date,
  position int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Drawings and versions (files live in R2; only keys stored here)
-- ---------------------------------------------------------------------------
create table public.drawings (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  kind public.drawing_kind not null,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.drawing_versions (
  id uuid primary key default gen_random_uuid(),
  drawing_id uuid not null references public.drawings (id) on delete cascade,
  version_no int not null,
  original_key text not null,          -- R2 object key of the source file
  original_filename text not null,
  original_size_bytes bigint,
  preview_kind public.preview_kind not null default 'none',
  preview_key text,                    -- R2 key of glTF/PDF/image preview
  notes text not null default '',
  approval public.approval_status not null default 'pending',
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (drawing_id, version_no)
);

-- ---------------------------------------------------------------------------
-- Messaging (project chat, drawing feedback, AI chat share one model)
-- ---------------------------------------------------------------------------
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  kind public.thread_kind not null,
  project_id uuid references public.projects (id) on delete cascade,
  drawing_version_id uuid references public.drawing_versions (id) on delete cascade,
  title text not null default '',
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  sender_id uuid references public.profiles (id),
  body text not null default '',
  is_ai boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table public.message_attachments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages (id) on delete cascade,
  storage_key text not null,
  filename text not null,
  mime_type text not null,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- AI generations (each billable image generation in an ai_chat thread)
-- ---------------------------------------------------------------------------
create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  message_id uuid references public.messages (id) on delete set null,
  input_keys text[] not null default '{}',   -- uploaded source images
  presets jsonb not null default '{}',       -- style/lighting/flooring/...
  output_key text,                           -- generated image in R2
  model text not null,
  tokens_used int,
  credits_spent int not null default 0,
  is_trial boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Payments and credits
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  amount_inr numeric(12, 2) not null check (amount_inr > 0),
  method public.payment_method not null,
  status public.payment_status not null default 'created',
  razorpay_order_id text,
  razorpay_payment_id text,
  recorded_by uuid references public.profiles (id), -- accountant, for cash
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table public.credits_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  delta int not null,                       -- positive = grant, negative = spend
  reason public.credit_reason not null,
  payment_id uuid references public.payments (id),
  generation_id uuid references public.ai_generations (id),
  recorded_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create index credits_ledger_user_idx on public.credits_ledger (user_id, created_at);

create function public.credit_balance(p_user uuid)
returns int
language sql stable security definer set search_path = public
as $$
  select coalesce(sum(delta), 0)::int
  from public.credits_ledger where user_id = p_user;
$$;

-- ---------------------------------------------------------------------------
-- Blog, enquiries, invites
-- ---------------------------------------------------------------------------
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'general',
  summary text not null default '',
  body_md text not null default '',
  cover_image_url text,
  author_id uuid references public.profiles (id),
  published_at timestamptz,               -- null = draft
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  source text not null default 'website',
  status public.enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role public.app_role not null,
  project_id uuid references public.projects (id) on delete cascade,
  token uuid not null default gen_random_uuid() unique,
  invited_by uuid references public.profiles (id),
  expires_at timestamptz not null default now() + interval '14 days',
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- System settings (admin-tunable constants) and telemetry events
-- ---------------------------------------------------------------------------
create table public.system_settings (
  key text primary key,
  value jsonb not null,
  description text not null default '',
  updated_by uuid references public.profiles (id),
  updated_at timestamptz not null default now()
);

insert into public.system_settings (key, value, description) values
  ('ai.model', '"gpt-4o"', 'OpenAI model used for interior generations'),
  ('ai.max_output_tokens', '2048', 'Max tokens per AI response'),
  ('ai.trial_generations', '2', 'Free generations for a new signed-in user'),
  ('ai.credits_per_generation', '1', 'Credits charged per image generation'),
  ('upload.max_file_mb', '200', 'Max upload size for drawings/models'),
  ('chat.max_attachment_mb', '25', 'Max attachment size in chat'),
  ('credits.inr_per_credit', '99', 'Price of one credit in INR');

create table public.events (
  id bigint generated always as identity primary key,
  user_id uuid,
  name text not null,
  props jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index events_name_idx on public.events (name, created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.milestones enable row level security;
alter table public.drawings enable row level security;
alter table public.drawing_versions enable row level security;
alter table public.threads enable row level security;
alter table public.messages enable row level security;
alter table public.message_attachments enable row level security;
alter table public.ai_generations enable row level security;
alter table public.payments enable row level security;
alter table public.credits_ledger enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.invites enable row level security;
alter table public.system_settings enable row level security;
alter table public.events enable row level security;

-- profiles: everyone signed-in can read basic profiles; users edit their own;
-- only the admin changes roles (enforced by trigger below).
create policy "profiles are readable by signed-in users"
  on public.profiles for select using (auth.uid() is not null);
create policy "users update own profile"
  on public.profiles for update using (id = auth.uid());
create policy "admin manages profiles"
  on public.profiles for all using (public.is_admin());

create function public.prevent_role_self_change()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'only the system admin can change roles';
  end if;
  return new;
end;
$$;

create trigger profiles_role_guard
  before update on public.profiles
  for each row execute function public.prevent_role_self_change();

-- projects: staff see all; clients/collaborators see their own.
create policy "staff full access to projects"
  on public.projects for all using (public.is_staff());
create policy "members read their projects"
  on public.projects for select
  using (client_id = auth.uid() or public.is_project_member(id));
create policy "public portfolio projects readable by anyone"
  on public.projects for select using (is_public);

create policy "staff manage project members"
  on public.project_members for all using (public.is_staff());
create policy "members see membership of their projects"
  on public.project_members for select
  using (user_id = auth.uid() or public.is_project_member(project_id));

create policy "staff manage milestones"
  on public.milestones for all using (public.is_staff());
create policy "members read milestones"
  on public.milestones for select using (public.is_project_member(project_id));

-- drawings: staff manage; project members read; collaborators can upload
-- versions to projects they belong to.
create policy "staff manage drawings"
  on public.drawings for all using (public.is_staff());
create policy "members read drawings"
  on public.drawings for select using (public.is_project_member(project_id));
create policy "members add drawings"
  on public.drawings for insert
  with check (public.is_project_member(project_id) and created_by = auth.uid());

create policy "staff manage drawing versions"
  on public.drawing_versions for all using (public.is_staff());
create policy "members read drawing versions"
  on public.drawing_versions for select
  using (exists (
    select 1 from public.drawings d
    where d.id = drawing_id and public.is_project_member(d.project_id)
  ));
create policy "members upload drawing versions"
  on public.drawing_versions for insert
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.drawings d
      where d.id = drawing_id and public.is_project_member(d.project_id)
    )
  );

-- threads/messages: participants only (project members, thread creator, staff).
create function public.can_access_thread(p_thread uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.threads t
    where t.id = p_thread
      and (
        t.created_by = auth.uid()
        or public.is_staff()
        or (t.project_id is not null and public.is_project_member(t.project_id))
      )
  );
$$;

create policy "participants access threads"
  on public.threads for select using (public.can_access_thread(id));
create policy "signed-in users create threads"
  on public.threads for insert with check (created_by = auth.uid());
create policy "staff manage threads"
  on public.threads for all using (public.is_staff());

create policy "participants read messages"
  on public.messages for select using (public.can_access_thread(thread_id));
create policy "participants send messages"
  on public.messages for insert
  with check (public.can_access_thread(thread_id)
    and (sender_id = auth.uid() or is_ai));
create policy "senders edit own messages"
  on public.messages for update using (sender_id = auth.uid());

create policy "participants read attachments"
  on public.message_attachments for select
  using (exists (
    select 1 from public.messages m
    where m.id = message_id and public.can_access_thread(m.thread_id)
  ));
create policy "participants attach files"
  on public.message_attachments for insert
  with check (exists (
    select 1 from public.messages m
    where m.id = message_id and m.sender_id = auth.uid()
  ));

-- AI generations: owner reads own; staff read all. Inserts happen through the
-- server (service role) so credit checks cannot be bypassed.
create policy "users read own generations"
  on public.ai_generations for select
  using (user_id = auth.uid() or public.is_staff());

-- payments/credits: owner reads own; accountant + admin manage.
create policy "users read own payments"
  on public.payments for select
  using (user_id = auth.uid()
    or public.current_app_role() in ('system_admin', 'accountant'));
create policy "accountant records payments"
  on public.payments for insert
  with check (public.current_app_role() in ('system_admin', 'accountant'));
create policy "accountant updates payments"
  on public.payments for update
  using (public.current_app_role() in ('system_admin', 'accountant'));

create policy "users read own credits"
  on public.credits_ledger for select
  using (user_id = auth.uid()
    or public.current_app_role() in ('system_admin', 'accountant'));
create policy "accountant writes ledger"
  on public.credits_ledger for insert
  with check (public.current_app_role() in ('system_admin', 'accountant'));

-- blog: published posts are public; staff manage.
create policy "published posts are public"
  on public.blog_posts for select using (published_at is not null);
create policy "staff manage posts"
  on public.blog_posts for all using (public.is_staff());

-- enquiries: anyone can submit (via anon key); only staff read.
create policy "anyone can submit an enquiry"
  on public.contact_enquiries for insert with check (true);
create policy "staff read enquiries"
  on public.contact_enquiries for select using (public.is_staff());
create policy "staff update enquiries"
  on public.contact_enquiries for update using (public.is_staff());

-- invites: staff manage; the invited email can read its own (checked server-side).
create policy "staff manage invites"
  on public.invites for all using (public.is_staff());

-- system settings: readable by staff; only admin writes.
create policy "staff read settings"
  on public.system_settings for select using (public.is_staff());
create policy "admin writes settings"
  on public.system_settings for all using (public.is_admin());

-- events: written by the server (service role); only admin reads.
create policy "admin reads events"
  on public.events for select using (public.is_admin());

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();
