-- Zayit Academy — database for the admin panel.
-- Run this once in Supabase: SQL Editor → New query → paste → Run.
-- Then add your login email at the bottom (see "Admin logins").

-- ---------------------------------------------------------------------------
-- Admins: only these emails can open /admin, even if someone else signs up
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security; -- no policies: hidden from the API

-- Admins sign in with a short username; the login looks up their email from it
alter table public.admins add column if not exists username text unique
  check (username ~ '^[a-z0-9._-]{3,30}$');

create or replace function public.admin_login_email(login text) returns text
language sql stable security definer set search_path = public as $$
  select email from public.admins where username = lower(trim(login));
$$;

-- The signed-in admin's own username, shown in the admin menu
create or replace function public.my_admin_username() returns text
language sql stable security definer set search_path = public as $$
  select username from public.admins where lower(email) = lower(auth.jwt() ->> 'email');
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- ---------------------------------------------------------------------------
-- Form submissions
-- ---------------------------------------------------------------------------
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  course_id text not null check (char_length(course_id) <= 60),
  course_title text not null check (char_length(course_title) <= 120),
  mode text not null check (mode in ('offline', 'online')),
  student_name text not null check (char_length(student_name) between 1 and 120),
  student_age int check (student_age between 3 and 99),
  parent_name text not null check (char_length(parent_name) between 1 and 120),
  mobile text not null check (char_length(mobile) between 5 and 30),
  email text not null check (char_length(email) between 3 and 200),
  message text check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled')),
  notes text check (char_length(notes) <= 2000)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  organisation text check (char_length(organisation) <= 160),
  email text not null check (char_length(email) between 3 and 200),
  mobile text not null check (char_length(mobile) between 5 and 30),
  collaboration_type text not null check (char_length(collaboration_type) <= 40),
  preferred_date date,
  message text not null check (char_length(message) between 1 and 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'confirmed', 'cancelled')),
  notes text check (char_length(notes) <= 2000)
);

alter table public.enrollments enable row level security;
alter table public.enquiries enable row level security;

-- Anyone can submit a form; only admins can read, update or delete
drop policy if exists "anyone can enroll" on public.enrollments;
create policy "anyone can enroll" on public.enrollments
  for insert to anon, authenticated with check (status = 'new' and notes is null);
drop policy if exists "admins manage enrollments" on public.enrollments;
create policy "admins manage enrollments" on public.enrollments
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone can send an enquiry" on public.enquiries;
create policy "anyone can send an enquiry" on public.enquiries
  for insert to anon, authenticated with check (status = 'new' and notes is null);
drop policy if exists "admins manage enquiries" on public.enquiries;
create policy "admins manage enquiries" on public.enquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Website content edited from the admin
-- ---------------------------------------------------------------------------
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
  sort int not null default 0,
  tier text not null check (char_length(tier) between 1 and 40),
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  duration text not null default '',
  schedule text not null default '',
  batch_size text not null default '',
  fee_offline int not null default 0 check (fee_offline >= 0),
  fee_online int not null default 0 check (fee_online >= 0),
  highlights text[] not null default '{}',
  image text not null default '',
  certificate boolean not null default true,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sort int not null default 0,
  title text not null default '' check (char_length(title) <= 120),
  category text not null check (char_length(category) <= 60),
  image text not null
);

alter table public.site_content enable row level security;
alter table public.courses enable row level security;
alter table public.gallery_items enable row level security;

-- Everyone can read the content; only admins can change it
drop policy if exists "anyone can read content" on public.site_content;
create policy "anyone can read content" on public.site_content for select using (true);
drop policy if exists "admins edit content" on public.site_content;
create policy "admins edit content" on public.site_content
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone can read published courses" on public.courses;
create policy "anyone can read published courses" on public.courses
  for select using (published or public.is_admin());
drop policy if exists "admins edit courses" on public.courses;
create policy "admins edit courses" on public.courses
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone can read the gallery" on public.gallery_items;
create policy "anyone can read the gallery" on public.gallery_items for select using (true);
drop policy if exists "admins edit the gallery" on public.gallery_items;
create policy "admins edit the gallery" on public.gallery_items
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Photo storage: public to view, only admins can upload or delete
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "admins upload media" on storage.objects;
create policy "admins upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins update media" on storage.objects;
create policy "admins update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
drop policy if exists "admins delete media" on storage.objects;
create policy "admins delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- API access. New Supabase projects don't open tables to the website by
-- default; the policies above still decide which rows each visitor can touch.
-- (The admins table gets no grants: only is_admin() reads it.)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.admin_login_email(text) to anon, authenticated;
grant execute on function public.my_admin_username() to authenticated;
grant select on public.site_content, public.courses, public.gallery_items to anon, authenticated;
grant insert on public.enrollments, public.enquiries to anon, authenticated;
grant select, insert, update, delete
  on public.enrollments, public.enquiries, public.site_content, public.courses, public.gallery_items
  to authenticated;

-- ---------------------------------------------------------------------------
-- Starting content: what the website shows today
-- ---------------------------------------------------------------------------
insert into public.site_content (key, data) values (
  'hero',
  jsonb_build_object(
    'eyebrow', 'Zayit Academy',
    'titleBefore', 'Beyond Art.',
    'titleHighlight', 'Towards a Better You',
    'titleAfter', '',
    'description', 'More than art education—a space to explore creativity, discover your abilities, and grow through the power of making.',
    'image', '/assets/hero.webp',
    'stats', jsonb_build_array(
      jsonb_build_object('value', '1200+', 'label', 'Students Trained'),
      jsonb_build_object('value', '9+', 'label', 'Years of Teaching'),
      jsonb_build_object('value', '18', 'label', 'Awards Won')
    )
  )
) on conflict (key) do nothing;

insert into public.courses
  (id, sort, tier, title, description, duration, schedule, batch_size, fee_offline, fee_online, highlights, image)
values
  ('basic', 1, 'Basic', 'Basic Course',
   'Where every young artist begins — line, form, shading and confidence, built one visual class at a time. For ages 5–16.',
   '6 Months', '2 classes / week · 1.5 hrs each', '15 Students Only', 1700, 1500,
   array['Fully visual, hands-on classes', 'Pencil, shading & basic composition', 'Small 15-seat batches', 'Certificate of completion'],
   'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop'),
  ('advanced', 2, 'Advanced', 'Advanced Course',
   'Deeper technique, colour theory and closer mentoring for students moving on from Basic.',
   '6 Months', '2 classes / week · 1.5 hrs each', '15 Students Only', 2200, 2000,
   array['Advanced shading & colour theory', 'Closer, small-batch mentoring', 'Mixed media exploration', 'Certificate of completion'],
   'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=1200&auto=format&fit=crop'),
  ('pro', 3, 'Pro', 'Pro Course',
   'Portfolio-ready technique for students completing their journey from Basic through Advanced to Pro.',
   '6 Months', '2 classes / week · 1.5 hrs each', '15 Students Only', 2500, 2300,
   array['Portfolio-ready final pieces', 'Exhibition-style showcase', 'Closer, one-on-one guidance', 'Certificate of completion'],
   'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop')
on conflict (id) do nothing;

insert into public.gallery_items (sort, title, category, image)
select * from (values
  (1, 'Study in Graphite', 'Drawing and Sketching', 'https://images.unsplash.com/photo-1549289524-06cf8837ace5?q=80&w=800&auto=format&fit=crop'),
  (2, 'Hills at Dusk', 'Painting and Mixed Media', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop'),
  (3, 'Quick Figure Sketch', 'Drawing and Sketching', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=800&auto=format&fit=crop'),
  (4, 'Abstract in Ember', 'Painting and Mixed Media', 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=800&auto=format&fit=crop'),
  (5, 'Saturday Studio Session', 'Creative Workshops', 'https://images.unsplash.com/photo-1522205408450-add114ad53fe?q=80&w=800&auto=format&fit=crop'),
  (6, 'Basic Batch 12', 'Student Progress', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop'),
  (7, 'Sunset Study', 'Student Artwork', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=800&auto=format&fit=crop'),
  (8, 'River Bend', 'Painting and Mixed Media', 'https://images.unsplash.com/photo-1519638399535-1b036603ac77?q=80&w=800&auto=format&fit=crop'),
  (9, 'Charcoal Portrait', 'Drawing and Sketching', 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?q=80&w=800&auto=format&fit=crop'),
  (10, 'Hands Study', 'Student Artwork', 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop'),
  (11, 'Community Mural Day', 'Community Art', 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=800&auto=format&fit=crop'),
  (12, 'Pro Batch Showcase', 'Student Progress', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop')
) as seed(sort, title, category, image)
where not exists (select 1 from public.gallery_items);

-- ---------------------------------------------------------------------------
-- Admin logins: the email of a user created under Authentication → Users → Add
-- user, and the username they type on /admin/login (lowercase, 3–30 characters).
-- Run this again for each extra admin.
-- ---------------------------------------------------------------------------
insert into public.admins (email, username) values ('thechalzart@gmail.com', 'chalz')
on conflict (email) do update set username = excluded.username;
