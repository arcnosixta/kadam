import { useState } from 'react';
import { ArrowLeft, Check, FileText, Sparkles, Wand2 } from 'lucide-react';
import { Badge, Button, Card, Field, Input, Select, Textarea } from '../../components/ui';
import { jobDescriptionAssistant } from '../../lib/ai';
import { REGIONS } from '../../data/jobs';

export function PostJob({ onPost, onNav }) {
  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('Алматы');
  const [format, setFormat] = useState('office');
  const [salaryFrom, setSalaryFrom] = useState(250);
  const [salaryTo, setSalaryTo] = useState(350);
  const [skills, setSkills] = useState('');
  const [desc, setDesc] = useState('');
  const [gen, setGen] = useState(false);

  const generate = () => {
    if (!skills.trim()) return;
    setGen(true);
    setTimeout(() => {
      setDesc(jobDescriptionAssistant(skills).join('\n\n'));
      setGen(false);
    }, 900);
  };

  const publish = () => {
    const skillList = skills.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean).slice(0, 6);
    onPost({
      id: 99, title: title || 'Специалист (' + (skillList[0] ?? 'профессия') + ')',
      company: 'ТОО «NurGroup»', region, format,
      salaryFrom: salaryFrom * 1000, salaryTo: salaryTo * 1000, type: 'full',
      industry: 'Торговля и услуги', level: 'any', skills: skillList,
      description: desc || 'Краткое описание вакансии формируется автоматически.', tags: ['Официально', 'Обучение за счёт компании'],
    });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5 animate-fade-up">
      <button onClick={() => onNav('dashboard')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-400 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Назад к найму
      </button>
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">Новая вакансия с ИИ-помощью</h1>
        <p className="mt-1 text-ink-500">Опишите, что нужно — ИИ напишет карточку, которая конвертит лучше.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-4 p-6">
          <Field label="Должность">
            <Input placeholder="Например: Менеджер по продажам услуг связи" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Регион">
              <Select value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.slice(0, 10).map((r) => <option key={r}>{r}</option>)}
              </Select>
            </Field>
            <Field label="Формат">
              <Select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="office">В офисе</option>
                <option value="hybrid">Гибрид</option>
                <option value="remote">Удалённо</option>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Зарплата от, тыс. ₸">
              <Input type="number" value={salaryFrom} onChange={(e) => setSalaryFrom(+e.target.value)} />
            </Field>
            <Field label="Зарплата до, тыс. ₸">
              <Input type="number" value={salaryTo} onChange={(e) => setSalaryTo(+e.target.value)} />
            </Field>
          </div>

          <Field label="Ключевые навыки (через запятую)" hint="ИИ будет искать кандидатов именно по ним">
            <Input placeholder="продажи, коммуникации, 1С, вождение…" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </Field>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-700">Описание вакансии</span>
              <Button size="sm" variant="light" onClick={generate} disabled={!skills.trim() || gen}>
                {gen ? <SpinnerTiny /> : <Wand2 className="h-4 w-4 text-brand-500" />} {gen ? 'Генерируем…' : 'Сгенерировать ИИ'}
              </Button>
            </div>
            <Textarea rows={7} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Обязанности, требования, условия…" />
          </div>

          <div className="flex items-center justify-between border-t border-ink-100 pt-4">
            <p className="flex items-center gap-1.5 text-xs text-ink-400"><FileText className="h-4 w-4" /> Карточка будет отправлена в подборку ИИ соискателям</p>
            <Button onClick={publish} disabled={!skills.trim()}>
              <Check className="h-4 w-4" /> Опубликовать
            </Button>
          </div>
        </Card>

        {/* preview */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-ink-500">Предпросмотр карточки</p>
          <Card className="p-6">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 font-display text-sm font-extrabold text-white">NG</span>
            <h3 className="font-display mt-3 text-lg font-bold text-ink-900">{title || 'Специалист'}</h3>
            <p className="text-sm text-ink-500">ТОО «NurGroup» · {region} · {format === 'remote' ? 'Удалённо' : format === 'hybrid' ? 'Гибрид' : 'Офис'}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge tone="brand">{salaryFrom}–{salaryTo} тыс. ₸</Badge>
              <Badge tone="slate">Полная занятость</Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 6).map((s) => <Badge key={s} tone="mint">{s.toLowerCase()}</Badge>)}
            </div>
            {desc && <p className="mt-4 whitespace-pre-wrap text-[13px] leading-relaxed text-ink-600">{desc.slice(0, 340)}…</p>}
            <div className="mt-4 rounded-2xl bg-brand-500/8 p-3 text-xs text-brand-700">
              <Sparkles className="mr-1 inline h-3.5 w-3.5" /> ИИ спрогнозирует до 40 откликов за первую неделю при таких требованиях.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SpinnerTiny() {
  return <svg className="h-4 w-4 animate-spin text-brand-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z" /></svg>;
}