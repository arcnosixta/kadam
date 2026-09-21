import { useMemo, useState } from 'react';
import {
  Building2, Check, FileText, Heart, MapPin, MessageSquareText, Search, Shield, Sparkles, X,
} from 'lucide-react';
import { Badge, Button, Card, Chip, Modal, Progress, Segmented, Spinner } from '../../components/ui';
import { JOBS } from '../../data/jobs';
import { rankedMatches, matchJob, fitAnalysis, coverLetter, fmt } from '../../lib/ai';
import { JobCard, SalaryWheel, SimilarNote, SkillMatchRow, FitBadge } from './parts';
import { cn } from '../../components/ui';

const FILTERS = ['Все', 'Мой регион', 'Удалённо', '> ожидаемой зарплаты'];

export function Matches({ profile, activeJob, onOpen, onApply, onSave, apps, mode = 'matches', onChat }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Все');
  const [minScore, setMinScore] = useState(0);
  const [detail, setDetail] = useState(activeJob ?? null);

  const ranked = useMemo(() => rankedMatches(profile, mode === 'search' ? JOBS : JOBS), [profile, mode]);

  const filtered = ranked
    .filter((j) => {
      if (query && !`${j.title} ${j.company} ${j.region} ${j.skills.join(' ')}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === 'Мой регион' && j.region !== profile.region) return false;
      if (filter === 'Удалённо' && j.format !== 'remote' && j.format !== 'hybrid') return false;
      if (filter === '> ожидаемой зарплаты' && j.salaryTo < profile.salaryExpect) return false;
      if (j.match.score < minScore) return false;
      return true;
    });

  const openDetail = (j) => { onOpen(j); setDetail(j); };
  const applied = (id) => apps[id]?.stage;

  return (
    <div className="mx-auto max-w-6xl space-y-5 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
            {mode === 'matches' ? 'Рекомендации ИИ' : 'Все вакансии рынка'}
          </h1>
          <p className="mt-1 text-ink-500">{mode === 'matches'
            ? 'Отранжировано по вероятности оффера для вашего профиля.'
            : 'Полный каталог: фильтруйте, сохраняйте, откликайтесь.'}</p>
        </div>
        {mode === 'matches' && (
          <div className="inline-flex items-center gap-2 rounded-xl bg-brand-500/10 px-3.5 py-2 text-xs font-bold text-brand-700">
            <Sparkles className="h-4 w-4" /> Модель Kadam Score® v2
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Card className="p-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Навык, профессия, компания, город…"
              className="h-11 w-full rounded-xl border border-ink-200 bg-ink-50 pl-10 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>{f}</Chip>)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink-500">min</span>
            <div className="flex gap-1">
              {[0, 55, 72, 86].map((v) => (
                <button key={v} onClick={() => setMinScore(v)} className={cn('rounded-lg px-2.5 py-1.5 text-xs font-bold transition', minScore === v ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500 hover:bg-ink-200')}>
                  {v === 0 ? 'все' : `${v}%`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {filtered.map((j) => {
          const st = applied(j.id);
          return (
            <JobCard key={j.id} job={j} match={j.match} onOpen={() => openDetail(j)} compact>
              <div className="flex flex-wrap items-center gap-2.5">
                <SkillMatchRow hit={j.match.hit} missing={j.match.missing} cover={j.match.skillsCover} />
                <div className="mt-1 flex w-full items-center gap-2">
                  <Button size="sm" variant={st ? 'mint' : 'primary'} onClick={() => onApply(j.id)} disabled={st === 'offer'}>
                    {['applied', 'interview', 'offer'].includes(st) ? 'Статус: ' + { applied: 'Откликнулись', interview: 'Собеседование', offer: 'Оффер' }[st] : 'Откликнуться'} 
                    {st && ['applied','interview','offer'].includes(st) ? null : <Check className="h-4 w-4" />}
                  </Button>
                  {!st && (
                    <Button size="sm" variant="light" onClick={() => onSave(j.id)}>
                      <Heart className="h-4 w-4" /> В избранное
                    </Button>
                  )}
                </div>
              </div>
            </JobCard>
          );
        })}
        {filtered.length === 0 && (
          <Card className="grid place-items-center gap-2 p-12 text-center">
            <Sparkles className="h-8 w-8 text-ink-300" />
            <p className="font-display font-bold text-ink-700">Под фильтр ничего не нашлось</p>
            <p className="max-w-sm text-sm text-ink-500">Попробуйте снизить порог fit-оценки или снять фильтры — рынок быстро меняется.</p>
          </Card>
        )}
      </div>

      {/* Detail modal */}
      {detail && (
        <JobDetailModal
          job={detail}
          match={matchJob(detail, profile)}
          profile={profile}
          stage={applied(detail.id)}
          onClose={() => setDetail(null)}
          onApply={() => onApply(detail.id)}
          onApplyNoClose={() => onApply(detail.id)}
          onSave={() => { onSave(detail.id); }}
          onChat={onChat}
        />
      )}
    </div>
  );
}

function JobDetailModal({ job, match, profile, stage, onClose, onApply, onSave, onChat }) {
  const [tab, setTab] = useState('fit');
  const analysis = fitAnalysis(job, profile);
  const letter = coverLetter(job, profile);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const tailorResume = () => {
    setLoading(true);
    setTimeout(() => {
      setTab('cover');
      setLoading(false);
      setSent(true);
      onApply();
    }, 900);
  };

  return (
    <Modal open onClose={onClose} wide>
      <div className="max-h-[86vh] overflow-y-auto nice-scroll">
        {/* header */}
        <div className="relative border-b border-ink-100 p-6">
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-ink-100 text-ink-500 transition hover:bg-ink-200">
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-start gap-4 pr-10">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 font-display font-extrabold text-white shadow-glow">
              {job.company.replace(/["«»]/g, '').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display text-xl font-extrabold text-ink-900">{job.title}</h2>
                <FitBadge score={match.score} />
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500"><Building2 className="h-4 w-4" /> {job.company} · <MapPin className="h-4 w-4" /> {job.region}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="brand">{fmt.money(job.salaryFrom, job.currency)}–{fmt.money(job.salaryTo, job.currency)}</Badge>
                <Badge tone="slate">{job.format === 'remote' ? 'Удалённо' : job.format === 'hybrid' ? 'Гибрид' : 'В офисе'}</Badge>
                <Badge tone="violet">{job.industry}</Badge>
                {job.verified && <Badge tone="mint"><Shield className="h-3 w-3" /> Проверенный работодатель</Badge>}
              </div>
            </div>
          </div>
          {/* tabs */}
          <div className="mt-5 flex gap-1 rounded-2xl bg-ink-100 p-1">
            {[['fit', 'Анализ ИИ'], ['job', 'О вакансии'], ['cover', 'Материалы для отклика']].map(([v, l]) => (
              <button key={v} onClick={() => setTab(v)} className={cn('flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition', tab === v ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500 hover:text-ink-800')}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === 'fit' && (
            <div className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-violet-600 p-5 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-200">Вердикт ИИ</p>
                  <p className="font-display mt-1 text-2xl font-extrabold">{analysis.verdict}</p>
                  <div className="mt-4"><Progress value={analysis.score} barClass="from-white/90 to-brand-200" /></div>
                  <p className="mt-2 text-sm text-brand-100">Совпадение {analysis.score}%</p>
                </div>
                <SalaryWheel from={job.salaryFrom} to={job.salaryTo} expect={profile.salaryExpect} currency={job.currency} />
              </div>
              <p className="rounded-2xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">{analysis.overview}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-mint-500/25 bg-mint-400/8 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-mint-600"><Check className="h-4 w-4" /> Сильные стороны</p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink-700">{analysis.strengths}</pre>
                </div>
                <div className="rounded-2xl border border-amber-500/25 bg-amber-400/8 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-amber-700"><FileText className="h-4 w-4" /> Пробелы</p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-ink-700">{analysis.gaps}</pre>
                </div>
              </div>
              <div className="rounded-2xl bg-brand-500/8 p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-brand-700"><Sparkles className="h-4 w-4" /> Рекомендация</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{analysis.advice}</p>
              </div>
              <SimilarNote job={job} profile={profile} />
            </div>
          )}

          {tab === 'job' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-bold text-ink-700">Описание</p>
                <p className="text-sm leading-relaxed text-ink-600">{job.description}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-bold text-ink-700">Требуемые навыки</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s) => <Chip key={s} active>{s}</Chip>)}
                </div>
              </div>
              {job.tags?.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-bold text-ink-700">Условия</p>
                  <div className="flex flex-wrap gap-2">{job.tags.map((t) => <Badge key={t} tone="sky">{t}</Badge>)}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[['Откликов', job.applications ?? 12], ['Просмотров', job.views], ['Проверен', job.verified ? 'Да' : '—']].map(([l, v]) => (
                  <div key={l} className="rounded-2xl bg-ink-50 p-3">
                    <p className="font-display text-lg font-extrabold text-ink-800">{v}</p>
                    <p className="text-xs text-ink-400">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'cover' && (
            <div className="space-y-4">
              {loading ? (
                <div className="grid place-items-center gap-3 py-10">
                  <Spinner className="h-8 w-8" />
                  <p className="text-sm font-semibold text-ink-500">ИИ подбирает резюме и письмо под «{job.title}»…</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-bold text-ink-700">
                      <Sparkles className="h-4 w-4 text-brand-500" /> Сопроводительное письмо (готово)
                    </p>
                    <Badge tone="mint"><Check className="h-3 w-3" /> Под ваш стиль</Badge>
                  </div>
                  <div className="rounded-2xl border border-ink-200 bg-white p-5">
                    <p className="text-sm font-bold text-ink-800">{letter.subject}</p>
                    <p className="mt-2 text-sm text-ink-600">{letter.greeting}</p>
                    <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-700">
                      {letter.body.map((b) => <p key={b}>{b}</p>)}
                    </div>
                    <pre className="mt-4 whitespace-pre-wrap font-sans text-sm text-ink-700">{letter.sign}</pre>
                  </div>
                  <div className="rounded-2xl bg-ink-50 p-4 text-xs text-ink-500">
                    Резюме адаптировано под ключевые слова вакансии: автоматически переставили приоритет навыков {match.hit.slice(0, 3).join(', ')}.
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-6 py-4">
          <Segmented
            value={tab}
            onChange={setTab}
            options={[{ value: 'fit', label: 'Анализ' }, { value: 'job', label: 'Описание' }, { value: 'cover', label: 'Материалы' }]}
            className="border-0 bg-white"
          />
          <div className="flex items-center gap-2">
            <Button variant="light" size="sm" onClick={() => { onSave(); }}>Сохранить</Button>
            <Button size="sm" variant="ghost" onClick={() => { onClose(); onChat(); }}>
              <MessageSquareText className="h-4 w-4" /> Уточнить у ИИ
            </Button>
            {!sent && (stage === undefined || stage === 'saved') ? (
              <Button size="sm" onClick={tailorResume} disabled={loading} className="min-w-[180px]">
                {loading ? <Spinner className="h-4 w-4 text-white" /> : <><Sparkles className="h-4 w-4" /> Откликнуться с письмом</>}
              </Button>
            ) : (
              <Badge tone="mint" className="px-3 py-2 text-sm"><Check className="h-3.5 w-3.5" /> Отклик отправлен</Badge>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}