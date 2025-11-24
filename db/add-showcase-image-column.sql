-- Migration: Add showCaseImage column to custom_orders table
-- Date: 2025-11-24
-- Description: Adds a column to store the URL of the showcase image that inspired the custom order

-- Add the showCaseImage column to custom_orders table
ALTER TABLE custom_orders
ADD COLUMN "showCaseImage" TEXT NULL;

-- Add a comment to the column for documentation
COMMENT ON COLUMN custom_orders."showCaseImage" IS 'URL of the showcase image from the shop page that inspired this custom order';

-- Optional: Create an index if you plan to query by this column frequently
-- CREATE INDEX idx_custom_orders_showcase_image ON custom_orders("showCaseImage");
