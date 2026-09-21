import { Badge, Card, Progress, Avatar, Button } from '../../components/ui';
import { fmt } from '../../lib/ai';
import { cn } from '../../components/ui';

export function FitBadge({ score }) {
  const tone = score >= 86 ? 'mint' : score >= 72 ? 'brand' : score >= 55 ? 'amber' : 'rose';
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-sm font-extrabold ring-1 ring-inset', {
      mint: 'bg-mint-400/15 text-mint-600 ring-mint-500/25',
      brand: 'bg-brand-500/12 text-brand-700 ring-brand-500/25',
      amber: 'bg-amber-400/15 text-amber-700 ring-amber-500/25',
      rose: 'bg-rose-500/12 text-rose-600 ring-rose-500/25',
    }[tone])}>
      {score}%
    </span>
  );
}

export function JobCard({ job, match, onOpen, children, compact = false }) {
  const m = match ?? { score: null };
  return (
    <Card hover className="p-5">
      <div className="flex items-start gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/12 to-violet-500/12 font-display text-sm font-extrabold text-brand-700">
          {job.company.replace(/["«»]/g, '').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display truncate text-base font-bold text-ink-900">{job.title}</h3>
              <p className="mt-0.5 truncate text-sm text-ink-500">{job.company} · {job.region}</p>
            </div>
            {m.score != null && <FitBadge score={m.score} />}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge tone="brand">{fmt.money(job.salaryFrom, job.currency)}–{fmt.money(job.salaryTo, job.currency)}</Badge>
            <Badge tone="slate">{job.format === 'remote' ? 'Удалённо' : job.format === 'hybrid' ? 'Гибрид' : 'В офисе'}</Badge>
            <Badge tone="slate">{job.type === 'full' ? 'Полная занятость' : 'Частичная'}</Badge>
          </div>
          {!compact && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">{job.description}</p>}
        </div>
      </div>
      {children && <div className="mt-4">{children}</div>}
      {onOpen && (
        <div className="mt-4 flex justify-end border-t border-ink-100 pt-3">
          <Button size="sm" variant="light" onClick={onOpen}>Подробнее и отклик</Button>
        </div>
      )}
    </Card>
  );
}

export function SkillMatchRow({ hit, missing, cover }) {
  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-700">Совпадение навыков</span>
          <span className="font-display font-extrabold text-brand-600">{cover}%</span>
        </div>
        <Progress value={cover} />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {hit.map((s) => <Badge key={s} tone="mint">{s} ✓</Badge>)}
        {missing.map((s) => <Badge key={s} tone="rose">{s} — освойте</Badge>)}
      </div>
    </div>
  );
}

export function SalaryWheel({ from, to, expect, currency }) {
  const mid = ((from + to) / 2) / Math.max(expect, 1);
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Ежемесячно (вилка)</p>
        <p className="font-display text-lg font-extrabold text-ink-900">
          {fmt.money(from, currency)} — {fmt.money(to, currency)}
        </p>
        <p className="text-xs text-ink-500">Ваше ожидание: {fmt.money(expect, currency)}</p>
      </div>
      <div className="text-right">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Соответствие</p>
        <p className={cn('font-display text-xl font-extrabold', mid >= 1 ? 'text-mint-600' : 'text-amber-600')}>
          {Math.round(mid * 100)}%
        </p>
      </div>
    </div>
  );
}

export function RegionRow({ jobRegion, myRegion }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Avatar name={jobRegion} initials={jobRegion.slice(0, 2).toUpperCase()} color={jobRegion === myRegion ? '#10b981' : '#94a3b8'} size="sm" />
      <span className="font-semibold text-ink-700">{jobRegion}</span>
      {jobRegion !== myRegion
        ? <Badge tone="amber">Переезд / мобильность</Badge>
        : <Badge tone="mint">Ваш регион</Badge>}
    </div>
  );
}

export function SimilarNote({ job, _profile }) {
  return (
    <div className="rounded-2xl bg-brand-500/8 p-3 text-sm text-brand-800">
      Похожих кандидатов на эту роль сейчас {40 + ((job.id * 7) % 60)}; вы входите в топ-{(job.id * 3) % 20 + 3} по совпадению навыков. Среднее время до оффера по такой роли — 21 день.
    </div>
  );
}