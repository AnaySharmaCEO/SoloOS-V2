// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// ===== DEBUG BLOCK START: SUPABASE INITIALIZATION =====
// console.log("[SUPABASE] client initialized with URL:", supabaseUrl);
// ===== DEBUG BLOCK END: SUPABASE INITIALIZATION =====

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && !!supabaseAnonKey;
};
