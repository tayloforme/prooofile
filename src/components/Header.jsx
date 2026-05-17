import React, { useEffect, useState } from 'react';
import { IconPaw, IconBell } from './Icons.jsx';

const SECTIONS = [
  { id: 'profile',  label: 'Profile' },
  { id: 'health',   label: 'Health' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'tasks',    label: 'Tasks' },
  { id: 'insights', label: 'Insights' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
      <div className="container header-inner">
        <a className="brand" href="#profile">
          <span className="brand-mark"><IconPaw /></span>
          <span className="brand-name">Prooofile</span>
        </a>

        <div className="header-pet">
          <img
            className="header-avatar"
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=80&h=80&q=80"
            alt=""
          />
          <span className="header-pet-name">Luna</span>
        </div>

        <nav className="header-nav">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.label}</a>
          ))}
        </nav>

        <button className="header-bell" aria-label="Notifications">
          <IconBell />
          <span className="bell-dot" />
        </button>
      </div>
    </header>
  );
}
