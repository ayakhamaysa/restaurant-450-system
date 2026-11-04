import { createClient } from "@supabase/supabase-js";

// The URL and key come from the .env file
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
