-- Create user_usage table for tracking monthly usage
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_type VARCHAR(50) NOT NULL CHECK (usage_type IN ('resume', 'cover_letter')),
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per user per usage type per month
  UNIQUE(user_id, usage_type, DATE_TRUNC('month', created_at))
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_user_usage_user_type_date 
ON user_usage(user_id, usage_type, created_at);

-- Enable RLS
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" ON user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_user_usage_updated_at 
  BEFORE UPDATE ON user_usage 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add tier column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'users' AND column_name = 'tier') THEN
    ALTER TABLE auth.users ADD COLUMN tier VARCHAR(20) DEFAULT 'free';
  END IF;
END $$;