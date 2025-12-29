-- ==========================================================
-- MIGRATION V2: GAMIFICATION & ECONOMY
-- Run this entire script in your Supabase SQL Editor
-- ==========================================================

-- 1. EXTENDED PROFILE & STATS
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
CREATE POLICY "Public stats are viewable by everyone." ON public.user_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats." ON public.user_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats." ON public.user_stats FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 2. ACTIVITY LOG (Heatmap)
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
CREATE POLICY "Public activity is viewable by everyone." ON public.activity_log FOR SELECT USING (true);
CREATE POLICY "Users can manage own activity." ON public.activity_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 3. ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL, 
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public achievements are viewable by everyone." ON public.user_achievements FOR SELECT USING (true);
CREATE POLICY "Users can manage own achievements." ON public.user_achievements FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 4. LEADERBOARD VIEW
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

GRANT SELECT ON public.leaderboard_ranks TO anon, authenticated;


-- 5. SHOP CATALOG
CREATE TABLE IF NOT EXISTS public.shop_items (
  id TEXT PRIMARY KEY, 
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_gems INTEGER NOT NULL CHECK (cost_gems >= 0),
  sell_price_gems INTEGER NOT NULL CHECK (sell_price_gems >= 0),
  max_quantity INTEGER DEFAULT 99,
  icon_name TEXT NOT NULL,
  category TEXT DEFAULT 'misc',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read shop items" ON public.shop_items FOR SELECT USING (true);


-- 6. USER INVENTORY
CREATE TABLE IF NOT EXISTS public.user_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT REFERENCES public.shop_items(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER DEFAULT 0 CHECK (quantity >= 0),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, item_id)
);

ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own inventory" ON public.user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own inventory" ON public.user_inventory FOR ALL USING (auth.uid() = user_id);


-- 7. TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT REFERENCES public.shop_items(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell', 'reward', 'adjustment', 'quest_reward')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);


-- 8. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'quest', 'achievement', 'social', 'shop')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);


-- 9. SEED DATA FOR SHOP
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

SELECT 'Migration completed successfully' as status;
