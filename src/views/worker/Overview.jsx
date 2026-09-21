import {
  ArrowRight, CalendarCheck, ChevronRight, CircleCheckBig, Flame, GraduationCap,
  MessageSquareText, Sparkles, Trophy, FileText,
} from 'lucide-react';
import { Badge, Button, Card, Progress, ProgressRing, Avatar } from '../../components/ui';
import { rankedMatches, skillGapReport, fmt } from '../../lib/ai';
import { PROGRAMS } from '../../data/stats';
import { JOBS } from '../../data/jobs';
import { FitBadge } from './parts';

const STEPS = [
  { done: true, label: 'Профиль и резюме созданы' },
  { done: true, label: 'Отклик на 3 вакансии' },
  { done: false, label: 'Тренировка собеседования' },
  { done: false, label: 'Собеседование с работодателем' },
];

export function Overview({ profile, apps, chat, jobs = JOBS, onChangeView, onOpenJob }) {
  const top = rankedMatches(profile, jobs).slice(0, 3);
  const gaps = skillGapReport(profile);
  const appsCount = Object.values(apps).length;
  const interviews = Object.values(apps).filter((a) => a.stage === 'interview').length;

  const readyScore = 100 - (appsCount === 0 ? 40 : 0);
  const aiStageNote = chat.length > 1 ? 'ИИ помнит ваши цели и с каждым откликом точнее' : 'Скажите ИИ, что ищете — и он запомнит';

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      {/* Greeting + mission */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            Добрый день, {profile.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-ink-500">Хороший день, чтобы сделать шаг к работе. Ваш ИИ уже всё разложил по полочкам.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="brand"><Flame className="h-3.5 w-3.5" /> Миссия дня</Badge>
          <Badge tone="mint">Статус: в поиске ({fmtMoney(profile.months)})</Badge>
        </div>
      </div>

      {/* Next step banner */}
      <Card className="overflow-hidden p-0">
        <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
          <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-7 text-white">
            <div className="bg-grid absolute inset-0 opacity-15" />
            <p className="relative text-xs font-bold uppercase tracking-widest text-brand-200">Следующий шаг к офферу</p>
            <h2 className="relative mt-2 max-w-md font-display text-2xl font-extrabold leading-snug">
              {appsCount === 0
                ? 'Откликнитесь на первый по силе кандидат — шанс на интервью 62%'
                : interviews >= 1
                  ? 'Вы идёте отлично! Подготовьтесь к собеседованию с ИИ-тренером'
                  : 'Продолжайте: ещё 2 отклика — и трекер выведет вас на interviews'}
            </h2>
            <div className="relative mt-5 flex flex-wrap gap-3">
              <Button variant="mint" size="sm" onClick={() => onChangeView('matches')}>
                {appsCount === 0 ? 'Смотреть подборки ИИ' : 'К рекомендациям'} <ArrowRight className="h-4 w-4" />
              </Button>
              {interviews >= 1 && (
                <Button variant="light" size="sm" onClick={() => onChangeView('interview')}>
                  <MessageSquareText className="h-4 w-4" /> Тренироваться
                </Button>
              )}
            </div>
            {/* floating badge */}
            <div className="glass-dark relative mt-5 inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm">
              <Sparkles className="h-4 w-4 text-brand-200" />
              <span>{aiStageNote}</span>
            </div>
          </div>
          <div className="grid place-items-center bg-white p-6">
            <div className="text-center">
              <ProgressRing value={readyScore > 100 ? 96 : readyScore} label={readyScore + '%'} sub="готовность профиля" color="#10b981" size={120} />
              <p className="mt-3 max-w-[220px] text-center text-xs leading-relaxed text-ink-500">
                ИИ оценивает полноту профиля, резюме и число откликов
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-brand-600" onClick={() => onChangeView('resume')}>
                Улучшить профиль <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Row: steps + stats */}
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-700">Маршрут к работе</p>
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div className="mt-4 space-y-3.5">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${s.done ? 'bg-mint-400/20 text-mint-600' : 'bg-ink-100 text-ink-400'}`}>
                  {s.done ? '✓' : i + 1}
                </span>
                <p className={`text-sm ${s.done ? 'text-ink-400 line-through' : 'font-semibold text-ink-700'}`}>{s.label}</p>
              </div>
            ))}
          </div>
          <Progress value={50} className="mt-4" />
          <p className="mt-1.5 text-xs text-ink-400">Прогресс: 2 из 4 шагов</p>
        </Card>

        {[
          { label: 'Активные отклики', value: appsCount, icon: CalendarCheck, sub: 'отслеживает ИИ', tone: 'text-brand-600 bg-brand-500/12' },
          { label: 'Собеседований назначено', value: interviews, icon: GraduationCap, sub: 'анализ вопросов готов', tone: 'text-violet-600 bg-violet-500/12' },
          { label: 'Бесплатных курсов рядом', value: gaps.programs.length + 3, icon: FileText, sub: 'под вашу цель', tone: 'text-mint-600 bg-mint-400/15' },
        ].map((s) => (
          <Card key={s.label} hover className="p-5">
            <span className={`grid h-11 w-11 place-items-center rounded-2xl ${s.tone}`}><s.icon className="h-6 w-6" /></span>
            <p className="font-display mt-3 text-3xl font-extrabold text-ink-900">{s.value}</p>
            <p className="text-sm font-semibold text-ink-700">{s.label}</p>
            <p className="mt-0.5 text-xs text-ink-400">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Top matches */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Рекомендации ИИ — лучшие для вас</h2>
          <Button size="sm" variant="ghost" onClick={() => onChangeView('matches')}>Все <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {top.map((j) => (
            <Card key={j.id} hover className="p-5" >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display text-[15px] font-bold text-ink-900">{j.title}</p>
                  <p className="truncate text-xs text-ink-500">{j.company} · {j.region}</p>
                </div>
                <FitBadge score={j.match.score} />
              </div>
              <div className="mt-3"><Progress value={j.match.score} size="sm" /></div>
              <p className="mt-2 line-clamp-1 text-xs text-ink-500">{j.match.reasons[0]}</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <Badge tone="brand">{fmt.money(j.salaryFrom, j.currency)}–{fmt.money(j.salaryTo, j.currency)}</Badge>
                <Badge tone="slate">{j.format === 'remote' ? 'Удалённо' : j.format === 'hybrid' ? 'Гибрид' : 'Офис'}</Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant={j.match.score >= 72 ? 'primary' : 'light'} className="flex-1" onClick={() => onOpenJob(j)}>Откликнуться</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning + gaps */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand-500" />
            <h3 className="font-display font-bold text-ink-900">Закройте пробелы навыков</h3>
          </div>
          <div className="mt-3 rounded-2xl bg-brand-500/8 p-4 text-sm leading-relaxed text-ink-700">
            {gaps.summary}
          </div>
          <div className="mt-4 space-y-3">
            {gaps.programs.slice(0, 2).map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-800">{p.title}</p>
                  <p className="text-xs text-ink-400">{p.duration} · {p.format}</p>
                </div>
                <Badge tone={p.price === 0 ? 'mint' : 'slate'}>{p.price === 0 ? 'Бесплатно' : 'Платно'}</Badge>
              </div>
            ))}
          </div>
          <Button size="sm" variant="light" className="mt-3 w-full" onClick={() => onChangeView('assistant')}>
            Подобрать обучение под меня <CircleCheckBig className="h-4 w-4 text-mint-500" />
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Avatar name="Aila" initials="АИ" color="#8b5cf6" size="sm" />
            <div>
              <h3 className="font-display font-bold text-ink-900">Айла знает ваш след</h3>
              <p className="text-xs text-ink-400">ИИ-ассистент</p>
            </div>
          </div>
          <div className="relative mt-4 rounded-2xl bg-brand-500/8 p-4">
            <p className="text-sm leading-relaxed text-ink-700">
              «Я вижу сильную связку навыков для {profile.desiredRole}. Пока вы изучаете курс, я мониторю новые вакансии и подгоню резюме под каждую.»
            </p>
          </div>
          <div className="mt-4 space-y-2 text-sm">
            {PROGRAMS.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2.5">
                <span className="line-clamp-1 font-medium text-ink-700">{p.title}</span>
                <span className="shrink-0 font-bold text-brand-600">{p.rating} ★</span>
              </div>
            ))}
          </div>
          <Button size="sm" variant="light" className="mt-3 w-full" onClick={() => onChangeView('assistant')}>
            <MessageSquareText className="h-4 w-4" /> Спросить Айлу об обучении
          </Button>
        </Card>
      </div>
    </div>
  );
}

function fmtMoney(months) {
  const v = months ?? 1.5;
  if (v < 1) return 'меньше месяца';
  if (v < 2) return `${Math.round(v * 10) / 10} месяц`;
  if (v < 5) return `${Math.round(v)} месяца`;
  return `${Math.round(v)} месяцев`;
}