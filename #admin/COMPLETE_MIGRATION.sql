-- Complete Migration Script
-- This script migrates your existing salawat_counter table and adds contributions tracking
-- Run this in Supabase SQL Editor

-- Step 1: Migrate existing salawat_counter table (if needed)
-- Rename count column to total_count if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'salawat_counter' AND column_name = 'count'
  ) THEN
    ALTER TABLE salawat_counter RENAME COLUMN count TO total_count;
  END IF;
END $$;

-- Add contribution_count column if it doesn't exist
ALTER TABLE salawat_counter 
  ADD COLUMN IF NOT EXISTS contribution_count BIGINT NOT NULL DEFAULT 0;

-- Update existing row to have contribution_count = 0 (or set to 1 if count was > 0)
UPDATE salawat_counter 
SET contribution_count = CASE WHEN total_count > 0 THEN 1 ELSE 0 END
WHERE id = 1;

-- Step 2: Create contributions table to store individual submissions
CREATE TABLE IF NOT EXISTS salawat_contributions (
  id BIGSERIAL PRIMARY KEY,
  contributor_name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) for contributions table
ALTER TABLE salawat_contributions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read contributions
CREATE POLICY "Allow public read access to contributions" 
ON salawat_contributions 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to insert contributions
CREATE POLICY "Allow public insert contributions" 
ON salawat_contributions 
FOR INSERT 
WITH CHECK (true);

-- Step 3: Update the increment_salawat function to save individual contributions
-- Drop old function if it exists (handles both old and new signatures)
DROP FUNCTION IF EXISTS increment_salawat();
DROP FUNCTION IF EXISTS increment_salawat(BIGINT);

-- Create new function that accepts name and amount
CREATE OR REPLACE FUNCTION increment_salawat(amount BIGINT, contributor_name TEXT)
RETURNS JSON AS $$
DECLARE
  new_total_count BIGINT;
  new_contribution_count BIGINT;
  contribution_id BIGINT;
BEGIN
  -- Validate that amount is positive
  IF amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be a positive integer';
  END IF;
  
  -- Validate that name is provided
  IF contributor_name IS NULL OR TRIM(contributor_name) = '' THEN
    RAISE EXCEPTION 'Contributor name is required';
  END IF;
  
  -- Insert the individual contribution first
  INSERT INTO salawat_contributions (contributor_name, amount)
  VALUES (TRIM(contributor_name), amount)
  RETURNING id INTO contribution_id;
  
  -- Update the aggregate counter
  UPDATE salawat_counter 
  SET 
    total_count = total_count + amount,
    contribution_count = contribution_count + 1,
    updated_at = NOW()
  WHERE id = 1
  RETURNING total_count, contribution_count INTO new_total_count, new_contribution_count;
  
  -- Return the updated stats
  RETURN json_build_object(
    'total_count', new_total_count,
    'contribution_count', new_contribution_count,
    'contribution_id', contribution_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION increment_salawat(BIGINT, TEXT) TO anon, authenticated;

-- Step 4: Verify the setup
-- Check salawat_counter table structure
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'salawat_counter'
ORDER BY ordinal_position;

-- Check salawat_contributions table structure
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'salawat_contributions'
ORDER BY ordinal_position;

-- Success message
SELECT 'Migration completed successfully! ✅' AS status;

