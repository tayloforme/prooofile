import React from 'react';
import { IconHome, IconActivity, IconStats, IconUser } from './Icons.jsx';

const TABS = [
  { id: 'home',    label: 'Home',     icon: IconHome },
  { id: 'care',    label: 'Care',     icon: IconActivity },
  { id: 'stats',   label: 'Stats',    icon: IconStats },
  { id: 'profile', label: 'Profile',  icon: IconUser },
];

export default function BottomNav({ active = 'home', onTab }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {TABS.map((t) => {
        const Icon = t.icon;
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            className={'nav-tab' + (isActive ? ' is-active' : '')}
            onClick={() => onTab && onTab(t.id)}
            type="button"
          >
            <Icon />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
