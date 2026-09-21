import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, ListChecks, MessageSquareText, Mic, Send, Sparkles, Trophy } from 'lucide-react';
import { Badge, Button, Card, ProgressRing, Avatar } from '../../components/ui';
import { interviewPrep } from '../../lib/ai';
import { JOBS } from '../../data/jobs';
import { cn } from '../../components/ui';

export function Interview({ profile, jobs = JOBS }) {
  const job = useMemo(() => jobs.find((j) => j.id === 8) ?? jobs[0], [jobs]);
  const prep = interviewPrep(job, profile);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState('');
  const [messages, setMessages] = useState([]);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [thinking, setThinking] = useState(false);
  const scores = useRef([]);
  const endRef = useRef(null);

  const submitAnswer = (skip = false) => {
    if (!skip && !answer.trim()) return;
    const q = prep.questions[step];
    const my = answer.trim();
    const score = gradeAnswer(my, q.input).score;

    setMessages((m) => [...m, { from: 'me', text: skip ? '(пропущен вопрос)' : my, q, score }]);
    scores.current.push(score);
    setAnswer('');
    setThinking(true);

    setTimeout(() => {
      const fb = gradeAnswer(skip ? '' : my, q.input);
      setFeedback(fb);
      setMessages((m) => [...m, { from: 'ai', text: fb.verdict, tip: fb.tip }]);
      setThinking(false);
    }, 650);
  };

  const next = () => {
    setFeedback(null);
    const nxt = step + 1;
    if (nxt >= prep.questions.length) {
      setDone(true);
      setMessages((m) => [
        ...m,
        { from: 'ai', text: `Сессия завершена! Вы прошли ${prep.questions.length} вопросов. Средний балл ${avgOf(scores.current)}/100. Ключевой совет: готовьте ответы по СТАР и опирайтесь на цифры.` },
      ]);
    } else {
      setStep(nxt);
    }
  };

  const gradeAnswer = (text, _q) => {
    const len = text.length;
    const hasNumbers = /\d/.test(text);
    const hasAction = /(сделал|организовал|увеличил|сократил|вывел|запустил|довёл|научил|продал)/i.test(text);
    const hasStar = /(когда|ситуация|задача|результат|итог)/i.test(text);
    let score = 55;
    if (len > 90) score += 10;
    if (len > 200) score += 8;
    if (len < 40) score -= 12;
    if (hasNumbers) score += 12;
    if (hasAction) score += 14;
    if (hasStar) score += 10;
    score = Math.max(28, Math.min(96, Math.round(score)));
    const verdict = score >= 80
      ? 'Сильный ответ: конкретика + результат. Так держать!'
      : score >= 60
        ? 'Хорошо, но добавьте цифры и конкретные достижения — это заметно повышает впечатление.'
        : 'Ответ слишком общий. Продавайте результат: «я сделал X, в цифрах это Y» (СТАР).';
    return {
      score,
      verdict,
      tip: score < 80
        ? 'Попробуйте структуру: Ситуация → Задача → Действие → Результат с цифрами.'
        : 'Держите темп — по одному примеру на вопрос, с изюминкой результата.',
    };
  };

  const restart = () => {
    setStep(0); setDone(false); setFeedback(null); setMessages([]); setAnswer('');
    scores.current = [];
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-up">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Тренировка собеседования</h1>
          <p className="mt-1 text-ink-500">Сценарий под реальную вакансию: {prep.role} · {prep.company}</p>
        </div>
        <Badge tone="violet"><Sparkles className="h-3.5 w-3.5" /> Индивидуальный сценарий</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        {/* Prep rail */}
        <div className="space-y-4">
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink-800"><Trophy className="h-4 w-4 text-amber-400" /> Подготовка к бою</p>
            <ul className="mt-3 space-y-2.5">
              {prep.checklist.map((c) => (
                <li key={c} className="flex items-start gap-2 text-[13px] leading-snug text-ink-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" /> {c}
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-brand-500/8 p-3 text-[13px] leading-relaxed text-brand-800">{prep.tip}</p>
          </Card>
          <Card className="p-5">
            <p className="flex items-center gap-2 text-sm font-bold text-ink-800"><ListChecks className="h-4 w-4 text-brand-500" /> Прогресс тренировки</p>
            <div className="mt-3 flex items-center gap-4">
              <ProgressRing
                value={Math.round((messages.filter((m) => m.from === 'me' && !m.text.includes('пропущен')).length / prep.questions.length) * 100)}
                size={76} stroke={8} label={`${messages.filter((m) => m.from === 'me').length}/${prep.questions.length}`} sub="вопросов"
              />
              <p className="text-sm leading-relaxed text-ink-600">Средний балл ответов: <b className={scoreColor(avgOf(scores.current))}>{avgOf(scores.current)}/100</b></p>
            </div>
          </Card>
        </div>

        {/* Interview window */}
        <Card className="flex flex-col overflow-hidden">
          {/* header */}
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <Avatar name="Interviewer" initials="ИА" color="#8b5cf6" />
              <div>
                <p className="text-sm font-bold text-ink-900">ИИ-рекрутёр · {job.company}</p>
                <p className="text-xs text-ink-400">Анонимно, без записи видео · следующий вопрос #{step + 1}</p>
              </div>
            </div>
            {done && <Button size="sm" variant="light" onClick={restart}>Начать заново</Button>}
          </div>

          {/* chat */}
          <div className="nice-scroll max-h-[430px] flex-1 space-y-4 overflow-y-auto bg-ink-50/60 p-5">
            {messages.length === 0 && (
              <div className="grid place-items-center gap-2 py-10 text-center">
                <MessageSquareText className="h-8 w-8 text-ink-300" />
                <p className="max-w-xs text-sm text-ink-500">ИИ спросит ваш первый вопрос. Отвечайте как на реальном интервью — честно и с деталями.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn('flex gap-3', m.from === 'me' ? 'flex-row-reverse' : '')}>
                {m.from === 'ai' && <Avatar name="ИИ" initials="ИА" color="#8b5cf6" size="sm" />}
                <div className={cn('max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft', m.from === 'me' ? 'bg-gradient-to-br from-brand-500 to-violet-600 text-white' : 'bg-white text-ink-700')}>
                  {m.q && <p className="mb-1 text-xs font-bold uppercase tracking-wide opacity-60">вопрос: {m.q}</p>}
                  {m.text}
                  {m.score != null && <p className="mt-1.5 text-right text-[11px] font-bold opacity-70">оценка {m.score}/100</p>}
                </div>
              </div>
            ))}

            {feedback && (
              <div className="ml-11 animate-fade-up flex gap-3">
                <div className="flex-1 rounded-2xl border border-brand-200 bg-brand-500/8 p-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-soft">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-800">Обратная связь ИИ · {feedback.score}/100</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{feedback.verdict}</p>
                    </div>
                  </div>
                  <p className="mt-2 rounded-lg bg-white/70 px-3 py-2 text-[13px] text-ink-700">{feedback.tip}</p>
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" onClick={next}>Следующий вопрос →</Button>
                  </div>
                </div>
              </div>
            )}
            {thinking && (
              <div className="ml-11 flex items-center gap-2 text-sm text-ink-400">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.2s' }} />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.4s' }} />
                ИИ оценивает ответ…
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* composer */}
          {!done ? (
            <div className="border-t border-ink-100 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-sm font-bold text-ink-800">
                  <Sparkles className="h-4 w-4 text-brand-500" /> Вопрос {step + 1}: {prep.questions[step]}
                </p>
              </div>
              <div className="flex items-end gap-2">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && submitAnswer()}
                  rows={2}
                  placeholder="Ваш ответ… (Enter — отправить)"
                  className="flex-1 resize-none rounded-xl border border-ink-200 bg-ink-50 px-3.5 py-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30"
                />
                <Button size="sm" onClick={() => submitAnswer()} disabled={!answer.trim()}>
                  <Send className="h-4 w-4" /> Ответить
                </Button>
                <Button size="sm" variant="light" onClick={() => submitAnswer(true)}>Пропустить</Button>
              </div>
            </div>
          ) : (
            <div className="border-t border-ink-100 bg-white p-5 text-center">
              <ProgressRing value={avgOf(scores.current)} size={110} sub="средний балл" color="#10b981" />
              <p className="mt-2 font-display font-bold text-ink-800">Тренировка завершена</p>
              <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">Ваш результат — в топ-{(avgOf(scores.current) / 100 * 35).toFixed(0)}% соискателей тем же профилем. Повторите сценарий перед реальным собеседованием.</p>
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="light" size="sm" onClick={restart}>Повторить</Button>
                <Button size="sm">Скачать отчёт</Button>
              </div>
            </div>
          )}

          {/* mic hint */}
          <div className="flex items-center justify-center gap-2 border-t border-ink-100 bg-ink-50/60 py-2.5 text-xs text-ink-400">
            <Mic className="h-3.5 w-3.5" /> В продакшене доступен голосовой ответ и оценка пауз ◆ сейчас — текстовая демо-тренировка
          </div>
        </Card>
      </div>
    </div>
  );
}

function avgOf(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}
function scoreColor(v) { return v >= 80 ? 'text-mint-600' : v >= 60 ? 'text-brand-600' : 'text-rose-500'; }