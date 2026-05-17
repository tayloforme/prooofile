import React from 'react';
import { IconSparkle, IconArrowRight } from '../components/Icons.jsx';

const ITEMS = [
  {
    tone: 'rose',
    tag: 'NUTRITION',
    title: 'Try salmon-based diet',
    body: 'Likely reduces paw licking in 3–4 weeks. Linked to chicken allergy.',
    cta: 'See products',
    prio: 'High',
  },
  {
    tone: 'mint',
    tag: 'ACTIVITY',
    title: 'Add midday play',
    body: '15-min burst around noon could improve evening sleep.',
    cta: 'View plan',
    prio: 'Med',
  },
  {
    tone: 'peach',
    tag: 'PREVENTIVE',
    title: 'Dental check due',
    body: '4 months since last cleaning. Plaque builds up quickly for retrievers.',
    cta: 'Book',
    prio: 'Low',
  },
];

export default function Insights() {
  return (
    <section id="insights" className="section">
      <header className="section-head">
        <h2><span className="ico"><IconSparkle /></span>AI Insights</h2>
        <span className="muted-mini">Updated today</span>
      </header>

      <div className="insight-grid">
        {ITEMS.map((it) => (
          <article key={it.title} className={`insight tone-${it.tone}`}>
            <header className="i-head">
              <span className="i-tag">{it.tag}</span>
              <span className={`i-prio prio-${it.prio.toLowerCase()}`}>{it.prio}</span>
            </header>
            <h3>{it.title}</h3>
            <p className="i-body">{it.body}</p>
            <button className="link-btn">{it.cta} <IconArrowRight /></button>
          </article>
        ))}
      </div>
    </section>
  );
}
