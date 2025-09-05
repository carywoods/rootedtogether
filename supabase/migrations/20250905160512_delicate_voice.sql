/*
  # Complete Database Schema for Rooted Together

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text, unique)
      - `display_name` (text)
      - `location_text` (text, approximate location)
      - `latitude` (numeric, for proximity matching)
      - `longitude` (numeric, for proximity matching)
      - `growing_zone` (text, USDA hardiness zone)
      - `experience_level` (text, enum: Sprout, Seedling, Sapling, Branch, Oak)
      - `available_space` (text[])
      - `sun_exposure` (text[])
      - `gardening_goals` (text[])
      - `preferred_plants` (text)
      - `bio` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references profiles)
      - `recipient_id` (uuid, references profiles)
      - `content` (text)
      - `read_at` (timestamp)
      - `created_at` (timestamp)

    - `gardening_posts`
      - `id` (uuid, primary key)
      - `author_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `growing_zone` (text)
      - `tags` (text[])
      - `image_url` (text)
      - `created_at` (timestamp)

    - `connections`
      - `id` (uuid, primary key)
      - `requester_id` (uuid, references profiles)
      - `addressee_id` (uuid, references profiles)
      - `status` (text, enum: pending, accepted, blocked)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate
*/

-- Create custom types
DO $$ BEGIN
    CREATE TYPE experience_level AS ENUM ('Sprout', 'Seedling', 'Sapling', 'Branch', 'Oak');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  location_text text,
  latitude numeric,
  longitude numeric,
  growing_zone text,
  experience_level experience_level DEFAULT 'Sprout',
  available_space text[] DEFAULT '{}',
  sun_exposure text[] DEFAULT '{}',
  gardening_goals text[] DEFAULT '{}',
  preferred_plants text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Gardening posts table
CREATE TABLE IF NOT EXISTS gardening_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  growing_zone text,
  tags text[] DEFAULT '{}',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  addressee_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  status connection_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE gardening_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view messages they sent or received" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Recipients can update read status" ON messages;

DROP POLICY IF EXISTS "Posts are viewable by everyone" ON gardening_posts;
DROP POLICY IF EXISTS "Users can create posts" ON gardening_posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON gardening_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON gardening_posts;

DROP POLICY IF EXISTS "Users can view their connections" ON connections;
DROP POLICY IF EXISTS "Users can create connection requests" ON connections;
DROP POLICY IF EXISTS "Addressees can update connection status" ON connections;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received"
  ON messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Recipients can update read status"
  ON messages
  FOR UPDATE
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Gardening posts policies
CREATE POLICY "Posts are viewable by everyone"
  ON gardening_posts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON gardening_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON gardening_posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON gardening_posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- Connections policies
CREATE POLICY "Users can view their connections"
  ON connections
  FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create connection requests"
  ON connections
  FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Addressees can update connection status"
  ON connections
  FOR UPDATE
  USING (auth.uid() = addressee_id)
  WITH CHECK (auth.uid() = addressee_id);

-- Create indexes for performance (without PostGIS dependency)
CREATE INDEX IF NOT EXISTS idx_profiles_latitude ON profiles (latitude);
CREATE INDEX IF NOT EXISTS idx_profiles_longitude ON profiles (longitude);
CREATE INDEX IF NOT EXISTS idx_profiles_experience ON profiles (experience_level);
CREATE INDEX IF NOT EXISTS idx_profiles_growing_zone ON profiles (growing_zone);
CREATE INDEX IF NOT EXISTS idx_messages_participants ON messages (sender_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gardening_posts_zone ON gardening_posts (growing_zone);
CREATE INDEX IF NOT EXISTS idx_gardening_posts_created_at ON gardening_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_connections_requester ON connections (requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_addressee ON connections (addressee_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();