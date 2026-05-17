import React, { useMemo, useState } from 'react';
import TaskModal from './TaskModal.jsx';
import { TODAY, TYPES, parseDate, daysBetween } from './data.js';

const VISIBLE = 4;
const HORIZON_DAYS = 14;
const WEEKDAY = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BUCKET_ORDER = ['today', 'tomorrow', 'week', 'later'];
const BUCKET_LABEL = {
  today:    'Today',
  tomorrow: 'Tomorrow',
  week:     'This week',
  later:    'Upcoming',
};

function bucketOf(date) {
  const diff = daysBetween(TODAY, date);
  if (diff <= 0)  return 'today';
  if (diff === 1) return 'tomorrow';
  if (diff <= 7)  return 'week';
  return 'later';
}

function whenLine(bucket, e) {
  switch (bucket) {
    case 'today':
    case 'tomorrow':
      return e.time;
    case 'week':
      return `${WEEKDAY[e.when.getDay()]} · ${e.time}`;
    default:
      return `${MONTH[e.when.getMonth()]} ${e.when.getDate()} · ${e.time}`;
  }
}

export default function Upcoming({ events, onComplete, onOpenCalendar }) {
  const [expanded, setExpanded]     = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const upcoming = useMemo(() => {
    return events
      .filter((e) => !e.done)
      .map((e) => ({ ...e, when: parseDate(e.date) }))
      .filter((e) => {
        const diff = daysBetween(TODAY, e.when);
        return diff >= 0 && diff <= HORIZON_DAYS;
      })
      .sort((a, b) => a.when - b.when || a.time.localeCompare(b.time));
  }, [events]);

  const visible = expanded ? upcoming : upcoming.slice(0, VISIBLE);

  const grouped = useMemo(() => {
    const g = { today: [], tomorrow: [], week: [], later: [] };
    visible.forEach((e) => { g[bucketOf(e.when)].push(e); });
    return g;
  }, [visible]);

  const stopAnd = (fn) => (ev) => { ev.stopPropagation(); fn(); };

  return (
    <section className="upcoming-card">
      <header className="up-header">
        <h2 className="up-title">Care plan</h2>
        <div className="up-actions">
          <button className="btn-secondary" type="button">
            <Plus /> Add event
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label="Open calendar"
            title="Open full calendar"
            onClick={onOpenCalendar}
          >
            <CalendarIcon />
          </button>
        </div>
      </header>

      {upcoming.length === 0 ? (
        <div className="up-empty">All caught up. Nothing planned in the next {HORIZON_DAYS} days.</div>
      ) : (
        <div className="up-buckets">
          {BUCKET_ORDER.map((key) => {
            const items = grouped[key];
            if (items.length === 0) return null;
            return (
              <div key={key} className={`bucket bucket-${key}`}>
                <h3 className="bucket-head">
                  {BUCKET_LABEL[key]}
                  {items.length > 1 && <span className="bucket-count">{items.length}</span>}
                </h3>
                <ul className="up-list">
                  {items.map((e) => {
                    const t = TYPES[e.type];
                    return (
                      <li
                        key={e.id}
                        className={'up-card up-card-' + key}
                        style={{ borderLeftColor: t.color }}
                        onClick={() => setActiveTask(e)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(ev) => { if (ev.key === 'Enter') setActiveTask(e); }}
                      >
                        <button
                          className="card-check"
                          type="button"
                          aria-label={`Mark "${e.title}" as done`}
                          onClick={stopAnd(() => onComplete(e.id))}
                        >
                          <Check />
                        </button>
                        <div className="up-card-body">
                          <p className="up-card-title">{e.title}</p>
                          <p className="up-meta">
                            <span className="when">{whenLine(key, e)}</span>
                            {e.note && <span className="dot-sep" />}
                            {e.note && <span className="up-note">{e.note}</span>}
                          </p>
                        </div>
                        <span className="badge badge-neutral">
                          {e.subtype || t.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
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
function Check() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
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
