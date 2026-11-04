-- =========================================================
-- Pizzeria 450° — إعداد قاعدة البيانات
-- شغّلي هاد الملف كامل مرة وحدة: Supabase > SQL Editor > New query > Run
-- آمن تشغيله أكثر من مرة.
--
-- الزبون (بدون حساب): بيشوف المنيو وبيبعت طلب بس.
-- الموظفين (حساب واحد): المطبخ والكاش.
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- الأقسام ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.categories add column if not exists name_en text not null default '';
-- is_compact: يعرض القسم كقائمة مختصرة (مثل المشروبات)
alter table public.categories add column if not exists is_compact boolean not null default false;

-- ---------- الأصناف ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  image_url text not null default '',
  image_path text not null default '',
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.products add column if not exists name_en text not null default '';
alter table public.products add column if not exists sort_order integer not null default 0;

-- ---------- الطلبات ----------
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number bigint not null unique default nextval('public.order_number_seq'),
  table_number integer,
  notes text not null default '',
  total numeric(10,2) not null default 0 check (total >= 0),
  status text not null default 'new' check (status in ('new','preparing','ready','delivered','cancelled')),
  created_at timestamptz not null default now()
);

-- نوع الطلب: طاولة أو سفري
alter table public.orders add column if not exists order_type text not null default 'table';
alter table public.orders add column if not exists customer_name text not null default '';
-- وقت الدفع: فاضي يعني الحساب لسا مفتوح
alter table public.orders add column if not exists paid_at timestamptz;

alter table public.orders alter column table_number drop not null;
alter table public.orders drop constraint if exists orders_table_number_check;
alter table public.orders drop constraint if exists orders_type_check;
alter table public.orders add constraint orders_type_check check (
  (order_type = 'table' and table_number > 0)
  or (order_type = 'takeaway' and length(trim(customer_name)) > 0)
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

create index if not exists idx_products_category_id on public.products(category_id);
create index if not exists idx_orders_status_created on public.orders(status, created_at desc);
create index if not exists idx_orders_open on public.orders(paid_at) where paid_at is null;
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- ---------- الحماية (RLS) ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- حذف السياسات القديمة (من نسخة البارون) والجديدة
drop policy if exists "public read active categories" on public.categories;
drop policy if exists "admin manage categories" on public.categories;
drop policy if exists "public read available products" on public.products;
drop policy if exists "admin manage products" on public.products;
drop policy if exists "authenticated read orders" on public.orders;
drop policy if exists "authenticated update orders" on public.orders;
drop policy if exists "public kitchen read orders" on public.orders;
drop policy if exists "public kitchen update orders" on public.orders;
drop policy if exists "authenticated read order items" on public.order_items;
drop policy if exists "public kitchen read order items" on public.order_items;
drop policy if exists "staff read orders" on public.orders;
drop policy if exists "staff update orders" on public.orders;
drop policy if exists "staff read order items" on public.order_items;

-- المنيو: الكل بيشوف الأقسام والأصناف المفعّلة
create policy "public read active categories" on public.categories
for select to anon, authenticated using (is_active = true);

create policy "public read available products" on public.products
for select to anon, authenticated using (is_available = true);

-- الطلبات: الموظفين بس (بعد تسجيل الدخول)
create policy "staff read orders" on public.orders
for select to authenticated using (true);

create policy "staff update orders" on public.orders
for update to authenticated using (true) with check (true);

create policy "staff read order items" on public.order_items
for select to authenticated using (true);

-- ---------- إرسال طلب من الزبون ----------
-- السعر بينحسب هون من قاعدة البيانات، مش من جهاز الزبون.
drop function if exists public.submit_order(integer, text, jsonb);
drop function if exists public.submit_order(text, integer, text, text, jsonb);
drop function if exists public.get_occupied_tables();

create or replace function public.submit_order(
  p_order_type text,
  p_table_number integer,
  p_customer_name text,
  p_notes text,
  p_items jsonb
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number bigint;
  v_total numeric(10,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_qty integer;
begin
  if p_order_type not in ('table', 'takeaway') then
    raise exception 'نوع الطلب غير صحيح';
  end if;
  if p_order_type = 'table' and (p_table_number is null or p_table_number <= 0 or p_table_number > 100) then
    raise exception 'رقم الطاولة غير صحيح';
  end if;
  if p_order_type = 'takeaway' and length(trim(coalesce(p_customer_name, ''))) = 0 then
    raise exception 'اكتب اسمك';
  end if;
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'الطلب فارغ';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'الطلب كبير جداً';
  end if;

  insert into public.orders(order_type, table_number, customer_name, notes, total)
  values (
    p_order_type,
    case when p_order_type = 'table' then p_table_number end,
    case when p_order_type = 'takeaway' then left(trim(p_customer_name), 60) else '' end,
    left(coalesce(trim(p_notes), ''), 300),
    0
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    begin
      v_qty := (v_item->>'quantity')::integer;
      select * into v_product from public.products
      where id = (v_item->>'product_id')::uuid and is_available = true;
    exception when others then
      raise exception 'بيانات أحد الأصناف غير صحيحة';
    end;

    if not found then
      raise exception 'أحد الأصناف غير متوفر';
    end if;
    if v_qty is null or v_qty <= 0 or v_qty > 50 then
      raise exception 'كمية أحد الأصناف غير صحيحة';
    end if;

    insert into public.order_items(order_id, product_id, product_name, quantity, unit_price)
    values (v_order_id, v_product.id, v_product.name, v_qty, v_product.price);

    v_total := v_total + (v_product.price * v_qty);
  end loop;

  update public.orders set total = v_total where id = v_order_id;
  return v_order_number;
end;
$$;

revoke all on function public.submit_order(text, integer, text, text, jsonb) from public;
grant execute on function public.submit_order(text, integer, text, text, jsonb) to anon, authenticated;

-- ---------- الكاش: إغلاق الحساب ----------
-- ما بنمسح الطلبات، بنسجل وقت الدفع، فبيضل عندك تاريخ المبيعات.
drop function if exists public.settle_table(integer);
drop function if exists public.settle_order(uuid);

create or replace function public.settle_table(p_table_number integer)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'غير مسموح';
  end if;
  update public.orders set paid_at = now()
  where order_type = 'table' and table_number = p_table_number
    and paid_at is null and status <> 'cancelled';
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

create or replace function public.settle_order(p_order_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare v_count integer;
begin
  if auth.role() <> 'authenticated' then
    raise exception 'غير مسموح';
  end if;
  update public.orders set paid_at = now()
  where id = p_order_id and paid_at is null;
  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

revoke all on function public.settle_table(integer) from public, anon;
revoke all on function public.settle_order(uuid) from public, anon;
grant execute on function public.settle_table(integer) to authenticated;
grant execute on function public.settle_order(uuid) to authenticated;

-- ---------- التحديث اللحظي ----------
do $$
begin
  if not exists (select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'orders') then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'order_items') then
    alter publication supabase_realtime add table public.order_items;
  end if;
end $$;
