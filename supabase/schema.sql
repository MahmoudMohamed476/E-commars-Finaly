-- ShopNow — Supabase schema
-- Run this in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run (drops are commented out; policies use IF NOT EXISTS-style guards).

-- ---------------------------------------------------------------------------
-- Products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id            bigint primary key,
  title         text    not null,
  price         numeric(10, 2) not null check (price > 0),
  original_price numeric(10, 2),
  rating        numeric(2, 1) not null default 0,
  review_count  integer not null default 0,
  category      text    not null,
  description   text    not null default '',
  image         text    not null,
  badge         text,
  in_stock      boolean not null default true,
  stock_count   integer not null default 0,
  features      text[]  not null default '{}',
  tags          text[]  not null default '{}',
  created_at    timestamptz not null default now()
);

alter table public.products enable row level security;

-- Everyone (including logged-out visitors) can read the catalog.
drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable"
  on public.products for select
  using (true);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users (id) on delete cascade,
  order_number   text not null,
  customer_name  text not null,
  email          text not null,
  address        text not null,
  city           text not null,
  postal_code    text not null,
  payment_method text not null,
  items          jsonb not null,
  subtotal       numeric(10, 2) not null,
  discount       numeric(10, 2) not null default 0,
  shipping       numeric(10, 2) not null default 0,
  total          numeric(10, 2) not null,
  created_at     timestamptz not null default now()
);

alter table public.orders enable row level security;

-- A signed-in user may create orders only for themselves...
drop policy if exists "Users insert own orders" on public.orders;
create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- ...and may read only their own order history.
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed products (13 rows, matches src/data/products.ts)
-- ---------------------------------------------------------------------------
insert into public.products
  (id, title, price, original_price, rating, review_count, category, description, image, badge, in_stock, stock_count, features, tags)
values
  (1, 'Wireless Bluetooth Headphones', 129.99, 179.99, 4.6, 1243, 'Electronics', 'Premium over-ear wireless headphones with active noise cancelling, 40-hour battery life and rich, balanced sound. Foldable design with cushioned ear cups for all-day comfort.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&auto=format', 'Best Seller', true, 24, ARRAY['Active noise cancellation','40-hour battery life','Bluetooth 5.3','Built-in microphone','Foldable lightweight design'], ARRAY['audio','wireless','bluetooth','noise-cancelling']),
  (2, 'Mechanical Keyboard', 89.99, 109.99, 4.4, 856, 'Electronics', 'Tenkeyless mechanical keyboard with hot-swappable switches, per-key RGB backlighting and a sturdy aluminium frame. Great for typing and gaming alike.', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&auto=format', 'Sale', true, 48, ARRAY['Hot-swappable switches','Per-key RGB lighting','Aluminium top plate','USB-C connection','PBT keycaps'], ARRAY['keyboard','typing','mechanical','gaming']),
  (3, 'Smart Fitness Watch', 199.99, null, 4.7, 2031, 'Wearables', 'Advanced fitness tracker with heart-rate monitoring, GPS, sleep tracking and a bright AMOLED display. Water resistant up to 50m with a 10-day battery.', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&auto=format', 'Hot', true, 37, ARRAY['AMOLED display','Built-in GPS','Heart-rate & sleep tracking','50m water resistance','10-day battery life'], ARRAY['watch','fitness','gps','health']),
  (4, 'Classic Cotton Hoodie', 49.99, 64.99, 4.3, 512, 'Fashion', 'Heavyweight cotton hoodie with brushed fleece lining, kangaroo pocket and adjustable drawstring hood. Relaxed fit that stays comfortable wash after wash.', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop&auto=format', 'Sale', true, 60, ARRAY['100% ring-spun cotton','Brushed fleece lining','Kangaroo pocket','Adjustable hood','Pre-shrunk, machine washable'], ARRAY['hoodie','cotton','streetwear','unisex']),
  (5, 'Portable Bluetooth Speaker', 59.99, 79.99, 4.5, 987, 'Electronics', 'Compact waterproof speaker delivering surprisingly big 360° sound. IPX7 rated with 20-hour playtime and speakerphone function for calls.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop&auto=format', 'New', true, 82, ARRAY['360° sound','IPX7 waterproof','20-hour playtime','Stereo pairing','Speakerphone function'], ARRAY['speaker','bluetooth','portable','waterproof']),
  (6, 'Leather Crossbody Bag', 74.99, null, 4.2, 318, 'Fashion', 'Slim genuine leather crossbody bag with adjustable strap, magnetic closure and interior zip pocket. Fits everyday essentials in style.', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop&auto=format', null, true, 18, ARRAY['Genuine leather','Adjustable shoulder strap','Magnetic clasp closure','Interior zip pocket','Slim 2L capacity'], ARRAY['bag','leather','crossbody','accessories']),
  (7, 'Ceramic Coffee Mug Set', 39.99, null, 4.8, 674, 'Home', 'Set of 4 stoneware coffee mugs in matte glaze finish. Stackable 12oz capacity, dishwasher and microwave safe. Handcrafted look for everyday use.', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=600&fit=crop&auto=format', 'Best Seller', true, 120, ARRAY['Set of 4 stoneware mugs','12oz capacity','Dishwasher & microwave safe','Matte glaze finish','Stackable design'], ARRAY['mug','coffee','home','kitchen']),
  (8, 'Ergonomic Office Chair', 259.99, 329.99, 4.4, 445, 'Home', 'Adjustable mid-back office chair with lumbar support, breathable mesh back and cushioned seat. Smooth rolling casters and pneumatic height adjustment.', 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600&h=600&fit=crop&auto=format', 'Sale', true, 9, ARRAY['Adjustable lumbar support','Breathable mesh back','Pneumatic height adjustment','Tilt & lock mechanism','Rated up to 120kg'], ARRAY['chair','office','ergonomic','furniture']),
  (9, 'Sunglasses - Polarized', 34.99, 49.99, 4.1, 229, 'Fashion', 'Polarized UV400 sunglasses with a classic wayfarer frame, spring hinges and scratch-resistant lenses. Protective case and cleaning cloth included.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&auto=format', 'New', true, 55, ARRAY['Polarized UV400 lenses','Spring hinge temples','Scratch resistant','Incl. hard case','Unisex design'], ARRAY['sunglasses','polarized','uv400','style']),
  (10, 'Cordless Vacuum Cleaner', 189.99, 239.99, 4.6, 733, 'Home', 'Lightweight stick vacuum with powerful suction, 2-in-1 handheld conversion and a swappable battery for up to 40 minutes of runtime.', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop&auto=format', 'Hot', false, 0, ARRAY['2-in-1 stick & handheld','Up to 40 min runtime','Swappable battery','HEPA filtration','Wall-mount charging dock'], ARRAY['vacuum','cordless','cleaning','home']),
  (11, 'Travel Backpack 40L', 94.99, null, 4.5, 561, 'Travel', 'Spacious carry-on friendly backpack with padded laptop sleeve, hidden anti-theft pocket, USB port and compression straps. Water-resistant fabric.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&auto=format', 'Best Seller', true, 41, ARRAY['40L capacity','Fits up to 17" laptop','Hidden anti-theft pocket','USB charging port','Water resistant'], ARRAY['backpack','travel','laptop','carry-on']),
  (12, 'Ceramic Skincare Set', 29.99, 39.99, 4, 132, 'Home', 'Mini serum, moisturizer and cleanser travel set with refillable ceramic pump bottles. Gentle formulas suitable for sensitive skin.', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop&auto=format', 'New', true, 90, ARRAY['Cleanser + serum + moisturizer','Sensitive skin friendly','Refillable ceramic bottles','Compact travel size','Fragrance free'], ARRAY['skincare','serum','travel','beauty']),
  (13, '4K Mirrorless Camera', 549.99, 699.99, 4.7, 892, 'Electronics', 'Compact mirrorless camera with 24MP sensor, 4K/30fps video, flip-out touchscreen and dual-band Wi-Fi. Perfect for vlogging and travel photography.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop&auto=format', 'Hot', true, 14, ARRAY['24MP APS-C sensor','4K video at 30fps','Flip-out touchscreen','Dual-band Wi-Fi','Lightweight body'], ARRAY['camera','photography','4k','vlog'])
on conflict (id) do update set
  title = excluded.title,
  price = excluded.price,
  original_price = excluded.original_price,
  rating = excluded.rating,
  review_count = excluded.review_count,
  category = excluded.category,
  description = excluded.description,
  image = excluded.image,
  badge = excluded.badge,
  in_stock = excluded.in_stock,
  stock_count = excluded.stock_count,
  features = excluded.features,
  tags = excluded.tags;
