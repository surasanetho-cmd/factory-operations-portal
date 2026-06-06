-- FOP Phase 1 initial schema

CREATE TYPE user_role AS ENUM (
  'ADMIN', 'SALE', 'PLANNING', 'STORE', 'PRODUCTION', 'MANAGER'
);

CREATE TYPE profile_status AS ENUM ('ACTIVE', 'INACTIVE');

CREATE TYPE order_status AS ENUM (
  'NEW', 'PLANNING', 'MATERIAL_CHECK', 'READY',
  'IN_PRODUCTION', 'COMPLETED', 'SHIPPED'
);

CREATE TYPE plan_status AS ENUM ('DRAFT', 'RELEASED', 'IN_PROGRESS', 'COMPLETED');

CREATE TYPE material_request_status AS ENUM (
  'DRAFT', 'SUBMITTED', 'APPROVED', 'ISSUED', 'COMPLETED'
);

CREATE TYPE inventory_status AS ENUM ('NORMAL', 'LOW', 'CRITICAL');

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'MANAGER',
  department TEXT,
  status profile_status NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  part_no TEXT NOT NULL,
  part_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  due_date DATE NOT NULL,
  status order_status NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE production_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plan_date DATE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  status plan_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE material_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_no TEXT NOT NULL UNIQUE,
  production_plan_id UUID NOT NULL REFERENCES production_plans(id) ON DELETE CASCADE,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  requested_by UUID NOT NULL REFERENCES profiles(id),
  status material_request_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE material_request_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_request_id UUID NOT NULL REFERENCES material_requests(id) ON DELETE CASCADE,
  material_code TEXT NOT NULL,
  material_name TEXT NOT NULL,
  requested_qty NUMERIC(12,2) NOT NULL CHECK (requested_qty > 0),
  issued_qty NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (issued_qty >= 0)
);

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_code TEXT NOT NULL UNIQUE,
  material_name TEXT NOT NULL,
  current_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
  safety_stock NUMERIC(12,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'PCS',
  status inventory_status NOT NULL DEFAULT 'NORMAL',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_due_date ON orders(due_date);
CREATE INDEX idx_plans_order_id ON production_plans(order_id);
CREATE INDEX idx_plans_status ON production_plans(status);
CREATE INDEX idx_mr_status ON material_requests(status);
CREATE INDEX idx_inventory_status ON inventory(status);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, employee_code, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'employee_code', 'EMP-' || LEFT(NEW.id::text, 8)),
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'MANAGER')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Inventory status sync
CREATE OR REPLACE FUNCTION sync_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.current_stock <= 0 THEN
    NEW.status := 'CRITICAL';
  ELSIF NEW.current_stock <= NEW.safety_stock THEN
    NEW.status := 'LOW';
  ELSE
    NEW.status := 'NORMAL';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_status_trigger
  BEFORE INSERT OR UPDATE OF current_stock, safety_stock ON inventory
  FOR EACH ROW EXECUTE FUNCTION sync_inventory_status();

-- Helper: get current user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_request_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated
  USING (true);
CREATE POLICY profiles_admin_update ON profiles FOR UPDATE TO authenticated
  USING (get_user_role() = 'ADMIN');
CREATE POLICY profiles_admin_insert ON profiles FOR INSERT TO authenticated
  WITH CHECK (get_user_role() = 'ADMIN');

-- Orders policies
CREATE POLICY orders_select ON orders FOR SELECT TO authenticated
  USING (get_user_role() IN ('ADMIN','SALE','PLANNING','MANAGER'));
CREATE POLICY orders_admin_all ON orders FOR ALL TO authenticated
  USING (get_user_role() = 'ADMIN');

-- Production plans policies
CREATE POLICY plans_select ON production_plans FOR SELECT TO authenticated
  USING (get_user_role() IN ('ADMIN','SALE','PLANNING','STORE','PRODUCTION','MANAGER'));
CREATE POLICY plans_planning ON production_plans FOR ALL TO authenticated
  USING (get_user_role() IN ('ADMIN','PLANNING'));
CREATE POLICY plans_production_update ON production_plans FOR UPDATE TO authenticated
  USING (get_user_role() IN ('ADMIN','PRODUCTION'));

-- Material requests
CREATE POLICY mr_select ON material_requests FOR SELECT TO authenticated
  USING (get_user_role() IN ('ADMIN','PLANNING','STORE','PRODUCTION','MANAGER'));
CREATE POLICY mr_production ON material_requests FOR INSERT TO authenticated
  WITH CHECK (get_user_role() IN ('ADMIN','PRODUCTION'));
CREATE POLICY mr_production_update ON material_requests FOR UPDATE TO authenticated
  USING (get_user_role() IN ('ADMIN','PRODUCTION','STORE'));

CREATE POLICY mri_select ON material_request_items FOR SELECT TO authenticated
  USING (true);
CREATE POLICY mri_write ON material_request_items FOR ALL TO authenticated
  USING (get_user_role() IN ('ADMIN','PRODUCTION','STORE'));

-- Inventory
CREATE POLICY inventory_select ON inventory FOR SELECT TO authenticated
  USING (get_user_role() IN ('ADMIN','SALE','PLANNING','STORE','PRODUCTION','MANAGER'));
CREATE POLICY inventory_store ON inventory FOR UPDATE TO authenticated
  USING (get_user_role() IN ('ADMIN','STORE'));
CREATE POLICY inventory_admin ON inventory FOR ALL TO authenticated
  USING (get_user_role() = 'ADMIN');

-- Notifications (own only)
CREATE POLICY notifications_own ON notifications FOR ALL TO authenticated
  USING (user_id = auth.uid());

-- Activity logs
CREATE POLICY activity_select ON activity_logs FOR SELECT TO authenticated
  USING (get_user_role() IN ('ADMIN','MANAGER'));
CREATE POLICY activity_insert ON activity_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
