import React from 'react';
import { PET_PROFILE } from './data.js';
import { EditIcon } from './icons.jsx';

const STATS = [
  { label: 'Weight',       value: '28 kg' },
  { label: 'Sex',          value: 'Female' },
  { label: 'Chip ID',      value: '#982012003' },
  { label: 'Last Checkup', value: '12 Oct 2024' },
];

export default function Hero() {
  return (
    <section className="hero">
      <img className="hero-avatar" src={PET_PROFILE.photo} alt={PET_PROFILE.name} />

      <div className="hero-body">
        <h1 className="hero-name">{PET_PROFILE.name}</h1>
        <p className="hero-meta">{PET_PROFILE.breed} · {PET_PROFILE.ageYears} Years Old</p>

        <dl className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <button className="edit-btn" type="button">
        <EditIcon />
        Edit profile
      </button>
    </section>
  );
}
