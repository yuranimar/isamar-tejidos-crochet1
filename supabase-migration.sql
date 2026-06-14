-- ══════════════════════════════════════════════════════════════
--  Isamar • Tejidos y Crochet — Migración Supabase
--  Ejecutar en: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════

-- 1. Tabla de productos
create table if not exists products (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz default now(),
  name             text        not null,
  category         text        not null default 'otros',
  price            text        not null,
  original_price   text,
  description      text,
  image            text,           -- URL pública de Supabase Storage
  status           text        not null default 'available'
                   check (status in ('available', 'new', 'out')),
  stock            integer,
  material         text,
  dimensions       text,
  delivery_time    text,
  care_instructions text,
  "order"          integer
);

-- 2. Índice para ordenar por categoría
create index if not exists products_category_idx on products(category);

-- 3. Row Level Security — tabla de lectura pública, escritura solo con secret key
alter table products enable row level security;

-- Cualquiera puede leer (catálogo público)
create policy "Lectura pública" on products
  for select using (true);

-- Solo el service role (secret key) puede escribir
create policy "Solo servicio puede escribir" on products
  for all using (auth.role() = 'service_role');

-- ══════════════════════════════════════════════════════════════
--  STORAGE — crear el bucket 'productos'
--  Hacerlo en: Supabase Dashboard → Storage → New Bucket
--  Nombre: productos
--  Public bucket: ✅ activado
-- ══════════════════════════════════════════════════════════════

-- Política de storage: lectura pública
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

create policy "Imágenes públicas"
  on storage.objects for select
  using ( bucket_id = 'productos' );

create policy "Solo servicio puede subir"
  on storage.objects for insert
  with check ( bucket_id = 'productos' AND auth.role() = 'service_role' );
