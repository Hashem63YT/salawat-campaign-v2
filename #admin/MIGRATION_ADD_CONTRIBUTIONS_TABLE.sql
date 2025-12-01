-- Migration: Add contributions table to track individual submissions
-- Run this in Supabase SQL Editor after migrating salawat_counter table

-- Create contributions table to store individual submissions
CREATE TABLE IF NOT EXISTS salawat_contributions (
  id BIGSERIAL PRIMARY KEY,
  contributor_name TEXT NOT NULL,
  amount BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
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

-- Update the increment_salawat function to also save individual contributions
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

-- Grant execute permission on the updated function
GRANT EXECUTE ON FUNCTION increment_salawat(BIGINT, TEXT) TO anon, authenticated;

-- Enable Realtime for contributions table (optional, for real-time updates)
-- You can enable this in Dashboard > Database > Replication if needed

