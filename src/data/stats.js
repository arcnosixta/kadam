// Аналитические данные рынка труда (на основе открытых данных КЗ/КР 2026)
export const MARKET_STATS = {
  countries: {
    'KZ': {
      name: 'Казахстан', population: 20.1, laborForce: 9844, employed: 9399, unemployed: 446, unemplRate: 4.5,
      youthUnempl: 2.9, vacancies: 105.9, resumes: 1022, avgSalary: 476, currency: 'KZT', scale: 'тыс.',
    },
    'KG': {
      name: 'Кыргызстан', population: 7.4, laborForce: 2861, employed: 2756, unemployed: 104.7, unemplRate: 3.7,
      youthUnempl: 4.1, vacancies: 8.1, resumes: 95, avgSalary: 31, currency: 'KGS', scale: 'тыс.',
    },
  },
  regions: [
    { region: 'Алматы', rate: 4.1, vacancies: 18600, demand: 'Высокий' },
    { region: 'Астана', rate: 3.6, vacancies: 15200, demand: 'Высокий' },
    { region: 'Шымкент', rate: 5.2, vacancies: 8400, demand: 'Средний' },
    { region: 'Туркестанская обл.', rate: 5.8, vacancies: 6100, demand: 'Средний' },
    { region: 'Карагандинская обл.', rate: 4.4, vacancies: 7200, demand: 'Средний' },
    { region: 'Жамбылская обл.', rate: 5.5, vacancies: 3900, demand: 'Низкий' },
    { region: 'Актюбинская обл.', rate: 4.0, vacancies: 5100, demand: 'Средний' },
    { region: 'Восточно-Казахастанская', rate: 4.7, vacancies: 4600, demand: 'Средний' },
    { region: 'Атырауская обл.', rate: 3.5, vacancies: 4300, demand: 'Высокий' },
    { region: 'Бишкек', rate: 3.2, vacancies: 4200, demand: 'Высокий' },
    { region: 'Ош', rate: 4.6, vacancies: 1100, demand: 'Средний' },
    { region: 'Чуйская обл.', rate: 3.9, vacancies: 1800, demand: 'Средний' },
  ],
  topDemand: [
    { skill: 'Швея', open: 1260, candidates: 340, deficit: true },
    { skill: 'Повар', open: 980, candidates: 710, deficit: true },
    { skill: 'Водитель', open: 1120, candidates: 860, deficit: true },
    { skill: 'Сварщик', open: 620, candidates: 210, deficit: true },
    { skill: 'Продавец', open: 1540, candidates: 1890, deficit: false },
    { skill: 'Бухгалтер', open: 890, candidates: 1420, deficit: false },
    { skill: 'Оператор линии', open: 760, candidates: 390, deficit: true },
    { skill: 'Медицинская сестра', open: 940, candidates: 180, deficit: true },
  ],
  trendByMonth: [
    { m: 'Апр', vacancies: 96, resumes: 110, hired: 8.1, unempl: 4.6 },
    { m: 'Май', vacancies: 102, resumes: 114, hired: 8.8, unempl: 4.6 },
    { m: 'Июн', vacancies: 108, resumes: 118, hired: 9.4, unempl: 4.5 },
    { m: 'Июл', vacancies: 104, resumes: 121, hired: 8.9, unempl: 4.6 },
    { m: 'Авг', vacancies: 131.6, resumes: 145.2, hired: 10.6, unempl: 4.5 },
    { m: 'Сен', vacancies: 140, resumes: 150, hired: 11.2, unempl: 4.4 },
  ],
};

export const PROGRAMS = [
  { id: 'p1', title: 'Швея 3-го разряда', category: 'Производство', duration: '2 месяца', price: 0, places: 120, rating: 4.8,
    format: 'Очно', skills: ['швейное дело'], tags: ['Обучение на грантовой основе', 'Стажировка на производстве', 'Помощь в трудоустройстве'],
    provider: 'Учебный центр "Устаз"', region: 'Алматы' },
  { id: 'p2', title: 'Основы предпринимательства и самозанятость', category: 'Услуги', duration: '1,5 месяца', price: 0, places: 240, rating: 4.6,
    format: 'Онлайн', skills: ['менеджмент', 'интернет'], tags: ['Сертификат', 'Консультации ИП'],
    provider: 'Центр развития трудовых ресурсов', region: 'Астана' },
  { id: 'p3', title: 'Оператор ЭВМ / цифровая грамотность', category: 'IT и связь', duration: '1 месяц', price: 0, places: 300, rating: 4.5,
    format: 'Онлайн', skills: ['интернет', 'word', 'excel'], tags: ['С нуля', 'Сертификат гособразца'],
    provider: 'Skills Enbek', region: 'Онлайн' },
  { id: 'p4', title: 'Электрогазосварщик (разряд 3-4)', category: 'Строительство', duration: '3 месяца', price: 0, places: 90, rating: 4.9,
    format: 'Очно', skills: ['сварка'], tags: ['Практика на площадке', 'Допуски', 'Трудоустройство'],
    provider: 'ПТУ №4', region: 'Актобе' },
  { id: 'p5', title: 'Бухгалтерский учёт и 1С:Бухгалтерия', category: 'Услуги', duration: '2 месяца', price: 145000, places: 60, rating: 4.7,
    format: 'Очно', skills: ['бухгалтерия', '1c', 'excel'], tags: ['1С сертификат', 'Стажировка'],
    provider: 'Академия "Профит"', region: 'Алматы' },
  { id: 'p6', title: 'Интернет-маркетинг и SMM', category: 'IT и связь', duration: '2 месяца', price: 0, places: 150, rating: 4.8,
    format: 'Онлайн', skills: ['маркетинг', 'контент'], tags: ['Портфолио', 'Сертификат', 'Карьерный вебинар'],
    provider: 'Цифровая академия', region: 'Онлайн' },
];

export const ACTIVE_MEASURES = [
  { id: 'm1', name: 'Молодёжная практика', desc: 'Стажировка для выпускников 18-29 лет с оплатой от работодателя', region: 'Чуйская обл.', participants: 2479, budget: '8,6 тыс. сомов/мес' },
  { id: 'm2', name: 'Общественные работы', desc: 'Временная занятость для лиц, ищущих работу', region: 'КЗ — все регионы', participants: 1940, budget: 'Оплата на уровне МЗП' },
  { id: 'm3', name: 'Переселение в трудодефицитные регионы', desc: 'Субсидия на переезд и обустройство', region: 'КЗ — 8 регионов', participants: 860, budget: 'До 70 МРП' },
  { id: 'm4', name: 'Краткосрочное профобучение', desc: 'Гранты на обучение востребованным профессиям', region: 'КЗ — все регионы', participants: 5240, budget: 'Покрыто гос-вом' },
  { id: 'm5', name: 'Субсидированные рабочие места', desc: 'Компенсация работодателю части зарплаты', region: 'КЗ — все регионы', participants: 1120, budget: 'До 30 МРП на работника' },
];