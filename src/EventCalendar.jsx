import React, { useMemo, useState } from 'react';

const TODAY = new Date(2026, 4, 17);

const TYPES = {
  checkup:    { label: 'Checkup',    color: '#3b82f6' },
  vaccine:    { label: 'Vaccine',    color: '#8b5cf6' },
  grooming:   { label: 'Grooming',   color: '#ec4899' },
  medication: { label: 'Medication', color: '#f59e0b' },
};

const EVENTS = [
  { date: '2026-05-17', time: '09:00', title: 'Morning walk check', type: 'checkup',    note: 'Log mood & energy' },
  { date: '2026-05-17', time: '20:00', title: 'Brush teeth',        type: 'grooming',   note: 'Use enzymatic paste' },
  { date: '2026-05-20', time: '11:00', title: 'Bath & brush',       type: 'grooming',   note: 'Home grooming' },
  { date: '2026-05-22', time: '15:30', title: 'Vet follow-up',      type: 'checkup',    note: 'Dr. Patel · Riverside' },
  { date: '2026-05-28', time: '14:00', title: 'NexGard dose',       type: 'medication', note: 'Monthly · with food' },
  { date: '2026-06-01', time: '10:00', title: 'Rabies booster',     type: 'vaccine',    note: 'Dr. Patel · Riverside' },
  { date: '2026-06-05', time: '11:00', title: 'Grooming session',   type: 'grooming',   note: 'Salon visit' },
  { date: '2026-06-10', time: '09:30', title: 'Weigh-in',           type: 'checkup',    note: 'Track monthly trend' },
  { date: '2026-06-22', time: '14:00', title: 'NexGard dose',       type: 'medication', note: 'Monthly · with food' },
  { date: '2026-07-04', time: '11:00', title: 'Nail trim',          type: 'grooming',   note: 'Salon visit' },
  { date: '2026-07-22', time: '14:00', title: 'NexGard dose',       type: 'medication', note: 'Monthly · with food' },
  { date: '2026-08-10', time: '10:00', title: 'DHPP booster',       type: 'vaccine',    note: 'Dr. Patel · Riverside' },
];

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function key(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}
function daysBetween(a, b) {
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

const INITIAL_LIMIT = 4;

export default function EventCalendar() {
  const [view, setView] = useState({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
  const [expanded, setExpanded] = useState(false);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    EVENTS.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date).push(e);
    });
    return map;
  }, []);

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const offset = (first.getDay() + 6) % 7;
    const start = new Date(view.year, view.month, 1 - offset);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [view]);

  const upcoming = useMemo(() => {
    const end = new Date(TODAY);
    end.setDate(end.getDate() + 90);
    return EVENTS
      .map((e) => ({ ...e, when: parseDate(e.date) }))
      .filter((e) => e.when >= TODAY && e.when <= end)
      .sort((a, b) => a.when - b.when || a.time.localeCompare(b.time));
  }, []);

  const goTo = (dir) => {
    const m = view.month + dir;
    if (m < 0)        setView({ year: view.year - 1, month: 11 });
    else if (m > 11)  setView({ year: view.year + 1, month: 0 });
    else              setView({ year: view.year, month: m });
  };
  const goToday = () => setView({ year: TODAY.getFullYear(), month: TODAY.getMonth() });

  return (
    <section className="calendar-card">
      <header className="cal-header">
        <div>
          <p className="cal-eyebrow">Event Calendar</p>
          <h2 className="cal-title">{MONTHS[view.month]} {view.year}</h2>
        </div>
        <div className="cal-controls">
          <button className="cal-today" onClick={goToday}>Today</button>
          <div className="cal-nav-group">
            <button className="cal-nav" onClick={() => goTo(-1)} aria-label="Previous month"><ChevronLeft /></button>
            <button className="cal-nav" onClick={() => goTo(1)}  aria-label="Next month"><ChevronRight /></button>
          </div>
          <button className="cal-add" type="button"><Plus /> Add event</button>
        </div>
      </header>

      <div className="cal-layout">
        <div className="cal-grid-wrap">
          <div className="cal-weekdays">
            {WEEKDAYS.map((w) => <span key={w}>{w}</span>)}
          </div>
          <div className="cal-grid">
            {days.map((d) => {
              const out = d.getMonth() !== view.month;
              const isToday = sameDay(d, TODAY);
              const evts = eventsByDay.get(key(d)) || [];
              const types = [...new Set(evts.map((e) => e.type))];
              return (
                <div
                  key={d.toISOString()}
                  className={
                    'cal-day'
                    + (out ? ' is-out' : '')
                    + (isToday ? ' is-today' : '')
                  }
                >
                  <span className="cal-num">{d.getDate()}</span>
                  {types.length > 0 && (
                    <span className="cal-dots">
                      {types.slice(0, 3).map((t) => (
                        <i key={t} style={{ background: TYPES[t].color }} />
                      ))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="cal-legend">
            {Object.entries(TYPES).map(([k, t]) => (
              <span key={k}>
                <i style={{ background: t.color }} /> {t.label}
              </span>
            ))}
          </div>
        </div>

        <aside className="upcoming">
          <div className="upcoming-head">
            <p className="day-eyebrow">Upcoming · 90 days</p>
            <span className="upcoming-count">{upcoming.length} events</span>
          </div>
          <ul className="event-list">
            {(expanded ? upcoming : upcoming.slice(0, INITIAL_LIMIT)).map((e, idx) => {
              const t = TYPES[e.type];
              const diff = daysBetween(TODAY, e.when);
              const relative = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `in ${diff} days`;
              return (
                <li key={idx} className="event-card">
                  <div className="event-date">
                    <span className="ed-month">{MONTHS[e.when.getMonth()].slice(0, 3).toUpperCase()}</span>
                    <span className="ed-day">{e.when.getDate()}</span>
                    <span className="ed-rel">{relative}</span>
                  </div>
                  <span className="event-bar" style={{ background: t.color }} />
                  <div className="event-body">
                    <p className="event-title">{e.title}</p>
                    <p className="event-note">{e.time} · {e.note}</p>
                  </div>
                  <span
                    className="event-tag"
                    style={{ color: t.color, background: t.color + '14' }}
                  >
                    {t.label}
                  </span>
                </li>
              );
            })}
          </ul>
          {upcoming.length > INITIAL_LIMIT && (
            <button
              type="button"
              className="show-more"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded
                ? 'Show less'
                : `Show ${upcoming.length - INITIAL_LIMIT} more`}
              <Chevron down={!expanded} />
            </button>
          )}
        </aside>
      </div>
    </section>
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
function Chevron({ down }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: down ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.15s' }}>
      <path d="M6 9l6 6 6-6" />
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
