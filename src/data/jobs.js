export const REGIONS = [
  'Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе',
  'Тараз', 'Павлодар', 'Ош', 'Бишкек', 'Усть-Каменогорск',
  'Семей', 'Атырау', 'Костанай', 'Кызылорда', 'Уральск',
];

export const INDUSTRIES = [
  'Производство', 'Торговля', 'Строительство', 'IT и связь', 'Услуги',
  'Образование', 'Медицина', 'Логистика', 'Сельское хозяйство', 'Питание',
];

// Кандидат: { id, name, initials, age, region, status, months, desiredRole, bio, skills, years, education, languages, salaryExpect, format, color, seen }
export function job(id, o) {
  return { id, views: 1300 + (id * 137) % 2400, applications: (id * 7) % 40, status: 'active', verified: true, ...o };
}

export const JOBS = [
  job(1, {
    title: 'Швея на производстве', company: 'ТехноТекстиль', region: 'Алматы', format: 'office', salaryFrom: 280000, salaryTo: 380000,
    type: 'full', industry: 'Производство', level: 'any',
    skills: ['швейное дело', 'сборка', 'качества', 'коммуникации'],
    description: 'Пошив спецодежды и постельного белья. Полное обучение на месте, работодатель обеспечивает инструментом. Стабильная загрузка, ежедневные бонусы за перевыполнение плана.',
    tags: ['Обучение на месте', 'График 5/2', 'Обед за счёт компании'],
  }),
  job(2, {
    title: 'Продавец-кассир', company: 'Супермаркет "Народный"', region: 'Астана', format: 'office', salaryFrom: 260000, salaryTo: 330000,
    type: 'full', industry: 'Торговля', level: 'any',
    skills: ['кассы', 'продажи', 'коммуникации', 'интернет'],
    description: 'Работа на кассе и в торговом зале. Обучим с нуля за 3 дня. Удобный график 2/2 или 5/2, премии за выполнение плана.',
    tags: ['Можно без опыта', 'Сменный график', 'Премии'],
  }),
  job(3, {
    title: 'Сварщик (полуавтомат/аргон)', company: 'СтройМетСервис', region: 'Караганда', format: 'office', salaryFrom: 460000, salaryTo: 580000,
    type: 'full', industry: 'Строительство', level: 'middle',
    skills: ['сварка', 'строительство'],
    description: 'Сварка металлоконструкций на производственной площадке. Работа с документацией, допуски. Жильё предоставляется для иногородних.',
    tags: ['Вахта / жильё', 'Официально', 'Допуски'],
  }),
  job(4, {
    title: 'PHP-разработчик (Junior/Middle)', company: 'Nomi Digital', region: 'Алматы', format: 'hybrid', salaryFrom: 600000, salaryTo: 950000,
    type: 'full', industry: 'IT и связь', level: 'middle',
    skills: ['javascript', 'python', 'sql', 'интернет'],
    description: 'Разработка и поддержка веб-платформ fintech-направления. Работаем гибридно: 2 дня в офисе, остальное — удалённо.',
    tags: ['Гибрид', 'ДМС', 'Рост до Senior'],
  }),
  job(5, {
    title: 'Водитель категории B на такси парк', company: 'Городское Такси', region: 'Шымкент', format: 'office', salaryFrom: 320000, salaryTo: 450000,
    type: 'full', industry: 'Логистика', level: 'any',
    skills: ['вождение'],
    description: 'Работа на автомобилях парка или личных. Низкая комиссия, ежедневные выплаты, помощь в оформлении лицензии.',
    tags: ['Ежедневные выплаты', 'Свой или парковый авто'],
  }),
  job(6, {
    title: 'Медицинская сестра', company: 'Городская поликлиника №7', region: 'Астана', format: 'office', salaryFrom: 300000, salaryTo: 400000,
    type: 'full', industry: 'Медицина', level: 'middle',
    skills: ['медсестра', 'коммуникации'],
    description: 'Кабинетный приём, процедурный кабинет. Наставничество молодых специалистов. Полный соцпакет, оплата наставничества.',
    tags: ['Соцпакет', 'Наставничество'],
  }),
  job(7, {
    title: 'Повар на производство', company: 'Сеть фудзоны "Панда"', region: 'Бишкек', format: 'office', salaryFrom: 150000, salaryTo: 220000,
    type: 'full', industry: 'Питание', level: 'any',
    skills: ['кулинария', 'общепит'],
    description: 'Приготовление по технологическим картам. Обучение на рабочем месте, кормежка смены, сменный график.',
    tags: ['Питание за счёт фирмы', 'График 2/2'],
  }),
  job(8, {
    title: 'Менеджер по продажам (выход на мобильность)', company: 'Kcell Plus', region: 'Алматы', format: 'hybrid', salaryFrom: 350000, salaryTo: 700000,
    type: 'full', industry: 'Торговля', level: 'any',
    skills: ['продажи', 'коммуникации', 'телефония', 'интернет'],
    description: 'Активные продажи услуг связи корпоративным клиентам. Прозрачная мотивация: оклад + проценты, оплачиваемое обучение.',
    tags: ['Оклад + %', 'Обучение', 'Карьерный рост'],
  }),
  job(9, {
    title: 'Оператор производственной линии', company: 'Молочная ферма "Айнур"', region: 'Костанай', format: 'office', salaryFrom: 300000, salaryTo: 400000,
    type: 'full', industry: 'Производство', level: 'any',
    skills: ['сборка', 'интернет'],
    description: 'Оператор линии розлива и упаковки. Важен аккуратный подход и внимание к деталям. Обучение и наставничество.',
    tags: ['Важно внимание', 'Стабильная смена'],
  }),
  job(10, {
    title: 'Воспитатель в детский сад', company: 'ЧУ "Балапан"', region: 'Павлодар', format: 'office', salaryFrom: 260000, salaryTo: 340000,
    type: 'full', industry: 'Образование', level: 'any',
    skills: ['работа с детьми', 'коммуникации'],
    description: 'Работа с группой 3-6 лет. Педагогическое образование приветствуется, но готовы обучать и переобучать. Доплата за категорию.',
    tags: ['Гибкие графики', 'Летний отпуск'],
  }),
  job(11, {
    title: 'Бухгалтер первичной документации', company: 'ТОО "Куат Консалтинг"', region: 'Астана', format: 'hybrid', salaryFrom: 380000, salaryTo: 480000,
    type: 'full', industry: 'Услуги', level: 'middle',
    skills: ['бухгалтерия', '1c', 'excel'],
    description: 'Проводка первички, авансовые отчёты, сверки. Знание 1С обязательно. Гибридный формат, дружная команда.',
    tags: ['Гибрид', 'Знание 1С'],
  }),
  job(12, {
    title: 'Разнорабочий на стройке (отделка)', company: 'СтройКомфорт', region: 'Шымкент', format: 'office', salaryFrom: 250000, salaryTo: 330000,
    type: 'full', industry: 'Строительство', level: 'any',
    skills: ['строительство'],
    description: 'Подсобные работы на отделке: уборка, подача материалов, помощь мастерам. Опытный бригадир обучит всем тонкостям.',
    tags: ['Обучение', 'Ежедневная оплата'],
  }),
  job(13, {
    title: 'Курьер на автомобиле', company: 'Доставка "Быстро"', region: 'Алматы', format: 'office', salaryFrom: 400000, salaryTo: 550000,
    type: 'part', industry: 'Логистика', level: 'any',
    skills: ['вождение'],
    description: 'Доставка товаров по городу. Гибкий график, выплаты еженедельно. Можно совмещать с учёбой.',
    tags: ['Гибкий график', 'Выплаты каждую неделю'],
  }),
  job(14, {
    title: 'Ассистент бухгалтера (стажёр)', company: 'Домбыра Аудит', region: 'Алматы', format: 'office', salaryFrom: 220000, salaryTo: 280000,
    type: 'full', industry: 'Услуги', level: 'any',
    skills: ['бухгалтерия', 'excel', 'интернет'],
    description: 'Ведение банка, работа с Excel, подготовка документов для налоговой. Отличная стартовая позиция для выпускников.',
    tags: ['Для выпускников', 'Наставник', 'Карьерный трек'],
  }),
  job(15, {
    title: 'Дизайнер-верстальщик (удалённо)', company: 'Издательский дом "Пегас"', region: 'Бишкек', format: 'remote', salaryFrom: 120000, salaryTo: 180000,
    type: 'full', industry: 'IT и связь', level: 'any',
    skills: ['дизайн', 'контент', 'интернет'],
    description: 'Вёрстка книг и корпоративных материалов в InDesign/Figma. Полностью удалённо, гибкое начало рабочего дня.',
    tags: ['Удалённо', 'Фриланс-формат'],
  }),
  job(16, {
    title: 'Официант/бариста (зал и кофе-поинт)', company: 'Кофейня "Толкын"', region: 'Астана', format: 'office', salaryFrom: 200000, salaryTo: 320000,
    type: 'part', industry: 'Питание', level: 'any',
    skills: ['общепит', 'коммуникации'],
    description: 'Обучение кофе-науке за наш счёт, чаевые на карту, смены утром и вечером — удобно студентам.',
    tags: ['Чаевые', 'Обучение бариста', 'Частичная занятость'],
  }),
  job(17, {
    title: 'Учитель начальных классов', company: 'Средняя школа № гимназия', region: 'Ош', format: 'office', salaryFrom: 30000, salaryTo: 45000,
    type: 'full', industry: 'Образование', level: 'middle', currency: 'KGS',
    skills: ['работа с детьми', 'коммуникации'],
    description: 'Педагогическая деятельность в 1-4 классах. Поддержка молодых педагогов, доплата за классное руководство.',
    tags: ['Классное руководство', 'Поддержка'],
  }),
  job(18, {
    title: 'Электрогазосварщик', company: 'МостТрест', region: 'Актобе', format: 'office', salaryFrom: 420000, salaryTo: 520000,
    type: 'full', industry: 'Строительство', level: 'middle',
    skills: ['сварка'],
    description: 'Монтаж металлоконструкций мостового перехода. Разряды 4-6, спецодежда и инструменты — за счёт компании.',
    tags: ['Вахта 15/15', 'Разряды 4-6'],
  }),
  job(19, {
    title: 'Администратор колл-центра', company: 'Салем Сервис', region: 'Шымкент', format: 'office', salaryFrom: 240000, salaryTo: 300000,
    type: 'full', industry: 'Услуги', level: 'any',
    skills: ['телефония', 'коммуникации', 'интернет', 'word'],
    description: 'Приём и обработка звонков клиентов, ведение базы. Обучим скриптам продаж и работе в CRM за неделю.',
    tags: ['Обучение неделя', 'График 5/2', 'CRM'],
  }),
  job(20, {
    title: 'Специалист по СЕО/контенту', company: 'Digital Asia Group', region: 'Астана', format: 'remote', salaryFrom: 300000, salaryTo: 550000,
    type: 'full', industry: 'IT и связь', level: 'middle',
    skills: ['маркетинг', 'контент', 'интернет'],
    description: 'Ведение блогов и SEO-оптимизация сайтов. Портфолио приветствуется, рассмотрим кандидатов с сильной переобучаемостью.',
    tags: ['Удалённо', 'Портфолио'],
  }),
];

export const WORKERS = [
  {
    id: 'w1', name: 'Айгерім Серікбол', initials: 'АС', age: 28, region: 'Алматы', status: 'unemployed', months: 1.5,
    desiredRole: 'Бухгалтер / ассистент', bio: 'Выпускница экономического факультета, 2 года в малом бизнесе семьи — вела учёт закупок и реализацию.',
    skills: ['бухгалтерия', '1c', 'excel', 'word'], years: 2, education: 'Высшее (экономика)',
    languages: ['Казахский', 'Русский'], salaryExpect: 350000, format: 'office', color: '#6366f1',
    applied: 5, interview: 1,
  },
  {
    id: 'w2', name: 'Сергей Кан', initials: 'СК', age: 34, region: 'Караганда', status: 'unemployed', months: 2.5,
    desiredRole: 'Сварщик / разнорабочий', bio: '6 лет проработал электросварщиком на заводе, разряд 4. Уверенно читаю чертежи.',
    skills: ['сварка', 'строительство'], years: 6, education: 'Средне-специальное',
    languages: ['Русский'], salaryExpect: 450000, format: 'office', color: '#0ea5e9',
    applied: 3, interview: 0,
  },
  {
    id: 'w3', name: 'Дана Бектасова', initials: 'ДБ', age: 23, region: 'Астана', status: 'unemployed', months: 0.8,
    desiredRole: 'СММ / контент-менеджер', bio: 'Вела Instagram кофейни (12k подписчиков), снимаю и монтирую shorts. Хочу развиваться в digital-маркетинге.',
    skills: ['маркетинг', 'контент', 'дизайн', 'интернет'], years: 2, education: 'Неоконченное высшее',
    languages: ['Казахский', 'Русский'], salaryExpect: 280000, format: 'remote', color: '#ec4899',
    applied: 8, interview: 2,
  },
  {
    id: 'w4', name: 'Улан Абдыкадыров', initials: 'УА', age: 41, region: 'Ош', status: 'unemployed', months: 4,
    desiredRole: 'Водитель / логистика', bio: 'Водительский стаж 20 лет, категории B,C. Был дальнобойщиком, теперь ищу работу в городе или на маршрут.',
    skills: ['вождение', 'грузавтоперевозки'], years: 20, education: 'Среднее',
    languages: ['Кыргызский', 'Русский'], salaryExpect: 40000, format: 'office', color: '#f59e0b', currency: 'KGS',
    applied: 2, interview: 0,
  },
  {
    id: 'w5', name: 'Мария Соколова', initials: 'МС', age: 45, region: 'Павлодар', status: 'unemployed', months: 9,
    desiredRole: 'Медицинская сестра', bio: 'Опыт медсестры 15 лет, была в декрете с внуками, готова вернуться в профессию. Хочу 1 ставку, без подработок.',
    skills: ['медсестра', 'коммуникации'], years: 15, education: 'Средне-специальное (мед)',
    languages: ['Русский'], salaryExpect: 320000, format: 'office', color: '#10b981',
    applied: 1, interview: 0,
  },
  {
    id: 'w6', name: 'Нурбек Исаев', initials: 'НИ', age: 19, region: 'Бишкек', status: 'unemployed', months: 0.6,
    desiredRole: 'Курьер / официант',
    bio: 'Студент, ищу первую работу. Готов к физической работе и гибкому графику, быстро учусь.',
    skills: ['общепит', 'вождение'], years: 0, education: 'Студент',
    languages: ['Кыргызский', 'Русский'], salaryExpect: 20000, format: 'office', color: '#8b5cf6', currency: 'KGS',
    applied: 4, interview: 1,
  },
  {
    id: 'w7', name: 'Гульмира Туреханова', initials: 'ГТ', age: 31, region: 'Атырау', status: 'unemployed', months: 2.2,
    desiredRole: 'Продавец / кассир', bio: '5 лет в розничной торговле: касса, выкладка, работа с поставщиками. Ответственная и пунктуальная.',
    skills: ['кассы', 'продажи', 'коммуникации'], years: 5, education: 'Средне-специальное',
    languages: ['Казахский', 'Русский'], salaryExpect: 300000, format: 'office', color: '#14b8a6',
    applied: 6, interview: 3,
  },
  {
    id: 'w8', name: 'Арман Жолдасов', initials: 'АЖ', age: 38, region: 'Актобе', status: 'unemployed', months: 6,
    desiredRole: 'Оператор линии', bio: '12 лет на производстве (конвейер, упаковка), внимательный к деталям, без вредных привычек.',
    skills: ['сборка', 'интернет'], years: 12, education: 'Средне-специальное',
    languages: ['Казахский', 'Русский'], salaryExpect: 320000, format: 'office', color: '#f43f5e',
    applied: 2, interview: 0,
  },
  {
    id: 'w9', name: 'Виктория Лим', initials: 'ВЛ', age: 26, region: 'Алматы', status: 'unemployed', months: 1.1,
    desiredRole: 'Дизайнер / верстальщик', bio: 'Фриланс-дизайнер 3 года: Figma, фирменный стиль, презентации. Ищу стабильную удалёнку.',
    skills: ['дизайн', 'контент', 'интернет'], years: 3, education: 'Высшее (дизайн)',
    languages: ['Русский', 'Английский'], salaryExpect: 320000, format: 'remote', color: '#d946ef',
    applied: 9, interview: 4,
  },
];