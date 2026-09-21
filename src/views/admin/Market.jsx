import { useState } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, ArrowDownRight, ArrowUpRight, Building2, Flame, Search } from 'lucide-react';
import { Badge, Card, Tabs } from '../../components/ui';
import { MARKET_STATS } from '../../data/stats';
import { cn } from '../../components/ui';

const COLORS = {
  brand: '#0f766e', violet: '#8b5cf6', mint: '#10b981', amber: '#f59e0b', ink: '#1f2937',
};

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-white p-3 shadow-soft ring-1 ring-ink-200">
      <p className="mb-1 text-xs font-bold text-ink-500">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="text-[13px] font-semibold text-ink-800">
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString('ru-RU') : p.value}
        </p>
      ))}
    </div>
  );
}

export function Market() {
  const [tab, setTab] = useState('demand');
  const trend = MARKET_STATS.trendByMonth;
  const regions = MARKET_STATS.regions;
  const prof = MARKET_STATS.topDemand;

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Рынок труда</h1>
          <p className="mt-1 text-ink-500">Казахстан и Кыргызстан · сентябрь 2026. Официальные данные + ИИ-прогнозы.</p>
        </div>
        <Tabs value={tab} onChange={setTab} items={[
          { value: 'demand', label: 'Дефицит профессий' },
          { value: 'regions', label: 'По регионам' },
          { value: 'trend', label: 'Динамика' },
        ]} />
      </div>

      {tab !== 'trend' && (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-extrabold text-ink-900">{tab === 'demand' ? 'Востребованные профессии' : 'Безработица по регионам'}</h2>
              <Badge tone="brand"><Flame className="h-3.5 w-3.5" /> {tab === 'demand' ? 'открытые вакансии' : '% безработицы'}</Badge>
            </div>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={tab === 'demand' ? 340 : 360}>
                {tab === 'demand' ? (
                  <BarChart data={[...prof].sort((a, b) => b.open - a.open)} layout="vertical" margin={{ left: 4, right: 24, top: 0, bottom: 0 }}>
                    <CartesianGrid horizontal={false} strokeDasharray="4 6" stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="skill" width={150} tick={{ fontSize: 12, fill: '#1f2937', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<TooltipBox />} cursor={{ fill: '#0f766e0d' }} />
                    <Bar dataKey="open" name="Вакансии" radius={[6, 6, 6, 6]} barSize={20} label={{ position: 'right', fontSize: 11, fill: '#475569' }}>
                      {prof.map((p) => (
                        <Cell key={p.skill} fill={p.deficit ? COLORS.violet : '#cbd5e1'} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <BarChart data={[...regions].sort((a, b) => b.rate - a.rate)} margin={{ left: 4, right: 24, top: 0, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#e2e8f0" />
                    <XAxis dataKey="region" interval={0} angle={-32} textAnchor="end" height={56} tick={{ fontSize: 10.5, fill: '#475569' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 7]} />
                    <Tooltip content={<TooltipBox />} cursor={{ fill: '#0f766e0d' }} />
                    <Bar dataKey="rate" name="Безработица, %" radius={[6, 6, 0, 0]} barSize={22}>
                      {regions.map((r) => (
                        <Cell key={r.region} fill={r.rate > 5 ? COLORS.amber : r.rate > 4.2 ? COLORS.violet : COLORS.mint} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-4">
            {tab === 'demand' ? (
              <Card className="p-5">
                <h3 className="font-display flex items-center gap-2 text-sm font-extrabold text-ink-900"><AlertTriangle className="h-4 w-4 text-amber-500" /> Точки напряжения</h3>
                <div className="mt-3 space-y-3">
                  {prof.filter((p) => p.deficit).slice(0, 4).map((p) => {
                    const gap = Math.round((p.open / p.candidates) * 100 - 100);
                    return (
                      <div key={p.skill} className="rounded-xl bg-amber-400/8 p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold text-ink-800">{p.skill}</p>
                          <span className={cn('flex items-center gap-1 text-xs font-bold', gap > 40 ? 'text-amber-600' : 'text-ink-500')}><ArrowUpRight className="h-3.5 w-3.5" />{Math.abs(gap)}%</span>
                        </div>
                        <p className="text-xs text-ink-500">{p.open} вакансий против {p.candidates} кандидатов</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
                          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${Math.min(100, (p.candidates / p.open) * 100)}%` }} />
                        </div>
                        <p className="mt-1.5 text-[11px] text-ink-400">Покрытие спроса: {Math.min(100, Math.round((p.candidates / p.open) * 100))}%</p>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 rounded-xl bg-teal-500/8 p-3 text-[13px] text-teal-700">
                  <Search className="mr-1 inline h-4 w-4" /> Kadam рекомендует гранты на обучение 4 профессиям выше.
                </div>
              </Card>
            ) : (
              <>
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-ink-800">Лидеры спроса</h3>
                  <div className="mt-3 space-y-2.5">
                    {[...regions].sort((a, b) => b.vacancies - a.vacancies).slice(0, 4).map((r) => (
                      <div key={r.region} className="flex items-center justify-between text-[13px]">
                        <span className="flex items-center gap-2 font-semibold text-ink-700"><Building2 className="h-4 w-4 text-brand-500" /> {r.region}</span>
                        <Badge tone={r.demand === 'Высокий' ? 'mint' : 'slate'}>{r.vacancies.toLocaleString('ru-RU')} вакансий</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-ink-800">Сводка по вакансиям</h3>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-ink-50 p-3 text-center">
                      <p className="font-display text-xl font-extrabold text-ink-900">{sum(regions).toLocaleString('ru-RU')}</p>
                      <p className="text-[11px] text-ink-400">всего вакансий</p>
                    </div>
                    <div className="rounded-xl bg-ink-50 p-3 text-center">
                      <p className="font-display text-xl font-extrabold text-violet-600">12</p>
                      <p className="text-[11px] text-ink-400">регионов в выборке</p>
                    </div>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      {tab === 'trend' && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-ink-900">Динамика рынка · январь—сентябрь</h2>
            <Badge tone="mint"><ArrowUpRight className="h-3.5 w-3.5" /> наём растёт 6 мес. подряд</Badge>
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trend} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f766e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipBox />} />
                  <Area type="monotone" dataKey="vacancies" name="Вакансии, тыс." stroke={COLORS.brand} strokeWidth={2.5} fill="url(#gV)" />
                  <Area type="monotone" dataKey="resumes" name="Резюме, тыс." stroke={COLORS.violet} strokeWidth={2.5} fill="url(#gB)" />
                </AreaChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-ink-400">Вакансии vs активные резюме</p>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trend} margin={{ left: -18, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 6" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TooltipBox />} />
                  <Line type="monotone" dataKey="hired" name="Нанято, тыс." stroke={COLORS.mint} strokeWidth={2.5} dot={{ r: 3, fill: COLORS.mint }} />
                  <Line type="monotone" dataKey="unempl" name="Безработица, %" stroke={COLORS.amber} strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <p className="mt-2 text-center text-xs text-ink-400">Наём (тыс.) и безработица (%)</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { l: 'Рост вакансий', v: '+45,8%', d: 'с апреля', good: true },
              { l: 'Нанято за сентябрь', v: '11,2 тыс.', d: 'лучший месяц года', good: true },
              { l: 'Безработица', v: '4,4%', d: '−0,2 п.п. за 6 мес.', good: true },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-ink-50 p-4 text-center">
                <p className="font-display text-xl font-extrabold text-ink-900">{s.v}</p>
                <p className="text-xs font-semibold text-ink-600">{s.l}</p>
                <p className="mt-0.5 flex items-center justify-center gap-1 text-[11px] text-teal-600"><ArrowDownRight className="h-3 w-3" />{s.d}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function sum(regions) {
  return regions.reduce((a, r) => a + r.vacancies, 0);
}