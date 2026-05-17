import React from 'react';
import {
  IconArrowRight, IconPlus, IconSparkle, IconClock,
} from '../components/Icons.jsx';

export default function Profile() {
  return (
    <section id="profile" className="section section-hero">
      <article className="hero tone-mint">
        <div className="hero-photo-wrap">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80"
            alt="Luna"
          />
        </div>

        <div className="hero-text">
          <div className="hero-top">
            <span className="hero-tag">PET PROFILE</span>
            <span className="hero-status">
              <span className="status-dot" /> Healthy
            </span>
          </div>

          <h1 className="hero-title">Luna</h1>
          <p className="hero-meta">Golden Retriever · 3 yrs · ♀</p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hs-label">Weight</span>
              <span className="hs-row">
                <span className="hs-value">27.4<span className="hs-unit">kg</span></span>
                <span className="hs-trend trend-up">
                  <TrendArrow /> +0.2
                </span>
              </span>
              <Sparkline />
            </div>

            <div className="hero-note">
              <span className="note-icon"><IconClock /></span>
              <div>
                <p className="note-label">UPCOMING</p>
                <p className="note-title">Vaccination in 5 days</p>
              </div>
            </div>
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary">
              <IconPlus /> Add record
            </button>
            <button className="btn btn-ghost">
              <IconSparkle /> Add symptom
            </button>
            <button className="btn btn-ghost">Upload photo</button>
            <button className="btn btn-ghost">Edit profile <IconArrowRight /></button>
          </div>
        </div>
      </article>
    </section>
  );
}

function TrendArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 14l6-6 6 6" />
    </svg>
  );
}

function Sparkline() {
  return (
    <svg className="hs-spark" viewBox="0 0 80 24" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0,18 C10,17 16,14 24,15 S44,20 56,12 72,8 80,6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
