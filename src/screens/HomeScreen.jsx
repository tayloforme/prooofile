import React from 'react';
import BottomNav from '../components/BottomNav.jsx';
import CarePackageCard from '../components/CarePackageCard.jsx';
import { IconClock, IconFlame } from '../components/Icons.jsx';

const FEATURED = {
  tone: 'mint',
  tag: "TODAY'S CARE",
  title: 'Day 1\nFull walk',
  duration: '29 min',
  metric: '4.2 km',
  image:
    'https://images.unsplash.com/photo-1601758174039-7d3f2adbcb8e?auto=format&fit=crop&w=600&q=80',
};

const PACKAGES = [
  {
    tone: 'rose',
    tag: 'GROOMING',
    title: 'Bath & brush',
    titleSecond: 'session',
    duration: '25 min',
    metric: 'Home',
    image:
      'https://images.unsplash.com/photo-1583511666445-775f1f2116f5?auto=format&fit=crop&w=600&q=80',
  },
  {
    tone: 'peach',
    tag: 'TRAINING',
    title: 'Sit & stay',
    titleSecond: 'practice',
    duration: '15 min',
    metric: 'Treats',
    image:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
  },
];

export default function HomeScreen({ active, onTab }) {
  return (
    <div className="screen home-screen">
      <header className="screen-head head-row">
        <div>
          <p className="hi-line">Hi, Shane</p>
          <p className="hi-sub">Luna&apos;s plan for today</p>
        </div>
        <img
          className="hi-avatar"
          src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=120&h=120&q=80"
          alt=""
        />
      </header>

      <FeaturedCard data={FEATURED} />

      <div className="section-head">
        <h2>Care Packages</h2>
        <button className="see-all">See all</button>
      </div>

      <div className="package-list">
        {PACKAGES.map((p) => (
          <CarePackageCard key={p.title} data={p} />
        ))}
      </div>

      <BottomNav active={active} onTab={onTab} />
    </div>
  );
}

function FeaturedCard({ data }) {
  return (
    <article className={`featured tone-${data.tone}`}>
      <div className="featured-text">
        <span className="featured-tag">{data.tag}</span>
        <h3 className="featured-title">
          {data.title.split('\n').map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </h3>
        <div className="featured-meta">
          <span className="meta-pill"><IconClock /> {data.duration}</span>
          <span className="meta-pill"><IconFlame /> {data.metric}</span>
        </div>
      </div>
      <img className="featured-image" src={data.image} alt="" />
    </article>
  );
}
