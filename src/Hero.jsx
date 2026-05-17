import React from 'react';
import { EditIcon } from './icons.jsx';

const PET = {
  name: 'Bella',
  breed: 'Golden Retriever',
  age: '4 Years Old',
  photo:
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&h=400&q=80',
  stats: [
    { label: 'Weight',       value: '28 kg' },
    { label: 'Sex',          value: 'Female' },
    { label: 'Chip ID',      value: '#982012003' },
    { label: 'Last Checkup', value: '12 Oct 2024' },
  ],
};

export default function Hero() {
  return (
    <section className="hero">
      <img className="hero-avatar" src={PET.photo} alt={PET.name} />

      <div className="hero-body">
        <h1 className="hero-name">{PET.name}</h1>
        <p className="hero-meta">{PET.breed} · {PET.age}</p>

        <dl className="hero-stats">
          {PET.stats.map((s) => (
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
