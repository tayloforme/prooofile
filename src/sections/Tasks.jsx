import React, { useState } from 'react';
import Calendar from '../components/Calendar.jsx';
import { IconCalendar, IconSyringe, IconPill, IconScissors, IconStethoscope, IconPlus } from '../components/Icons.jsx';

const TODAY = new Date(2026, 4, 17);

const TYPE_META = {
  vaccine:    { label: 'Vaccine',    tone: 'lilac', icon: IconSyringe },
  medication: { label: 'Medication', tone: 'mint',  icon: IconPill },
  grooming:   { label: 'Grooming',   tone: 'rose',  icon: IconScissors },
  checkup:    { label: 'Checkup',    tone: 'peach', icon: IconStethoscope },
};

const TONE_COLOR = {
  vaccine:    '#a18ee2',
  medication: '#86b88e',
  grooming:   '#e2a09d',
  checkup:    '#dba778',
};

const INITIAL_TASKS = [
  { date: '2026-05-17', title: 'Morning walk',  type: 'checkup',    done: false },
  { date: '2026-05-17', title: 'Brush teeth',   type: 'grooming',   done: false },
  { date: '2026-05-20', title: 'Bath & brush',  type: 'grooming',   done: false },
  { date: '2026-05-22', title: 'Vet follow-up', type: 'checkup',    done: false },
  { date: '2026-05-28', title: 'NexGard dose',  type: 'medication', done: false },
  { date: '2026-05-29', title: 'Nail trim',     type: 'grooming',   done: false },
  { date: '2026-06-01', title: 'Rabies booster', type: 'vaccine',   done: false },
  { date: '2026-06-05', title: 'Grooming',      type: 'grooming',   done: false },
  { date: '2026-06-10', title: 'Weigh-in',      type: 'checkup',    done: false },
];

const DONE = [
  { title: 'Trim nails',     date: 'May 14' },
  { title: 'Annual checkup', date: 'Apr 12' },
];

function key(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function sameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

export default function Tasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [view, setView] = useState({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
  const [selected, setSelected] = useState(new Date(TODAY));

  const typesForDate = (d) => {
    const k = key(d);
    return [...new Set(tasks.filter((t) => t.date === k).map((t) => t.type))];
  };

  const dayTasks = tasks
    .map((t, idx) => ({ ...t, idx }))
    .filter((t) => t.date === key(selected));

  const dayLabel = sameDay(selected, TODAY)
    ? 'Today'
    : sameDay(selected, new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()+1))
      ? 'Tomorrow'
      : 'Selected day';

  const dayTitle = `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][selected.getMonth()]} ${selected.getDate()}`;

  const toggle = (idx) => {
    setTasks((cur) => cur.map((t, i) => (i === idx ? { ...t, done: !t.done } : t)));
  };

  return (
    <section id="tasks" className="section">
      <header className="section-head">
        <h2><span className="ico"><IconCalendar /></span>Tasks</h2>
        <button className="link-btn"><IconPlus /> New task</button>
      </header>

      <div className="tasks-layout">
        <Calendar
          today={TODAY}
          view={view}
          setView={setView}
          selected={selected}
          setSelected={setSelected}
          typesForDate={typesForDate}
          toneByType={TONE_COLOR}
        />

        <div className="day-panel">
          <p className="day-eyebrow">{dayLabel.toUpperCase()}</p>
          <h3 className="day-title">{dayTitle}</h3>

          {dayTasks.length === 0 ? (
            <p className="day-empty">Nothing scheduled.</p>
          ) : (
            <ul className="day-list">
              {dayTasks.map((t) => {
                const meta = TYPE_META[t.type];
                const Icon = meta.icon;
                return (
                  <li
                    key={t.idx}
                    className={`d-task tone-${meta.tone}` + (t.done ? ' is-done' : '')}
                    onClick={() => toggle(t.idx)}
                  >
                    <span className="d-check" />
                    <span className="d-icon"><Icon /></span>
                    <span className="d-body">
                      <span className="d-title">{t.title}</span>
                      <span className="d-meta">{meta.label}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          )}

          <p className="day-eyebrow day-eyebrow-mt">RECENTLY DONE</p>
          <ul className="day-list day-list-done">
            {DONE.map((d) => (
              <li key={d.title} className="d-task is-done">
                <span className="d-check" />
                <span className="d-body">
                  <span className="d-title">{d.title}</span>
                  <span className="d-meta">{d.date}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
