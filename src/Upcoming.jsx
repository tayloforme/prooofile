import React, { useMemo, useState } from 'react';
import TaskModal from './TaskModal.jsx';
import { TODAY, TYPES, parseDate, relativeStatus } from './data.js';

const VISIBLE = 4;

export default function Upcoming({ events, onComplete, onOpenCalendar }) {
  const [filter, setFilter]         = useState('all');
  const [expanded, setExpanded]     = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const upcoming = useMemo(() => {
    return events
      .filter((e) => !e.done)
      .map((e) => ({ ...e, when: parseDate(e.date) }))
      .filter((e) => e.when >= TODAY)
      .sort((a, b) => a.when - b.when || a.time.localeCompare(b.time));
  }, [events]);

  const counts = useMemo(() => {
    const c = { all: upcoming.length };
    Object.keys(TYPES).forEach((k) => { c[k] = 0; });
    upcoming.forEach((e) => { c[e.type] = (c[e.type] || 0) + 1; });
    return c;
  }, [upcoming]);

  const availableFilters = useMemo(() => {
    return ['all', ...Object.keys(TYPES).filter((k) => counts[k] > 0)];
  }, [counts]);

  const filtered = filter === 'all' ? upcoming : upcoming.filter((e) => e.type === filter);
  const visible  = expanded ? filtered : filtered.slice(0, VISIBLE);

  const switchFilter = (k) => {
    setFilter(k);
    setExpanded(false);
  };

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
        <>
          {availableFilters.length > 1 && (
            <div className="up-filters" role="tablist" aria-label="Filter by category">
              {availableFilters.map((k) => {
                const isActive = filter === k;
                const t        = k === 'all' ? null : TYPES[k];
                return (
                  <button
                    key={k}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={'filter-chip' + (isActive ? ' is-active' : '')}
                    style={
                      isActive && t
                        ? { background: t.color + '14', color: t.color, borderColor: t.color + '30' }
                        : undefined
                    }
                    onClick={() => switchFilter(k)}
                  >
                    {t ? t.label : 'All'}
                    <span className="chip-count">{counts[k]}</span>
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="up-empty">No {filter} tasks coming up.</div>
          ) : (
        <ul className="up-list">
          {visible.map((e) => {
            const t      = TYPES[e.type];
            const status = relativeStatus(e.when);
            return (
              <li
                key={e.id}
                className="up-card"
                style={{ borderLeftColor: t.color }}
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
        </>
      )}

      {filtered.length > VISIBLE && (
        <button
          type="button"
          className="show-more"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Show less' : `Show ${filtered.length - VISIBLE} more`}
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
