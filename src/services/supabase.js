import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY wajib diisi di .env.");
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

