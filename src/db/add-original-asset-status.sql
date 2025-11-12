-- Add original_asset_status column for easy testing resets
-- Run this in your Supabase SQL Editor

-- =====================================================
-- Step 1: Add the new column
-- =====================================================
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS original_asset_status TEXT;

-- =====================================================
-- Step 2: Populate it with current asset_status values
-- =====================================================
UPDATE assets 
SET original_asset_status = asset_status 
WHERE original_asset_status IS NULL;

-- =====================================================
-- Step 3: Make it NOT NULL with a default
-- =====================================================
ALTER TABLE assets 
ALTER COLUMN original_asset_status SET NOT NULL;

ALTER TABLE assets 
ALTER COLUMN original_asset_status SET DEFAULT 'inventory';

-- =====================================================
-- Verify the column was added
-- =====================================================
SELECT 
    asset_status, 
    original_asset_status, 
    COUNT(*) as count 
FROM assets 
GROUP BY asset_status, original_asset_status;
