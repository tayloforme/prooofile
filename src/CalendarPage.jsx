import React, { useMemo, useState } from 'react';
import { TODAY, TYPES, parseDate, formatLongDate } from './data.js';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function key(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function CalendarPage({ events, onBack }) {
  const [view, setView]         = useState({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
  const [selected, setSelected] = useState(new Date(TODAY));

  const eventsByDay = useMemo(() => {
    const map = new Map();
    events.filter((e) => !e.done).forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    });
    return map;
  }, [events]);

  const days = useMemo(() => {
    const first  = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start  = new Date(view.year, view.month, 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const dayEvents = (eventsByDay.get(key(selected)) || [])
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time));

  const goTo = (dir) => {
    const m = view.month + dir;
    if (m < 0)       setView({ year: view.year - 1, month: 11 });
    else if (m > 11) setView({ year: view.year + 1, month: 0 });
    else             setView({ year: view.year, month: m });
  };
  const goToday = () => {
    setView({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
    setSelected(new Date(TODAY));
  };

  return (
    <main className="page">
      <section className="calendar-page">
        <header className="cp-header">
          <button className="back-btn" onClick={onBack}><ChevronLeft /> Back</button>
          <div className="cp-title-wrap">
            <p className="cal-eyebrow">Event Calendar</p>
            <h2 className="cal-title">{MONTHS[view.month]} {view.year}</h2>
          </div>
          <div className="cal-controls">
            <button className="cal-today" onClick={goToday}>Today</button>
            <div className="cal-nav-group">
              <button className="cal-nav" onClick={() => goTo(-1)} aria-label="Previous month"><ChevronLeft /></button>
              <button className="cal-nav" onClick={() => goTo(1)}  aria-label="Next month"><ChevronRight /></button>
            </div>
            <button className="btn-primary" type="button"><Plus /> Add event</button>
          </div>
        </header>

        <div className="cp-layout">
          <div>
            <div className="cal-weekdays">
              {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
            </div>
            <div className="cal-grid cal-grid-large">
              {days.map((d) => {
                const out        = d.getMonth() !== view.month;
                const isToday    = sameDay(d, TODAY);
                const isSelected = sameDay(d, selected);
                const evts       = eventsByDay.get(key(d)) || [];
                const types      = [...new Set(evts.map((e) => e.type))];
                return (
                  <button
                    key={d.toISOString()}
                    type="button"
                    className={
                      'cal-day cal-day-large'
                      + (out ? ' is-out' : '')
                      + (isToday ? ' is-today' : '')
                      + (isSelected ? ' is-selected' : '')
                    }
                    onClick={() => {
                      if (out) setView({ year: d.getFullYear(), month: d.getMonth() });
                      setSelected(d);
                    }}
                  >
                    <span className="cal-num">{d.getDate()}</span>
                    {types.length > 0 && (
                      <span className="cal-dots">
                        {types.slice(0, 4).map((t) => (
                          <i key={t} style={{ background: TYPES[t].color }} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="cp-day">
            <p className="cal-eyebrow">{sameDay(selected, TODAY) ? 'Today' : 'Selected'}</p>
            <h3 className="cp-day-title">{formatLongDate(selected)}</h3>

            {dayEvents.length === 0 ? (
              <div className="up-empty">No events on this day.</div>
            ) : (
              <ul className="up-list">
                {dayEvents.map((e) => {
                  const t = TYPES[e.type];
                  return (
                    <li key={e.id} className="up-card">
                      <div className="up-card-body">
                        <p className="up-card-title">{e.title}</p>
                        <p className="up-meta">
                          {e.time && <span>{e.time}</span>}
                          {e.note && <span className="dot-sep" />}
                          {e.note && <span className="up-note">{e.note}</span>}
                        </p>
                      </div>
                      <span
                        className="badge"
                        style={{ color: t.color, background: t.color + '14' }}
                      >
                        {e.subtype || t.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
function Plus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
