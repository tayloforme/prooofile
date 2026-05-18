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

export const Heart = (p) => (
  <Svg {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </Svg>
);

export const Shield = (p) => (
  <Svg {...p}>
    <path d="M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </Svg>
);

export const Pill = (p) => (
  <Svg {...p}>
    <rect x="2" y="9" width="20" height="6" rx="3" />
    <line x1="12" y1="9" x2="12" y2="15" />
  </Svg>
);

export const Star = (p) => (
  <Svg stroke={1.6} {...p}>
    <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 9 8.5 12 2" />
  </Svg>
);

export const Bulb = (p) => (
  <Svg {...p}>
    <path d="M9 18h6M10 22h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7c.6.6 1 1.4 1 2.3v1h6v-1c0-.9.4-1.7 1-2.3A7 7 0 0 0 12 2z" />
  </Svg>
);

export const CheckCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12l3 3 5-6" />
  </Svg>
);

export const AlertCircle = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="8" x2="12" y2="13" />
    <line x1="12" y1="16.5" x2="12" y2="16.5" />
  </Svg>
);

export const Activity = (p) => (
  <Svg {...p}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);

export const Bowl = (p) => (
  <Svg {...p}>
    <path d="M3 11h18a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8z" />
    <path d="M7 7c0-1.5 2-3 5-3s5 1.5 5 3" />
  </Svg>
);

export const HeartPulse = (p) => (
  <Svg {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    <polyline points="3.5 12 8 12 10 9 13 15 15 12 20.5 12" />
  </Svg>
);

export const DocIcon = (p) => (
  <Svg {...p}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </Svg>
);

export const WeightIcon = (p) => (
  <Svg {...p}>
    <path d="M5 8h14l-1.5 12a2 2 0 0 1-2 1.8H8.5a2 2 0 0 1-2-1.8L5 8z" />
    <path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" />
  </Svg>
);

export const InfoIcon = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <line x1="12" y1="7.5" x2="12" y2="8" />
  </Svg>
);

export const Sun = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </Svg>
);

export const QuestionMark = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9.5a2.5 2.5 0 1 1 4.5 1.5c-.7 1-2 1.5-2 2.5" />
    <line x1="12" y1="17" x2="12" y2="17.5" />
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
