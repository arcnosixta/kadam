import React from 'react';

export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

// ---------- Logo ----------
export function Logo({ className = 'h-9', dark = false, withText = true }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-glow">
        <svg viewBox="0 0 64 64" className="h-5 w-5" aria-hidden>
          <path d="M20 44 V27 l8 6 8-12 8 16v7" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="49" cy="18" r="6" fill="#34d399" />
        </svg>
      </span>
      {withText && (
        <span className={cn('font-display text-[1.35rem] font-extrabold tracking-tight', dark ? 'text-white' : 'text-ink-900')}>
          Kadam
          <span className="text-gradient-mint">.ai</span>
        </span>
      )}
    </span>
  );
}

// ---------- Button ----------
const BTN_VARIANTS = {
  primary: 'bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow hover:from-brand-600 hover:to-violet-700 active:scale-[0.98]',
  mint: 'bg-gradient-to-br from-mint-500 to-brand-500 text-white shadow-glow hover:brightness-105 active:scale-[0.98]',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 active:scale-[0.98]',
  light: 'bg-white text-ink-800 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 active:scale-[0.98]',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  danger: 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100',
};
const BTN_SIZES = { sm: 'h-9 px-3.5 text-sm', md: 'h-11 px-5 text-sm', lg: 'h-12 px-6 text-base' };

export function Button({ variant = 'primary', size = 'md', className, children, ...props }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-ring disabled:pointer-events-none disabled:opacity-50',
        BTN_VARIANTS[variant], BTN_SIZES[size], className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ---------- Badge ----------
const BADGE_TONES = {
  mint: 'bg-mint-400/15 text-mint-600 ring-mint-500/20',
  brand: 'bg-brand-500/12 text-brand-700 ring-brand-500/20',
  violet: 'bg-violet-500/12 text-violet-700 ring-violet-500/20',
  amber: 'bg-amber-400/15 text-amber-700 ring-amber-500/25',
  rose: 'bg-rose-500/12 text-rose-700 ring-rose-500/20',
  sky: 'bg-sky-500/12 text-sky-700 ring-sky-500/20',
  slate: 'bg-ink-100 text-ink-600 ring-ink-300/40',
  dark: 'bg-ink-900 text-white',
};
export function Badge({ tone = 'slate', className, children, ...props }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset', BADGE_TONES[tone], className)} {...props}>
      {children}
    </span>
  );
}

// ---------- Card ----------
export function Card({ className, children, hover = false, ...props }) {
  return (
    <div className={cn('card relative overflow-hidden transition-all duration-200', hover && 'hover:-translate-y-0.5 hover:shadow-lift', className)} {...props}>
      {children}
    </div>
  );
}

// ---------- Stat ----------
export function Stat({ label, value, delta, icon: Icon, tone = 'brand' }) {
  const deltas = { up: 'text-mint-600', down: 'text-rose-600', flat: 'text-ink-500' };
  const iconBg = { brand: 'bg-brand-500/12 text-brand-600', mint: 'bg-mint-400/15 text-mint-600', violet: 'bg-violet-500/12 text-violet-600', amber: 'bg-amber-400/15 text-amber-600', sky: 'bg-sky-500/12 text-sky-600', rose: 'bg-rose-500/12 text-rose-600' };
  return (
    <Card className="flex items-center gap-4 p-5">
      {Icon && (
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', iconBg[tone])}>
          <Icon className="h-6 w-6" strokeWidth={2} />
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-ink-500">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="font-display text-2xl font-extrabold tracking-tight text-ink-900">{value}</p>
          {delta && <p className={cn('text-sm font-semibold', deltas[delta.dir])}>{delta.text}</p>}
        </div>
      </div>
    </Card>
  );
}

// ---------- Progress ----------
export function Progress({ value, className, barClass, size = 'md' }) {
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className={cn('w-full overflow-hidden rounded-full bg-ink-100', h, className)}>
      <div
        className={cn('h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-700', barClass)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

// ---------- Progress ring ----------
export function ProgressRing({ value, size = 96, stroke = 9, label, sub, color = '#6366f1' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const [id] = React.useState(() => `rg-${Math.random().toString(36).slice(2, 8)}`);
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor={color === '#10b981' ? '#34d399' : '#8b5cf6'} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-ink-100)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display font-extrabold leading-none" style={{ fontSize: size / 4.6 }}>
            {label ?? `${value}%`}
          </div>
          {sub && <div className="mt-1 text-[11px] font-medium text-ink-500">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

// ---------- Avatar ----------
export function Avatar({ initials, name, color = '#6366f1', size = 'md' }) {
  const map = { sm: 'h-8 w-8 text-[10px]', md: 'h-10 w-10 text-xs', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-2xl' };
  return (
    <span
      title={name}
      className={cn('inline-grid shrink-0 select-none place-items-center rounded-full font-display font-bold text-white shadow-inner', map[size])}
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
    >
      {initials}
    </span>
  );
}

// ---------- Modal ----------
export function Modal({ open, onClose, children, className, wide = false }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('glass relative z-10 w-full overflow-hidden rounded-3xl shadow-lift', wide ? 'max-w-3xl' : 'max-w-lg', className)}>
        {children}
      </div>
    </div>
  );
}

// ---------- Tabs ----------
export function Tabs({ items, value, onChange, className }) {
  return (
    <div className={cn('inline-flex flex-wrap gap-1 rounded-2xl bg-ink-100 p-1', className)}>
      {items.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all focus-ring',
            value === t.value ? 'bg-white text-ink-900 shadow-soft' : 'text-ink-500 hover:text-ink-800'
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Segmented ----------
export function Segmented({ options, value, onChange, className }) {
  return (
    <div className={cn('inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all focus-ring',
            value === o.value ? 'bg-brand-500 text-white shadow-soft' : 'text-ink-500 hover:text-ink-800'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------- Form helpers ----------
export function Field({ label, hint, children, className }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[13px] font-semibold text-ink-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={cn(
        'h-11 w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 shadow-soft outline-none transition',
        'placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30',
        props.className
      )}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-xl border border-ink-200 bg-white px-3.5 py-3 text-sm text-ink-900 shadow-soft outline-none transition',
        'placeholder:text-ink-400 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30',
        props.className
      )}
    />
  );
}

export function Select(props) {
  return (
    <select
      {...props}
      className={cn(
        'h-11 w-full appearance-none rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 shadow-soft outline-none transition',
        'focus:border-brand-400 focus:ring-2 focus:ring-brand-500/30', props.className
      )}
    />
  );
}

// ---------- Spinner ----------
export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={cn('animate-spin text-brand-500', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" />
    </svg>
  );
}

// ---------- Empty state ----------
export function Empty({ icon: Icon, title, text, children }) {
  return (
    <div className="grid place-items-center gap-3 py-14 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink-100 text-ink-400">
        <Icon className="h-7 w-7" />
      </span>
      <div>
        <p className="font-display text-base font-bold text-ink-800">{title}</p>
        {text && <p className="mt-1 max-w-sm text-sm text-ink-500">{text}</p>}
      </div>
      {children}
    </div>
  );
}

// ---------- Chip (selectable skill/tag) ----------
export function Chip({ active, onClick, children, tone = 'brand' }) {
  const activeCls = {
    brand: 'border-brand-400 bg-brand-500/10 text-brand-700',
    slate: 'border-ink-300 bg-ink-100 text-ink-700',
    mint: 'border-mint-500/50 bg-mint-400/10 text-mint-600',
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-all focus-ring',
        active ? activeCls[tone] : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300 hover:text-ink-700'
      )}
    >
      {children}
    </button>
  );
}