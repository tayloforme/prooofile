import React from 'react';
import { IconClock, IconFlame, IconActivity, IconArrowRight } from '../components/Icons.jsx';

export default function Profile() {
  return (
    <section id="profile" className="section section-hero">
      <article className="hero tone-mint">
        <div className="hero-text">
          <span className="hero-tag">PET PROFILE</span>
          <h1 className="hero-title">
            <span>Meet Luna</span>
            <span>Golden Retriever</span>
          </h1>
          <p className="hero-sub">Healthy · 3 yrs · 27.4 kg · ♀</p>
          <div className="hero-pills">
            <span className="meta-pill"><IconClock /> 5/7 active days</span>
            <span className="meta-pill"><IconFlame /> 2 tasks today</span>
            <span className="meta-pill"><IconActivity /> Weight stable</span>
          </div>

          <div className="hero-actions">
            <button className="btn btn-primary">Add record <IconArrowRight /></button>
            <button className="btn btn-ghost">+ Symptom</button>
            <button className="btn btn-ghost">+ Photo</button>
          </div>
        </div>

        <div className="hero-photo-wrap">
          <img
            className="hero-photo"
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80"
            alt="Luna"
          />
          <span className="hero-status">
            <span className="status-dot" /> Healthy
          </span>
        </div>
      </article>
    </section>
  );
}
