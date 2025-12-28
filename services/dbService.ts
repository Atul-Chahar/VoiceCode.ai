
import { supabase } from '../lib/supabase';
import { Progress, UserProfile } from '../types';
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
    }
};

