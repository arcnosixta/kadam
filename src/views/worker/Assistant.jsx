import { useEffect, useRef, useState } from 'react';
import { BookOpen, FileText, MessageSquareText, Send, Sparkles, Target } from 'lucide-react';
import { Avatar, Button, Card } from '../../components/ui';
import { chatReply, matchJob, fmt } from '../../lib/ai';
import { JOBS } from '../../data/jobs';
import { cn } from '../../components/ui';

const QUICK = [
  { label: 'Найти вакансии', k: 'найти работу' },
  { label: 'Обучение', k: 'хочу обучиться' },
  { label: 'Собеседование', k: 'как готовиться к собеседованию' },
  { label: 'Резюме', k: 'как улучшить резюме' },
  { label: 'Пособие', k: 'как получить пособие' },
];

export function Assistant({ profile, jobs = JOBS, chat, setChat, onChangeView }) {
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  const send = (text) => {
    const msg = (text ?? value).trim();
    if (!msg) return;
    setChat((c) => [...c, { from: 'me', text: msg }]);
    setValue('');
    setTyping(true);
    setTimeout(() => {
      const reply = chatReply(msg, {
        role: profile.desiredRole.toLowerCase(),
        salary: fmt.money(profile.salaryExpect),
      });
      setChat((c) => [...c, { from: 'ai', text: reply, job: maybeJob(msg) }]);
      setTyping(false);
    }, 700);
  };

  const maybeJob = (msg) => {
    const j = jobs.find((x) => msg.toLowerCase().includes(x.region.toLowerCase()));
    return j && matchJob(j, profile).score >= 60 ? j : null;
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="mb-4 flex items-center gap-3">
        <Avatar name="Aila" initials="АИ" color="#8b5cf6" size="lg" />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Айла — ваш ИИ-ассистент</h1>
          <p className="text-sm text-ink-500">Помогает находить, учиться и устраиваться. Пишите как другу — я пойму.</p>
        </div>
        <Badge className="ml-auto"><Sparkles className="h-3.5 w-3.5" /> online</Badge>
      </div>

      <Card className="flex flex-col overflow-hidden">
        {/* messages */}
        <div className="nice-scroll max-h-[520px] flex-1 space-y-4 overflow-y-auto bg-ink-50/60 p-5">
          {chat.map((m, i) => (
            <div key={i} className={cn('flex items-end gap-2.5', m.from === 'me' && 'flex-row-reverse')}>
              {m.from === 'ai' && <Avatar name="Aila" initials="АИ" color="#8b5cf6" size="sm" />}
              <div className={cn(
                'max-w-[80%] space-y-2',
                m.from === 'ai' ? 'items-start' : 'items-end'
              )}>
                <div className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft',
                  m.from === 'ai' ? 'rounded-bl-md bg-white text-ink-700' : 'rounded-br-md bg-gradient-to-br from-brand-500 to-violet-600 text-white'
                )}>
                  {m.text}
                </div>
                {m.job && (
                  <Card className="flex items-center gap-3 p-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/12 font-display text-sm font-extrabold text-brand-700">
                      {m.job.company.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink-900">{m.job.title}</p>
                      <p className="text-xs text-ink-500">{m.job.company} · {m.job.region} · fit {matchJob(m.job, profile).score}%</p>
                    </div>
                    <Button size="sm" variant="light" onClick={() => onChangeView('matches')}>Смотреть</Button>
                  </Card>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2.5">
              <Avatar name="Aila" initials="АИ" color="#8b5cf6" size="sm" />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.2s' }} />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* quick replies */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-ink-100 bg-white px-4 py-3">
          {QUICK.map((q) => (
            <button key={q.k} onClick={() => send(q.k)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-2 text-[13px] font-semibold text-ink-600 transition hover:border-brand-300 hover:text-brand-600">
              <q.icon className="h-3.5 w-3.5" />{q.label}
            </button>
          ))}
        </div>

        {/* composer */}
        <div className="flex items-end gap-2 border-t border-ink-100 bg-white p-4">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            rows={1}
            placeholder="Спросите Айлу… (Enter — отправить)"
            className="max-h-32 flex-1 resize-none rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
          />
          <Button onClick={() => send()} disabled={!value.trim()} className="h-11 w-11 !p-0">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* capabilities line */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Target, l: 'Подбор вакансий' },
          { icon: FileText, l: 'Анализ резюме' },
          { icon: BookOpen, l: 'Маршрут обучения' },
          { icon: MessageSquareText, l: 'Сценарии интервью' },
        ].map((c) => (
          <div key={c.l} className="flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-3 py-2.5 text-[13px] font-semibold text-ink-600">
            <c.icon className="h-4 w-4 text-brand-500" /> {c.l}
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({ children, className }) {
  return <span className={cn('inline-flex items-center gap-1.5 rounded-full bg-violet-500/12 px-3 py-1.5 text-xs font-bold text-violet-600', className)}>{children}</span>;
}