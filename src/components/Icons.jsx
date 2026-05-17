import React from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconHeart = ({ filled, ...p }) => (
  <svg width="16" height="16" {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 21s-7-4.5-9-9.5C1.5 7.5 4 4 7.5 4c2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 22.5 7.5 21 11.5 19 16.5 12 21 12 21z" />
  </svg>
);

export const IconShare = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
    <path d="M16 6l-4-4-4 4" />
    <path d="M12 2v14" />
  </svg>
);

export const IconStar = ({ filled, ...p }) => (
  <svg width="14" height="14" {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 3l2.6 5.6L20 9.4l-4 4 1 5.8L12 16.6 7 19.2l1-5.8-4-4 5.4-.8z" />
  </svg>
);

export const IconPaw = (p) => (
  <svg width="18" height="18" {...base} {...p}>
    <circle cx="5.5" cy="9.5" r="1.6" />
    <circle cx="9.5" cy="5.5" r="1.6" />
    <circle cx="14.5" cy="5.5" r="1.6" />
    <circle cx="18.5" cy="9.5" r="1.6" />
    <path d="M7.5 17.5c0-3 2-5 4.5-5s4.5 2 4.5 5c0 1.7-1.3 2.5-3 2.2-1-.2-2-.2-3 0-1.7.3-3-.5-3-2.2z" />
  </svg>
);

export const IconScale = (p) => (
  <svg width="18" height="18" {...base} {...p}>
    <path d="M5 7h14l-1 13H6z" />
    <circle cx="12" cy="5" r="2" />
    <path d="M8 12l4-4 4 4" />
  </svg>
);

export const IconSyringe = (p) => (
  <svg width="18" height="18" {...base} {...p}>
    <path d="M14 4l6 6" />
    <path d="M16 6l-9 9-3 4 4-3 9-9" />
    <path d="M9 14l1 1M11 12l1 1M13 10l1 1" />
  </svg>
);

export const IconAlert = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v5" />
    <circle cx="12" cy="18" r="0.6" fill="currentColor" />
  </svg>
);

export const IconPlus = (p) => (
  <svg width="14" height="14" {...base} {...p} strokeWidth="2.2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconCamera = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <path d="M4 7h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);

export const IconEdit = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M14 6l4 4" />
  </svg>
);
