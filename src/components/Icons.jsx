import React from 'react';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const IconPaw = (p) => (
  <svg width="18" height="18" {...base} {...p}>
    <circle cx="5.5" cy="9.5" r="1.6" />
    <circle cx="9.5" cy="5.5" r="1.6" />
    <circle cx="14.5" cy="5.5" r="1.6" />
    <circle cx="18.5" cy="9.5" r="1.6" />
    <path d="M7.5 17.5c0-3 2-5 4.5-5s4.5 2 4.5 5c0 1.7-1.3 2.5-3 2.2-1-.2-2-.2-3 0-1.7.3-3-.5-3-2.2z" />
  </svg>
);

export const IconHeart = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <path d="M12 21s-7-4.5-9-9.5C1.5 7.5 4 4 7.5 4c2 0 3.5 1 4.5 2.5C13 5 14.5 4 16.5 4 20 4 22.5 7.5 21 11.5 19 16.5 12 21 12 21z" />
  </svg>
);

export const IconBell = (p) => (
  <svg width="18" height="18" {...base} {...p}>
    <path d="M6 8a6 6 0 0 1 12 0c0 4 2 5 2 7H4c0-2 2-3 2-7z" />
    <path d="M10 19a2 2 0 0 0 4 0" />
  </svg>
);

export const IconClock = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconFlame = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M12 3c1 4 5 5 5 9a5 5 0 1 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 1-5 1-8z" />
  </svg>
);

export const IconActivity = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M4 12h3l2-5 4 10 2-5h5" />
  </svg>
);

export const IconBolt = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M13 3L5 14h6l-1 7 8-11h-6z" />
  </svg>
);

export const IconCalendar = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);

export const IconSparkle = (p) => (
  <svg width="16" height="16" {...base} {...p}>
    <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" />
    <path d="M5 18l.9 2.1L8 21l-2.1.9L5 24l-.9-2.1L2 21l2.1-.9z" />
  </svg>
);

export const IconArrowRight = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const IconChevronLeft = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const IconChevronRight = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const IconPlus = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconStethoscope = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M6 3v6a4 4 0 0 0 8 0V3" />
    <path d="M10 13v2a4 4 0 0 0 8 0v-2" />
    <circle cx="18" cy="11" r="1.5" />
  </svg>
);

export const IconScissors = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M8 8l12 10M8 16L20 6" />
  </svg>
);

export const IconPill = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-30 12 12)" />
    <path d="M9 9.5l4.5 4.5" />
  </svg>
);

export const IconSyringe = (p) => (
  <svg width="14" height="14" {...base} {...p}>
    <path d="M14 4l6 6M16 6l-9 9-3 4 4-3 9-9" />
    <path d="M9 14l1 1" />
  </svg>
);
