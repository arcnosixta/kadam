import { supabase, supabaseReady, PROFILE_COLUMNS } from './supabase';

// ---------- Профиль: строка БД <-> объект приложения ----------
export function profileFromRow(r) {
  return r ? {
    id: r.id, role: r.role, name: r.name, email: r.email, company: r.company,
    initials: r.initials ?? initialsOf(r.name), avatarColor: r.avatar_color,
    age: r.age, region: r.region, status: r.status, months: r.months,
    desiredRole: r.desired_role, bio: r.bio, years: r.years,
    education: r.education, languages: r.languages ?? [], salaryExpect: r.salary_expect,
    format: r.format, phone: r.phone, verified: r.verified,
  } : null;
}

export const rowFromProfile = (p) => ({
  id: p.id, role: p.role, name: p.name, email: p.email, company: p.company ?? null,
  initials: p.initials, avatar_color: p.avatarColor ?? '#6366f1',
  age: p.age, region: p.region, status: p.status, months: p.months,
  desired_role: p.desiredRole, bio: p.bio, years: p.years,
  education: p.education, languages: p.languages, salary_expect: p.salaryExpect,
  format: p.format, phone: p.phone, verified: p.verified,
});

function initialsOf(name) {
  const parts = String(name ?? '').trim().split(/\s+/).filter(Boolean);
  const first = (parts[0]?.[0] ?? 'И').toUpperCase();
  const second = (parts[1]?.[0] ?? parts[0]?.[1] ?? '').toUpperCase();
  return first + second;
}

// ---------- Сессия ----------
const ROLE_LABELS = { worker: 'работник', employer: 'работодатель', admin: 'администратор' };

export async function fetchProfile(uid) {
  if (!supabaseReady() || !uid) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS.join(','))
    .eq('id', uid)
    .maybeSingle();
  if (error) return null;
  return profileFromRow(data);
}

// Собирает объект сессии приложения из объекта сессии Supabase.
async function buildSession(sbSession) {
  if (!sbSession) return null;
  const profile = await fetchProfile(sbSession.user.id);
  if (!profile) return null;
  return {
    id: sbSession.user.id,
    email: sbSession.user.email,
    role: profile.role,
    name: profile.role === 'employer' ? (profile.company ?? profile.name) : profile.name,
    profile,
    authed: true,
  };
}

export const auth = {
  isReady: () => supabaseReady(),

  async getSession() {
    if (!supabaseReady()) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return buildSession(data.session);
  },

  onAuthChange(cb) {
    if (!supabaseReady()) return () => {};
    return supabase.auth.onAuthStateChange(async (_event, sbSession) => {
      cb(await buildSession(sbSession));
    }).data.subscription.unsubscribe;
  },

  // Вход/регистрация. Возвращает { session, needConfirmation } или бросает Error(сообщение).
  async signIn(email, password) {
    if (!supabaseReady()) throw new Error('Supabase не настроен');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(userFriendly(error));
    return { session: await buildSession(data.session) };
  },

  async signInMagic(email) {
    if (!supabaseReady()) throw new Error('Supabase не настроен');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(userFriendly(error));
    return { needConfirmation: true };
  },

  async signUp(email, password, { role, name }) {
    if (!supabaseReady()) throw new Error('Supabase не настроен');
    if (!ROLE_LABELS[role]) throw new Error(`Неизвестная роль: ${role}`);
    const emails = String(email).trim().toLowerCase();
    const fullName = String(name ?? '').trim() ||
      (role === 'employer' ? 'Компания' : `Кандидат ${initialsOf(email)}`);
    const { data, error } = await supabase.auth.signUp({
      email: emails,
      password,
      options: {
        data: { role, name: fullName },
        // имя компании для работодателя хранится в profiles.company отдельно
      },
    });
    if (error) throw new Error(userFriendly(error));

    // Если подтверждение e-mail включено — сессии ещё нет, возвращаем флаг.
    if (!data.session) return { needConfirmation: true };
    return { session: await buildSession(data.session) };
  },

  async signOut() {
    if (!supabaseReady()) return;
    await supabase.auth.signOut();
  },
};

// Роль, выбранная при регистрации — источник правды в profiles.role (см. триггер).
export const roleLabel = (role) => ROLE_LABELS[role] ?? role;

function userFriendly(error) {
  const m = String(error?.message ?? error);
  if (m.includes('Invalid login credentials')) return 'Неверный e-mail или пароль';
  if (m.includes('Email not confirmed')) return 'Сначала подтвердите e-mail (ссылка в письме)';
  if (m.includes('already registered')) return 'Аккаунт уже существует — войдите';
  if (m.includes('password')) return 'Пароль должен быть не короче 6 символов';
  if (m.includes('rate limit')) return 'Слишком много попыток. Подождите минуту';
  return m;
}