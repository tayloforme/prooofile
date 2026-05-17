import React, { useMemo, useState } from 'react';
import TaskModal from './TaskModal.jsx';
import { TODAY, TYPES, parseDate, relativeStatus } from './data.js';

const VISIBLE = 4;

export default function Upcoming({ events, onComplete, onOpenCalendar }) {
  const [expanded, setExpanded]     = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const upcoming = useMemo(() => {
    return events
      .filter((e) => !e.done)
      .map((e) => ({ ...e, when: parseDate(e.date) }))
      .filter((e) => e.when >= TODAY)
      .sort((a, b) => a.when - b.when || a.time.localeCompare(b.time));
  }, [events]);

  const visible = expanded ? upcoming : upcoming.slice(0, VISIBLE);

  return (
    <section className="upcoming-card">
      <header className="up-header">
        <h2 className="up-title">Upcoming</h2>
        <div className="up-actions">
          <button className="btn-primary" type="button">
            <Plus /> Add event
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label="Open calendar"
            title="Open calendar"
            onClick={onOpenCalendar}
          >
            <CalendarIcon />
          </button>
        </div>
      </header>

      {upcoming.length === 0 ? (
        <div className="up-empty">All caught up. Nothing planned right now.</div>
      ) : (
        <ul className="up-list">
          {visible.map((e) => {
            const t      = TYPES[e.type];
            const status = relativeStatus(e.when);
            return (
              <li
                key={e.id}
                className="up-card"
                onClick={() => setActiveTask(e)}
                role="button"
                tabIndex={0}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') setActiveTask(e);
                }}
              >
                <div className="up-card-body">
                  <p className="up-card-title">{e.title}</p>
                  <p className="up-meta">
                    <span className={`status status-${status.tone}`}>{status.label}</span>
                    {e.time && <span className="dot-sep" />}
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

      {upcoming.length > VISIBLE && (
        <button
          type="button"
          className="show-more"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : `Show ${upcoming.length - VISIBLE} more`}
          <Chevron down={!expanded} />
        </button>
      )}

      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={(id) => {
            onComplete(id);
            setActiveTask(null);
          }}
        />
      )}
    </section>
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
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
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
