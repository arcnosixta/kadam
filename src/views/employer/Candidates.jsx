import { useMemo, useState } from 'react';
import {
  Award, CalendarCheck, Check, MessageSquareText, Phone, Sparkles, Star, ThumbsDown, X,
} from 'lucide-react';
import { Avatar, Badge, Button, Card, Modal, Progress, Tabs } from '../../components/ui';
import { screenCandidate } from '../../lib/ai';
import { FitBadge } from '../worker/parts';
import { cn } from '../../components/ui';

export function Candidates({ job, jobs, workers, notify }) {
  const [jobSel, setJobSel] = useState(job?.id ?? jobs[0]?.id);
  const active = jobs.find((j) => j.id === jobSel) ?? job;
  const [detail, setDetail] = useState(null);
  const [decide, setDecide] = useState({});

  const ranked = useMemo(() => {
    return workers
      .map((w) => ({ w, s: screenCandidate(w, active) }))
      .sort((a, b) => b.s.score - a.s.score);
  }, [workers, active]);

  const [filter, setFilter] = useState('all');

  const visible = ranked.filter(({ w }) => {
    const d = decide[w.id];
    if (filter === 'yes' && d !== 'yes') return false;
    if (filter === 'no' && d !== 'no') return false;
    return true;
  });

  const act = (wId, kind, label) => {
    setDecide((d) => ({ ...d, [wId]: kind }));
    if (kind === 'yes') notify(`Приглашение отправлено ${workers.find((w) => w.id === wId).name} — она/он видит слоты завтра`);
    else if (kind !== 'pass') notify(label);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Кандидаты и ИИ-отбор</h1>
          <p className="mt-1 text-ink-500">Автоматически ранжированы под вакансию с объяснением решений.</p>
        </div>
        <Tabs
          value={filter} onChange={setFilter}
          items={[
            { value: 'all', label: `Все · ${ranked.length}` },
            { value: 'yes', label: `К собеседованию · ${Object.values(decide).filter((v) => v === 'yes').length}` },
            { value: 'no', label: 'Отклонены' },
          ]}
        />
      </div>

      {/* job selector */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {jobs.map((j) => (
          <button
            key={j.id}
            onClick={() => setJobSel(j.id)}
            className={cn(
              'inline-flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition',
              active.id === j.id ? 'border-brand-400 bg-brand-500/10 text-brand-700 shadow-soft' : 'border-ink-200 bg-white text-ink-500 hover:text-ink-800'
            )}
          >
            <Sparkles className="h-4 w-4" /> {j.title}
          </button>
        ))}
      </div>

      {/* candidates */}
      <div className="space-y-4">
        {visible.map(({ w, s }, idx) => {
          const decision = decide[w.id];
          return (
            <Card key={w.id} className={cn('p-5 transition', idx === 0 && 'ring-2 ring-brand-500/50')} hover>
              <div className="flex flex-wrap items-start gap-4">
                <div className="relative">
                  <Avatar name={w.name} initials={w.initials} color={w.color} size="lg" />
                  {idx === 0 && (
                    <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white">
                      <Star className="h-3 w-3" fill="currentColor" />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-extrabold text-ink-900">{w.name}</h2>
                    <FitBadge score={s.score} />
                    {s.score >= 80 && <Badge tone="mint"><Award className="h-3 w-3" /> Рекомендуется к собеседованию</Badge>}
                  </div>
                  <p className="text-sm text-ink-500">{w.desiredRole} · {w.age} лет · {w.region} · опыт {w.years} г.</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">{w.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.skills.map((sk) => <Badge key={sk} tone={s.hit.includes(sk) ? 'mint' : 'slate'}>{sk}{s.hit.includes(sk) && ' ✓'}</Badge>)}
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-2xl bg-ink-50 p-3 text-[13px] text-ink-600">
                      <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-brand-500" />
                      {s.summary}
                    </div>
                    {s.questions[0] && (
                      <div className="rounded-2xl bg-violet-500/8 p-3 text-[13px] text-ink-700">
                        <MessageSquareText className="mr-1.5 inline h-3.5 w-3.5 text-violet-500" />
                        Вопрос для интервью: {s.questions[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-col sm:items-end">
                  <Button
                    size="sm" variant={decision === 'yes' ? 'mint' : 'primary'}
                    onClick={() => act(w.id, 'yes', null)}
                    disabled={decision === 'yes'}
                  >
                    <CalendarCheck className="h-4 w-4" /> {decision === 'yes' ? 'Приглашён(а)' : 'К собеседованию'}
                  </Button>
                  {decision !== 'yes' && (
                    <Button size="sm" variant="light" onClick={() => act(w.id, 'no', null)}>
                      <ThumbsDown className="h-4 w-4 text-rose-400" /> Пропустить
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => setDetail(w)}>Досье ИИ</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {detail && <DetailModal w={detail} s={screenCandidate(detail, active)} onClose={() => setDetail(null)} onInvite={() => { act(detail.id, 'yes', null); setDetail(null); }} />}
    </div>
  );
}

function DetailModal({ w, s, onClose, onInvite }) {
  return (
    <Modal open onClose={onClose} wide>
      <div className="max-h-[86vh] overflow-y-auto nice-scroll">
        <div className="flex items-start gap-4 border-b border-ink-100 p-6">
          <Avatar name={w.name} initials={w.initials} color={w.color} size="xl" />
          <div className="min-w-0 flex-1 pr-8">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-xl font-extrabold text-ink-900">{w.name}, {w.age}</h2>
              <FitBadge score={s.score} />
            </div>
            <p className="text-sm text-ink-500">{w.desiredRole} · {w.region}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone="slate"><Phone className="h-3 w-3" /> +7 (7**) ***-**-34</Badge>
              <Badge tone="slate">Ожидания {w.salaryExpect} ₸</Badge>
              <Badge tone={w.status === 'unemployed' ? 'amber' : 'mint'}>{w.status === 'unemployed' ? `Ищет ${w.months} мес.` : 'Работает'}</Badge>
            </div>
          </div>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-ink-100 text-ink-500 hover:bg-ink-200"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Решение ИИ</p>
            <p className="font-display mt-1 text-xl font-extrabold">{s.fitLabel}</p>
            <div className="mt-3"><Progress value={s.score} barClass="from-white/90 to-brand-200" /></div>
            <p className="mt-2 text-sm text-brand-100">Совпадение навыков с вакансией: {w.skills.filter((x) => s.hit.includes(x)).length}/{s.hit.length + s.missing.length}+</p>
          </div>
          <p className="rounded-2xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">Вердикт: {s.summary}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-mint-500/25 bg-mint-400/8 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-mint-600"><Check className="h-4 w-4" /> Подтверждённые навыки</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.hit.length ? s.hit.map((x) => <Badge key={x} tone="mint">{x}</Badge>) : <span className="text-[13px] text-ink-500">Прямых совпадений нет</span>}</div>
            </div>
            <div className="rounded-2xl border border-amber-500/25 bg-amber-400/8 p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-amber-700"><Sparkles className="h-4 w-4" /> Пробелы</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{s.missing.length ? s.missing.map((x) => <Badge key={x} tone="amber">{x}</Badge>) : <span className="text-[13px] text-ink-500">Требования полностью закрыты</span>}</div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-ink-200 p-4">
            <p className="text-sm font-bold text-ink-800">Вопросы для интервью (от ИИ)</p>
            {s.questions.map((q) => (
              <p key={q} className="rounded-xl bg-ink-50 px-3 py-2 text-[13px] text-ink-700">{q}</p>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-ink-100 pt-4">
            <Button variant="light" onClick={onClose}>Вернуться</Button>
            <Button onClick={onInvite}><CalendarCheck className="h-4 w-4" /> Пригласить на собеседование</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}