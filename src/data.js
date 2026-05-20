export const TODAY = new Date(2026, 4, 17);

export const PET_PROFILE = {
  name: 'Bella',
  breed: 'Golden Retriever',
  ageYears: 4,
  sex: 'Female',
  weightRange: { min: 25, max: 34, unit: 'kg' },
  photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&h=400&q=80',
};

export const PET_NUTRITION = {
  foodType: 'Dry kibble',
  amount: '2 cups / day',
  treats: '~ 2 per day',
};

export const PET_INSIGHTS = {
  weight:   { status: 'Slight increase' },
  activity: { status: 'On track' },
};

export const INITIAL_WEIGHTS = [
  { id: 1, date: '2025-11-20', kg: 26.8, note: '' },
  { id: 2, date: '2025-12-18', kg: 27.1, note: 'Post-holiday weigh-in' },
  { id: 3, date: '2026-01-15', kg: 27.3, note: '' },
  { id: 4, date: '2026-02-14', kg: 27.4, note: '' },
  { id: 5, date: '2026-03-12', kg: 27.5, note: '' },
  { id: 6, date: '2026-04-10', kg: 27.7, note: '' },
  { id: 7, date: '2026-04-26', kg: 27.7, note: '' },
  { id: 8, date: '2026-05-10', kg: 28.0, note: '' },
];

export const INITIAL_VACCINES = [
  { id: 1, name: 'Rabies',     description: 'Rabies Virus',                                       lastDate: '2025-06-15', nextDate: '2026-06-15' },
  { id: 2, name: 'DHPP',       description: 'Distemper, Hepatitis, Parainfluenza, Parvovirus',    lastDate: '2025-08-10', nextDate: '2026-08-10' },
  { id: 3, name: 'Bordetella', description: 'Kennel Cough',                                       lastDate: '2025-03-20', nextDate: '2026-03-20' },
  { id: 4, name: 'Lyme',       description: 'Lyme Disease',                                       lastDate: null,         nextDate: null },
];

export const INITIAL_MEDICATIONS = [
  { id: 1, name: 'NexGard',           type: 'Flea & tick', dose: '1 chew',   frequency: 'Monthly',   startDate: '2025-01-15', nextDose: '2026-05-17', endDate: null },
  { id: 2, name: 'Joint supplement',  type: 'Glucosamine', dose: '1 chew',   frequency: 'Daily',     startDate: '2026-03-01', nextDose: '2026-05-18', endDate: null },
  { id: 3, name: 'Apoquel',           type: 'Allergy',     dose: '16 mg',    frequency: 'Daily',     startDate: '2025-09-10', nextDose: null,         endDate: '2025-11-20' },
  { id: 4, name: 'Amoxicillin',       type: 'Antibiotic',  dose: '250 mg',   frequency: '2× daily',  startDate: '2025-12-01', nextDose: null,         endDate: '2025-12-10' },
];

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

