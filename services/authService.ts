import { supabase } from '../lib/supabase';

export const authService = {
    async login(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        return data.user;
    },

    async signup(name: string, email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                    avatar_url: '', // Optional: add default avatar logic here
                },
            },
        });
        if (error) throw new Error(error.message);
        return data.user;
    },

    async loginWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin,
            }
        });
        if (error) throw new Error(error.message);
        return data;
    },

    async loginAsGuest() {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) throw new Error(error.message);
        return data.user;
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    }
};
