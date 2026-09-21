import { useMemo } from 'react';
import { ArrowRight, Bookmark, BriefcaseBusiness, CalendarCheck, CheckCircle2, ChevronRight, MailCheck, PartyPopper } from 'lucide-react';
import { Badge, Button, Card, Empty, ProgressRing } from '../../components/ui';
import { JOBS } from '../../data/jobs';
import { fmt } from '../../lib/ai';
import { cn } from '../../components/ui';

const STAGES = [
  { key: 'saved', label: 'Сохранено', icon: Bookmark, tone: 'text-ink-500 bg-ink-100' },
  { key: 'applied', label: 'Откликнулся', icon: MailCheck, tone: 'text-sky-600 bg-sky-500/12' },
  { key: 'interview', label: 'Собеседование', icon: CalendarCheck, tone: 'text-violet-600 bg-violet-500/12' },
  { key: 'offer', label: 'Оффер', icon: PartyPopper, tone: 'text-mint-600 bg-mint-400/15' },
];

export function Track({ apps, onApply, onChangeView }) {
  const jobsWithStage = useMemo(() => {
    return JOBS.map((j) => ({ job: j, stage: apps[j.id]?.stage ?? null })).filter((x) => x.stage);
  }, [apps]);

  const inPipeline = jobsWithStage.filter((x) => ['applied', 'interview'].includes(x.stage)).length;
  const offers = jobsWithStage.filter((x) => x.stage === 'offer').length;
  const progress = Math.min(100, Math.round((inPipeline + offers) / 3 * 100));

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Мои отклики</h1>
          <p className="mt-1 text-ink-500">ИИ ведёт каждый отклик и вовремя напоминает о следующем шаге.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-ink-200">
            <ProgressRing value={progress} size={64} stroke={7} label={`${progress}%`} sub="к офферу" />
            <div>
              <p className="text-sm font-bold text-ink-800">Воронка активна</p>
              <p className="text-xs text-ink-400">{inPipeline} в работе · {offers} оффер(ов)</p>
            </div>
          </div>
          <Button size="sm" onClick={() => onChangeView('matches')}>Найти ещё <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>

      {jobsWithStage.length === 0 ? (
        <Card className="p-6">
          <Empty icon={BriefcaseBusiness} title="Пока пусто" text="Сохраните или откройте первые 3 вакансии — ИИ мгновенно начнёт вести их статус и подкидывать материалы.">
            <Button onClick={() => onChangeView('matches')}>К рекомендациям ИИ</Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid gap-5 lg:grid-cols-4">
          {STAGES.map((stage) => {
            const items = jobsWithStage.filter((x) => x.stage === stage.key);
            return (
              <div key={stage.key} className="rounded-3xl bg-ink-100/70 p-3">
                <div className="flex items-center gap-2 px-1.5 py-2">
                  <span className={cn('grid h-8 w-8 place-items-center rounded-xl', stage.tone)}><stage.icon className="h-4 w-4" /></span>
                  <p className="text-sm font-bold text-ink-800">{stage.label}</p>
                  <span className="ml-auto grid h-6 min-w-6 place-items-center rounded-full bg-white px-1.5 text-xs font-bold text-ink-600 shadow-soft">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map(({ job, stage: st }) => (
                    <Card key={job.id} hover className={cn('p-3.5', st === 'offer' && 'ring-2 ring-mint-500/50')}>
                      <p className="line-clamp-1 text-sm font-bold text-ink-900">{job.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{job.company} · {job.region}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge tone={st === 'offer' ? 'mint' : 'slate'}>{fmt.money(job.salaryFrom, job.currency)}–{fmt.money(job.salaryTo, job.currency)}</Badge>
                        <span className="text-[11px] text-ink-400">{apps[job.id]?.at}</span>
                      </div>
                      {st === 'applied' && (
                        <button onClick={() => onApply(job.id)} className="mt-2.5 flex w-full items-center justify-center gap-1 rounded-lg bg-violet-500/10 py-1.5 text-xs font-bold text-violet-600 transition hover:bg-violet-500/20">
                          Продвинуть к собеседованию <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {st === 'interview' && (
                        <div className="mt-2.5 rounded-lg bg-mint-400/10 py-1.5 text-center text-xs font-bold text-mint-600">
                          Сценарий собеседования готов
                        </div>
                      )}
                      {st === 'offer' && (
                        <div className="mt-2.5 flex items-center gap-1.5 rounded-lg bg-mint-400/10 py-1.5 text-center text-xs font-bold text-mint-600">
                          <CheckCircle2 className="mx-auto h-3.5 w-3.5" /> Поздравляем!
                        </div>
                      )}
                    </Card>
                  ))}
                  {items.length === 0 && (
                    <div className="grid h-28 place-items-center rounded-2xl border-2 border-dashed border-ink-200 text-xs text-ink-400">
                      Сделайте шаг
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}