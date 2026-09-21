import { useEffect, useState } from 'react';
import {
  Home, Sparkles, FileText, MessageSquareText, ClipboardList, Search, BookOpen,
} from 'lucide-react';
import { Shell } from '../Shell';
import { DEMO_WORKER } from '../../lib/ai';
import { JOBS } from '../../data/jobs';
import { store } from '../../lib/store';
import { Overview } from './Overview';
import { Matches } from './Matches';
import { Resume } from './Resume';
import { Interview } from './Interview';
import { Track } from './Track';
import { Assistant } from './Assistant';

export function WorkerApp({ user, onExit, notify }) {
  const [view, setView] = useState('overview');
  const [profile, setProfile] = useState({
    ...DEMO_WORKER,
    name: user.name ?? DEMO_WORKER.name,
    ...(user.profile ?? {}),
  });
  const [apps, setApps] = useState({});
  const [jobs, setJobs] = useState(JOBS);
  const [loading, setLoading] = useState(user.authed);
  const [chat, setChat] = useState([
    { from: 'ai', text: `Здравствуйте, ${mutFirstName(user.name)}! Я Айла — ваш ИИ-ассистент. Готова помочь найти работу. Хотите посмотреть подборки вакансий?` },
  ]);
  const [activeJob, setActiveJob] = useState(null);

  useEffect(() => {
    if (!user.authed) return;
    let alive = true;
    (async () => {
      const [prof, market, application] = await Promise.all([
        store.getProfile(user.id),
        store.listJobs(),
        store.listApplications(user.id),
      ]);
      if (!alive) return;
      setProfile((p) => ({ ...p, ...(prof ?? {}), name: prof?.name ?? p.name }));
      setJobs(market);
      setApps(application);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user.id, user.authed]);

  const persist = (jobId, stage) => {
    if (!user.authed) return Promise.resolve();
    return store.setApplication(jobId, stage, user.id);
  };

  const apply = async (jobId) => {
    const cur = apps[jobId]?.stage ?? 'saved';
    const next = cur === 'saved' ? 'applied' : cur === 'applied' ? 'interview' : cur === 'interview' ? 'offer' : 'offer';
    await persist(jobId, next);
    setApps((a) => ({ ...a, [jobId]: { stage: next, at: new Date().toLocaleDateString('ru-RU') } }));
    notify(nextStageNotify(cur));
  };

  const saveJob = async (jobId) => {
    await persist(jobId, 'saved');
    setApps((a) => (a[jobId] ? a : { ...a, [jobId]: { stage: 'saved', at: '-' } }));
    notify('Вакансия сохранена в «Мои отклики»');
  };

  const saveProfile = async (nextProfile) => {
    setProfile(nextProfile);
    if (user.authed) await store.updateProfile({ ...nextProfile, id: user.id, role: 'worker' });
  };

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
      user={{ ...user, initials: profile.initials, color: profile.avatarColor, authed: user.authed }}
      nav={nav} active={view} onNav={setView} onExit={onExit}
      loading={loading}
      header={<span className="hidden rounded-xl bg-mint-400/15 px-3 py-1.5 text-xs font-bold text-mint-600 md:inline">{user.authed ? 'Аккаунт подключён' : 'Демо-режим · данные не сохраняются'}</span>}
    >
      {view === 'overview' && <Overview profile={profile} apps={apps} chat={chat} jobs={jobs} onChangeView={setView} onOpenJob={setActiveJob} />}
      {view === 'matches' && <Matches profile={profile} activeJob={activeJob} jobs={jobs} onOpen={setActiveJob} onApply={apply} onSave={saveJob} apps={apps} onChat={() => setView('assistant')} />}
      {view === 'search' && <Matches profile={profile} activeJob={activeJob} jobs={jobs} onOpen={setActiveJob} onApply={apply} onSave={saveJob} apps={apps} mode="search" onChat={() => setView('assistant')} />}
      {view === 'resume' && <Resume profile={profile} onSave={saveProfile} />}
      {view === 'interview' && <Interview profile={profile} jobs={jobs} />}
      {view === 'track' && <Track apps={apps} profile={profile} jobs={jobs} onApply={apply} onChangeView={setView} />}
      {view === 'assistant' && <Assistant profile={profile} jobs={jobs} chat={chat} setChat={setChat} onChangeView={setView} />}
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