
import { createClient } from '@supabase/supabase-js';

// Cast import.meta to any to avoid TS errors if Vite types aren't fully loaded in this context
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Only warn if we are actually trying to use Supabase (currently using Firebase, so this might be okay to be empty)
if ((!supabaseUrl || !supabaseAnonKey) && false) {
    console.warn("Supabase URL or Anon Key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);