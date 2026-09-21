import { useState } from 'react';
import {
  BriefcaseBusiness, LayoutDashboard, MessageSquareText, PlusCircle, UserSearch,
} from 'lucide-react';
import { Shell } from '../Shell';
import { JOBS, WORKERS } from '../../data/jobs';
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
  const initialJobs = JOBS.filter((j) => [2, 8, 14].includes(j.id));
  const [view, setView] = useState('dashboard');
  const [jobPool, setJobPool] = useState(initialJobs);
  const [selectedJob, setSelectedJob] = useState(initialJobs[0] ?? JOBS[0]);
  const [chat, setChat] = useState([
    { from: 'ai', text: 'Добрый день! Я HR-ассистент Kadam. Разложу кандидатов по полочкам, напишу вакансию и ускорю найм. С чего начнём?' },
  ]);

  const postJob = (job) => {
    setJobPool((p) => [{ ...job, id: 99 + p.length }, ...p]);
    notify('Вакансия опубликована и уже разослана подходящим кандидатам');
  };

  const nav = [
    { id: 'dashboard', label: 'Обзор найма', icon: LayoutDashboard, badge: selectedJob.applications ?? 12 },
    { id: 'mylobs', label: 'Мои вакансии', icon: BriefcaseBusiness },
    { id: 'candidates', label: 'Кандидаты и ИИ-отбор', icon: UserSearch, badge: 24 },
    { id: 'post', label: 'Разместить вакансию', icon: PlusCircle },
    { id: 'assistant', label: 'HR-ассистент', icon: MessageSquareText },
  ];

  return (
    <Shell
      user={{ ...user, initials: EMPLOYER.initials, color: EMPLOYER.color, role: 'employer' }}
      nav={nav} active={view} onNav={setView} onExit={onExit}
      header={<span className="hidden rounded-xl bg-violet-500/12 px-3 py-1.5 text-xs font-bold text-violet-600 md:inline">Проверено · {EMPLOYER.industry}</span>}
    >
      {view === 'dashboard' && <Dashboard jobs={jobPool} onOpenJob={setSelectedJob} onNav={setView} notify={notify} />}
      {view === 'mylobs' && <MyJobs jobs={jobPool} onSelect={(j) => { setSelectedJob(j); setView('candidates'); }} onNav={setView} />}
      {view === 'candidates' && <Candidates job={selectedJob} onPick={(j) => setSelectedJob(j)} jobs={jobPool} workers={WORKERS} notify={notify} />}
      {view === 'post' && <PostJob onPost={postJob} onNav={setView} />}
      {view === 'assistant' && <Assistant chat={chat} setChat={setChat} onOpenPost={() => setView('candidates')} />}
    </Shell>
  );
}