-- Seed data for FOP Phase 1 (run after migration, with auth users created separately)
-- Sample orders
INSERT INTO orders (order_no, customer_name, part_no, part_name, quantity, due_date, status) VALUES
  ('SO-2026-001', 'Toyota Motor Thailand', 'PART-A100', 'Bracket Assy Front', 500, '2026-06-15', 'NEW'),
  ('SO-2026-002', 'Honda Trading Asia', 'PART-B200', 'Reinforcement Panel', 300, '2026-06-10', 'PLANNING'),
  ('SO-2026-003', 'Mazda Supplier Co.', 'PART-C300', 'Cross Member', 150, '2026-05-28', 'IN_PRODUCTION'),
  ('SO-2026-004', 'Nissan Auto Parts', 'PART-D400', 'Side Member LH', 200, '2026-07-01', 'NEW'),
  ('SO-2026-005', 'Isuzu Motors', 'PART-E500', 'Floor Panel', 400, '2026-06-20', 'MATERIAL_CHECK')
ON CONFLICT (order_no) DO NOTHING;

-- Inventory
INSERT INTO inventory (material_code, material_name, current_stock, safety_stock, unit) VALUES
  ('RM-STEEL-001', 'Steel Sheet 1.2mm', 1200, 500, 'KG'),
  ('RM-STEEL-002', 'Steel Sheet 0.8mm', 80, 200, 'KG'),
  ('RM-BOLT-M8', 'Bolt M8x20', 5000, 1000, 'PCS'),
  ('RM-WELD-WIRE', 'Welding Wire 0.9mm', 0, 50, 'KG'),
  ('RM-PAINT-GRY', 'Paint Gray Primer', 150, 100, 'L')
ON CONFLICT (material_code) DO NOTHING;
