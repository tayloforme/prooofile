import React, { useEffect, useMemo, useState } from 'react';
import { TODAY, TYPES } from './data.js';
import { Plus, ChevronLeft, ChevronRight, Cross } from './icons.jsx';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAY_HEADER = ['M','T','W','T','F','S','S'];
const WEEKDAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function key(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

export default function CalendarModal({ events, onClose }) {
  const [view, setView]         = useState({ year: TODAY.getFullYear(), month: TODAY.getMonth() });
  const [selected, setSelected] = useState(new Date(TODAY));

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

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

  const selectedIsToday = sameDay(selected, TODAY);
  const dayLabel = selectedIsToday
    ? 'Today'
    : WEEKDAY_NAMES[selected.getDay()];

  return (
    <div className="cal-modal-backdrop" onClick={onClose}>
      <div className="cal-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Event calendar">
        <header className="cal-modal-head">
          <h3 className="cal-modal-title">{MONTHS[view.month]} {view.year}</h3>
          <div className="cal-modal-controls">
            <button className="cal-today" type="button" onClick={goToday}>Today</button>
            <div className="cal-nav-group">
              <button className="cal-nav" type="button" onClick={() => goTo(-1)} aria-label="Previous month"><ChevronLeft size={14} /></button>
              <button className="cal-nav" type="button" onClick={() => goTo(1)}  aria-label="Next month"><ChevronRight size={14} /></button>
            </div>
            <button className="icon-btn icon-btn-sm" type="button" onClick={onClose} aria-label="Close">
              <Cross size={14} />
            </button>
          </div>
        </header>

        <div className="cal-weekdays">
          {WEEKDAY_HEADER.map((w, i) => <span key={i}>{w}</span>)}
        </div>
        <div className="cal-grid cal-grid-modal">
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
                  'cal-day cal-day-modal'
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
                {types.length > 0 && !isSelected && (
                  <span className="cal-bars" aria-hidden="true">
                    {types.slice(0, 3).map((t) => (
                      <i key={t} style={{ background: TYPES[t].color }} />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="cal-modal-day">
          <header className="cal-day-head">
            <p className="cal-day-line">
              <strong>{dayLabel}</strong>
              <span className="dot-sep" />
              <span>{MONTHS_SHORT[selected.getMonth()]} {selected.getDate()}</span>
            </p>
            <button className="day-add" type="button">
              <Plus size={12} /> Add event
            </button>
          </header>

          {dayEvents.length === 0 ? (
            <p className="cal-empty">No events on this day.</p>
          ) : (
            <ul className="cal-day-list">
              {dayEvents.map((e) => {
                const t = TYPES[e.type];
                return (
                  <li key={e.id} className="cal-day-event" style={{ borderLeftColor: t.color }}>
                    <span className="cal-day-time">{e.time}</span>
                    <div className="cal-day-text">
                      <p className="cal-day-name">{e.title}</p>
                      {e.note && <p className="cal-day-note">{e.note}</p>}
                    </div>
                    <span className="badge badge-neutral">{e.subtype || t.label}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

