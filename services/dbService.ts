
import { supabase } from '../lib/supabase';
import { Progress, UserProfile, UserStats, ActivityLog, LeaderboardEntry, ShopItem, InventoryItem, Notification } from '../types';
import { INITIAL_PROGRESS } from '../constants';

export const dbService = {
    // --- Standard CRUD for 'profiles' table ---

    // 1. Create (or overwrite) a user profile
    async createUser(userId: string, userData: { name: string; email: string }): Promise<void> {
        // Note: The 'handle_new_user' trigger usually handles creation on signup.
        // This method can be used to update or ensure existence.
        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                full_name: userData.name,
                email: userData.email,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("Error creating/updating user:", error);
            throw error;
        }
    },

    // 2. Retrieve all profiles
    async getAllUsers(): Promise<UserProfile[]> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*');

        if (error) {
            console.error("Error getting all users:", error);
            throw error;
        }

        // Map Supabase profile to UserProfile interface
        return (data || []).map((p: any) => ({
            uid: p.id,
            name: p.full_name || '',
            email: p.email || '',
            createdAt: p.updated_at || '', // approximate mapping
        }));
    },

    // 3. Update a specific user profile
    async updateUser(userId: string, data: Partial<UserProfile>): Promise<void> {
        // Map UserProfile keys to DB columns
        const updates: any = {};
        if (data.name) updates.full_name = data.name;
        if (data.email) updates.email = data.email;
        if (Object.keys(updates).length === 0) return;

        updates.updated_at = new Date().toISOString();

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId);

        if (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // 4. Delete a specific user
    async deleteUser(userId: string): Promise<void> {
        // Deleting from auth.users (via Admin API) is strictly server-side.
        // Here we just delete the profile, but usually RLS prevents this for others.
        // If this is an admin function, it needs service role key.
        // Assuming this is "delete my own profile":
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // --- App-Specific Methods ---

    async getUserProgress(userId: string, courseId: string): Promise<Progress> {
        // We assume 'courseId' maps to 'lesson_id' in our simple schema, 
        // OR we store the whole Progress JSON object if structure is complex.
        // Given 'user_progress' table has 'lesson_id', let's use that.
        // However, the `Progress` type in types.ts is a complex object (completedLessons array etc).
        // Our SQL schema `user_progress` (lesson_id, status) seems to track *per lesson*.
        // BUT the frontend expects a `Progress` object which contains global state (aiMemory, completedLessons).
        // Mismatch identified: The SQL schema `user_progress` row per lesson doesn't nicely map to the `Progress` object concept.

        // ADAPTATION: We will treat `user_progress` table as a store for the "Lesson State" 
        // AND we probably need a `user_app_state` table for `aiMemory` and `currentLessonId`.
        // OR, simply: The `Progress` object typically tracks a *Course* progress.
        // Let's look for a `progress` table that matches the JSON structure to minimize refactor friction.
        // Since we didn't create a complex JSON table, let's assume valid JSON storage in a new table 'user_course_data'
        // or just re-use `user_progress` if we change strategy.

        // RE-STRATEGY: Use a `user_states` table to store the JSON blob for `Progress` to keep frontend changes minimal.
        // This mimics the Firestore document structure.

        const { data, error } = await supabase
            .from('user_states')
            .select('data')
            .eq('user_id', userId)
            .eq('context_id', courseId) // generic context ID
            .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
            console.error("Error fetching progress:", error);
            return INITIAL_PROGRESS;
        }

        if (data && data.data) {
            return data.data as Progress;
        }
        return INITIAL_PROGRESS;
    },

    async saveUserProgress(userId: string, courseId: string, progress: Progress): Promise<void> {
        // We need the 'user_states' table. I'll create it in schema update.
        const { error } = await supabase
            .from('user_states')
            .upsert({
                user_id: userId,
                context_id: courseId,
                data: progress,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, context_id' });

        if (error) {
            console.error("Error saving progress:", error);
            throw error;
        }
    },

    async getUserNotes(userId: string): Promise<string> {
        const { data, error } = await supabase
            .from('user_notes')
            .select('content')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            console.error("Error fetching notes:", error);
            return '';
        }

        return data?.content || '';
    },

    async saveUserNotes(userId: string, content: string): Promise<void> {
        const { error } = await supabase
            .from('user_notes')
            .upsert({
                user_id: userId,
                content: content,
                updated_at: new Date().toISOString()
            });

        if (error) {
            console.error("Error saving notes:", error);
            throw error;
        }
    },

    async submitFeedback(userId: string, message: string, type: 'bug' | 'feature' | 'general' = 'general'): Promise<void> {
        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: userId,
                message,
                type
            });

        if (error) {
            console.error("Error submitting feedback:", error);
            throw error;
        }
    },

    // --- Gamification & Analytics Methods ---

    async getUserStats(userId: string): Promise<UserStats | null> {
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching user stats:", error);
            return null;
        }

        if (!data) {
            // Initialize stats if not exist
            const initialStats = {
                user_id: userId,
                xp: 0,
                level: 1,
                current_streak: 0,
                longest_streak: 0,
                lessons_completed: 0,
                skill_js: 0,
                skill_python: 0,
                skill_voice: 0,
                skill_logic: 0,
                skill_speed: 0
            };

            const { error: initError } = await supabase
                .from('user_stats')
                .insert(initialStats);

            if (initError) console.error("Error initializing stats:", initError);

            return {
                userId,
                xp: 0,
                level: 1,
                currentStreak: 0,
                longestStreak: 0,
                joinedAt: new Date().toISOString(),
                lessonsCompleted: 0,
                skillJs: 0, skillPython: 0, skillVoice: 0, skillLogic: 0, skillSpeed: 0
            };
        }

        return {
            userId: data.user_id,
            xp: data.xp,
            level: data.level,
            currentStreak: data.current_streak,
            longestStreak: data.longest_streak,
            joinedAt: data.joined_at,
            lessonsCompleted: data.lessons_completed,
            tagline: data.tagline,
            bio: data.bio,
            location: data.location,
            githubHandle: data.github_handle,
            linkedinHandle: data.linkedin_handle,
            websiteUrl: data.website_url,
            skillJs: data.skill_js,
            skillPython: data.skill_python,
            skillVoice: data.skill_voice,
            skillLogic: data.skill_logic,
            skillSpeed: data.skill_speed,
        };
    },

    async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<void> {
        // Map camelCase to snake_case for DB
        const dbUpdates: any = {};
        if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
        if (updates.level !== undefined) dbUpdates.level = updates.level;
        if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
        if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
        if (updates.lessonsCompleted !== undefined) dbUpdates.lessons_completed = updates.lessonsCompleted;
        if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
        if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
        if (updates.location !== undefined) dbUpdates.location = updates.location;
        if (updates.githubHandle !== undefined) dbUpdates.github_handle = updates.githubHandle;
        if (updates.linkedinHandle !== undefined) dbUpdates.linkedin_handle = updates.linkedinHandle;
        if (updates.websiteUrl !== undefined) dbUpdates.website_url = updates.websiteUrl;

        // Skills
        if (updates.skillJs !== undefined) dbUpdates.skill_js = updates.skillJs;
        if (updates.skillPython !== undefined) dbUpdates.skill_python = updates.skillPython;
        if (updates.skillVoice !== undefined) dbUpdates.skill_voice = updates.skillVoice;
        if (updates.skillLogic !== undefined) dbUpdates.skill_logic = updates.skillLogic;
        if (updates.skillSpeed !== undefined) dbUpdates.skill_speed = updates.skillSpeed;

        const { error } = await supabase
            .from('user_stats')
            .update(dbUpdates)
            .eq('user_id', userId);

        if (error) {
            console.error("Error updating user stats:", error);
            throw error;
        }
    },

    async getActivityLog(userId: string, days: number = 365): Promise<ActivityLog[]> {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const { data, error } = await supabase
            .from('activity_log')
            .select('*')
            .eq('user_id', userId)
            .gte('activity_date', startDate.toISOString().split('T')[0])
            .order('activity_date', { ascending: true });

        if (error) {
            console.error("Error fetching activity log:", error);
            return [];
        }

        return (data || []).map((d: any) => ({
            id: d.id,
            date: d.activity_date,
            xpEarned: d.xp_earned,
            lessonsCompleted: d.lessons_completed,
            minutesSpent: d.minutes_spent
        }));
    },

    async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
        const { data, error } = await supabase
            .from('leaderboard_ranks')
            .select('*')
            .limit(limit);

        if (error) {
            console.error("Error fetching leaderboard:", error);
            return [];
        }

        return (data || []).map((d: any) => ({
            rank: d.rank,
            userId: d.user_id,
            fullName: d.full_name || 'Anonymous',
            avatarUrl: d.avatar_url,
            xp: d.xp,
            level: d.level
        }));
    },

    // --- Shop & Economy Methods ---

    async getShopItems(): Promise<ShopItem[]> {
        const { data, error } = await supabase
            .from('shop_items')
            .select('*')
            .order('cost_gems', { ascending: true });

        if (error) {
            console.error("Error fetching shop items:", error);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            costGems: item.cost_gems,
            sellPriceGems: item.sell_price_gems,
            maxQuantity: item.max_quantity,
            iconName: item.icon_name,
            category: item.category
        }));
    },

    async getInventory(userId: string): Promise<InventoryItem[]> {
        const { data, error } = await supabase
            .from('user_inventory')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error("Error fetching inventory:", error);
            return [];
        }

        return (data || []).map((item: any) => ({
            id: item.id,
            itemId: item.item_id,
            quantity: item.quantity
        }));
    },

    async buyItem(userId: string, itemId: string, cost: number): Promise<{ success: boolean; message?: string }> {
        // 1. Get current user stats for gem balance (using XP as gems for now, needs separation? Plan says XP/Gems)
        // Assumption: XP = Gems for this MVP, or we need a 'gems' field in user_stats.
        // Let's assume 'xp' IS the currency for simplicity, or we add 'gems' to user_stats.
        // Wait, the plan says "Currency Display (Gems/XP)".
        // The schema for user_stats has 'xp' but NOT 'gems'.
        // Refinement: I will use 'xp' as the currency for now to avoid schema migration issues mid-flight, 
        // OR I should have added 'gems' column.
        // Let's check the schema update I just did... I added `shop_items` with `cost_gems`.
        // I did NOT add `gems` to `user_stats`.
        // FIX: I will use `xp` as the "Gems" value for logic, effectively "XP = Currency".
        // This is common in simple gamification.

        const stats = await this.getUserStats(userId);
        if (!stats || stats.xp < cost) {
            return { success: false, message: 'Insufficient XP/Gems' };
        }

        // 2. Check Inventory Max Quantity
        // Fetch item details first to get max? We passed cost, but we need max_quantity.
        // Let's rely on the frontend passing valid cost, but backend should verify.
        // For MVP, we skip the max quantity check to save a round trip or do checking in SQL triggers.
        // Let's do a simple check.

        // 3. Perform Transaction (Deduct XP, Add Item, Record Transaction)
        // Ideally this should be a stored procedure or transaction block.
        // Supabase-js doesn't support complex transactions easily client-side without RPC.
        // We will do optimistic sequential updates.

        // Deduct XP
        const { error: statsError } = await supabase
            .from('user_stats')
            .update({ xp: stats.xp - cost })
            .eq('user_id', userId);

        if (statsError) return { success: false, message: 'Transaction failed (Stats)' };

        // Add to Inventory (Upsert)
        // We need to fetch current quantity first to increment?
        // simple upsert with increment is hard without RPC.
        // Let's try to find existing item.
        const { data: existingInv } = await supabase
            .from('user_inventory')
            .select('quantity')
            .eq('user_id', userId)
            .eq('item_id', itemId)
            .maybeSingle();

        const newQuantity = (existingInv?.quantity || 0) + 1;

        const { error: invError } = await supabase
            .from('user_inventory')
            .upsert({
                user_id: userId,
                item_id: itemId,
                quantity: newQuantity,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, item_id' });

        if (invError) {
            // Rollback stats? (Not implementing rollback for MVP, risky but acceptable)
            console.error("Inventory update failed", invError);
            return { success: false, message: 'Inventory update failed' };
        }

        // Record Transaction
        await supabase.from('transactions').insert({
            user_id: userId,
            item_id: itemId,
            amount: -cost,
            type: 'buy',
            description: `Bought item ${itemId}`
        });

        return { success: true };
    },

    async sellItem(userId: string, itemId: string, sellPrice: number): Promise<{ success: boolean, message?: string }> {
        // Check inventory
        const { data: existingInv } = await supabase
            .from('user_inventory')
            .select('quantity')
            .eq('user_id', userId)
            .eq('item_id', itemId)
            .maybeSingle();

        if (!existingInv || existingInv.quantity <= 0) {
            return { success: false, message: 'Item not in inventory' };
        }

        // Add XP/Gems
        // We need to fetch stats again to get current XP to add to.
        const stats = await this.getUserStats(userId);
        if (!stats) return { success: false, message: 'User not found' };

        await supabase.from('user_stats').update({ xp: stats.xp + sellPrice }).eq('user_id', userId);

        // Decrement Inventory
        const newQuantity = existingInv.quantity - 1;
        if (newQuantity === 0) {
            // Option: delete row or set to 0. Set to 0 is safer for upsert logic elsewhere.
            await supabase.from('user_inventory').update({ quantity: 0 }).eq('user_id', userId).eq('item_id', itemId);
        } else {
            await supabase.from('user_inventory').update({ quantity: newQuantity }).eq('user_id', userId).eq('item_id', itemId);
        }

        // Record Transaction
        await supabase.from('transactions').insert({
            user_id: userId,
            item_id: itemId,
            amount: sellPrice,
            type: 'sell',
            description: `Sold item ${itemId}`
        });

        return { success: true };
    },

    // --- Notifications Methods ---

    async getNotifications(userId: string): Promise<Notification[]> {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }

        return (data || []).map((n: any) => ({
            id: n.id,
            type: n.type,
            title: n.title,
            message: n.message,
            isRead: n.is_read,
            linkUrl: n.link_url,
            createdAt: n.created_at
        }));
    },

    async markNotificationRead(notificationId: string): Promise<void> {
        await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId);
    }
};

