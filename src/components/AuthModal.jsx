import { useState } from 'react';
import { Building2, LogIn, MonitorSmartphone, Sparkles, UserPlus, Users, X } from 'lucide-react';
import { auth, roleLabel } from '../lib/auth';
import { Button, Field, Input, Modal, Spinner, cn } from './ui';

const ROLES = {
  worker: { icon: Users, title: 'Соискатель', tag: 'Ищу работу', color: 'from-brand-500 to-violet-600' },
  employer: { icon: Building2, title: 'Работодатель', tag: 'Нанимаю людей', color: 'from-violet-500 to-fuchsia-600' },
  admin: { icon: MonitorSmartphone, title: 'Структуры занятости', tag: 'Управляю рынком', color: 'from-emerald-500 to-teal-600' },
};

export function AuthModal({ role, onClose, onEnter, onDemo }) {
  const cfg = ROLES[role] ?? ROLES.worker;
  const [tab, setTab] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      if (tab === 'signin') {
        const res = await auth.signIn(email, password);
        if (res.session) onEnter(res.session);
        else setNotice('Сессия не создана. Проверьте e-mail и пароль.');
      } else if (tab === 'signup') {
        const res = await auth.signUp(email, password, { role, name });
        if (res.session) onEnter(res.session);
        else setNotice('Проверьте почту: отправлена ссылка для активации аккаунта. После подтверждения — вернитесь и войдите.');
      } else {
        const res = await auth.signInMagic(email);
        if (res.needConfirmation) setNotice('Ссылка для входа отправлена на почту. Откройте её, чтобы продолжить.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const demoEnter = () => {
    const demoName = role === 'worker' ? 'Айгерім' : role === 'employer' ? 'ТОО «NurGroup»' : 'Оператор рынка';
    onDemo(role, demoName);
  };

  const tabs = role === 'admin' ? [['signin', 'Вход']] : [['signin', 'Вход'], ['signup', 'Регистрация'], ['magic', 'Ссылка на почту']];

  return (
    <Modal open onClose={onClose}>
      <div className="p-6 sm:p-8">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl bg-ink-100 text-ink-500 transition hover:bg-ink-200">
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-4">
          <span className={cn('grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow', cfg.color)}>
            <cfg.icon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900">{cfg.title}</h2>
            <p className="text-sm text-ink-500">{cfg.tag}</p>
          </div>
        </div>

        {!auth.isReady() ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-amber-400/12 p-4 text-sm text-amber-800 ring-1 ring-amber-500/20">
              Бэкенд ещё не настроен: пропущены один или оба пункта — <code className="font-mono">VITE_SUPABASE_URL</code> / <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>. Доступен только демо-режим.
            </div>
            <Button className="w-full" onClick={demoEnter}>
              <Sparkles className="h-4 w-4" /> Продолжить в демо-режиме
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="flex gap-1 rounded-2xl bg-ink-100 p-1">
              {tabs.map(([v, l]) => (
                <button type="button" key={v} onClick={() => { setTab(v); setError(null); setNotice(null); }}
                  className={cn('flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition', tab === v ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500 hover:text-ink-800')}>
                  {l}
                </button>
              ))}
            </div>

            {tab === 'signup' && (
              <Field label={role === 'employer' ? 'Название компании' : 'Как вас зовут'}>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'employer' ? 'ТОО «NurGroup»' : 'Айгерім Серікбол'} required autoFocus />
              </Field>
            )}
            <Field label="E-mail">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.kz" required autoFocus={tab !== 'signup'} />
            </Field>
            {tab !== 'magic' && (
              <Field label="Пароль" hint={tab === 'signup' ? 'Минимум 6 символов' : undefined}>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
              </Field>
            )}

            {error && <p className="rounded-xl bg-rose-500/10 px-3.5 py-2.5 text-sm font-semibold text-rose-700">{error}</p>}
            {notice && <p className="rounded-xl bg-mint-400/15 px-3.5 py-2.5 text-sm font-semibold text-mint-700">{notice}</p>}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Spinner className="h-4 w-4 text-white" /> : tab === 'signup' ? <><UserPlus className="h-4 w-4" /> Создать аккаунт как {roleLabel(role)}</> : tab === 'magic' ? <><LogIn className="h-4 w-4" /> Отправить ссылку</> : <><LogIn className="h-4 w-4" /> Войти как {roleLabel(role)}</>}
            </Button>

            {role === 'admin' && tab === 'signin' && (
              <p className="text-center text-xs text-ink-400">Аккаунты «Структуры занятости» создаются вручную — напишите нам, и мы выдадим доступ.</p>
            )}

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-ink-200" />
              <span className="text-xs font-semibold text-ink-400">или</span>
              <span className="h-px flex-1 bg-ink-200" />
            </div>
            <Button type="button" variant="light" className="w-full" onClick={demoEnter}>
              <Sparkles className="h-4 w-4 text-brand-500" /> Смотреть демо без аккаунта
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}