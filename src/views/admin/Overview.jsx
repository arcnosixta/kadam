import { useMemo } from 'react';
import {
  ArrowRight, Banknote, BriefcaseBusiness, CheckCircle2, Clock3, Sparkles, Target, UserCheck, Users,
} from 'lucide-react';
import { Badge, Button, Card, Progress, Stat } from '../../components/ui';
import { MARKET_STATS, ACTIVE_MEASURES } from '../../data/stats';
import { cn } from '../../components/ui';

export function Overview({ onNav, notify }) {
  const kz = MARKET_STATS.countries.KZ;
  const trend = MARKET_STATS.trendByMonth.at(-1);

  const goals = [
    { label: 'Официальный найм в 2026', value: 34, target: 60, tone: 'from-brand-500 to-violet-500' },
    { label: 'Охват ИИ-платформой', value: 41, target: 100, tone: 'from-mint-400 to-teal-500' },
    { label: 'Прошли обучение', value: 19, target: 40, tone: 'from-amber-400 to-orange-500' },
    { label: 'Снижение безработицы', value: 46, target: 100, tone: 'from-sky-500 to-brand-500' },
  ];

  const alerts = useMemo(() => [
    { tone: 2, icon: Banknote, text: 'Дефицит швей в Туркестанской обл.: 1260 мест, кандидатов — 340. Запустить грант на профобучение?', cta: 'Создать программу' },
    { tone: 1, icon: Users, text: 'В Алматы кандидатов бухгалтеров 1420 при 890 вакансиях — переобучение на востребованные смежные роли.', cta: 'Предложить переобучение' },
    { tone: 1, icon: Clock3, text: '7 вакансий ждут модерации более 2 дней — кандидаты уходят к конкурентам.', cta: 'К модерации' },
  ], []);

  const flash = (a) => {
    notify('Действие принято: ' + a.text.split(':')[0]);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Панель занятости</h1>
          <p className="mt-1 text-ink-500">Сводка по {kz.name} и Кыргызстану за сентябрь, {new Date().toLocaleDateString('ru-RU')}.</p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-white p-2 pr-4 shadow-soft ring-1 ring-ink-200">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-400/15 text-mint-600"><Sparkles className="h-4 w-4" /></span>
          <div>
            <p className="text-xs font-bold text-ink-800">ИИ-совет дня</p>
            <p className="text-[11px] text-ink-400">Фокус недели — дефицит рабочих рук</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Users} tone="brand" label="Уровень безработицы" value={`${kz.unemplRate}%`} sub={`${kz.unemployed} тыс. человек в ${kz.name}`} delta={{ dir: 'down', text: '−0,2 п.п. к августу' }} />
        <Stat icon={BriefcaseBusiness} tone="mint" label="Открытых вакансий" value={fmtK(kz.vacancies)} sub={`${trend.hired} тыс. нанято за месяц`} delta={{ dir: 'up', text: '+6,3% месяц к месяцу' }} />
        <Stat icon={Target} tone="amber" label="Платформа Kadam" value={`${41}%`} sub="Цифровизация служб занятости" delta={{ dir: 'up', text: '+9 п.п. за квартал' }} />
        <Stat icon={CheckCircle2} tone="violet" label="Трудоустроено через ИИ" value="8 214" sub="За текущий месяц" delta={{ dir: 'up', text: '+17%' }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* goals */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-ink-900">Цели национального проекта</h2>
            <Badge tone="brand">2026 · итого 18,4 тыс. трудоустроено</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {goals.map((g) => (
              <div key={g.label}>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-ink-700">{g.label}</p>
                  <p className="text-xs font-bold text-ink-500">{Math.min(100, g.value)}%</p>
                </div>
                <Progress value={(g.value / g.target) * 100} barClass={g.tone} />
              </div>
            ))}
          </div>
        </Card>

        {/* alerts */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Что требует внимания (ИИ)</h2>
          <div className="mt-4 space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={cn('rounded-2xl p-4', a.tone === 2 ? 'bg-amber-400/8 ring-1 ring-amber-500/30' : 'bg-violet-500/6 ring-1 ring-violet-500/20')}>
                <div className="flex items-start gap-3">
                  <a.icon className={cn('mt-0.5 h-5 w-5 shrink-0', a.tone === 2 ? 'text-amber-600' : 'text-violet-600')} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-relaxed text-ink-700">{a.text}</p>
                    <Button size="sm" variant={a.tone === 2 ? 'light' : 'ghost'} className="mt-2 !px-2 !py-1 !text-xs" onClick={() => flash(a)}>
                      {a.cta} <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* active measures strip */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Активные государственные меры</h2>
          <Button size="sm" variant="ghost" onClick={() => onNav('programs')}>Все меры <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVE_MEASURES.slice(0, 3).map((m) => (
            <div key={m.id} className="rounded-2xl border border-ink-100 p-4 hover:bg-ink-50">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-teal-500/12 text-teal-600"><UserCheck className="h-4 w-4" /></span>
                <p className="text-sm font-bold text-ink-800">{m.name}</p>
              </div>
              <p className="mt-2 line-clamp-2 text-[13px] text-ink-500">{m.desc}</p>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-ink-600">{m.participants.toLocaleString('ru-RU')} участ. · {m.budget}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function fmtK(v) { return v >= 1000 ? `${(Math.round(v) / 1000).toFixed(1).replace('.', ',')} тыс.` : v; }