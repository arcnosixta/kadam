import { createClient } from '@supabase/supabase-js';

// Publishable-ключ и URL публичны по дизайну (данные защищает RLS).
// env VITE_* — приоритетный оверрайд; дефолты гарантируют работу без build-time env.
export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL ?? 'https://rfwbgrzhwrktkubxvcnh.supabase.co').trim() || null;
export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'sb_publishable_WqTi7fggfdHizGdV3sVAOw_90ZzFLc6').trim() || null;

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// true, когда тенант Supabase настроен (URL + publishable key). Без них приложение работает в демо-режиме.
export const supabaseReady = () => Boolean(supabase);

export const supabaseEnv = () => ({ url: Boolean(SUPABASE_URL), anon: Boolean(SUPABASE_ANON_KEY) });

export const PROFILE_COLUMNS = [
  'id', 'role', 'name', 'email', 'company', 'initials', 'avatar_color',
  'age', 'region', 'status', 'months', 'desired_role', 'bio', 'years',
  'education', 'languages', 'salary_expect', 'format', 'phone', 'verified',
];