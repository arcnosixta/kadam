import { useState } from 'react';
import {
  ClipboardCheck, LayoutDashboard, LineChart as LineChartIcon, SlidersHorizontal,
} from 'lucide-react';
import { Shell } from '../Shell';
import { Overview } from './Overview';
import { Market } from './Market';
import { Programs } from './Programs';
import { Moderation } from './Moderation';

export const ADMIN = {
  id: 'a1', name: 'Оператор рынка', initials: 'OP', color: '#0f766e',
  role: 'Контролирующий орган', region: 'Казахстан / Кыргызстан',
};

export function AdminApp({ user, onExit, notify }) {
  const [view, setView] = useState('overview');

  const nav = [
    { id: 'overview', label: 'Обзор', icon: LayoutDashboard },
    { id: 'market', label: 'Рынок труда', icon: LineChartIcon },
    { id: 'programs', label: 'Программы и меры', icon: SlidersHorizontal },
    { id: 'moderation', label: 'Модерация', icon: ClipboardCheck, badge: 7 },
  ];

  return (
    <Shell
      user={{ ...user, initials: ADMIN.initials, color: ADMIN.color, role: 'admin' }}
      nav={nav} active={view} onNav={setView} onExit={onExit}
      accent="teal"
      header={<span className="hidden rounded-xl bg-teal-500/12 px-3 py-1.5 text-xs font-bold text-teal-600 md:inline">Официальный источник · {ADMIN.region}</span>}
    >
      {view === 'overview' && <Overview onNav={setView} notify={notify} />}
      {view === 'market' && <Market />}
      {view === 'programs' && <Programs onNav={setView} notify={notify} />}
      {view === 'moderation' && <Moderation notify={notify} />}
    </Shell>
  );
}