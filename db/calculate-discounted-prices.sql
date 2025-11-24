-- Migration: Calculate discounted prices for all assets
-- Date: 2025-11-24
-- Description: Sets discounted_price as 85% of the original price (15% discount)

-- Update all assets with discounted_price = 0.85 * price
UPDATE assets
SET discounted_price = ROUND((price * 0.85)::numeric, 2)
WHERE price IS NOT NULL;

-- Add a comment to the column
COMMENT ON COLUMN assets.discounted_price IS 'Discounted price (15% off original price)';
