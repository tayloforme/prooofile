export const TODAY = new Date(2026, 4, 17);

export const TYPES = {
  health:     { label: 'Health',     color: '#3b82f6' },
  vaccine:    { label: 'Vaccine',    color: '#8b5cf6' },
  medication: { label: 'Medication', color: '#f59e0b' },
  grooming:   { label: 'Grooming',   color: '#ec4899' },
  activity:   { label: 'Activity',   color: '#10b981' },
  trip:       { label: 'Trip',       color: '#0d9488' },
};

export const INITIAL_EVENTS = [
  { id: 1,  date: '2026-05-17', time: '09:00', title: 'Forest walk',          type: 'activity',   subtype: 'Long walk',   note: '4.2 km · Riverside trail' },
  { id: 2,  date: '2026-05-17', time: '20:00', title: 'Brush teeth',          type: 'grooming',   subtype: 'Brush',       note: 'Use enzymatic paste' },
  { id: 3,  date: '2026-05-20', time: '11:00', title: 'Bath at home',         type: 'grooming',   subtype: 'Bath',        note: 'Sensitive-skin shampoo' },
  { id: 4,  date: '2026-05-22', time: '15:30', title: 'Vet follow-up',        type: 'health',     subtype: 'Checkup',     note: 'Dr. Patel · Riverside' },
  { id: 5,  date: '2026-05-25', time: '14:00', title: 'Deworming',            type: 'medication', subtype: 'Deworming',   note: 'Every 3 months' },
  { id: 6,  date: '2026-05-28', time: '14:00', title: 'NexGard dose',         type: 'medication', subtype: 'Flea & tick', note: 'Monthly · with food' },
  { id: 7,  date: '2026-06-01', time: '10:00', title: 'Rabies booster',       type: 'vaccine',    subtype: 'Vaccine',     note: 'Dr. Patel · Riverside' },
  { id: 8,  date: '2026-06-05', time: '11:00', title: 'Grooming salon',       type: 'grooming',   subtype: 'Salon',       note: 'Full groom' },
  { id: 9,  date: '2026-06-12', time: '08:00', title: 'Weekend at grandma’s', type: 'trip',       subtype: 'Boarding',    note: '3 days · drop-off morning' },
  { id: 10, date: '2026-06-15', time: '17:00', title: 'Playdate with Max',    type: 'activity',   subtype: 'Playdate',    note: 'Riverside park' },
  { id: 11, date: '2026-06-22', time: '14:00', title: 'NexGard dose',         type: 'medication', subtype: 'Flea & tick', note: 'Monthly' },
  { id: 12, date: '2026-07-04', time: '11:00', title: 'Dental cleaning',      type: 'health',     subtype: 'Dental',      note: 'Annual cleaning' },
  { id: 13, date: '2026-07-10', time: '08:00', title: 'Coast road trip',      type: 'trip',       subtype: 'Travel',      note: '4 days with us' },
  { id: 14, date: '2026-07-20', time: '17:00', title: 'Training class',       type: 'activity',   subtype: 'Training',    note: 'Recall practice' },
  { id: 15, date: '2026-07-22', time: '14:00', title: 'NexGard dose',         type: 'medication', subtype: 'Flea & tick', note: 'Monthly' },
  { id: 16, date: '2026-08-10', time: '10:00', title: 'DHPP booster',         type: 'vaccine',    subtype: 'Vaccine',     note: 'Dr. Patel · Riverside' },
];

export function parseDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(from, to) {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

