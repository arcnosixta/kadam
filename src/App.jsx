import { useEffect, useState } from 'react';
import { Landing } from './views/Landing';
import { WorkerApp } from './views/worker/WorkerApp';
import { EmployerApp } from './views/employer/EmployerApp';
import { AdminApp } from './views/admin/AdminApp';
import { auth } from './lib/auth';

export default function App() {
  const [session, setSession] = useState(null);
  const [flash, setFlash] = useState(null);

  // Восстановление сессии + подписка на вход/выход из Supabase.
  useEffect(() => {
    let active = true;
    auth.getSession().then((s) => { if (active && s) setSession(s); });
    const unsub = auth.onAuthChange(async (s) => {
      if (!active) return;
      setSession((cur) => {
        if (!cur && !s) return null;
        return s;
      });
    });
    return () => { active = false; unsub(); };
  }, []);

  const enter = (entry) => {
    if (entry?.authed) {
      setSession(entry);
      return;
    }
    // Демо-вход без аккаунта.
    setSession({ role: entry.role, name: entry.name, start: Date.now(), authed: false });
  };

  const exit = async () => {
    await auth.signOut();
    setSession(null);
  };

  const myFlash = (msg) => {
    setFlash({ msg, id: Date.now() });
    setTimeout(() => setFlash(null), 2600);
  };

  return (
    <>
      {flash && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-ink-800 shadow-lift" key={flash.id}>
            <svg className="h-5 w-5 text-mint-500" viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {flash.msg}
          </div>
        </div>
      )}

      {!session && <Landing onEnter={enter} />}

      {session?.role === 'worker' && (
        <WorkerApp user={session} onExit={exit} notify={myFlash} />
      )}
      {session?.role === 'employer' && (
        <EmployerApp user={session} onExit={exit} notify={myFlash} />
      )}
      {session?.role === 'admin' && (
        <AdminApp user={session} onExit={exit} notify={myFlash} />
      )}
    </>
  );
}