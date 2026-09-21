import { JOBS, WORKERS } from '../data/jobs';
import { normalizeSkill } from '../data/skills';
import { PROGRAMS } from '../data/stats';

export const DEMO_WORKER = {
  id: 'me', name: 'Айгерім Серікбол', initials: 'АС', age: 28, region: 'Алматы', status: 'unemployed', months: 1.5,
  desiredRole: 'Бухгалтер / ассистент', bio: 'Выпускница экономического факультета, 2 года вела учёт в семейном бизнесе.',
  skills: ['бухгалтерия', '1c', 'excel', 'word'], years: 2, education: 'Высшее (экономика)',
  languages: ['Казахский', 'Русский'], salaryExpect: 350000, format: 'office',
  phone: '+7 (7**) ***-**-34', email: 'aigerim@mail.kz', avatarColor: '#6366f1',
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const norm = (v) => String(v ?? '').trim().toLowerCase();
const fmtMoney = (v, cur = 'KZT') =>
  v >= 1000 ? `${Math.round(v / 1000)} ${cur === 'KGS' ? 'тыс. сомов' : 'тыс. ₸'}` : `${v} ${cur}`;

const LEVEL_WEIGHT = { any: 1, junior: 0.9, middle: 0.75, senior: 0.6 };

// ---------- ИИ-матчинг ----------
export function matchJob(job, p = DEMO_WORKER) {
  const need = job.skills.map(normalizeSkill);
  const have = p.skills.map(normalizeSkill);
  const hit = have.filter((s) => need.includes(s));
  const skillsCover = need.length ? hit.length / need.length : 1;

  const salaryOk = job.salaryFrom <= p.salaryExpect * 1.25 || job.salaryTo >= p.salaryExpect;
  const salaryScore = salaryOk ? 1 : 0.4;

  const regionScore = job.region === p.region ? 1 : 0.55;
  const remoteOk = job.format === 'remote' || job.format === 'hybrid' || p.format !== 'remote';
  const formatScore = remoteOk ? 1 : 0.5;
  const levelScore = LEVEL_WEIGHT[job.level] ?? 0.85;
  const expFit = job.level === 'junior' || job.level === 'any' ? 1 : clamp(p.years / (job.level === 'middle' ? 3 : 5), 0.4, 1);

  const weights = { skills: 0.48, salary: 0.18, region: 0.12, format: 0.1, level: 0.07, exp: 0.05 };
  const score = Math.round(
    skillsCover * weights.skills +
    salaryScore * weights.salary +
    regionScore * weights.region +
    formatScore * weights.format +
    levelScore * weights.level +
    expFit * weights.exp
  ) * 100;

  const missing = need.filter((s) => !have.includes(s));
  const verdict = score >= 86 ? 'Отличное совпадение' : score >= 72 ? 'Хорошее совпадение' : score >= 55 ? 'Стоит попробовать' : 'Низкое совпадение';

  return {
    score: clamp(score, 8, 99),
    skillsCover: Math.round(skillsCover * 100),
    hit, missing, verdict,
    reasons: [
      hit.length ? `Совпадает ключевых навыков: ${hit.join(', ')}` : 'Прямых совпадений навыков пока мало',
      salaryOk ? `Зарплата в рамках ожиданий (${fmtMoney(job.salaryFrom, job.currency)}–${fmtMoney(job.salaryTo, job.currency)})` : 'Зарплата ниже ожидаемой',
      regionScore === 1 ? `Работа в вашем регионе — ${job.region}` : `Вакансия в регионе ${job.region}, потребуется переезд «${job.region}»`,
      missing.length ? `Требуются навыки, которых нет: ${missing.join(', ')}` : 'Навыки полностью закрывают требования',
    ],
  };
}

export function rankedMatches(p = DEMO_WORKER, jobs = JOBS) {
  return jobs.map((j) => ({ ...j, match: matchJob(j, p) })).sort((a, b) => b.match.score - a.match.score);
}

// ---------- Анализ соответствия (человеческим языком) ----------
export function fitAnalysis(job, p = DEMO_WORKER) {
  const r = matchJob(job, p);
  const strengths = r.hit.map((s) => `— ${s}: подтверждено вашим опытом`).join('\n');
  const gaps = r.missing.length
    ? r.missing.map((s) => `— ${s}: закрыть можно за 2–4 недели обучения`).join('\n')
    : 'Все обязательные навыки закрыты.';
  const advice =
    r.score >= 72
      ? 'Рекомендуем откликнуться уже сейчас: вы проходите первичный фильтр. Подготовьте 2–3 истории достижений по ключевым навыкам.'
      : 'Рекомендуем сначала закрыть пробелы в навыках через программы обучения, затем откликнуться — шансы вырастут на ~30–40%.';
  return {
    verdict: r.verdict, score: r.score,
    overview: `${job.title} в ${job.company} запрашивает: ${job.skills.join(', ')}. Ваш профиль закрывает ${r.skillsCover}% требований.`,
    strengths,
    gaps,
    advice,
  };
}

// ---------- Резюме ----------
export function buildResume(p = DEMO_WORKER, target) {
  const skills = p.skills.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' · ');
  const years = p.years === 0 ? 'Начинающий специалист' : `Опыт работы: ${p.years} ${p.years === 1 ? 'год' : p.years < 5 ? 'года' : 'лет'}`;
  return {
    name: p.name, role: p.desiredRole, contact: { phone: p.phone, email: p.email, region: p.region },
    summary: `${p.bio} Ищу ${target ? `позицию «${target.title}»` : 'работу по специальности'}. Готов(а) к обучению и быстрому включению в задачи.`,
    skills, education: p.education, languages: p.languages.join(', '), years,
    highlights: [
      `Владею: ${p.skills.join(', ')}`,
      p.years >= 2 ? 'Подтверждённый опыт в задачах реального бизнеса' : 'Высокая обучаемость, готовность к стажировке',
      `Зарплатные ожидания: ${fmtMoney(p.salaryExpect)}`,
    ],
  };
}

// ---------- Сопроводительное письмо ----------
export function coverLetter(job, p = DEMO_WORKER) {
  const r = matchJob(job, p);
  const top = r.hit.slice(0, 2).join(' и ');
  return {
    subject: `Отклик на вакансию «${job.title}» — ${p.name}`,
    greeting: `Здравствуйте, команда ${job.company}!`,
    body: [
      `Меня зовут ${p.name}. Узнала о вакансии «${job.title}» через платформу Kadam, и она полностью совпадает с моей карьерной целью — развиваться в направлении ${p.desiredRole}.`,
      p.years >= 1
        ? `У меня ${p.years} ${p.years === 1 ? 'год' : 'года'} опыта в этой сфере. Ключевые сильные стороны: ${top}. Я привык(ла) доводить задачи до результата и быстро встраиваться в процессы.`
        : 'Я делаю первые шаги в профессии, но это компенсирую высокой скоростью обучения и вниманием к деталям. Уже освоил(а): ' + (p.skills.join(', ')) + '.',
      `Особенно привлекает то, что ${job.description.slice(0, 90)}…`,
      'Буду рада(а) обсудить, чем могу быть полезна(ен) компании. Заранее благодарю за уделённое время.',
    ],
    sign: `С уважением,\n${p.name}\n${p.phone} · ${p.email}`,
  };
}

// ---------- Анализ пробелов навыков + план обучения ----------
const DEMAND_BY_ROLE = {
  'швея': ['швейное дело', 'сборка'],
  'повар': ['кулинария', 'общепит'],
  'водитель': ['вождение'],
  'сварщик': ['сварка'],
  'продавец': ['кассы', 'продажи', 'коммуникации'],
  'бухгалтер': ['бухгалтерия', '1c', 'excel'],
  'медицинская сестра': ['медсестра'],
  'оператор линии': ['сборка', 'интернет'],
  'смм': ['маркетинг', 'контент', 'дизайн'],
  'дизайнер': ['дизайн', 'интернет'],
  'курьер': ['вождение'],
  'официант': ['общепит'],
  'разнорабочий': ['строительство'],
};

export function demandScore(skill) {
  const s = normalizeSkill(skill);
  const map = {
    'сварка': 96, 'медсестра': 94, 'швейное дело': 92, 'вождение': 90, 'кассы': 78,
    'кулинария': 84, 'сборка': 82, '1c': 86, 'бухгалтерия': 80, 'строительство': 88,
    'продажи': 76, 'общепит': 74, 'телефония': 70, 'excel': 82, 'word': 66, 'интернет': 78,
    'маркетинг': 72, 'контент': 68, 'дизайн': 64, 'коммуникации': 60, 'менеджмент': 62,
  };
  return map[s] ?? 50;
}

export function skillGapReport(p = DEMO_WORKER) {
  const have = p.skills.map(normalizeSkill);
  const role = Object.keys(DEMAND_BY_ROLE).find((k) => norm(p.desiredRole).includes(k));
  const needed = role ? DEMAND_BY_ROLE[role] : [];
  const missing = needed.filter((s) => !have.includes(s));
  const profGood = have.map((s) => ({ skill: s, demand: demandScore(s) }));
  const weakest = [...profGood].sort((a, b) => a.demand - b.demand).slice(0, 3);
  const progRecommend = PROGRAMS.filter((pr) => pr.skills.some((s) => missing.includes(normalizeSkill(s)) || have.includes(normalizeSkill(s)))).slice(0, 3);
  return {
    coverage: Math.max(0, Math.round((1 - (missing.length / Math.max(needed.length, 1))) * 100)),
    missing, needed, weakest, programs: progRecommend,
    summary: role
      ? `Для профессии «${role}» вам нужно ещё освоить: ${missing.length ? missing.join(', ') : 'ничего — вы готовы'}. Рынок высоко ценит навыки ${needed.join(', ')}.`
      : `Укрепите навыки, которые больше всего ценятся рынком: ${weakest.map((w) => w.skill).join(', ')}. Это расширит число подходящих вакансий.`,
  };
}

// ---------- Подготовка к собеседованию ----------
const QUESTION_BANK = {
  'продажи': ['Приведите пример, как вы продали товар прохожему. Что именно сделали?', 'Как вы поступите, если клиент злится?', 'Какие 3 аргумента первыми назовёте за наш продукт?'],
  'сварка': ['Какие виды сварки вам знакомы?', 'Как ведёте контроль качества шва?', 'Что сделаете при дефекте на сварном шве?'],
  'бухгалтерия': ['Как выгружаете остатки из 1С?', 'Что такое авансовый отчёт и как его провести?', 'Как проверите, что первичка сходится с контрагентами?'],
  'вождение': ['Какой был максимальный суточный пробег?', 'Как оцените состояние авто перед выездом?', 'Что важнее: скорость доставки или её безопасность?'],
  'швейное дело': ['С какими тканями работали?', 'Как выдерживаете нормы выработки при сохранении качества?', 'Как устраните брак в шве?'],
  'smm': ['Какие метрики ведёте для постов?', 'Расскажите про кейс, где привлекли подписчиков.', 'Как отреагируете на негативный комментарий?'],
  default: ['Расскажите о себе за 2 минуты.', 'Почему заинтересовала эта роль?', 'Какие задачи делаете лучше всего?', 'Почему мы должны выбрать вас?'],
};

export function interviewPrep(job, p = DEMO_WORKER) {
  const qs = QUESTION_BANK[norm(job.title).includes('продаж') || norm(p.desiredRole).includes('продаж') ? 'продажи' :
    norm(p.desiredRole).includes('бухгалтер') ? 'бухгалтерия' :
    norm(p.desiredRole).includes('свар') ? 'сварка' :
    norm(p.desiredRole).includes('водитель') ? 'вождение' :
    norm(p.desiredRole).includes('шве') ? 'швейное дело' :
    norm(p.desiredRole).includes('смм') || norm(p.desiredRole).includes('маркетинг') ? 'smm' : 'default'];
  return {
    company: `${job.company} · ${job.region}`,
    role: job.title,
    checklist: [
      'Изучите 3 недавних новости о компании',
      `Подготовьте ответ «почему ${job.title}» с акцентом на ваши сильные навыки: ${p.skills.slice(0, 3).join(', ')}`,
      'Подготовьте 2 конкретных примера достижений (СТАР-структура)',
      'Оденьтесь по стандарту компании: уточнить при звонке',
      'Подготовьте 2–3 вопроса работодателю (зарплата, график, задачи на первый месяц)',
    ],
    questions: qs,
    tip: 'Отвечайте по структуре: ситуация → действие → результат. Держите ответы в пределах 60–90 секунд.',
  };
}

// ---------- ИИ-ассистент (чат) ----------
const CHAT_INTENTS = [
  { keys: ['привет', 'здравств', 'добрый'], reply: 'Здравствуйте! Я Айла, ИИ-помощник Kadam. Подскажу, как найти работу, обновить резюме, освоить профессию и подготовиться к собеседованию. Что вас интересует?' },
  { keys: ['резюме', 'cv', 'св'], reply: 'У вас уже есть базовое резюме. Сейчас могу: 1) собрать резюме под конкретную вакансию, 2) повысить «проходимость» на 20–30%, 3) проверить на ошибки. Начнём с подбора под вакансию?' },
  { keys: ['собесед', 'интервью', 'зададут'], reply: 'Отличный план! Могу сгенерировать вопросы, которые, скорее всего, зададут, и дать чек-лист подготовки. В вашем направлении #{role} чаще всего спрашивают о конкретных кейсах.' },
  { keys: ['обуч', 'курс', 'науч', 'освоить', 'переобуч'], reply: 'В каталоге Kadam есть бесплатные программы: швея, сварщик, оператор ЭВМ, SMM и другие. Могу подобрать программу под ваш профиль за 10 секунд.' },
  { keys: ['ваканс', 'работа', 'найти работу', 'искать'], reply: 'Я уже подобрал(а) для вас 5 лучших вакансий с fit-оценкой. Зайдите в раздел «Мои рекомендации». Совет: откликайтесь на позиции с оценкой выше 75% — там шанс на интервью существенно выше.' },
  { keys: ['зарплат', 'деньг', 'оплат'], reply: 'По вашему профилю медианная зарплата в вашем регионе — около #{salary}. Советую указывать вилку, а не конкретное число: так переговоры проходят легче.' },
  { keys: ['спасибо', 'благодар'], reply: 'Рада помочь! Помните: Kadam сопровождает вас до оффера. Мы вместе пройдём весь путь. Удачи!' },
  { keys: ['пособ', 'статус', 'безработн', 'центр занятости'], reply: 'Могу подсказать, как получить статус безработного и пособие: нужно обратиться в карьерный центр (бывший центр занятости) по месту жительства. При себе: удостоверение личности, при наличии — трудовая книжка.' },
  { keys: ['свой бизнес', 'ип', 'бизнес'], reply: 'Если хотите работать на себя — есть программа «Основы предпринимательства» (бесплатно, онлайн). После обучения помогу оформить ИП и посчитать первые 3 месяца.' },
];

export function chatReply(input, context = {}) {
  const text = norm(input);
  const found = CHAT_INTENTS.find((i) => i.keys.some((k) => text.includes(k)));
  if (found) {
    return found.reply
      .replace('#{role}', context.role ?? 'вашем направлении')
      .replace('#{salary}', context.salary ?? fmtMoney(DEMO_WORKER.salaryExpect));
  }
  return 'Я лучше всего помогаю в четырёх вещах: поиск вакансий, резюме, обучение и собеседования. Переформулируйте вопрос, например: «как обновить резюме?»';
}

// ---------- Сторона работодателя ----------
export function screenCandidate(candidate, job) {
  const need = job.skills.map(normalizeSkill);
  const have = candidate.skills.map(normalizeSkill);
  const hit = have.filter((s) => need.includes(s));
  const missing = need.filter((s) => !have.includes(s));
  const cover = need.length ? hit.length / need.length : 1;
  const expScore = candidate.years >= (job.level === 'middle' ? 2 : job.level === 'senior' ? 4 : 1) ? 1 : 0.5;
  const regionScore = candidate.region === job.region ? 1 : 0.7;
  const score = Math.round(clamp((cover * 0.6 + expScore * 0.25 + regionScore * 0.15), 0, 1) * 100);
  const fitLabel = score >= 80 ? 'Рекомендуется к собеседованию' : score >= 60 ? 'Достоин рассмотрения' : 'Средний кандидат';
  return {
    score, hit, missing, fitLabel,
    summary: `${candidate.name} — ${candidate.years} ${candidate.years === 1 ? 'год' : 'года'} опыта, ключевые навыки: ${candidate.skills.join(', ')}.`,
    questions: missing.length
      ? [`Готовы ли вы закрыть пробел в «${missing[0]}» в первые 2 месяца? Как планируете?`]
      : ['Готовы ли вы приступить с понедельника?'],
  };
}

export function jobDescriptionAssistant(input) {
  const s = norm(input);
  const hasFull = /полный|full|5\/2/.test(s);
  const hasRemote = /удален|remote|гибрид/.test(s);
  const hasShift = /сменн|2\/2/.test(s);
  return [
    `Обязанности: выполнение задач по направлению (уточните технологическую карту); работа строго по регламентам компании; качество и сроки — в приоритете.`,
    `Требования: ${hasFull ? 'график 5/2' : hasShift ? 'сменный график 2/2' : 'гибкий график'}; ${hasRemote ? 'работа в гибридном/удалённом формате' : 'работа на площадке работодателя'}${input ? `; ${input}` : ''}.`,
    'Условия: официальное оформление, стабильные выплаты 2 раза в месяц, обучение за счёт компании, ДМС после испытательного срока.',
    'Отклик: нажмите «Откликнуться на Kadam» — заявка мгновенно попадёт HR и ИИ подготовит краткую справку о кандидате.',
  ];
}

export const fmt = { money: fmtMoney, clamp, norm };
export const getJob = (id) => JOBS.find((j) => j.id === Number(id)) || JOBS[0];
export const getWorker = (id) => WORKERS.find((w) => w.id === id) || WORKERS[0];