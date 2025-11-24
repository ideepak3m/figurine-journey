-- Migration: Add phone and address columns to user_profiles table
-- Date: 2025-11-24
-- Description: Adds phone and address columns to store user contact information

-- Add the phone column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN phone TEXT NULL;

-- Add the address column to user_profiles table
ALTER TABLE user_profiles
ADD COLUMN address TEXT NULL;

-- Add comments to the columns for documentation
COMMENT ON COLUMN user_profiles.phone IS 'User phone number for contact purposes';
COMMENT ON COLUMN user_profiles.address IS 'User shipping/contact address';

-- Optional: Create indexes if you plan to query by these columns frequently
-- CREATE INDEX idx_user_profiles_phone ON user_profiles(phone);
-- CREATE INDEX idx_user_profiles_address ON user_profiles(address);
