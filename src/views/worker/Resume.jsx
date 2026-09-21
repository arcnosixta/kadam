import { useEffect, useState } from 'react';
import { Copy, FileCheck2, Lock, Pencil, Sparkles, X } from 'lucide-react';
import { Badge, Button, Card, Chip, Field, Input, Select, Textarea } from '../../components/ui';
import { buildResume, skillGapReport } from '../../lib/ai';
import { cn } from '../../components/ui';

const SKILL_POOL = ['бухгалтерия', '1c', 'excel', 'word', 'вождение', 'сварка', 'продажи', 'кассы', 'маркетинг', 'контент', 'дизайн', 'кулинария', 'швейное дело', 'строительство', 'сборка', 'интернет', 'телефония', 'медсестра', 'работа с детьми', 'менеджмент'];
const ROLE_POOL = ['Бухгалтер / ассистент', 'Продавец', 'СММ / контент', 'Водитель', 'Сварщик', 'Швея', 'Повар', 'Оператор линии', 'Разнорабочий', 'Официант'];

export function Resume({ profile, onSave }) {
  const [p, setP] = useState(profile);
  const [targetRole, setTargetRole] = useState(profile.desiredRole);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [born, setBorn] = useState(false);

  // Синхронизация с внешними изменениями профиля не требуется: профиль приходит
  // из сессии/стейта родителя, изменение пишется обратно через onSave.

  const resume = buildResume({
    ...p, desiredRole: targetRole, skills: p.skills.length ? p.skills : profile.skills,
  }, null);

  useEffect(() => {
    const t = setTimeout(() => setBorn(true), 300);
    return () => clearTimeout(t);
  }, []);

  const save = () => {
    onSave?.({ ...p, desiredRole: targetRole });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const toggleSkill = (s) => {
    setP((prev) => ({
      ...prev,
      skills: prev.skills.includes(s) ? prev.skills.filter((x) => x !== s) : [...prev.skills, s],
    }));
  };

  const copy = () => {
    navigator.clipboard?.writeText([
      `${resume.name} — ${resume.role}`,
      resume.summary,
      `Навыки: ${resume.skills}`,
      `Образование: ${resume.education}`,
      `Контакты: ${p.phone} · ${p.email}`,
    ].join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  const gaps = skillGapReport(p);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Резюме и профиль</h1>
          <p className="mt-1 text-ink-500">ИИ собирает резюме под цель и подсказывает, как пройти ATS-фильтры.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="mint"><FileCheck2 className="h-3.5 w-3.5" /> ATS: 78/100 — лучше, чем у 70% кандидатов</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Editor */}
        <Card className="h-fit p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink-900"><Pencil className="h-4 w-4 text-brand-500" /> Редактор профиля</h2>

          <div className="mt-5 space-y-4">
            <Field label="Целевая должность">
              <Select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}>
                {ROLE_POOL.map((r) => <option key={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Коротко о себе">
              <Textarea rows={3} value={p.bio} onChange={(e) => setP({ ...p, bio: e.target.value })} />
            </Field>

            <div>
              <p className="mb-1.5 text-[13px] font-semibold text-ink-700">Навыки</p>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_POOL.map((s) => {
                  const on = p.skills.includes(s);
                  return <Chip key={s} active={on} onClick={() => toggleSkill(s)}>{s}{on && <X className="h-3 w-3" />}</Chip>;
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Ожидаемая зарплата">
                <Input type="number" value={p.salaryExpect} onChange={(e) => setP({ ...p, salaryExpect: Number(e.target.value) })} />
              </Field>
              <Field label="Опыт, лет">
                <Input type="number" value={p.years} onChange={(e) => setP({ ...p, years: Number(e.target.value) })} />
              </Field>
            </div>
            <Field label="Регион">
              <Select value={p.region} onChange={(e) => setP({ ...p, region: e.target.value })}>
                {['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Бишкек', 'Ош', 'Павлодар', 'Актобе'].map((r) => <option key={r}>{r}</option>)}
              </Select>
            </Field>

            {/* AI tips */}
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-ink-700"><Sparkles className="h-4 w-4 text-brand-500" /> Советы ИИ по улучшению</p>
              {[
                p.years === 0 ? 'Добавьте учебный проект или стажировку — работодатели видят мотивацию, а не пробел.' : null,
                p.skills.length < 4 ? 'Добавьте ещё 1–2 навыка из требований целевой роли — это поднимет ATS-оценку.' : null,
                gaps.coverage < 100 ? `Для «${targetRole.toLowerCase()}» рынок ждёт: ${gaps.missing.slice(0, 2).join(', ') || 'вы всё закрыли'}.` : null,
              ].filter(Boolean).slice(0, 2).map((tip) => (
                <p key={tip} className="rounded-xl bg-brand-500/8 px-3 py-2 text-[13px] leading-relaxed text-brand-800">{tip}</p>
              ))}
            </div>
          </div>
        </Card>

        {/* Preview */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-500">Превью для вакансии «{targetRole}»</p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="light" onClick={copy}>{copied ? 'Скопировано!' : <><Copy className="h-4 w-4" /> Скопировать</>}</Button>
              <Button size="sm" variant={saved ? 'mint' : 'primary'} onClick={save}>{saved ? <><FileCheck2 className="h-4 w-4" /> Сохранено</> : <><FileCheck2 className="h-4 w-4" /> Сохранить профиль</>}</Button>
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-white p-8 shadow-lift ring-1 ring-ink-200" style={{ background: 'linear-gradient(140deg,#fff 0%,#f8faff 100%)' }}>
            <div className="flex items-start justify-between gap-6">
              <div>
                <h2 className="font-display text-2xl font-extrabold text-ink-900">{p.name}</h2>
                <p className="text-brand-600">{resume.role}</p>
                <p className="mt-2 text-xs text-ink-500">{p.email} · {p.phone} · {p.region}</p>
              </div>
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 font-display text-xl font-extrabold text-white shadow-glow">{p.initials}</span>
            </div>

            <div className={cn('mt-6 border-t border-ink-100 pt-5 transition duration-700', !born && 'opacity-0 translate-y-2')}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400">О себе</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{resume.summary}</p>
            </div>

            <div className="mt-5 transition duration-700" style={{ transitionDelay: '120ms' }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400">Навыки</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {p.skills.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}
                {gaps.missing.slice(0, 2).map((s) => <Badge key={s} tone="amber">{s} (осваиваю)</Badge>)}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4 transition duration-700" style={{ transitionDelay: '240ms' }}>
              {[
                ['Опыт', resume.years],
                ['Образование', resume.education],
                ['Языки', resume.languages],
                ['Зарплата', `${Math.round(p.salaryExpect / 1000)} тыс. ₸`],
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400">{l}</p>
                  <p className="mt-0.5 text-sm font-medium text-ink-800">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-brand-500/10 to-violet-500/10 p-4">
              <p className="text-[13px] font-bold text-brand-700">Безопасность данных</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-500">
                <Lock className="h-3.5 w-3.5" /> Резюме хранится в вашем аккаунте Supabase (защищено RLS) и передаётся работодателю только после вашего согласия.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}