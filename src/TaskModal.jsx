import React, { useEffect } from 'react';
import { TYPES, parseDate, relativeStatus, formatLongDate } from './data.js';

export default function TaskModal({ task, onClose, onComplete }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const t      = TYPES[task.type];
  const when   = parseDate(task.date);
  const status = relativeStatus(when);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <span
            className="badge"
            style={{ color: t.color, background: t.color + '14' }}
          >
            {task.subtype || t.label}
          </span>
          <button className="icon-btn icon-btn-sm" onClick={onClose} aria-label="Close">
            <Cross />
          </button>
        </header>

        <h3 className="modal-title">{task.title}</h3>

        <dl className="modal-meta">
          <div>
            <dt>When</dt>
            <dd>
              <span className={`status status-${status.tone}`}>{status.label}</span>
              <span className="modal-sub">{formatLongDate(when)}{task.time ? ` · ${task.time}` : ''}</span>
            </dd>
          </div>
          <div>
            <dt>Category</dt>
            <dd>{t.label}</dd>
          </div>
          {task.note && (
            <div>
              <dt>Notes</dt>
              <dd>{task.note}</dd>
            </div>
          )}
        </dl>

        <footer className="modal-foot">
          <button className="btn-primary" type="button" onClick={() => onComplete(task.id)}>
            <Check /> Mark as done
          </button>
          <button className="btn-ghost" type="button" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}

function Cross() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6l12 12M18 6l-12 12" />
    </svg>
  );
}
function Check() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
