-- ─────────────────────────────────────────────────────────────
-- CleanVision — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ─────────────────────────────────────────────────────────────

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── CATEGORIES ───────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null unique,
  created_at timestamptz not null default now()
);

-- Seed categories
insert into categories (name) values
  ('Residential'),
  ('Commercial'),
  ('Specialty'),
  ('Premium')
on conflict do nothing;

-- ─── SERVICES ─────────────────────────────────────────────────
create table if not exists services (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  description text not null default '',
  image_url   text,
  category_id uuid references categories(id) on delete set null,
  price       numeric(10, 2),
  featured    boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Seed services
insert into services (title, description, image_url, price, featured, category_id)
select
  'Residential Deep Clean',
  'Every corner, every surface — transformed. Our deep clean protocol leaves your home immaculate from ceiling to floor.',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
  120,
  true,
  id
from categories where name = 'Residential';

insert into services (title, description, image_url, price, featured, category_id)
select
  'Commercial Spaces',
  'Professional environments demand professional standards. We deliver both with systematic precision and care.',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  280,
  true,
  id
from categories where name = 'Commercial';

insert into services (title, description, image_url, price, featured, category_id)
select
  'Post-Construction',
  'Debris, dust, and residue eliminated. Your new space, perfectly presented for handover.',
  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
  350,
  false,
  id
from categories where name = 'Specialty';

insert into services (title, description, image_url, price, featured, category_id)
select
  'Luxury Event Prep',
  'Your event deserves a pristine backdrop. We prepare spaces for moments that matter and memories that last.',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
  450,
  true,
  id
from categories where name = 'Premium';

-- ─── BOOKINGS ─────────────────────────────────────────────────
create table if not exists bookings (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  phone      text not null,
  service    text not null default '',
  message    text not null default '',
  status     text not null default 'pending' check (status in ('pending', 'confirmed', 'completed')),
  created_at timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────

-- Public can read services and categories
alter table services enable row level security;
alter table categories enable row level security;
alter table bookings enable row level security;

-- Anyone can read services/categories
create policy "Public read services"
  on services for select using (true);

create policy "Public read categories"
  on categories for select using (true);

-- Anyone can insert a booking
create policy "Public insert booking"
  on bookings for insert with check (true);

-- Only authenticated users (admin) can manage everything
create policy "Admin all services"
  on services for all using (auth.role() = 'authenticated');

create policy "Admin all categories"
  on categories for all using (auth.role() = 'authenticated');

create policy "Admin read bookings"
  on bookings for select using (auth.role() = 'authenticated');

create policy "Admin update bookings"
  on bookings for update using (auth.role() = 'authenticated');

-- ─── STORAGE ──────────────────────────────────────────────────
-- Run in Storage section → Create bucket "service-images" (public)
-- Then add policy: authenticated users can upload

-- ─────────────────────────────────────────────────────────────
-- ENV VARIABLES (.env.local)
-- ─────────────────────────────────────────────────────────────
-- NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
-- ─────────────────────────────────────────────────────────────
