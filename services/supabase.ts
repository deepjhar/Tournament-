import { createClient } from '@supabase/supabase-js';

// Credentials provided for the battlezone-esports project
const SUPABASE_URL = 'https://afqtraxjjpqscdcvjiba.supabase.co';
const SUPABASE_KEY = 'sb_publishable_h2jd27drBVYJlCDPwRqPQg_f8Yq451g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('Supabase client initialized');