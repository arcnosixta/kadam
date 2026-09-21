import { useEffect, useState } from 'react';
import {
  ArrowRight, Bot, Brain, Building2, CheckCircle2, GraduationCap, HeartHandshake,
  LineChart, MessageSquareText, MonitorSmartphone, Radar, ShieldCheck,
  Sparkles, Target, Users, Zap,
} from 'lucide-react';
import { Button, Logo, cn } from '../components/ui';

const people = ['Айгерім', 'Нурбек', 'Мария', 'Арман', 'Гульмира'];

function Counter({ to, suffix = '', decimals = 0 }) {
  return (
    <span>
      {to.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

export function Landing({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  const [heroTick, setHeroTick] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const t = setInterval(() => setHeroTick((x) => x + 1), 2800);
    return () => { window.removeEventListener('scroll', onScroll); clearInterval(t); };
  }, []);

  const goRole = (role) => onEnter(role, people[heroTick % people.length]);

  return (
    <div className="min-h-screen bg-ink-50 font-sans">
      {/* ======= NAV ======= */}
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-300', scrolled ? 'bg-white/75 shadow-soft backdrop-blur-xl' : 'bg-transparent')}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo className="h-8" />
          <nav className="hidden items-center gap-1 md:flex">
            {[['Возможности', '#features'], ['Как это работает', '#how'], ['Роли', '#roles'], ['Рынок', '#market']].map(([l, h]) => (
              <a key={h} href={h} className="rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 transition hover:text-brand-600">{l}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => goRole('worker')}>Войти</Button>
            <Button size="sm" onClick={() => goRole('worker')}>Начать бесплатно</Button>
          </div>
        </div>
      </header>

      {/* ======= HERO ======= */}
      <section id="home" className="relative overflow-hidden pb-16 pt-28 sm:pt-36">
        <div className="bg-hero absolute inset-0" />
        <div className="bg-grid absolute inset-0" />
        <div className="animate-float absolute -right-24 top-10 h-96 w-96 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="animate-float absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-mint-400/20 blur-3xl" style={{ animationDelay: '1.4s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Left */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-brand-700 shadow-soft backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Первая ИИ-платформа занятости в Центральной Азии
              </div>
              <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl xl:text-[3.6rem]">
                Без работы сегодня — <span className="text-gradient">на пути к труду</span> уже завтра.
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-600">
                Kadam соединяет тех, кто потерял работу, и тех, кто ищет сотрудников. ИИ подбирает вакансии по навыкам, закрывает пробелы обучением и доводит человека до оффера.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={() => goRole('worker')}>
                  Ищу работу <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="light" onClick={() => onEnter('employer', 'ТОО «NurGroup»')}>
                  <Building2 className="h-5 w-5 text-violet-500" /> Нанимаю сотрудников
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-500">
                {['Бесплатно для соискателей', 'Работает 24/7', 'На русском и казахском'].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-mint-500" />{t}</span>
                ))}
              </div>

              {/* Mini stat bar */}
              <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                {[
                  { v: <Counter to={446} suffix=" тыс." />, l: 'ищут работу', d: '-0,1% к прошлому кварталу' },
                  { v: <Counter to={105} suffix=" тыс." />, l: 'открытых вакансий', d: '+25% за месяц' },
                  { v: <Counter to={62} suffix="%" />, l: 'трудоустройств за 90 дней', d: 'через ИИ-сопровождение' },
                ].map((s) => (
                  <div key={s.l} className="rounded-2xl border border-white/60 bg-white/70 p-3.5 shadow-soft backdrop-blur">
                    <p className="font-display text-xl font-extrabold text-ink-900 sm:text-2xl">{s.v}</p>
                    <p className="mt-0.5 text-xs font-medium text-ink-500">{s.l}</p>
                    <p className="mt-1 text-[11px] font-semibold text-mint-600">{s.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: product preview */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="animate-float relative">
                <HeroCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= LOGO STRIP / HOW ======= */}
      <section id="how" className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Как это работает"
            title="Три шага от «потерял работу» до «получил оффер»"
            sub="ИИ ведёт вас за руку на каждом этапе — без дедлайнов и очередей в карьерный центр."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: '01', icon: Bot, title: 'ИИ изучает вас', text: 'Диалог с ИИ-ассистентом за 5 минут строит профиль: навыки, опыт, регион, пожелания. Подходит даже тем, кто впервые ищет работу.' },
              { n: '02', icon: Radar, title: 'ИИ находит и обучает', text: 'Платформа подбирает вакансии с fit-оценкой и сразу видит пробелы в навыках — предлагает бесплатные программы обучения.' },
              { n: '03', icon: HeartHandshake, title: 'ИИ доводит до оффера', text: 'Готовое резюме, сопроводительные письма, тренировка собеседования и трекер откликов — до подписанного договора.' },
            ].map((s, i) => (
              <div key={s.n} className={cn('card group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift', i === 1 && 'md:-mt-4')}>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-extrabold text-ink-100 transition group-hover:text-brand-100">{s.n}</span>
                </div>
                <h3 className="font-display mt-5 text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= FEATURES / AI POWERS ======= */}
      <section id="features" className="relative bg-mesh-dark py-20 text-white">
        <div className="bg-noise absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead dark
            kicker="Возможности ИИ"
            title="Суперсилы платформы"
            sub="Две стороны рынка и аналитик — один мозг."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Target, t: 'Fit-оценка до 99%', d: 'Каждая вакансия получает прозрачный балл совпадения с причиной. Никаких «слепых» откликов.', tag: 'Работнику' },
              { icon: GraduationCap, t: 'Закрытие пробелов', d: 'ИИ находит разницу между вашими навыками и требованиями рынка и предлагает бесплатное обучение.', tag: 'Работнику' },
              { icon: MessageSquareText, t: 'ИИ-собеседование', d: 'Тренажёр с вопросами конкретно под вашу роль, обратной связью и чек-листом подготовки.', tag: 'Работнику' },
              { icon: ShieldCheck, t: 'Скрининг кандидатов', d: 'Работодатель получает ранжированный список с обоснованием решения и вопросами для интервью.', tag: 'Работодателю' },
              { icon: Brain, t: 'Авто-резюме и письма', d: 'Резюме под вакансию и сопроводительное письмо формируются за секунды в вашем голосе.', tag: 'Работнику' },
              { icon: LineChart, t: 'Аналитика рынка', d: 'Тепловая карта безработицы, дефицит профессий и контроль активных мер — для администрации.', tag: 'Администратору' },
            ].map((f, i) => (
              <div key={f.t} className="group glass-dark relative overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
                {i === 0 && <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/30 blur-3xl" />}
                <span className="relative inline-grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15 transition group-hover:bg-brand-500/30">
                  <f.icon className="h-5 w-5" />
                </span>
                <span className="relative mt-4 inline-block rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-200 ring-1 ring-brand-400/20">{f.tag}</span>
                <h3 className="relative mt-2 font-display text-lg font-bold">{f.t}</h3>
                <p className="relative mt-1.5 text-sm leading-relaxed text-ink-300">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======= ROLES ======= */}
      <section id="roles" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Три роли — одна платформа"
            title="Выберите свою точку входа"
            sub="Один аккаунт объединяет соискателей, работодателей и тех, кто отвечает за рынок труда."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <RoleCard
              icon={Users} iconCls="from-brand-500 to-violet-600"
              tag="Для соискателя" title="Ищу работу" points={['Вакансии с fit-оценкой', 'Бесплатное обучение навыкам', 'ИИ-подготовка к собеседованию']}
              cta="Войти как работник" onClick={() => goRole('worker')} featured
            />
            <RoleCard
              icon={Building2} iconCls="from-violet-500 to-fuchsia-600"
              tag="Для бизнеса" title="Нанимаю людей" points={['Пост вакансии за 30 секунд', 'ИИ-сортировка кандидатов', 'Готовые вопросы для интервью']}
              cta="Войти как работодатель" onClick={() => onEnter('employer', 'ТОО «NurGroup»')}
            />
            <RoleCard
              icon={Landmark} iconCls="from-emerald-500 to-teal-600"
              tag="Для структур занятости" title="Управляю рынком" points={['Аналитика по регионам и профессиям', 'Контроль программ занятости', 'Модерация и антифрод']}
              cta="Войти как администратор" onClick={() => onEnter('admin', 'Оператор рынка')}
            />
          </div>
        </div>
      </section>

      {/* ======= MARKET SNAPSHOT ======= */}
      <section id="market" className="relative overflow-hidden py-20">
        <div className="bg-hero absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHead
            kicker="Живые данные рынка"
            title="Куда движется занятость"
            sub="Аналитика собирается из открытых данных и обновляется каждую неделю."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-semibold text-ink-500">Безработица (КЗ, МОТ)</p>
              <div className="mt-3 flex items-end gap-2">
                <p className="font-display text-5xl font-extrabold text-ink-900">4,5<span className="text-2xl">%</span></p>
                <span className="mb-2 rounded-full bg-mint-400/15 px-2.5 py-1 text-xs font-bold text-mint-600">-0,1 п.п.</span>
              </div>
              <div className="mt-4 flex h-24 items-end gap-1.5">
                {[4.6, 4.6, 4.5, 4.6, 4.5, 4.4].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-brand-500/80 to-violet-400" style={{ height: `${v * 13}%` }} />
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-400">Апр · Май · Июн · Июл · Авг · Сен</p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold text-ink-500">Дефицит кадров (топ-5)</p>
              <ul className="mt-4 space-y-3">
                {[['Швея', 79], ['Сварщик', 66], ['Водитель', 23], ['Повар', 28], ['Мед. сестра', 81]].map(([name, gap]) => (
                  <li key={name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink-700">{name}</span>
                      <span className="text-xs font-bold text-rose-600">↗ спрос</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-amber-400" style={{ width: `${100 - gap}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-6">
              <p className="text-sm font-semibold text-ink-500">Вакансии vs резюме (тыс.)</p>
              <div className="mt-4 space-y-4">
                {[['Авг', 131.6, 145.2], ['Сен', 140, 150]].map(([m, v, r]) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="w-10 text-sm font-bold text-ink-500">{m}</span>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2"><div className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-violet-400" style={{ width: `${(v / 150) * 100}%` }} /><span className="text-xs font-semibold text-ink-600">{v}</span></div>
                      <div className="flex items-center gap-2"><div className="h-3 rounded-full bg-gradient-to-r from-mint-400 to-brand-400" style={{ width: `${(r / 150) * 100}%` }} /><span className="text-xs font-semibold text-ink-600">{r}</span></div>
                    </div>
                  </div>
                ))}
                <p className="mt-2 rounded-xl bg-brand-500/8 px-3 py-2 text-xs font-medium text-brand-700">Разрыв спроса и предложения сократился в 2,5 раза с июля по август.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= CTA ======= */}
      <section className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-600 via-brand-500 to-violet-600 p-10 text-center shadow-lift sm:p-16">
            <div className="bg-grid absolute inset-0 opacity-20" />
            <div className="animate-float absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            <div className="relative">
              <Sparkles className="mx-auto h-10 w-10 text-white/90" />
              <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Каждый шаг навстречу работе — это Kadam
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-white/80">
                Бесплатно для тех, кто ищет работу. Прозрачно для работодателей. Полезно для управления рынком труда.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button size="lg" variant="mint" onClick={() => goRole('worker')}>
                  Начать бесплатно <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="light" onClick={() => onEnter('employer', 'ТОО «NurGroup»')}>Нанять первых сотрудников</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= FOOTER ======= */}
      <footer className="border-t border-ink-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <Logo className="h-8" />
              <p className="mt-3 max-w-sm text-sm text-ink-500">ИИ-платформа занятости. Доводим человека из статуса «безработный» до первого рабочего дня.</p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3">
              {[
                ['Продукт', ['Рекомендации', 'Обучение', 'Собеседования']],
                ['Компания', ['О нас', 'Наука о матчинге', 'Careers']],
                ['Помощь', ['Контакты', 'Центры занятости', 'Документы']],
              ].map(([h, items]) => (
                <div key={h}>
                  <p className="font-bold text-ink-800">{h}</p>
                  <ul className="mt-3 space-y-2 text-ink-500">
                    {items.map((i) => <li key={i} className="hover:text-brand-600"><a href="#home">{i}</a></li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-ink-100 pt-6 text-xs text-ink-400 sm:flex-row">
            <p>© 2026 Kadam.ai — прототип. Данные рынка: открытые источники, 2026.</p>
            <p className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-400" /> Работает на ИИ в браузере, ничего не отправляется на сервер</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ kicker, title, sub, dark }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <span className={cn('inline-block rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider', dark ? 'bg-white/10 text-brand-200 ring-1 ring-white/15' : 'bg-brand-500/10 text-brand-600')}>
        {kicker}
      </span>
      <h2 className={cn('font-display mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl', dark ? 'text-white' : 'text-ink-900')}>{title}</h2>
      <p className={cn('mt-4 text-lg leading-relaxed', dark ? 'text-ink-300' : 'text-ink-500')}>{sub}</p>
    </div>
  );
}

function RoleCard({ icon: Icon, iconCls, tag, title, points, cta, onClick, featured }) {
  return (
    <div className={cn('card group relative p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift', featured && 'ring-2 ring-brand-500/60')}>
      {featured && <span className="absolute right-5 top-5 rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] font-bold text-brand-600">Популярно</span>}
      <span className={cn('inline-grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-glow', iconCls)}>
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink-400">{tag}</p>
      <h3 className="font-display mt-1 text-2xl font-extrabold text-ink-900">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-ink-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-mint-500" />{p}
          </li>
        ))}
      </ul>
      <Button size="md" className="mt-6 w-full" variant={featured ? 'primary' : 'light'} onClick={onClick}>
        {cta} <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative">
      {/* Glow behind */}
      <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-brand-500/25 to-violet-500/25 blur-2xl" />
      {/* Main card */}
      <div className="glass relative rounded-[2rem] p-5 shadow-lift">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow"><Sparkles className="h-5 w-5" /></span>
            <div>
              <p className="font-display text-sm font-extrabold text-ink-900">Айла, ИИ-помощник</p>
              <p className="text-xs text-ink-500">нашла 5 новых вакансий</p>
            </div>
          </div>
          <span className="rounded-full bg-mint-400/15 px-2.5 py-1 text-[11px] font-bold text-mint-600">Online</span>
        </div>

        <div className="relative mt-4 space-y-2.5 rounded-2xl bg-white/70 p-3.5 text-sm text-ink-700">
          <p className="relative pl-4"><span className="absolute left-0 top-0 h-full w-1 rounded bg-brand-500/40" /> «Здравствуйте, Айгерім! Я проанализировала ваш профиль и вижу сильную связку навыков для роли «Бухгалтер». Есть 3 вакансии с вероятностью оффера выше 80%. Начнём с резюме?»</p>
        </div>

        <div className="mt-4 grid gap-2.5">
          {[
            { t: 'Ассистент бухгалтера · Алматы', s: '92%', c: 'text-brand-600', w: '92%' },
            { t: 'Бухгалтер первички · Астана', s: '84%', c: 'text-violet-600', w: '84%' },
            { t: 'Младший финансист · удалённо', s: '71%', c: 'text-mint-600', w: '71%' },
          ].map((m) => (
            <div key={m.t} className="rounded-2xl border border-ink-200/60 bg-white p-3.5 shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-ink-800">{m.t}</p>
                <span className={cn('font-display shrink-0 text-sm font-extrabold', m.c)}>{m.s}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500" style={{ width: m.w }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating chips */}
      <div className="animate-float absolute -left-10 top-16 hidden rounded-2xl glass px-4 py-3 shadow-lift sm:block" style={{ animationDelay: '0.8s' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-mint-400/15 text-mint-600"><GraduationCap className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-bold text-ink-800">Курс «1С: Бухгалтерия»</p>
            <p className="text-[11px] text-mint-600">Бесплатно · гос. грант</p>
          </div>
        </div>
      </div>
      <div className="animate-float absolute -right-8 bottom-24 hidden rounded-2xl glass px-4 py-3 shadow-lift sm:block" style={{ animationDelay: '1.6s' }}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500/12 text-brand-600"><Target className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-bold text-ink-800">ИИ-собеседование</p>
            <p className="text-[11px] text-ink-400">готово к тренировке</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landmark({ className, ...p }) {
  return <MonitorSmartphone className={className} {...p} />;
}