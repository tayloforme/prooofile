import React, { useMemo, useState } from 'react';
import {
  TODAY, PET_PROFILE,
  INITIAL_WEIGHTS, INITIAL_VACCINES, INITIAL_MEDICATIONS,
  parseDate, daysBetween,
} from './data.js';
import { Plus, ChevronDown, Dots } from './icons.jsx';
import { assessWeight, assessTrend, combineStatus } from './health.js';

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtShort = (d) => `${MONTH[d.getMonth()]} ${d.getDate()}`;
const fmtMonthYear = (d) => `${MONTH[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;

const RECENT_CHIPS = 4;

const STATUS_LABEL = {
  ok:       'Up to date',
  soon:     'Due soon',
  overdue:  'Overdue',
  unknown:  'Not given',
};

export default function Health() {
  const weights = useMemo(
    () => [...INITIAL_WEIGHTS].sort((a, b) => a.date.localeCompare(b.date)),
    []
  );
  const latest = weights[weights.length - 1];
  const prev   = weights[weights.length - 2];
  const delta  = prev ? latest.kg - prev.kg : 0;
  const deltaWeeks = prev
    ? Math.max(1, Math.round(daysBetween(parseDate(prev.date), parseDate(latest.date)) / 7))
    : 0;

  const verdict = combineStatus(
    assessWeight(latest.kg, PET_PROFILE.weightRange),
    assessTrend(weights),
  );

  const [showAllWeights, setShowAllWeights] = useState(false);
  const [showPastMeds,   setShowPastMeds]   = useState(false);

  const chipEntries = showAllWeights
    ? weights.slice().reverse()
    : weights.slice(-RECENT_CHIPS).reverse();

  return (
    <section className="health-card">
      <header className="health-head">
        <h2 className="health-title">Health</h2>
      </header>

      {/* Weight */}
      <div className="health-section">
        <div className="health-section-head">
          <h3>Weight</h3>
          <button className="btn-secondary" type="button">
            <Plus size={13} /> Log weight
          </button>
        </div>

        <div className="weight-row">
          <div className="weight-now">
            <span className="weight-big">
              {latest.kg.toFixed(1)} <small>kg</small>
            </span>
            {prev && (
              <span className={'weight-delta ' + (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat')}>
                {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {Math.abs(delta).toFixed(1)} kg
                <span className="weight-delta-meta">
                  · in {deltaWeeks} {deltaWeeks === 1 ? 'week' : 'weeks'}
                </span>
              </span>
            )}
          </div>
          <div className={'weight-verdict status-' + verdict.status}>
            <span className="status-dot" />
            <span>{verdict.message}</span>
          </div>
        </div>

        <WeightChart entries={weights} range={PET_PROFILE.weightRange} />

        <div className="weight-chips">
          {chipEntries.map((w) => (
            <span key={w.id} className="weight-chip">
              {fmtShort(parseDate(w.date))} · <b>{w.kg.toFixed(1)}</b>
            </span>
          ))}
          {weights.length > RECENT_CHIPS && (
            <button className="link-btn" type="button" onClick={() => setShowAllWeights((v) => !v)}>
              {showAllWeights ? 'Show less' : `View all (${weights.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Vaccines */}
      <div className="health-section">
        <div className="health-section-head">
          <h3>Vaccines</h3>
          <button className="btn-secondary" type="button">
            <Plus size={13} /> Add vaccine
          </button>
        </div>
        <VaccineList vaccines={INITIAL_VACCINES} />
      </div>

      {/* Medications */}
      <div className="health-section">
        <div className="health-section-head">
          <h3>Medications</h3>
          <button className="btn-secondary" type="button">
            <Plus size={13} /> Add medication
          </button>
        </div>
        <MedicationList
          meds={INITIAL_MEDICATIONS}
          showPast={showPastMeds}
          onTogglePast={() => setShowPastMeds((v) => !v)}
        />
      </div>
    </section>
  );
}

function WeightChart({ entries, range }) {
  const W = 600, H = 140;
  const padX = 8, padTop = 14, padBottom = 22;

  const points = entries.map((e) => ({ t: parseDate(e.date).getTime(), kg: e.kg }));
  const minT = points[0].t;
  const maxT = points[points.length - 1].t;
  const span = Math.max(1, maxT - minT);

  const minY = Math.min(range.min - 1, ...points.map((p) => p.kg));
  const maxY = Math.max(range.max + 1, ...points.map((p) => p.kg));

  const x = (t)  => padX + ((t - minT) / span) * (W - 2 * padX);
  const y = (kg) => padTop + (1 - (kg - minY) / (maxY - minY)) * (H - padTop - padBottom);

  const bandTop    = y(range.max);
  const bandBottom = y(range.min);

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.t).toFixed(1)} ${y(p.kg).toFixed(1)}`)
    .join(' ');

  const TICKS = 4;
  const labels = Array.from({ length: TICKS }, (_, i) => {
    const t = minT + (span * i) / (TICKS - 1);
    return { t, label: fmtMonthYear(new Date(t)) };
  });

  return (
    <svg className="weight-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <rect
        x={padX} y={bandTop}
        width={W - 2 * padX} height={Math.max(0, bandBottom - bandTop)}
        fill="#10b981" opacity="0.08"
      />
      <line x1={padX} y1={bandTop}    x2={W - padX} y2={bandTop}
            stroke="#10b981" strokeOpacity="0.35" strokeDasharray="3 3" />
      <line x1={padX} y1={bandBottom} x2={W - padX} y2={bandBottom}
            stroke="#10b981" strokeOpacity="0.35" strokeDasharray="3 3" />

      <path d={linePath} fill="none" stroke="#111418" strokeWidth="1.5"
            strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={x(p.t)} cy={y(p.kg)} r="3" fill="#111418" />
      ))}

      <text x={W - padX - 2} y={bandTop - 4} textAnchor="end"
            fontSize="10" fill="#10b981" fillOpacity="0.9">
        {range.max} kg
      </text>
      <text x={W - padX - 2} y={bandBottom + 12} textAnchor="end"
            fontSize="10" fill="#10b981" fillOpacity="0.9">
        {range.min} kg
      </text>

      {labels.map((l, i) => (
        <text key={i} x={x(l.t)} y={H - 6}
              textAnchor={i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle'}
              fontSize="10" fill="#9aa0a8">
          {l.label}
        </text>
      ))}
    </svg>
  );
}

function VaccineList({ vaccines }) {
  const enriched = vaccines.map((v) => {
    if (!v.lastDate) return { ...v, status: 'unknown', diff: null };
    const diff = daysBetween(TODAY, parseDate(v.nextDate));
    let status;
    if (diff < 0)        status = 'overdue';
    else if (diff <= 30) status = 'soon';
    else                 status = 'ok';
    return { ...v, status, diff };
  });
  const order = { overdue: 0, soon: 1, ok: 2, unknown: 3 };
  enriched.sort((a, b) => order[a.status] - order[b.status]);

  return (
    <ul className="vax-list">
      {enriched.map((v) => (
        <li key={v.id} className={'vax-row status-' + v.status}>
          <span className="vax-name">{v.name}</span>
          <span className="vax-dates">
            {v.lastDate ? (
              <>
                Last: {fmtMonthYear(parseDate(v.lastDate))}
                <span className="dot-sep" />
                Next: {fmtMonthYear(parseDate(v.nextDate))}
                {v.status === 'overdue' && <span className="vax-tag"> · overdue</span>}
                {v.status === 'soon' && <span className="vax-tag"> · in {v.diff}d</span>}
              </>
            ) : (
              <span className="vax-empty">Not given</span>
            )}
          </span>
          <span className="vax-status">
            <span className="status-dot" />
            {STATUS_LABEL[v.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}

function MedicationList({ meds, showPast, onTogglePast }) {
  const active = meds.filter((m) => !m.endDate);
  const past   = meds.filter((m) =>  m.endDate);

  return (
    <div className="med-list">
      <ul className="med-rows">
        {active.map((m) => <MedRow key={m.id} m={m} />)}
      </ul>

      {past.length > 0 && (
        <div className="med-past">
          <button className="completed-toggle" type="button" onClick={onTogglePast}>
            <ChevronDown size={12} style={{
              transform: showPast ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s',
            }} />
            Past
            <span className="bucket-count">{past.length}</span>
          </button>
          {showPast && (
            <ul className="med-rows">
              {past.map((m) => <MedRow key={m.id} m={m} past />)}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function MedRow({ m, past }) {
  return (
    <li className={'med-row' + (past ? ' is-past' : '')}>
      <span className="med-name">{m.name}</span>
      <span className="med-meta">{m.type} · {m.dose}</span>
      <span className="med-since">
        {past
          ? `${fmtMonthYear(parseDate(m.startDate))} – ${fmtMonthYear(parseDate(m.endDate))}`
          : `Since ${fmtMonthYear(parseDate(m.startDate))}`}
      </span>
      <button className="card-menu-trigger" type="button" aria-label="More options">
        <Dots size={14} />
      </button>
    </li>
  );
}
