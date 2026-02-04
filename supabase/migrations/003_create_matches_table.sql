-- Create matches table
-- Tracks mutual likes (matches) between users
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user1_id, user2_id),
  CHECK (user1_id < user2_id) -- Ensures consistent ordering
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view matches they're part of
CREATE POLICY "Users can view their matches"
  ON matches FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create policy: System can insert matches (via trigger)
CREATE POLICY "System can insert matches"
  ON matches FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON matches(user2_id);

-- Function to create a match when two users like each other
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_swipe_exists BOOLEAN;
  match_user1_id UUID;
  match_user2_id UUID;
BEGIN
  -- Only process if action is 'like'
  IF NEW.action != 'like' THEN
    RETURN NEW;
  END IF;

  -- Check if the swiped user has also liked the swiper
  SELECT EXISTS (
    SELECT 1 FROM swipes
    WHERE swiper_id = NEW.swiped_id
    AND swiped_id = NEW.swiper_id
    AND action = 'like'
  ) INTO mutual_swipe_exists;

  -- If mutual like exists, create a match
  IF mutual_swipe_exists THEN
    -- Ensure consistent ordering (smaller UUID first)
    IF NEW.swiper_id < NEW.swiped_id THEN
      match_user1_id := NEW.swiper_id;
      match_user2_id := NEW.swiped_id;
    ELSE
      match_user1_id := NEW.swiped_id;
      match_user2_id := NEW.swiper_id;
    END IF;

    -- Insert match if it doesn't already exist
    -- Use fully qualified column names to avoid ambiguity
    INSERT INTO matches (user1_id, user2_id)
    VALUES (match_user1_id, match_user2_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create matches
CREATE TRIGGER on_mutual_like_create_match
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();
