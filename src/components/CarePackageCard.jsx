import React from 'react';
import { IconClock, IconFlame, IconTrash } from './Icons.jsx';

export default function CarePackageCard({ data }) {
  return (
    <article className={`pkg tone-${data.tone}`}>
      <div className="pkg-text">
        <div className="pkg-top">
          <span className="pkg-tag">{data.tag}</span>
          <button className="pkg-trash" aria-label="Remove"><IconTrash /></button>
        </div>
        <h3 className="pkg-title">
          <span>{data.title}</span>
          <span>{data.titleSecond}</span>
        </h3>
        <div className="pkg-meta">
          <span className="meta-pill"><IconClock /> {data.duration}</span>
          <span className="meta-pill"><IconFlame /> {data.metric}</span>
        </div>
      </div>
      <img className="pkg-image" src={data.image} alt="" />
    </article>
  );
}
