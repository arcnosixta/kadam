import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, MapPin, Star, Users } from 'lucide-react';
import { Badge, Button, Card, Progress, Tabs } from '../../components/ui';
import { PROGRAMS, MARKET_STATS } from '../../data/stats';

export function Programs({ notify }) {
  const [cat, setCat] = useState('all');
  const [fill, setFill] = useState({});

  const cats = useMemo(() => ['all', ...new Set(PROGRAMS.map((p) => p.category))], []);
  const list = PROGRAMS.filter((p) => cat === 'all' || p.category === cat);

  const deficitNames = MARKET_STATS.topDemand.filter((d) => d.deficit).map((d) => d.skill);
  const demanded = (p) => p.skills.some((s) => deficitNames.some((d) => s.includes(d.split(' ')[0].toLowerCase()) || d.toLowerCase().includes(s)));

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Программы и активные меры</h1>
          <p className="mt-1 text-ink-500">Краткосрочное профобучение, гранты и субсидии по {MARKET_STATS.countries.KZ.name} и КР.</p>
        </div>
        <Tabs value={cat} onChange={setCat} items={cats.map((c) => ({ value: c, label: c === 'all' ? 'Все' : c }))} />
      </div>

      <Card className="flex flex-wrap items-center gap-4 border-l-4 !border-l-amber-400 p-5">
        <Users className="h-6 w-6 text-amber-500" />
        <div className="flex-1">
          <p className="font-display text-sm font-extrabold text-ink-900">Гос. охват обучения вырос до {Math.round(5240 / 1.4).toLocaleString('ru-RU')} грантов в месяц</p>
          <p className="text-[13px] text-ink-500">ИИ-анализ показал перекос спроса: гранты на {deficitNames[0]} закрывают <b>{Math.round((340 / 1260) * 100)}%</b> потребности. Рекомендуем расширить.</p>
        </div>
        <Button size="sm" variant="light" onClick={() => notify('Заявка на расширение грантов направлена в МТСЗН')}>Подать заявку <ArrowRight className="h-4 w-4" /></Button>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => {
          const toured = Math.min(100, (p.places / 300) * 100) + 45;
          const filled = fill[p.id] ? p.places : null;
          return (
            <Card key={p.id} hover className="group flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-500/10 text-brand-600">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-400" fill="currentColor" />
                  <span className="text-xs font-bold text-ink-700">{p.rating}</span>
                </div>
              </div>
              <h3 className="mt-3 font-display text-[15px] font-extrabold leading-snug text-ink-900">{p.title}</h3>
              <p className="mt-1 text-xs text-ink-400">{p.provider}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-ink-500">
                <span className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-2 py-1"><Clock3 className="h-3 w-3" /> {p.duration}</span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-ink-100 px-2 py-1"><MapPin className="h-3 w-3" /> {p.region}</span>
                {p.price === 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-mint-400/15 px-2 py-1 text-mint-600">Грант</span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-amber-400/15 px-2 py-1 text-amber-700">{p.price.toLocaleString('ru-RU')} ₸</span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => <Badge key={t} tone={demanded(p) ? 'mint' : 'slate'}>{t}</Badge>)}
                {demanded(p) && <Badge tone="amber"><ArrowRight className="h-3 w-3" /> дефицит</Badge>}
              </div>

              <div className="mt-auto space-y-3 pt-4">
                <div>
                  <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-ink-500">
                    <span>{filled ? `${p.places}/${p.places} заполнено` : 'Заполнено'}</span>
                    <span>{filled ? '100%' : `${Math.min(100, Math.round(toured))}%`}</span>
                  </div>
                  <Progress value={filled ? 100 : Math.min(100, toured)} barClass={filled ? 'from-mint-400 to-teal-500' : p.price === 0 ? 'from-brand-500 to-violet-500' : 'from-amber-400 to-orange-500'} />
                </div>
                <Button
                  size="sm" full
                  variant={filled ? 'mint' : 'primary'}
                  onClick={() => { if (!filled) { setFill((f) => ({ ...f, [p.id]: true })); notify(`Набор закрыт: «${p.title}» — ${p.places} мест забронировано`); } }}
                >
                  <CheckCircle2 className="h-4 w-4" /> {filled ? 'Набор подтверждён' : 'Подтвердить набор'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}