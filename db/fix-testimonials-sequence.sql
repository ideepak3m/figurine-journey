-- Fix testimonials table sequence
-- Run this in Supabase SQL Editor if you're getting duplicate key errors

-- Reset the sequence to the maximum id + 1
SELECT setval('testimonials_id_seq', COALESCE((SELECT MAX(id) FROM testimonials), 0) + 1, false);

-- Verify the sequence is correct
SELECT currval('testimonials_id_seq') as current_sequence_value;

-- Check if RLS is enabled (if true, we need to add policies)
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'testimonials';

-- Enable RLS if not already enabled
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert testimonials (public feedback)
DROP POLICY IF EXISTS "Allow public insert on testimonials" ON testimonials;
CREATE POLICY "Allow public insert on testimonials"
ON testimonials
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create policy to allow anyone to read testimonials (public display)
DROP POLICY IF EXISTS "Allow public read on testimonials" ON testimonials;
CREATE POLICY "Allow public read on testimonials"
ON testimonials
FOR SELECT
TO anon, authenticated, public
USING (true);
