import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

// true, когда тенант Supabase настроен (URL + publishable key). Без них приложение работает в демо-режиме.
export const supabaseReady = () => Boolean(supabase);

export const PROFILE_COLUMNS = [
  'id', 'role', 'name', 'email', 'company', 'initials', 'avatar_color',
  'age', 'region', 'status', 'months', 'desired_role', 'bio', 'years',
  'education', 'languages', 'salary_expect', 'format', 'phone', 'verified',
];