import { useState } from 'react';
import {
  Home, Sparkles, FileText, MessageSquareText, ClipboardList, Search, BookOpen,
} from 'lucide-react';
import { Shell } from '../Shell';
import { DEMO_WORKER } from '../../lib/ai';
import { Overview } from './Overview';
import { Matches } from './Matches';
import { Resume } from './Resume';
import { Interview } from './Interview';
import { Track } from './Track';
import { Assistant } from './Assistant';

export function WorkerApp({ user, onExit, notify }) {
  const [view, setView] = useState('overview');
  const [profile] = useState({ ...DEMO_WORKER, name: user.name ?? DEMO_WORKER.name });
  const [apps, setApps] = useState({});
  const [chat, setChat] = useState([
    { from: 'ai', text: `Здравствуйте, ${mutFirstName(user.name)}! Я Айла — ваш ИИ-ассистент. Готова помочь найти работу. Хотите посмотреть подборки вакансий?` },
  ]);
  const [activeJob, setActiveJob] = useState(null);

  const apply = (jobId) => {
    setApps((a) => {
      const cur = a[jobId]?.stage ?? 'saved';
      const next = cur === 'saved' ? 'applied' : cur === 'applied' ? 'interview' : cur === 'interview' ? 'offer' : 'offer';
      return { ...a, [jobId]: { stage: next, at: new Date().toLocaleDateString('ru-RU') } };
    });
    notify(nextStageNotify(apps[jobId]?.stage));
  };

  const saveJob = (jobId) => {
    setApps((a) => (a[jobId] ? a : { ...a, [jobId]: { stage: 'saved', at: '-' } }));
    notify('Вакансия сохранена в «Мои отклики»');
  };

  const viewedBy = apps;
  void viewedBy;

  const activeCount = Object.values(apps).filter((a) => ['applied', 'interview'].includes(a.stage)).length;

  const nav = [
    { id: 'overview', label: 'Главная', icon: Home },
    { id: 'matches', label: 'Рекомендации ИИ', icon: Sparkles, badge: 6 },
    { id: 'search', label: 'Все вакансии', icon: Search },
    { id: 'resume', label: 'Резюме', icon: FileText },
    { id: 'interview', label: 'Тренировка собеседования', icon: MessageSquareText },
    { id: 'track', label: 'Мои отклики', icon: ClipboardList, badge: activeCount || undefined },
    { id: 'assistant', label: 'ИИ-ассистент', icon: BookOpen },
  ];

  return (
    <Shell
      user={{ ...user, initials: profile.initials, color: profile.avatarColor }}
      nav={nav} active={view} onNav={setView} onExit={onExit}
      header={<span className="hidden rounded-xl bg-mint-400/15 px-3 py-1.5 text-xs font-bold text-mint-600 md:inline">Задача: первый оффер за 21 день</span>}
    >
      {view === 'overview' && <Overview profile={profile} apps={apps} chat={chat} onChangeView={setView} onOpenJob={setActiveJob} />}
      {view === 'matches' && <Matches profile={profile} activeJob={activeJob} onOpen={setActiveJob} onApply={apply} onSave={saveJob} apps={apps} onChat={() => setView('assistant')} />}
      {view === 'search' && <Matches profile={profile} activeJob={activeJob} onOpen={setActiveJob} onApply={apply} onSave={saveJob} apps={apps} mode="search" onChat={() => setView('assistant')} />}
      {view === 'resume' && <Resume profile={profile} />}
      {view === 'interview' && <Interview profile={profile} />}
      {view === 'track' && <Track apps={apps} profile={profile} onApply={apply} onChangeView={setView} />}
      {view === 'assistant' && <Assistant profile={profile} chat={chat} setChat={setChat} onChangeView={setView} />}
    </Shell>
  );
}

function mutFirstName(name) {
  const parts = String(name ?? '').split(' ').filter(Boolean);
  return parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'друг';
}

function nextStageNotify(stage) {
  if (!stage || stage === 'saved') return 'Отклик отправлен. ИИ следит за статусом';
  if (stage === 'applied') return 'Вас пригласили на собеседование! Платформа подготовила материалы';
  return 'Статус обновлён. До оффера остался шаг';
}