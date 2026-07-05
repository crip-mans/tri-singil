-- Tri-Singil initial schema
-- Fares are FIXED per zone-to-zone route (flat rate lookup), not distance-based.

create extension if not exists "pgcrypto";
create extension if not exists postgis;

create table if not exists zones (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  municipality text not null,
  boundary geometry(Polygon, 4326),
  created_at timestamptz not null default now()
);

create table if not exists fare_matrix (
  id uuid primary key default gen_random_uuid(),
  origin_zone_id uuid not null references zones (id),
  destination_zone_id uuid not null references zones (id),
  base_fare numeric not null,
  effective_date date not null default current_date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists fare_modifiers (
  id uuid primary key default gen_random_uuid(),
  type text not null check (
    type in ('student_discount', 'senior_discount', 'pwd_discount', 'night_surcharge')
  ),
  calculation text not null check (calculation in ('flat', 'percent')),
  value numeric not null,
  time_start time,
  time_end time,
  is_active boolean not null default true
);

create index if not exists fare_matrix_route_idx
  on fare_matrix (origin_zone_id, destination_zone_id);
