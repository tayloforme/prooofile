import React from 'react';
import { IconHeart, IconClock, IconSyringe, IconPill } from '../components/Icons.jsx';

const VACCINES = [
  { name: 'Rabies',     date: 'Jun 1',  pct: 88 },
  { name: 'DHPP',       date: 'Aug 14', pct: 55 },
  { name: 'Bordetella', date: 'Oct 22', pct: 30 },
];

const MEDS = [
  { name: 'NexGard',  freq: 'Monthly', tone: 'mint' },
  { name: 'Omega-3',  freq: 'Daily',   tone: 'peach' },
];

export default function Health() {
  return (
    <section id="health" className="section">
      <header className="section-head">
        <h2><span className="ico"><IconHeart /></span>Health</h2>
        <a className="link-btn" href="#">Full history →</a>
      </header>

      <div className="next-up tone-lilac">
        <div className="next-icon"><IconClock /></div>
        <div className="next-text">
          <p className="next-label">NEXT ACTION</p>
          <p className="next-title">Rabies booster · in 12 days</p>
        </div>
        <button className="btn btn-primary btn-sm">Book</button>
      </div>

      <div className="health-grid">
        <div className="h-card">
          <div className="h-head">
            <div className="h-head-l"><IconSyringe /> <span className="h-label">Vaccinations</span></div>
            <span className="badge badge-ok">Up to date</span>
          </div>
          <ul className="h-list">
            {VACCINES.map((v) => (
              <li key={v.name}>
                <span className="h-name">{v.name}</span>
                <span className="h-progress"><i style={{ width: `${v.pct}%` }} /></span>
                <span className="h-meta">{v.date}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-card">
          <div className="h-head">
            <div className="h-head-l"><IconPill /> <span className="h-label">Medications</span></div>
            <span className="badge">2</span>
          </div>
          <ul className="h-list h-list-simple">
            {MEDS.map((m) => (
              <li key={m.name}>
                <span className={`h-pill tone-${m.tone}`}>{m.name[0]}</span>
                <span className="h-name">{m.name}</span>
                <span className="h-meta">{m.freq}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-card">
          <div className="h-head">
            <div className="h-head-l"><span className="h-label">Symptoms</span></div>
            <span className="badge badge-warn">1 active</span>
          </div>
          <ul className="h-list h-list-simple">
            <li>
              <span className="h-dot warn" />
              <span className="h-name">Paw licking</span>
              <span className="h-meta">3 days</span>
            </li>
          </ul>
          <p className="h-empty">Otherwise feeling great</p>
        </div>

        <div className="h-card">
          <div className="h-head">
            <div className="h-head-l"><span className="h-label">Allergies</span></div>
            <span className="badge">2</span>
          </div>
          <div className="h-tags">
            <span className="h-tag tone-rose">Chicken</span>
            <span className="h-tag tone-peach">Grass pollen</span>
          </div>
        </div>
      </div>
    </section>
  );
}
