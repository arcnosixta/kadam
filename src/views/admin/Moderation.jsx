import { useState } from 'react';
import { AlertTriangle, Check, Clock3, Copy, Flag, ShieldAlert, X } from 'lucide-react';
import { Badge, Button, Card, Empty } from '../../components/ui';
import { cn } from '../../components/ui';

const MOCK_QUEUE = [
  {
    id: 'q1', kind: 'job', title: 'Оператор колл-центра', company: 'ТОО «Телесфера»', region: 'Астана',
    issue: 'Подозрение на неофициальную занятость: зарплата «на руки», без договора',
    risk: 'high', asked: '2 дня назад', skills: ['коммуникации', 'интернет'],
  },
  {
    id: 'q2', kind: 'job', title: 'Укладчица-упаковщица', company: 'ИП «Рахат»', region: 'Шымкент',
    issue: 'Вакансия дублирует активную публикацию; подозрение на теневые схемы оплаты',
    risk: 'mid', asked: '1 день назад', skills: ['внимательность'],
  },
  {
    id: 'q3', kind: 'candidate', title: 'Кандидат «Асель Н.»', company: 'Анкета', region: 'Алматы',
    issue: 'Несоответствие опыта резюме и навыков; возможна накрутка стажа',
    risk: 'low', asked: '3 часа назад', skills: ['бухгалтерия', '1c'],
  },
  {
    id: 'q4', kind: 'job', title: 'Водитель категории B', company: 'ТОО «Айнур Логистик»', region: 'Кызылорда',
    issue: 'Не указана заработная плата и график — нарушение правил публикации',
    risk: 'low', asked: 'вчера', skills: ['вождение категории b'],
  },
];

export function Moderation({ notify }) {
  const [queue, setQueue] = useState(MOCK_QUEUE);
  const [done, setDone] = useState([]);

  const decide = (q, ok) => {
    setQueue((s) => s.filter((x) => x.id !== q.id));
    setDone((d) => [...d, { ...q, ok }]);
    notify(ok ? `Одобрено: ${q.title}` : `Отклонено: ${q.title}`);
  };

  const stats = [
    { l: 'Ожидают', v: queue.length, c: 'bg-amber-400/12 text-amber-600' },
    { l: 'Одобрено сегодня', v: 12, c: 'bg-mint-400/15 text-mint-600' },
    { l: 'Отклонено (спам/ТШ)', v: 4, c: 'bg-rose-400/12 text-rose-600' },
    { l: 'На рассмотрении ИИ', v: 5, c: 'bg-violet-500/12 text-violet-600' },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Модерация контента</h1>
          <p className="mt-1 text-ink-500">ИИ выявляет подозрительные вакансии и анкеты до того, как их увидят соискатели.</p>
        </div>
        <div className="flex gap-2">
          {stats.map((s) => (
            <div key={s.l} className={cn('rounded-2xl px-3.5 py-2.5 text-center', s.c)}>
              <p className="font-display text-lg font-extrabold">{s.v}</p>
              <p className="text-[10px] font-semibold opacity-80">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {queue.map((q) => (
          <Card key={q.id} className="p-5">
            <div className="flex flex-wrap items-start gap-4">
              <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', q.kind === 'job' ? 'bg-brand-500/10 text-brand-600' : 'bg-violet-500/12 text-violet-600')}>
                {q.kind === 'job' ? <Copy className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg font-extrabold text-ink-900">{q.title}</h3>
                  <Badge tone={q.risk === 'high' ? 'rose' : q.risk === 'mid' ? 'amber' : 'slate'}>
                    <AlertTriangle className="h-3 w-3" /> риск {q.risk === 'high' ? 'высокий' : q.risk === 'mid' ? 'средний' : 'низкий'}
                  </Badge>
                  {q.kind === 'candidate' && <Badge tone="violet">анкета кандидата</Badge>}
                </div>
                <p className="text-sm text-ink-500">{q.company} · {q.region}</p>
                <p className="mt-2 rounded-xl bg-amber-400/8 px-3 py-2 text-[13px] leading-relaxed text-ink-700">
                  <Flag className="mr-1.5 inline h-3.5 w-3.5 text-amber-500" />
                  {q.issue}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] text-ink-400"><Clock3 className="h-3 w-3" /> {q.asked}</span>
                  {q.skills.map((s) => <Badge key={s} tone="slate">{s}</Badge>)}
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="light" onClick={() => decide(q, false)}><X className="h-4 w-4 text-rose-400" /> Отклонить</Button>
                <Button size="sm" onClick={() => decide(q, true)}><Check className="h-4 w-4" /> Одобрить</Button>
              </div>
            </div>
          </Card>
        ))}

        {queue.length === 0 && (
          <Card className="p-10">
            <Empty icon={Check} title="Очередь пуста" text="Все публикации проверены. ИИ продолжает сканировать новые материалы." />
          </Card>
        )}
      </div>

      {done.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-bold text-ink-800">История решений (сегодня)</h3>
          <div className="mt-3 space-y-2">
            {done.slice(0, 4).map((d) => (
              <p key={d.id} className="flex items-center gap-2 text-[13px] text-ink-600">
                <span className={cn('grid h-5 w-5 place-items-center rounded-full', d.ok ? 'bg-mint-400/15 text-mint-600' : 'bg-rose-400/12 text-rose-600')}>
                  {d.ok ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                </span>
                {d.title} — {d.ok ? 'одобрено' : 'отклонено'}
              </p>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}