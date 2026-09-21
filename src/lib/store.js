import { supabase, supabaseReady } from './supabase';
import { JOBS, WORKERS } from '../data/jobs';
import { fetchProfile, profileFromRow, rowFromProfile } from './auth';

// Слой данных: при настроенном Supabase читает/пишет в БД, иначе откатывается на демо-данные.
// Вся работа «по-настоящему» идёт под авторизованным пользователем (RLS).

const APP_COUNT = `(select count(*)::int from applications a where a.job_id = jobs.id)`;

function jobFromRow(r, appsCount = 0) {
  return {
    id: r.id, title: r.title, company: r.company, region: r.region, format: r.format,
    salaryFrom: r.salary_from, salaryTo: r.salary_to, currency: r.currency ?? 'KZT',
    type: r.type, industry: r.industry, level: r.level,
    skills: r.skills ?? [], tags: r.tags ?? [], demands: r.demands ?? [],
    description: r.description, status: r.status, views: r.views ?? 0,
    verified: r.verified ?? false, applications: appsCount,
  };
}

export function jobToRow(job, employerId) {
  return {
    employer_id: employerId,
    title: job.title, company: job.company, region: job.region, format: job.format,
    salary_from: job.salaryFrom, salary_to: job.salaryTo, currency: job.currency ?? 'KZT',
    type: job.type, industry: job.industry, level: job.level,
    skills: job.skills ?? [], tags: job.tags ?? [],
    description: job.description ?? '', status: job.status ?? 'active',
    verified: job.verified ?? true,
  };
}

const workerFromRow = (r) => ({
  id: r.id, name: r.name, initials: r.initials, age: r.age, region: r.region,
  status: r.status, months: r.months, desiredRole: r.desired_role, bio: r.bio,
  skills: r.skills ?? [], years: r.years,
  education: r.education, languages: r.languages ?? [],
  salaryExpect: r.salary_expect, format: r.format, color: r.avatar_color,
  applied: r.applied ?? 0, interview: r.interview ?? 0, currency: r.currency ?? 'KZT',
});

// ---------- Вакансии ----------
export const store = {
  ready: () => supabaseReady(),

  // Все активные вакансии рынка (для соискателя и модерации).
  async listJobs() {
    if (!supabaseReady()) return JOBS;
    const { data, error } = await supabase
      .from('jobs')
      .select(`*, applications:${APP_COUNT}`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []).map((r) => jobFromRow(r, r.applications ?? 0));
  },

  // Вакансии конкретного работодателя.
  async listEmployerJobs(employerId) {
    if (!supabaseReady() || !employerId) return JOBS.filter((j) => [2, 8, 14].includes(j.id));
    const { data, error } = await supabase
      .from('jobs')
      .select(`*, applications:${APP_COUNT}`)
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []).map((r) => jobFromRow(r, r.applications ?? 0));
  },

  async getJob(id) {
    if (!supabaseReady()) return JOBS.find((j) => j.id === id) ?? null;
    const { data, error } = await supabase
      .from('jobs')
      .select(`*, applications:${APP_COUNT}`)
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return jobFromRow(data, data.applications ?? 0);
  },

  // Публикация вакансии работодателем.
  async postJob(job, employerId, employerName) {
    const company = employerName || job.company || 'Компания';
    const row = jobToRow({ ...job, company }, employerId);
    if (!supabaseReady() || !employerId) {
      return { ...job, company, id: 99 + Math.floor(Math.random() * 900) };
    }
    const { data, error } = await supabase.from('jobs').insert(row).select().single();
    if (error || !data) throw new Error(error?.message ?? 'Не удалось опубликовать');
    return jobFromRow(data, 0);
  },

  async setJobStatus(id, status, uid) {
    if (!supabaseReady() || !uid) return;
    await supabase.from('jobs').update({ status }).eq('id', id).eq('employer_id', uid);
  },

  // Резюме кандидатов (профили с ролью worker).
  async listWorkers() {
    if (!supabaseReady()) return WORKERS;
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, initials, avatar_color, age, region, status, months, desired_role, bio, skills, years, education, languages, salary_expect, format, applied, interview, currency')
      .eq('role', 'worker')
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []).map(workerFromRow);
  },

  // Отклики соискателя: { [jobId]: { stage, at } }
  async listApplications(workerId) {
    const out = {};
    if (!supabaseReady() || !workerId) return out;
    const { data, error } = await supabase
      .from('applications')
      .select('job_id, stage, created_at')
      .eq('worker_id', workerId);
    if (error) return out;
    for (const r of data ?? []) {
      out[r.job_id] = {
        stage: r.stage,
        at: r.created_at ? new Date(r.created_at).toLocaleDateString('ru-RU') : '-',
      };
    }
    return out;
  },

  // Отклик/смена статуса (saved → applied → interview → offer).
  async setApplication(jobId, stage, workerId) {
    if (!supabaseReady() || !workerId) return;
    const { error } = await supabase
      .from('applications')
      .upsert(
        { job_id: jobId, worker_id: workerId, stage },
        { onConflict: 'job_id,worker_id', ignoreDuplicates: false }
      );
    if (error) return { error: error.message };
    return null;
  },

  async getProfile(uid) {
    return fetchProfile(uid);
  },

  // Сохранение профиля (резюме соискателя, данные компании).
  async updateProfile(profile) {
    if (!supabaseReady() || !profile?.id) return false;
    const { error } = await supabase
      .from('profiles')
      .upsert(rowFromProfile(profile), { onConflict: 'id' });
    return !error;
  },
};

// Утилита для EmployerApp: профиль работодателя (компания).
export function employerFromProfile(p) {
  return p ? {
    id: p.id, name: p.company ?? p.name, initials: p.initials, color: p.avatarColor ?? '#8b5cf6',
    industry: p.bio ?? 'Услуги', region: p.region, employees: 0, verified: p.verified ?? true,
  } : null;
}

export { profileFromRow };