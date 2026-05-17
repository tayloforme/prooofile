import React, { useEffect, useMemo, useRef, useState } from 'react';
import TaskModal from './TaskModal.jsx';
import { TODAY, TYPES, parseDate, daysBetween } from './data.js';

const VISIBLE = 4;
const HORIZON_DAYS = 14;
const RECENT_COMPLETED = 5;
const UNDO_MS = 6000;
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

function completedAgo(ts) {
  if (!ts) return '';
  const diffMs   = Date.now() - ts;
  const minutes  = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

export default function Upcoming({ events, onComplete, onRestore, onOpenCalendar }) {
  const [expanded, setExpanded]           = useState(false);
  const [activeTask, setActiveTask]       = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [lastCompleted, setLastCompleted] = useState(null);
  const undoTimerRef = useRef(null);

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

  const completed = useMemo(() => {
    return events
      .filter((e) => e.done)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, RECENT_COMPLETED);
  }, [events]);

  const visible = expanded ? upcoming : upcoming.slice(0, VISIBLE);

  const grouped = useMemo(() => {
    const g = { today: [], tomorrow: [], week: [], later: [] };
    visible.forEach((e) => { g[bucketOf(e.when)].push(e); });
    return g;
  }, [visible]);

  // Toast lifecycle
  useEffect(() => {
    if (!lastCompleted) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => setLastCompleted(null), UNDO_MS);
    return () => clearTimeout(undoTimerRef.current);
  }, [lastCompleted]);

  const handleComplete = (id) => {
    const task = events.find((e) => e.id === id);
    if (!task) return;
    onComplete(id);
    setLastCompleted(task);
  };
  const handleUndo = () => {
    if (!lastCompleted) return;
    onRestore(lastCompleted.id);
    setLastCompleted(null);
  };

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
                          onClick={stopAnd(() => handleComplete(e.id))}
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

      {completed.length > 0 && (
        <div className="completed-block">
          <button
            className="completed-toggle"
            type="button"
            onClick={() => setShowCompleted((v) => !v)}
          >
            <Chevron down={!showCompleted} />
            Recently completed
            <span className="bucket-count">{completed.length}</span>
          </button>

          {showCompleted && (
            <ul className="up-list completed-list">
              {completed.map((e) => {
                const t = TYPES[e.type];
                return (
                  <li
                    key={e.id}
                    className="up-card up-card-done"
                    style={{ borderLeftColor: t.color }}
                  >
                    <button
                      className="card-check is-checked"
                      type="button"
                      aria-label="Restore task"
                      onClick={() => onRestore(e.id)}
                    >
                      <Check />
                    </button>
                    <div className="up-card-body">
                      <p className="up-card-title">{e.title}</p>
                      <p className="up-meta">
                        <span className="up-note">Done {completedAgo(e.completedAt)}</span>
                      </p>
                    </div>
                    <button
                      className="restore-btn"
                      type="button"
                      onClick={() => onRestore(e.id)}
                    >
                      Restore
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {activeTask && (
        <TaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onComplete={(id) => {
            handleComplete(id);
            setActiveTask(null);
          }}
        />
      )}

      {lastCompleted && (
        <div className="undo-toast" role="status">
          <span>Marked “{lastCompleted.title}” as done</span>
          <button type="button" onClick={handleUndo}>Undo</button>
        </div>
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
