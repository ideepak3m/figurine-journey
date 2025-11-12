-- Fix RLS policies for assets table to allow public access
-- Run this in your Supabase SQL Editor

-- Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Allow authenticated access to assets" ON assets;
DROP POLICY IF EXISTS "Allow public read access to assets" ON assets;

-- Create permissive policy for public read access
CREATE POLICY "Allow public read access to assets" 
ON assets FOR SELECT 
USING (true);

-- Optional: If you also want to allow public writes (for testing)
-- CREATE POLICY "Allow public insert to assets" 
-- ON assets FOR INSERT 
-- WITH CHECK (true);

-- CREATE POLICY "Allow public update to assets" 
-- ON assets FOR UPDATE 
-- USING (true);

-- Verify RLS is enabled (it should be)
-- ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
