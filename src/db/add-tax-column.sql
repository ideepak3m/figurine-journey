-- Migration: Add tax column to orders table
-- Run this in your Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00;

-- Update existing orders to calculate tax (Ontario HST 13%)
-- UPDATE orders SET tax = (subtotal + shipping_fee) * 0.13 WHERE tax = 0;

