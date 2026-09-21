import { Badge, Button, Card, Progress } from '../../components/ui';
import { ArrowRight, Eye, Plus, Users } from 'lucide-react';
import { screenCandidate } from '../../lib/ai';
import { WORKERS } from '../../data/jobs';
import { fmt } from '../../lib/ai';

export function MyJobs({ jobs, onSelect, onNav }) {
  return (
    <div className="mx-auto max-w-5xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Мои вакансии</h1>
          <p className="mt-1 text-ink-500">ИИ следит за каждым объявлением: охватом, откликами и качеством пула.</p>
        </div>
        <Button onClick={() => onNav('post')}><Plus className="h-4 w-4" /> Новая вакансия</Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((j) => {
          const scored = WORKERS.map((w) => ({ w, s: screenCandidate(w, j) })).sort((a, b) => b.s.score - a.s.score);
          const good = scored.filter((x) => x.s.score >= 70).length;
          const views = j.views ?? 1200;
          const appl = j.applications ?? 12;
          return (
            <Card key={j.id} hover className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-lg font-extrabold text-ink-900">{j.title}</h2>
                    <Badge tone="mint">Активна</Badge>
                    <Badge tone="slate">{j.format === 'remote' ? 'Удалённо' : j.format === 'hybrid' ? 'Гибрид' : 'Офис'}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">{j.company} · {j.region} · {fmt.money(j.salaryFrom, j.currency)}–{fmt.money(j.salaryTo, j.currency)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">{j.skills.map((s) => <Badge key={s} tone="brand">{s}</Badge>)}</div>
                </div>
                <div className="flex shrink-0 gap-4">
                  {[
                    { icon: Eye, v: formatK(views), l: 'просмотров' },
                    { icon: Users, v: appl, l: 'откликов' },
                    { icon: ArrowRight, v: good, l: 'топ-кандидатов' },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <s.icon className="mx-auto h-4 w-4 text-ink-300" />
                      <p className="mt-1 font-display text-lg font-extrabold text-ink-900">{s.v}</p>
                      <p className="text-[11px] text-ink-400">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 border-t border-ink-100 pt-3">
                <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                  <span>Отклики ≥ 70% совпадения: {good} из {appl}</span>
                  <span className="text-mint-600">Конверсия отклик→интервью {Math.round(appl * 0.16)}%</span>
                </div>
                <Progress value={(Math.min(good, appl * 4) / Math.max(appl, 1)) * 100} className="mt-2" barClass="from-mint-400 to-brand-500" />
                <div className="mt-4 flex justify-end gap-2">
                  <Button size="sm" variant="ghost">Пауза</Button>
                  <Button size="sm" variant="light" onClick={() => onSelect(j)}>
                    Смотреть кандидатов <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function formatK(v) { return v >= 1000 ? `${(v / 1000).toFixed(1)} тыс.` : v; }