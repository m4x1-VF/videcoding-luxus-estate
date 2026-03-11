-- Add is_active column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing records to be active
UPDATE properties SET is_active = true WHERE is_active IS NULL;
