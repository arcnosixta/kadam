import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Bot, FilePlus2, Send, Sparkles, UserSearch } from 'lucide-react';
import { Avatar, Button, Card } from '../../components/ui';
import { cn } from '../../components/ui';

const QUICK = [
  { label: 'Как ускорить найм?', k: 'accelerate', icon: UserSearch },
  { label: 'Написать вакансию', k: 'write', icon: FilePlus2 },
  { label: 'Что с рынком?', k: 'market', icon: Sparkles },
];

const REPLIES = {
  accelerate: 'У вас 24 отклика, из них 6 с совпадением ≥70%. Советую: (1) перенести пару сильных кандидатов на завтра (слоты открыты), (2) поднять зарплату на 10% — это поднимает конверсию на 18%, (3) написать кандидатам уточняющее письмо — молчунов станет меньше на треть.',
  write: 'Давайте я составлю. Напишите: должность, 3–5 ключевых навыков и основной бонус (зарплата, обучение, график). По готовности размещу вакансию на платформе и разошлю её 240 подходящим соискателям.',
  market: 'По рынку КЗ: спрос на вашу сферу вырос на 12% месяц к месяцу, средняя зарплата в Алматы по вашим ролям — 320 тыс. ₸. Кандидаты с активным поиском ждут не дольше 3 дней — отвечайте быстрее.',
};

export function Assistant({ chat, setChat, onOpenPost }) {
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat, typing]);

  const reply = (text, key) => {
    setChat((c) => [...c, { from: 'me', text }]);
    setValue('');
    setTyping(true);
    setTimeout(() => {
      const body = REPLIES[key] ?? 'Хороший вопрос! Могу быстро: - собрать топ кандидатов под вакансию, - написать карточку вакансии, - подсказать, как поднять конверсию. Выберите вариант ниже или спросите своё.';
      setChat((c) => [...c, { from: 'ai', text: body, hop: key }]);
      setTyping(false);
    }, 650);
  };

  const send = (text) => {
    const t = (text ?? value).trim();
    if (!t) return;
    const key = t.toLowerCase().includes('ваканси') ? 'write' : t.toLowerCase().includes('конверси') || t.toLowerCase().includes('ускор') ? 'accelerate' : t.toLowerCase().includes('рын') ? 'market' : 'auto';
    reply(t, key);
  };

  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <div className="mb-4 flex items-center gap-3">
        <Avatar name="HR" initials="HR" color="#8b5cf6" size="lg" />
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">HR-ассистент Kadam</h1>
          <p className="text-sm text-ink-500">Помогает быстрее закрывать вакансии: кандидаты, тексты, аналитика.</p>
        </div>
        <BadgePulse />
      </div>

      <Card className="flex flex-col overflow-hidden">
        <div className="nice-scroll max-h-[520px] flex-1 space-y-4 overflow-y-auto bg-ink-50/60 p-5">
          {chat.map((m, i) => (
            <div key={i} className={cn('flex items-end gap-2.5', m.from === 'me' && 'flex-row-reverse')}>
              {m.from === 'ai' && <Avatar name="HR" initials="HR" color="#8b5cf6" size="sm" />}
              <div className={cn('max-w-[80%] space-y-2')}>
                <div className={cn('whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft', m.from === 'ai' ? 'rounded-bl-md bg-white text-ink-700' : 'rounded-br-md bg-gradient-to-br from-brand-500 to-violet-600 text-white')}>
                  {m.text}
                </div>
                {m.hop === 'write' && (
                  <Button size="sm" variant="light" onClick={onOpenPost}><ArrowRight className="h-4 w-4" /> Перейти к созданию вакансии</Button>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex items-end gap-2.5">
              <Avatar name="HR" initials="HR" color="#8b5cf6" size="sm" />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.2s' }} />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-brand-400" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-ink-100 bg-white px-4 py-3">
          {QUICK.map((q) => (
            <button key={q.k} onClick={() => send(q.label)} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink-200 bg-ink-50 px-3.5 py-2 text-[13px] font-semibold text-ink-600 transition hover:border-violet-300 hover:text-violet-600">
              <q.icon className="h-3.5 w-3.5" />{q.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 border-t border-ink-100 bg-white p-4">
          <textarea value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()} rows={1} placeholder="Спросите ассистента…" className="max-h-32 flex-1 resize-none rounded-xl border border-ink-200 bg-ink-50 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30" />
          <Button onClick={() => send()} disabled={!value.trim() || typing} className="h-11 w-11 !p-0"><Send className="h-5 w-5" /></Button>
        </div>
      </Card>
    </div>
  );
}

function BadgePulse() {
  return (
    <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-violet-500/12 px-3 py-1.5 text-xs font-bold text-violet-600 md:hidden">
      <Bot className="h-3.5 w-3.5" /> online
    </span>
  );
}