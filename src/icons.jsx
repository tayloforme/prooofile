import React from 'react';

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function Svg({ size = 14, stroke = 1.8, children, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" strokeWidth={stroke} {...base} {...rest}>
      {children}
    </svg>
  );
}

export const Plus        = (p) => <Svg stroke={2.2} {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const Check       = (p) => <Svg stroke={3} {...p}><path d="M5 12l5 5L20 7" /></Svg>;
export const ChevronDown = (p) => <Svg stroke={2.2} {...p}><path d="M6 9l6 6 6-6" /></Svg>;
export const ChevronLeft  = (p) => <Svg stroke={2} {...p}><path d="M15 6l-6 6 6 6" /></Svg>;
export const ChevronRight = (p) => <Svg stroke={2} {...p}><path d="M9 6l6 6-6 6" /></Svg>;
export const Cross       = (p) => <Svg stroke={2} {...p}><path d="M6 6l12 12M18 6l-12 12" /></Svg>;

export const CalendarIcon = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Svg>
);

export const EditIcon = (p) => (
  <Svg {...p}>
    <path d="M4 20h4l10-10-4-4L4 16v4z" />
    <path d="M14 6l4 4" />
  </Svg>
);

export const ClockIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

export const TrashIcon = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
  </Svg>
);

export function Dots({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  );
}
