-- Add email tracking to orders table
-- Run this in your Supabase SQL Editor

-- =====================================================
-- Step 1: Add email tracking columns to orders table
-- =====================================================
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS confirmation_email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confirmation_email_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS admin_email_sent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_email_sent_at TIMESTAMP WITH TIME ZONE;

-- =====================================================
-- Step 2: Create index for querying unsent emails
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_orders_confirmation_email_sent 
ON orders(confirmation_email_sent, created_at);

-- =====================================================
-- Verify the columns were added
-- =====================================================
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_name LIKE '%email%';
