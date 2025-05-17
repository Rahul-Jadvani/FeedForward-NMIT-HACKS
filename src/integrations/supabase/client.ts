
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://ecgtuclrfnjjiidayxqt.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjZ3R1Y2xyZm5qamlpZGF5eHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MDQzMzYsImV4cCI6MjA2MzA4MDMzNn0.k3AiOG-NXt0tvKhI8kHs2TRQh3crJHdgdoNc-BXLyIY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Using 'any' type to bypass TypeScript errors with database schema
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined
  }
});
