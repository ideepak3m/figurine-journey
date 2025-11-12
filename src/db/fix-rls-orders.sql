-- Fix RLS policies for orders, order_items, and custom_orders tables
-- Run this in your Supabase SQL Editor if you get RLS errors

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow all operations on orders" ON orders;
DROP POLICY IF EXISTS "Allow all operations on order_items" ON order_items;
DROP POLICY IF EXISTS "Allow all operations on custom_orders" ON custom_orders;

-- Create policies that allow all operations (for testing/demo)
CREATE POLICY "Allow all operations on orders" 
    ON orders FOR ALL 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on order_items" 
    ON order_items FOR ALL 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow all operations on custom_orders" 
    ON custom_orders FOR ALL 
    USING (true)
    WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- Check the policies were created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items', 'custom_orders');
