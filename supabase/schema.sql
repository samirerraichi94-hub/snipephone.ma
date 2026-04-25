-- ============================================================
-- Snipe Phone — Supabase Database Schema
-- Run this in the Supabase SQL Editor to initialize the DB
-- ============================================================

-- ─── Categories ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  slug       text UNIQUE NOT NULL,
  icon       text,
  created_at timestamptz DEFAULT now()
);

-- ─── Products ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  description text,
  price       numeric(10,2) NOT NULL,
  old_price   numeric(10,2),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  images      text[] DEFAULT '{}',
  in_stock    boolean DEFAULT true,
  featured    boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ─── Articles ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.articles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  content     text,
  cover_image text,
  published   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ─── Admins ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.admins (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ─── Auto-update updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Row Level Security ────────────────────────────────────

-- Categories: public read, authenticated write
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories_public_read"   ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_admin_all"     ON public.categories FOR ALL    USING (auth.role() = 'authenticated');

-- Products: public read, authenticated write
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read"     ON public.products   FOR SELECT USING (true);
CREATE POLICY "products_admin_all"       ON public.products   FOR ALL    USING (auth.role() = 'authenticated');

-- Articles: public read only published, authenticated can see all
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles_public_read"     ON public.articles   FOR SELECT USING (published = true);
CREATE POLICY "articles_admin_read"      ON public.articles   FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "articles_admin_write"     ON public.articles   FOR ALL    USING (auth.role() = 'authenticated');

-- Admins: authenticated only
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_admin_all"         ON public.admins     FOR ALL    USING (auth.role() = 'authenticated');

-- ─── Storage bucket ────────────────────────────────────────
-- Run in Supabase Dashboard > Storage > New bucket:
--   Name: product-images
--   Public: YES
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "product_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "product_images_admin_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "product_images_admin_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ─── Seed default categories ───────────────────────────────
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Téléphones',         'telephones',  '📱'),
  ('Accessoires',        'accessoires', '🎧'),
  ('PC & Laptops',       'pc-laptops',  '💻'),
  ('Tablettes',          'tablettes',   '📟'),
  ('Caméras',            'cameras',     '📷'),
  ('Flashage',           'flashage',    '🔓'),
  ('Récepteurs',         'recepteurs',  '📡')
ON CONFLICT (slug) DO NOTHING;

-- ─── Create admin user ────────────────────────────────────
-- After running this schema, go to Supabase Dashboard > Authentication > Users
-- and manually create a user with your admin email.
-- Then insert that email into the admins table:
-- INSERT INTO public.admins (email) VALUES ('snipephonecontact@gmail.com');
