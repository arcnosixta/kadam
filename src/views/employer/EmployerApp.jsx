import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness, LayoutDashboard, MessageSquareText, PlusCircle, UserSearch,
} from 'lucide-react';
import { Shell } from '../Shell';
import { JOBS, WORKERS } from '../../data/jobs';
import { store, employerFromProfile } from '../../lib/store';
import { Dashboard } from './Dashboard';
import { MyJobs } from './MyJobs';
import { Candidates } from './Candidates';
import { PostJob } from './PostJob';
import { Assistant } from './Assistant';

export const EMPLOYER = {
  id: 'e1', name: 'ТОО «NurGroup»', initials: 'NG', color: '#8b5cf6',
  industry: 'Торговля и услуги', region: 'Алматы', employees: 240, verified: true,
};

export function EmployerApp({ user, onExit, notify }) {
  const [view, setView] = useState('dashboard');
  const [jobPool, setJobPool] = useState(JOBS.filter((j) => [2, 8, 14].includes(j.id)));
  const [workers, setWorkers] = useState(WORKERS);
  const [employer, setEmployer] = useState(EMPLOYER);
  const [loading, setLoading] = useState(user.authed);
  const [selectedJob, setSelectedJob] = useState(() => JOBS.filter((j) => [2, 8, 14].includes(j.id))[0] ?? JOBS[0]);
  const [chat, setChat] = useState([
    { from: 'ai', text: 'Добрый день! Я HR-ассистент Kadam. Разложу кандидатов по полочкам, напишу вакансию и ускорю найм. С чего начнём?' },
  ]);

  useEffect(() => {
    if (!user.authed) return;
    let alive = true;
    (async () => {
      const [jobs, candidates, prof] = await Promise.all([
        store.listEmployerJobs(user.id),
        store.listWorkers(),
        store.getProfile(user.id),
      ]);
      if (!alive) return;
      const ep = employerFromProfile(prof);
      if (ep) setEmployer((e) => ({ ...e, ...ep }));
      setJobPool(jobs);
      setWorkers(candidates);
      setSelectedJob((cur) => cur ?? jobs[0] ?? null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user.id, user.authed]);

  const postJob = async (job) => {
    try {
      const created = await store.postJob(job, user.authed ? user.id : null, employer.name);
      setJobPool((p) => [created, ...p]);
      notify('Вакансия опубликована и уже разослана подходящим кандидатам');
    } catch (err) {
      notify(`Не удалось опубликовать: ${err.message}`);
    }
  };

  const nav = [
    { id: 'dashboard', label: 'Обзор найма', icon: LayoutDashboard, badge: selectedJob?.applications ?? 12 },
    { id: 'mylobs', label: 'Мои вакансии', icon: BriefcaseBusiness },
    { id: 'candidates', label: 'Кандидаты и ИИ-отбор', icon: UserSearch, badge: 24 },
    { id: 'post', label: 'Разместить вакансию', icon: PlusCircle },
    { id: 'assistant', label: 'HR-ассистент', icon: MessageSquareText },
  ];

  return (
    <Shell
      user={{ ...user, name: employer.name, initials: employer.initials, color: employer.color, role: 'employer' }}
      nav={nav} active={view} onNav={setView} onExit={onExit}
      loading={loading}
      header={<span className="hidden rounded-xl bg-violet-500/12 px-3 py-1.5 text-xs font-bold text-violet-600 md:inline">{user.authed ? 'Аккаунт компании' : 'Демо-режим · данные не сохраняются'} · {employer.industry}</span>}
    >
      {view === 'dashboard' && <Dashboard jobs={jobPool} onOpenJob={setSelectedJob} onNav={setView} notify={notify} />}
      {view === 'mylobs' && <MyJobs jobs={jobPool} onSelect={(j) => { setSelectedJob(j); setView('candidates'); }} onNav={setView} />}
      {view === 'candidates' && <Candidates job={selectedJob} onPick={(j) => setSelectedJob(j)} jobs={jobPool} workers={workers} notify={notify} />}
      {view === 'post' && <PostJob onPost={postJob} onNav={setView} />}
      {view === 'assistant' && <Assistant chat={chat} setChat={setChat} onOpenPost={() => setView('candidates')} />}
    </Shell>
  );
}