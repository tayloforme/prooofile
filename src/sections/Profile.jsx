import React, { useState } from 'react';
import {
  IconHeart, IconShare, IconStar, IconPaw, IconScale,
  IconSyringe, IconAlert, IconPlus, IconCamera, IconEdit,
} from '../components/Icons.jsx';

export default function Profile() {
  const [saved, setSaved] = useState(false);

  return (
    <section className="hero">
      <div className="hero-gallery">
        <img
          className="hero-photo"
          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80"
          alt="Luna"
        />
        <div className="hero-photo-actions">
          <button className="circle-btn"><IconShare /> Share</button>
          <button
            className={'circle-btn' + (saved ? ' is-saved' : '')}
            onClick={() => setSaved((v) => !v)}
          >
            <IconHeart filled={saved} />
            {saved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="hero-body">
        <header className="hero-head">
          <div>
            <h1 className="hero-title">Luna</h1>
            <p className="hero-sub">
              Golden Retriever <span className="dot" /> 3 yrs <span className="dot" /> Female
            </p>
          </div>
          <div className="hero-rating">
            <IconStar filled />
            <strong>Healthy</strong>
            <span className="hero-rating-meta">· 12 vet visits</span>
          </div>
        </header>

        <hr className="hr" />

        <div className="hero-stats">
          <div className="stat">
            <div className="stat-icon"><IconScale /></div>
            <div>
              <p className="stat-value">27.4 kg <span className="trend">↑ +0.2 last month</span></p>
              <p className="stat-label">Current weight</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><IconSyringe /></div>
            <div>
              <p className="stat-value">Vaccination in 5 days</p>
              <p className="stat-label">Rabies booster · Dr. Patel</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><IconPaw /></div>
            <div>
              <p className="stat-value">5 / 7 active days</p>
              <p className="stat-label">Walks logged this week</p>
            </div>
          </div>
          <div className="stat">
            <div className="stat-icon"><IconAlert /></div>
            <div>
              <p className="stat-value">1 active symptom</p>
              <p className="stat-label">Paw licking · 3 days</p>
            </div>
          </div>
        </div>

        <hr className="hr" />

        <div className="hero-actions">
          <button className="btn btn-primary"><IconPlus /> Add record</button>
          <button className="btn btn-secondary"><IconAlert /> Add symptom</button>
          <button className="btn btn-secondary"><IconCamera /> Upload photo</button>
          <button className="btn btn-link"><IconEdit /> Edit profile</button>
        </div>
      </div>
    </section>
  );
}
