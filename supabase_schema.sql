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

-- 7. GAMIFICATION & ANALYTICS
-- ============================

-- User Stats & Extended Profile
CREATE TABLE IF NOT EXISTS public.user_stats (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lessons_completed INTEGER DEFAULT 0,
  
  -- Social/Bio fields
  tagline TEXT,
  bio TEXT,
  location TEXT,
  github_handle TEXT,
  linkedin_handle TEXT,
  website_url TEXT,
  
  -- Skill points for Radar Chart
  skill_js INTEGER DEFAULT 0,
  skill_python INTEGER DEFAULT 0,
  skill_voice INTEGER DEFAULT 0,
  skill_logic INTEGER DEFAULT 0,
  skill_speed INTEGER DEFAULT 0
);

ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public stats are viewable by everyone." ON public.user_stats;
CREATE POLICY "Public stats are viewable by everyone." 
  ON public.user_stats FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Users can update own stats." ON public.user_stats;
CREATE POLICY "Users can update own stats." 
  ON public.user_stats FOR UPDATE 
  USING ( auth.uid() = user_id );

DROP POLICY IF EXISTS "Users can insert own stats." ON public.user_stats;
CREATE POLICY "Users can insert own stats." 
  ON public.user_stats FOR INSERT 
  WITH CHECK ( auth.uid() = user_id );


-- Daily Activity Log (For Heatmap & Growth Chart)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  activity_date DATE NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  minutes_spent INTEGER DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public activity is viewable by everyone." ON public.activity_log;
CREATE POLICY "Public activity is viewable by everyone." 
  ON public.activity_log FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Users can manage own activity." ON public.activity_log;
CREATE POLICY "Users can manage own activity." 
  ON public.activity_log FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );


-- User Achievements
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL, 
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public achievements are viewable by everyone." ON public.user_achievements;
CREATE POLICY "Public achievements are viewable by everyone." 
  ON public.user_achievements FOR SELECT 
  USING ( true );

DROP POLICY IF EXISTS "Users can manage own achievements." ON public.user_achievements;
CREATE POLICY "Users can manage own achievements." 
  ON public.user_achievements FOR ALL
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );


-- Leaderboard View
CREATE OR REPLACE VIEW public.leaderboard_ranks AS
SELECT 
  us.user_id,
  p.full_name,
  p.avatar_url,
  us.xp,
  us.level,
  ROW_NUMBER() OVER (ORDER BY us.xp DESC) as rank
FROM public.user_stats us
JOIN public.profiles p ON p.id = us.user_id;

-- Grant permissions to the viewing user (unauthenticated and authenticated)
GRANT SELECT ON public.leaderboard_ranks TO anon, authenticated;

-- ==========================================
-- PHASE 5.5: SHOP & ECONOMY (Scalable)
-- ==========================================

-- 1. Shop Catalog (Admin managed, or modify via SQL)
CREATE TABLE IF NOT EXISTS public.shop_items (
  id TEXT PRIMARY KEY, 
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_gems INTEGER NOT NULL CHECK (cost_gems >= 0),
  sell_price_gems INTEGER NOT NULL CHECK (sell_price_gems >= 0),
  max_quantity INTEGER DEFAULT 99,
  icon_name TEXT NOT NULL, -- Logical name for frontend icon mapping
  category TEXT DEFAULT 'misc', -- 'powerup', 'cosmetic', 'theme'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for Shop Items
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
-- Everyone can read shop items
CREATE POLICY "Public read shop items" ON public.shop_items FOR SELECT USING (true);


-- 2. User Inventory
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

-- Enable RLS for Inventory
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
-- Insert/Update is handled via service functions or server-side logic in a real app, 
-- but for MVP we allow users to modify their own inventory (careful in production!).
CREATE POLICY "Users update own inventory" ON public.user_inventory FOR ALL USING (auth.uid() = user_id);


-- 3. Transactions (Audit Log)
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT REFERENCES public.shop_items(id), -- Nullable if it's just a raw gem grant
  amount INTEGER NOT NULL, -- Negative for spend, Positive for earn
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'reward', 'adjustment', 'quest_reward')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- Users insert via app logic (buying)
CREATE POLICY "Users create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 4. Notifications System
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'quest', 'achievement', 'social', 'shop')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  link_url TEXT, -- Optional action link
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);


-- ==========================================
-- SEED DATA
-- ==========================================

INSERT INTO public.shop_items (id, name, description, cost_gems, sell_price_gems, max_quantity, icon_name, category)
VALUES
('streak_freeze', 'Frozen Flame', 'Protect your streak for one day if you miss a goal.', 100, 50, 5, 'flame-blue', 'powerup'),
('xp_potion', 'XP Potion', 'Double XP for the next 30 minutes.', 40, 20, 10, 'flask', 'powerup'),
('seer_stone', 'Seer Stone', 'View a solution without losing potential XP.', 50, 25, 5, 'gem', 'powerup'),
('theme_cyber', 'Cyberpunk Theme', 'Unlock the neon Cyberpunk UI theme.', 500, 0, 1, 'monitor', 'theme'),
('theme_retro', 'Retro Terminal', 'Unlock the monochrome green terminal theme.', 500, 0, 1, 'terminal', 'theme')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, 
    description = EXCLUDED.description, 
    cost_gems = EXCLUDED.cost_gems,
    icon_name = EXCLUDED.icon_name;

