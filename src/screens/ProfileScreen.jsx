import React from 'react';
import BottomNav from '../components/BottomNav.jsx';
import { IconEdit, IconChevron, IconPaw, IconHeart, IconBell, IconHelp, IconSettings } from '../components/Icons.jsx';

const STATS = [
  { icon: '🦴', value: '3 yrs',  label: 'Age' },
  { icon: '⚖️', value: '27.4',   label: 'kg' },
  { icon: '💉', value: '2',      label: 'Done' },
];

const ITEMS = [
  { icon: <IconPaw />,      label: 'Pet details' },
  { icon: <IconHeart />,    label: 'Health' },
  { icon: <IconBell />,     label: 'Reminders' },
  { icon: <IconSettings />, label: 'Preferences' },
  { icon: <IconHelp />,     label: 'Help' },
];

export default function ProfileScreen() {
  return (
    <div className="screen profile-screen">
      <header className="screen-head">
        <button className="head-btn ghost" aria-label="Back">‹</button>
        <h1 className="head-title">Profile</h1>
        <button className="head-btn ghost" aria-label="More">···</button>
      </header>

      <div className="profile-top">
        <div className="avatar-wrap">
          <img
            className="avatar"
            src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=240&h=240&q=80"
            alt="Luna"
          />
          <button className="avatar-edit" aria-label="Edit photo">
            <IconEdit />
          </button>
        </div>
        <h2 className="profile-name">Luna</h2>
        <p className="profile-sub">Golden Retriever · luna@family</p>
      </div>

      <ul className="stat-row">
        {STATS.map((s) => (
          <li key={s.label} className="stat-chip">
            <span className="stat-emoji" aria-hidden="true">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </li>
        ))}
      </ul>

      <ul className="menu-list">
        {ITEMS.map((it) => (
          <li key={it.label} className="menu-item">
            <span className="menu-icon">{it.icon}</span>
            <span className="menu-label">{it.label}</span>
            <span className="menu-arrow"><IconChevron /></span>
          </li>
        ))}
      </ul>

      <BottomNav active="profile" />
    </div>
  );
}
