-- Fix the match trigger function to resolve ambiguous column reference
-- Run this directly in your Supabase SQL Editor

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_mutual_like_create_match ON swipes;
DROP TRIGGER IF EXISTS on_mutual_like_create_match_insert ON swipes;
DROP TRIGGER IF EXISTS on_mutual_like_create_match_update ON swipes;

-- Recreate the trigger function with fixed variable names
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
    INSERT INTO matches (user1_id, user2_id)
    VALUES (match_user1_id, match_user2_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for INSERT
CREATE TRIGGER on_mutual_like_create_match_insert
  AFTER INSERT ON swipes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- Create trigger for UPDATE (handles when users change their swipe)
CREATE TRIGGER on_mutual_like_create_match_update
  AFTER UPDATE ON swipes
  FOR EACH ROW
  WHEN (NEW.action = 'like' AND (OLD.action IS NULL OR OLD.action != 'like'))
  EXECUTE FUNCTION create_match_on_mutual_like();
