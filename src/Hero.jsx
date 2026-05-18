import React from 'react';
import { PET_PROFILE } from './data.js';
import { EditIcon } from './icons.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <button className="edit-btn" type="button">
        <EditIcon />
        Edit profile
      </button>

      <img className="hero-avatar" src={PET_PROFILE.photo} alt={PET_PROFILE.name} />

      <h1 className="hero-name">{PET_PROFILE.name}</h1>
      <p className="hero-meta">{PET_PROFILE.breed} · {PET_PROFILE.ageYears} Years Old</p>
    </section>
  );
}
