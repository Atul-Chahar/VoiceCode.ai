
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Helper to map Supabase user to our app's User type
const mapUser = (sbUser: SupabaseUser | null): User | null => {
    if (!sbUser) return null;
    const name = sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || 'Guest';
    return {
        id: sbUser.id,
        email: sbUser.email || `guest_${sbUser.id.slice(0, 5)}@voicecode.ai`,
        name: name,
        avatar: sbUser.user_metadata?.avatar_url
    };
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(mapUser(session?.user ?? null));
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(mapUser(session?.user ?? null));
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
    };

    const signup = async (name: string, email: string, password: string) => {
        await authService.signup(name, email, password);
    };

    const loginWithGoogle = async () => {
        await authService.loginWithGoogle();
    }

    const loginAsGuest = async () => {
        await authService.loginAsGuest();
    }

    const logout = async () => {
        await authService.logout();
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, loginWithGoogle, loginAsGuest, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

