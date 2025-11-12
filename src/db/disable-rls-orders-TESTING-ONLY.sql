-- TEMPORARY: Disable RLS for testing orders functionality
-- ⚠️ WARNING: Only use this for development/testing
-- ⚠️ Re-enable RLS before going to production!

-- Disable RLS on all order-related tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders DISABLE ROW LEVEL SECURITY;

-- Verify RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items', 'custom_orders');

-- When ready to re-enable RLS, run this:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;
