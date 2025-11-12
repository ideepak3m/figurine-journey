-- Fix RLS policies for Storage buckets
-- Run this in your Supabase SQL Editor

-- First, find your bucket name (check what bucket your images are in)
-- Common names: 'assets', 'images', 'products', 'public', etc.

-- Replace 'YOUR_BUCKET_NAME' with your actual bucket name below:

-- Allow public access to view/download files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'FigureIt_Assets');

-- If you want to allow public uploads too (for testing):
-- CREATE POLICY "Public Upload"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'FigureIt_Assets');

-- ===================================================
-- OR: Make the entire bucket public (easier approach)
-- ===================================================
-- Go to: Supabase Dashboard → Storage → Your Bucket → Settings
-- Toggle "Public bucket" to ON

-- ===================================================
-- To check your current bucket name, run:
-- ===================================================
-- SELECT DISTINCT bucket_id FROM storage.objects LIMIT 10;
