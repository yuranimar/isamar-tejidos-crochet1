-- ══════════════════════════════════════════════════════════════════
--  Isamar • Tejidos y Crochet — Setup Supabase
--  Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ══════════════════════════════════════════════════════════════════

-- 1. TABLA DE PRODUCTOS
create table if not exists products (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  category         text,
  price            text,
  original_price   text,
  description      text,
  image            text,           -- URL pública de Supabase Storage
  status           text default 'available' check (status in ('available', 'new', 'out')),
  stock            integer,
  material         text,
  dimensions       text,
  delivery_time    text,
  care_instructions text,
  "order"          integer,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 2. ACCESO PÚBLICO DE LECTURA (sin autenticación)
alter table products enable row level security;

create policy "Lectura pública de productos"
  on products for select
  using (true);

-- 3. STORAGE — bucket para las fotos
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Política: lectura pública de imágenes
create policy "Imágenes públicas"
  on storage.objects for select
  using (bucket_id = 'products');

-- 4. PRODUCTOS DE EJEMPLO (opcionales — borrar si no los quieres)
insert into products (name, category, price, status, stock, description) values
  ('Manta Luna de Miel',   'mantas',         '$85.000',  'new',       2,    'Tejida en punto trenzado con hilo suave merino.'),
  ('Ruana Borgoña',         'mantas',         '$120.000', 'available', null, 'Lana 100% natural en tono borgoña profundo.'),
  ('Bolso Tejido Camel',    'accesorios',     '$55.000',  'new',       1,    'Trenzado a mano con asa de madera natural.'),
  ('Diadema Floral',        'accesorios',     '$35.000',  'available', 3,    'Tejida a crochet con detalles de flores.'),
  ('Manta Personalizada',   'personalizados', 'Consultar','available', null, 'Diseño exclusivo con nombre bordado.'),
  ('Set Regalo Bebé',       'personalizados', '$95.000',  'out',       0,    'Manta y gorro personalizados para bebé.');
