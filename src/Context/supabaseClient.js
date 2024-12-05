import { createClient } from "@supabase/supabase-js";

// URL e chave pública do Supabase (pegue do painel do Supabase)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
