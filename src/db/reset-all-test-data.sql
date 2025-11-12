-- Reset all test data: restore original asset status and delete orders
-- Run this in your Supabase SQL Editor after testing

-- =====================================================
-- Step 1: Restore all assets to their original status
-- =====================================================
UPDATE assets 
SET asset_status = original_asset_status;

-- =====================================================
-- Step 2: Delete all order items (must delete before orders due to FK)
-- =====================================================
DELETE FROM order_items;

-- =====================================================
-- Step 3: Delete all custom orders
-- =====================================================
DELETE FROM custom_orders;

-- =====================================================
-- Step 4: Delete all orders
-- =====================================================
DELETE FROM orders;

-- =====================================================
-- Verify everything is reset
-- =====================================================
SELECT 'Assets' as table_name, asset_status, COUNT(*) as count 
FROM assets 
GROUP BY asset_status

UNION ALL

SELECT 'Orders' as table_name, 'total' as status, COUNT(*) as count 
FROM orders

UNION ALL

SELECT 'Order Items' as table_name, 'total' as status, COUNT(*) as count 
FROM order_items

UNION ALL

SELECT 'Custom Orders' as table_name, 'total' as status, COUNT(*) as count 
FROM custom_orders;

-- =====================================================
-- Alternative: Delete only today's test orders
-- =====================================================
-- -- Get order IDs from today
-- WITH today_orders AS (
--     SELECT id FROM orders WHERE DATE(created_at) = CURRENT_DATE
-- )
-- -- Delete order items first
-- DELETE FROM order_items WHERE order_id IN (SELECT id FROM today_orders);
-- 
-- -- Delete custom orders
-- DELETE FROM custom_orders WHERE order_id IN (SELECT id FROM today_orders);
-- 
-- -- Delete orders
-- DELETE FROM orders WHERE DATE(created_at) = CURRENT_DATE;
-- 
-- -- Restore assets that were sold today
-- UPDATE assets 
-- SET asset_status = original_asset_status
-- WHERE asset_status = 'sold';
