-- Add UPDATE trigger for match creation
-- The existing trigger only fires on INSERT, but upsert() can UPDATE existing rows
-- This ensures matches are created even when swipes are updated

-- Drop the existing trigger if it exists (we'll recreate it to handle both INSERT and UPDATE)
DROP TRIGGER IF EXISTS on_mutual_like_create_match ON swipes;

-- Recreate the trigger function to handle both INSERT and UPDATE
-- Fixed: Renamed variables to avoid conflict with table column names
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
    -- Use renamed variables to avoid ambiguity with table columns
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

-- Create trigger for UPDATE (this was missing!)
-- Fires when action changes to 'like' (e.g., user changes from 'dislike' to 'like')
CREATE TRIGGER on_mutual_like_create_match_update
  AFTER UPDATE ON swipes
  FOR EACH ROW
  WHEN (NEW.action = 'like' AND (OLD.action IS NULL OR OLD.action != 'like'))
  EXECUTE FUNCTION create_match_on_mutual_like();
