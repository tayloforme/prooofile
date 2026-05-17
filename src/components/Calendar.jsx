import React from 'react';
import { IconChevronLeft, IconChevronRight } from './Icons.jsx';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
}

export default function Calendar({ today, view, setView, selected, setSelected, typesForDate, toneByType }) {
  const first = new Date(view.year, view.month, 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const start = new Date(view.year, view.month, 1 - offset);

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }

  const prev = () => {
    const m = view.month - 1;
    setView(m < 0 ? { year: view.year - 1, month: 11 } : { year: view.year, month: m });
  };
  const next = () => {
    const m = view.month + 1;
    setView(m > 11 ? { year: view.year + 1, month: 0 } : { year: view.year, month: m });
  };

  return (
    <div className="calendar">
      <div className="cal-head">
        <p className="cal-title">{MONTHS[view.month]} {view.year}</p>
        <div className="cal-nav-wrap">
          <button className="cal-nav" onClick={prev} aria-label="Previous"><IconChevronLeft /></button>
          <button className="cal-nav" onClick={next} aria-label="Next"><IconChevronRight /></button>
        </div>
      </div>

      <div className="cal-weekdays">
        {['M','T','W','T','F','S','S'].map((d, i) => <span key={i}>{d}</span>)}
      </div>

      <div className="cal-grid">
        {days.map((d) => {
          const out = d.getMonth() !== view.month;
          const isToday = sameDay(d, today);
          const isSelected = sameDay(d, selected);
          const types = typesForDate(d);
          return (
            <button
              key={d.toISOString()}
              type="button"
              className={
                'cal-day'
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
                  {types.slice(0, 3).map((t) => (
                    <i key={t} style={{ background: toneByType[t] }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="cal-legend">
        <span><i style={{ background: toneByType.vaccine }} /> Vaccine</span>
        <span><i style={{ background: toneByType.medication }} /> Medication</span>
        <span><i style={{ background: toneByType.grooming }} /> Grooming</span>
      </div>
    </div>
  );
}
