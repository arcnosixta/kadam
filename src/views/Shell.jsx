import { useState } from 'react';
import { Bell, LogOut, Sparkles, Search } from 'lucide-react';
import { Avatar, Logo, cn, Badge } from '../components/ui';

const ROLE_META = {
  worker: { label: 'Работник', tone: 'brand' },
  employer: { label: 'Работодатель', tone: 'violet' },
  admin: { label: 'Администратор', tone: 'dark' },
};

export function Shell({ user, nav, active, onNav, onExit, children, header, loading = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const meta = ROLE_META[user.role];

  const badge = (
    <Badge tone={meta.tone} className="ml-1">{meta.label}</Badge>
  );

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Sidebar */}
      <aside className={cn('fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col bg-white/90 backdrop-blur-xl border-r border-ink-200/70 transition-transform lg:static lg:translate-x-0', mobileOpen ? 'translate-x-0' : '-translate-x-full')}>
        <div className="flex h-16 items-center justify-between border-b border-ink-100 px-5">
          <Logo className="h-8" />
          <button className="lg:hidden text-ink-400" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <nav className="nice-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {nav.map((item) => {
            const Active = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNav(item.id); setMobileOpen(false); }}
                className={cn(
                  'group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all focus-ring',
                  Active ? 'bg-gradient-to-r from-brand-500/12 to-violet-500/8 text-brand-700' : 'text-ink-500 hover:bg-ink-100 hover:text-ink-800'
                )}
              >
                <item.icon className={cn('h-5 w-5 transition-colors', Active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600')} strokeWidth={Active ? 2.2 : 1.8} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold text-white">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-ink-50">
            <Avatar name={user.name} initials={user.initials ?? user.name.slice(0, 2).toUpperCase()} color={user.color ?? '#6366f1'} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink-900">{user.name}</p>
              <p className="truncate text-xs text-ink-400">{meta.label}</p>
            </div>
          </div>
          <button onClick={onExit} className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-ink-400 transition hover:bg-rose-50 hover:text-rose-600">
            <LogOut className="h-4 w-4" /> Выйти на главную
          </button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-ink-200/60 bg-ink-50/80 px-4 backdrop-blur-xl sm:px-6">
          <button className="text-ink-500 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Открыть меню">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div className="hidden md:block">{badge}</div>
          <div className="ml-auto flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-xl border border-ink-200 bg-white text-ink-500 transition hover:text-brand-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>
            <button className="hidden h-10 items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-400 transition hover:text-ink-700 sm:flex">
              <Search className="h-4 w-4" /> Быстрый поиск...
              <kbd className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold text-ink-400">⌘K</kbd>
            </button>
            {header}
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid h-[60vh] place-items-center">
              <div className="text-center">
                <svg className="mx-auto h-8 w-8 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
                </svg>
                <p className="mt-3 text-sm font-semibold text-ink-500">Загружаем данные из Supabase…</p>
              </div>
            </div>
          ) : children}
        </main>
      </div>
    </div>
  );
}

// Кнопка «ИИ-помощник» на подобие лаунчера
export function AiLauncher({ onClick, label = 'ИИ-ассистент', pulse = true }) {
  return (
    <button onClick={onClick} className="group sticky bottom-5 z-30 mr-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-500 to-violet-600 px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110">
      <Sparkles className={cn('h-5 w-5', pulse && 'animate-pulse-soft')} />
      {label}
    </button>
  );
}