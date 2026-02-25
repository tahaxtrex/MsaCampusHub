import { createClient } from '@supabase/supabase-js';

// dotenv is loaded by `import 'dotenv/config'` in index.js (first import).
// In ESM, module evaluation order can vary — if env vars are missing, we
// degrade gracefully rather than crashing the whole server.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[supabase] ⚠️  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing from backend .env — admin routes will not work until these are set.');
}

// Only create the client if both vars are present to avoid a hard crash on startup
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;
