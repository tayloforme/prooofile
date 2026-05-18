import { parseDate } from './data.js';

export function assessWeight(kg, range) {
  if (kg < range.min) {
    return {
      status: 'alert',
      message: `Below breed range (${range.min}–${range.max} ${range.unit})`,
    };
  }
  if (kg > range.max) {
    return {
      status: 'alert',
      message: `Above breed range (${range.min}–${range.max} ${range.unit})`,
    };
  }
  return {
    status: 'ok',
    message: `Healthy range (${range.min}–${range.max} ${range.unit})`,
  };
}

export function assessTrend(entries) {
  if (entries.length < 2) return { status: 'ok', message: '' };
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const window = sorted.slice(-Math.min(5, sorted.length));
  const first = window[0];
  const last  = window[window.length - 1];
  const days  = (parseDate(last.date) - parseDate(first.date)) / 86_400_000;
  const weeks = Math.max(1, days / 7);
  const rate  = (last.kg - first.kg) / weeks;

  if (Math.abs(rate) > 0.2) {
    const dir = rate > 0 ? 'Gained' : 'Lost';
    const total = Math.abs(last.kg - first.kg).toFixed(1);
    return {
      status: 'warn',
      message: `${dir} ${total} kg in ${Math.round(weeks)} weeks — monitor closely`,
    };
  }
  return { status: 'ok', message: '' };
}

const PRIORITY = { alert: 3, warn: 2, ok: 1 };

export function combineStatus(...assessments) {
  return assessments.reduce((best, a) =>
    PRIORITY[a.status] > PRIORITY[best.status] ? a : best
  );
}
