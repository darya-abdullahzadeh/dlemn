-- Create swipes table
-- Tracks user swipes (likes/dislikes) on other profiles
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('like', 'dislike', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(swiper_id, swiped_id)
);

-- Enable Row Level Security
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own swipes
CREATE POLICY "Users can view their own swipes"
  ON swipes FOR SELECT
  USING (auth.uid() = swiper_id);

-- Create policy: Users can insert their own swipes
CREATE POLICY "Users can insert their own swipes"
  ON swipes FOR INSERT
  WITH CHECK (auth.uid() = swiper_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_swipes_swiper ON swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped ON swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_swipes_action ON swipes(action);
