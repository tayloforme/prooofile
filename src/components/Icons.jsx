import React from 'react';

const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconEdit = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M14 6l4 4" />
  </svg>
);

export const IconChevron = (p) => (
  <svg {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconPaw = (p) => (
  <svg {...base} {...p}>
    <circle cx="5.5" cy="9.5" r="1.6" />
    <circle cx="9.5" cy="5.5" r="1.6" />
    <circle cx="14.5" cy="5.5" r="1.6" />
    <circle cx="18.5" cy="9.5" r="1.6" />
    <path d="M7.5 17.5c0-3 2-5 4.5-5s4.5 2 4.5 5c0 1.7-1.3 2.5-3 2.2-1-.2-2-.2-3 0-1.7.3-3-.5-3-2.2z" />
  </svg>
);

export const IconHeart = (p) => (
  <svg {...base} {...p}>
    <path d="M12 21s-7-4.5-9-9.5C1.5 7.5 4 4 7.5 4c2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 22.5 7.5 21 11.5 19 16.5 12 21 12 21z" />
  </svg>
);

export const IconBell = (p) => (
  <svg {...base} {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconHelp = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5c.3-1.4 1.4-2 2.5-2 1.5 0 2.5 1 2.5 2.2 0 1.6-2.5 1.8-2.5 3.8" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </svg>
);

export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <path d="M4 8h10M18 8h2" />
    <circle cx="16" cy="8" r="2" />
    <path d="M4 16h6M14 16h6" />
    <circle cx="12" cy="16" r="2" />
  </svg>
);

export const IconClock = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconFlame = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M12 3c1 4 5 5 5 9a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-5 1-8z" />
  </svg>
);

export const IconTrash = (p) => (
  <svg {...base} width="14" height="14" {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </svg>
);

export const IconHome = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11l9-7 9 7" />
    <path d="M5 10v10h14V10" />
  </svg>
);

export const IconActivity = (p) => (
  <svg {...base} {...p}>
    <path d="M4 12h3l2-5 4 10 2-5h5" />
  </svg>
);

export const IconStats = (p) => (
  <svg {...base} {...p}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </svg>
);

export const IconUser = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.5-3.5 4.5-5 7.5-5s6 1.5 7.5 5" />
  </svg>
);
