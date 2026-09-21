import { useMemo, useState } from 'react';
import {
  ArrowRight, Eye, Lightbulb, Sparkles, TrendingDown, TrendingUp, UserCheck, UserSearch, Wallet,
} from 'lucide-react';
import { Badge, Button, Card, Stat, Tabs } from '../../components/ui';
import { screenCandidate } from '../../lib/ai';
import { WORKERS } from '../../data/jobs';
import { FitBadge } from '../worker/parts';
import { cn } from '../../components/ui';

export function Dashboard({ jobs, onOpenJob, onNav }) {
  const [stage, setStage] = useState('week');
  const scored = useMemo(
    () => (jobs[0] ? WORKERS.map((w) => ({ w, s: screenCandidate(w, jobs[0]).score })).sort((a, b) => b.s - a.s) : []),
    [jobs]
  );

  const avgHireDays = 18;
  const costView = Math.round(jobs[0]?.views ?? 1200);
  const applied = jobs.reduce((a, j) => a + (j.applications ?? 0), 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Обзор найма</h1>
          <p className="mt-1 text-ink-500">ИИ уже отобрал {top3(scored)} кандидатов с вероятностью успеха выше 70%.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs
            value={stage} onChange={setStage}
            items={[{ value: 'week', label: 'Неделя' }, { value: 'month', label: 'Месяц' }, { value: 'quarter', label: 'Квартал' }]}
          />
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          icon={UserSearch} tone="brand" label="Кандидатов на вакансиях" value={applied + 24}
          delta={{ dir: 'up', text: '+18% к прошлому периоду' }}
        />
        <Stat icon={Eye} tone="violet" label="Просмотров вакансий" value={formatK(costView)} delta={{ dir: 'up', text: '+9%' }} />
        <Stat icon={UserCheck} tone="mint" label="Собеседований назначено" value={5} delta={{ dir: 'up', text: 'ИИ-скрининг включён' }} />
        <Stat icon={Wallet} tone="amber" label="Средняя цена найма" value={`${avgHireDays} дн.`} delta={{ dir: 'down', text: 'быстрее на 7 дней' }} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-extrabold text-ink-900">Воронка найма</h2>
              <p className="text-sm text-ink-500">Активная вакансия: <b>{jobs[0]?.title}</b></p>
            </div>
            <Badge tone="mint"><Sparkles className="h-3.5 w-3.5" /> Автоматический скрининг</Badge>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { l: 'Отклики', v: applied, c: 'from-brand-500 to-violet-500' },
              { l: 'Прошли фильтр', v: Math.round(applied * 0.42), c: 'from-violet-500 to-fuchsia-500' },
              { l: 'Собеседования', v: Math.round(applied * 0.18), c: 'from-mint-400 to-teal-500' },
              { l: 'Оффер', v: Math.max(1, Math.round(applied * 0.07)), c: 'from-amber-400 to-orange-500' },
            ].map((s, i, arr) => (
              <div key={s.l}>
                <div className="relative h-36 overflow-hidden rounded-2xl bg-ink-50">
                  <div className={cn('absolute bottom-0 left-0 right-0 rounded-t-2xl bg-gradient-to-t', s.c)} style={{ height: `${(s.v / Math.max(arr[0].v, 1)) * 100}%`, opacity: 0.85 }} />
                  <span className="absolute left-3 top-3 font-display text-2xl font-extrabold text-ink-900">{s.v}</span>
                  {i < arr.length - 1 && <ArrowRight className="absolute right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" />}
                </div>
                <p className="mt-2 text-center text-[13px] font-semibold text-ink-600">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-xl bg-brand-500/8 px-3.5 py-2.5 text-[13px] leading-relaxed text-brand-800">
            <Lightbulb className="mr-1 inline h-4 w-4" />
            ИИ-скрининг отсеивает 58% откликов по формальным признакам и поднимает долю собеседований с 12% до 26%.
          </p>
        </Card>

        {/* AI shortlist preview */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-ink-900">Топ кандидаты</h2>
            <Button size="sm" variant="ghost" onClick={() => onNav('candidates')}>Все <ArrowRight className="h-4 w-4" /></Button>
          </div>
          <div className="mt-4 space-y-3">
            {scored.slice(0, 4).map(({ w, s }) => (
              <div key={w.id} className="flex items-center gap-3 rounded-2xl border border-ink-100 p-3 hover:bg-ink-50">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-display text-sm font-extrabold text-white" style={{ background: w.color }}>
                  {w.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-800">{w.name}</p>
                  <p className="truncate text-xs text-ink-500">{w.desiredRole} · {w.years} г. опыта</p>
                </div>
                <FitBadge score={s} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* jobs table */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink-900">Активные вакансии</h2>
          <Button size="sm" onClick={() => onNav('post')}><PlusIcon /> Разместить</Button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-400">
                <th className="py-2.5 font-semibold">Вакансия</th>
                <th className="py-2.5 font-semibold">Отклики</th>
                <th className="py-2.5 font-semibold">ИИ-оценка пула</th>
                <th className="py-2.5 font-semibold">Статус</th>
                <th className="py-2.5" />
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => {
                const hi = Math.max(...WORKERS.map((w) => screenCandidate(w, j).score), 1);
                return (
                  <tr key={j.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                    <td className="py-3">
                      <p className="font-bold text-ink-800">{j.title}</p>
                      <p className="text-xs text-ink-400">{j.region} · {j.format}</p>
                    </td>
                    <td className="py-3 font-semibold text-ink-700">{j.applications ?? 12}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-ink-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-mint-400 to-brand-500" style={{ width: `${hi}%` }} />
                        </div>
                        <span className="text-xs font-bold text-ink-600">{hi}%</span>
                      </div>
                    </td>
                    <td className="py-3"><Badge tone="mint">Идёт найм</Badge></td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="light" onClick={() => onOpenJob(j)}>Открыть <ArrowRight className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* insights */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="flex items-start gap-3 p-5">
          <TrendingUp className="mt-0.5 h-5 w-5 text-mint-500" />
          <div>
            <p className="text-sm font-bold text-ink-800">Спрос на вашу сферу растёт</p>
            <p className="mt-1 text-sm text-ink-500">За месяц число откликов на похожие роли выросло на 12%. Рекомендуем ускорить отклики — лучшие кандидаты остывают за 3 дня.</p>
          </div>
        </Card>
        <Card className="flex items-start gap-3 p-5">
          <TrendingDown className="mt-0.5 h-5 w-5 text-amber-500" />
          <div>
            <p className="text-sm font-bold text-ink-800">Чего не хватает кандидатам</p>
            <p className="mt-1 text-sm text-ink-500">34% кандидатов не указывают ключевые навыки {jobs[0]?.skills.slice(0, 2).join(' и ')}. Уточните требования в письме-приглашении.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function PlusIcon() {
  return <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>;
}
function formatK(v) { return v >= 1000 ? `${(v / 1000).toFixed(1)} тыс.` : v; }
function top3(arr) { return arr.filter((x) => x.s >= 70).length; }