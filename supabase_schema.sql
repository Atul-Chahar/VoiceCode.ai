-- ==========================================
-- VoiceCode.ai Supabase Schema Setup
-- ==========================================

-- NOTE: We rely on Supabase's managed `auth.users` table. 
-- We DO NOT attempt to enable RLS on `auth.users` manually as it requires superuser permissions.

-- 1. PROFILES TABLE
-- Create a table for public profiles if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  CONSTRAINT username_length CHECK (char_length(full_name) >= 3)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Idempotent Policies for profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." 
  ON public.profiles FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT 
  WITH CHECK ( auth.uid() = id );

DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE 
  USING ( auth.uid() = id );


-- 2. USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  lesson_id TEXT NOT NULL,
  status TEXT CHECK (status IN ('locked', 'unlocked', 'completed')) DEFAULT 'locked',
  xp INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own progress." ON public.user_progress;
CREATE POLICY "Users can read own progress." 
  ON public.user_progress FOR SELECT 
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can insert own progress." ON public.user_progress;
CREATE POLICY "Users can insert own progress." 
  ON public.user_progress FOR INSERT 
  WITH CHECK ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can update own progress." ON public.user_progress;
CREATE POLICY "Users can update own progress." 
  ON public.user_progress FOR UPDATE 
  USING ( auth.uid() = user_id );


-- 3. USER STATES TABLE (For JSON blobs like aiMemory)
CREATE TABLE IF NOT EXISTS public.user_states (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  context_id TEXT NOT NULL,
  data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, context_id)
);

ALTER TABLE public.user_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own states." ON public.user_states;
CREATE POLICY "Users can manage own states." 
  ON public.user_states FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );


-- 4. USER NOTES TABLE
CREATE TABLE IF NOT EXISTS public.user_notes (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  content TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own notes." ON public.user_notes;
CREATE POLICY "Users can manage own notes." 
  ON public.user_notes FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );


-- 5. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('bug', 'feature', 'general')) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert feedback." ON public.feedback;
CREATE POLICY "Users can insert feedback." 
  ON public.feedback FOR INSERT 
  WITH CHECK ( auth.uid() = user_id );


-- 6. TRIGGERS (Idempotent approach)
-- We need to drop the trigger before recreating it to avoid errors if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING; -- Safe if profile already exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Output success message (visible in some SQL clients)
SELECT 'Schema setup completed successfully.' as result;
