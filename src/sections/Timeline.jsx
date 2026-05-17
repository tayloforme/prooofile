import React, { useState } from 'react';
import { IconTimeline } from '../components/Icons.jsx';

const EVENTS = [
  { type: 'health',   when: 'Today',     text: 'Logged symptom · paw licking' },
  { type: 'activity', when: 'Yesterday', text: 'Evening walk · 4.2 km',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=900&q=70' },
  { type: 'food',     when: 'Yesterday', text: 'Switched to salmon kibble' },
  { type: 'health',   when: 'May 12',    text: 'NexGard dose given' },
  { type: 'activity', when: 'May 9',     text: 'Beach trip · 90 min play' },
];

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'health',   label: 'Health' },
  { id: 'food',     label: 'Food' },
  { id: 'activity', label: 'Activity' },
];

export default function Timeline() {
  const [filter, setFilter] = useState('all');
  const visible = EVENTS.filter((e) => filter === 'all' || e.type === filter);

  return (
    <section id="timeline" className="section">
      <header className="section-head">
        <h2><span className="ico"><IconTimeline /></span>Timeline</h2>
        <div className="filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={'filter' + (filter === f.id ? ' is-active' : '')}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <ol className="timeline">
        {visible.map((e, i) => (
          <li key={i} className="t-item">
            <span className={`t-dot t-${e.type}`} />
            <time>{e.when}</time>
            <p>{e.text}</p>
            {e.image && <img src={e.image} alt="" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
