import React, { useMemo, useState } from 'react';
import {
  TODAY, PET_PROFILE,
  INITIAL_WEIGHTS, INITIAL_VACCINES, INITIAL_MEDICATIONS,
  parseDate, daysBetween,
} from './data.js';
import { Plus, ChevronDown, Dots } from './icons.jsx';
import { assessWeight, assessTrend, combineStatus } from './health.js';

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtMonthYear = (d) => `${MONTH[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
const fmtTooltip   = (d) => `${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;

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

  const [showPastMeds, setShowPastMeds] = useState(false);

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
            <Plus size={13} /> Add weight
          </button>
        </div>

        <div className="weight-row">
          <span className="weight-big">
            {latest.kg.toFixed(1)}<small>kg</small>
          </span>
          {prev && (
            <span className={'weight-delta ' + (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat')}>
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {Math.abs(delta).toFixed(1)} kg
              <span className="weight-delta-meta"> · {deltaWeeks} {deltaWeeks === 1 ? 'week' : 'weeks'}</span>
            </span>
          )}
          <span className={'weight-verdict status-' + verdict.status}>
            <span className="status-dot" />
            <span>{verdict.message}</span>
          </span>
        </div>

        <WeightChart entries={weights} range={PET_PROFILE.weightRange} />
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
  const [hoverIdx, setHoverIdx] = useState(null);

  const W = 900, H = 170;
  const padL = 12, padR = 12, padT = 24, padB = 22;

  const points = entries.map((e) => ({
    t: parseDate(e.date).getTime(),
    kg: e.kg,
    date: parseDate(e.date),
  }));
  const n = points.length;
  const minT = points[0].t;
  const maxT = points[n - 1].t;
  const span = Math.max(1, maxT - minT);

  const dataMin = Math.min(...points.map((p) => p.kg));
  const dataMax = Math.max(...points.map((p) => p.kg));
  const yPad   = Math.max(0.25, (dataMax - dataMin) * 0.18);
  const minY   = dataMin - yPad;
  const maxY   = dataMax + yPad;

  const x = (t)  => padL + ((t - minT) / span) * (W - padL - padR);
  const y = (kg) => padT + (1 - (kg - minY) / (maxY - minY)) * (H - padT - padB);

  const xs = points.map((p) => x(p.t));
  const ys = points.map((p) => y(p.kg));

  // Monotone cubic tangents
  const m = [];
  for (let i = 0; i < n - 1; i++) m.push((ys[i+1] - ys[i]) / (xs[i+1] - xs[i]));
  const d = new Array(n);
  d[0] = m[0];
  d[n-1] = m[n-2];
  for (let i = 1; i < n - 1; i++) {
    d[i] = m[i-1] * m[i] <= 0 ? 0 : (m[i-1] + m[i]) / 2;
  }

  let linePath = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const dx = (xs[i+1] - xs[i]) / 3;
    linePath += ` C ${(xs[i]+dx).toFixed(1)} ${(ys[i]+d[i]*dx).toFixed(1)}, ${(xs[i+1]-dx).toFixed(1)} ${(ys[i+1]-d[i+1]*dx).toFixed(1)}, ${xs[i+1].toFixed(1)} ${ys[i+1].toFixed(1)}`;
  }
  const areaPath = `${linePath} L ${xs[n-1].toFixed(1)} ${H - padB} L ${xs[0].toFixed(1)} ${H - padB} Z`;

  const showMax = range.max >= minY && range.max <= maxY;
  const showMin = range.min >= minY && range.min <= maxY;

  const monthTicks = [];
  let prevM = -1;
  points.forEach((p) => {
    const mn = p.date.getMonth();
    if (mn !== prevM) { monthTicks.push({ t: p.t, label: MONTH[mn] }); prevM = mn; }
  });

  const last = n - 1;

  return (
    <div className="weight-chart-wrap">
      <svg
        className="weight-chart"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#111418" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#111418" stopOpacity="0" />
          </linearGradient>
        </defs>

        {showMax && (
          <g>
            <line x1={padL} y1={y(range.max)} x2={W - padR} y2={y(range.max)}
                  stroke="#cbd2da" strokeDasharray="2 4" strokeWidth="1" />
            <text x={W - padR - 2} y={y(range.max) - 4} textAnchor="end" fontSize="10" fill="#9aa0a8">
              max {range.max}
            </text>
          </g>
        )}
        {showMin && (
          <g>
            <line x1={padL} y1={y(range.min)} x2={W - padR} y2={y(range.min)}
                  stroke="#cbd2da" strokeDasharray="2 4" strokeWidth="1" />
            <text x={W - padR - 2} y={y(range.min) + 12} textAnchor="end" fontSize="10" fill="#9aa0a8">
              min {range.min}
            </text>
          </g>
        )}

        <path d={areaPath} fill="url(#wgrad)" />
        <path d={linePath} fill="none" stroke="#111418" strokeWidth="2"
              strokeLinejoin="round" strokeLinecap="round" />

        {points.map((p, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]}
                  r={i === last ? 4.5 : 2.5}
                  fill="#111418"
                  stroke={i === last ? '#fff' : 'none'}
                  strokeWidth={i === last ? 2 : 0} />
        ))}

        <text x={xs[last]} y={ys[last] - 12} fontSize="11" fontWeight="700"
              fill="#111418" textAnchor="middle">
          {points[last].kg.toFixed(1)}
        </text>

        {monthTicks.map((tick, i) => (
          <text key={i} x={x(tick.t)} y={H - 5} fontSize="10" fill="#9aa0a8"
                textAnchor={i === 0 ? 'start' : i === monthTicks.length - 1 ? 'end' : 'middle'}>
            {tick.label}
          </text>
        ))}

        {points.map((p, i) => {
          const left  = i === 0     ? 0 : (xs[i-1] + xs[i]) / 2;
          const right = i === n - 1 ? W : (xs[i] + xs[i+1]) / 2;
          return (
            <rect key={i} x={left} y={0} width={right - left} height={H}
                  fill="transparent" style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoverIdx(i)} />
          );
        })}

        {hoverIdx !== null && (
          <g pointerEvents="none">
            <line x1={xs[hoverIdx]} y1={padT} x2={xs[hoverIdx]} y2={H - padB}
                  stroke="#111418" strokeOpacity="0.18" />
            <circle cx={xs[hoverIdx]} cy={ys[hoverIdx]} r="5.5"
                    fill="#111418" stroke="#fff" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {hoverIdx !== null && (
        <div
          className="weight-tooltip"
          style={{ left: `${(xs[hoverIdx] / W) * 100}%` }}
        >
          <strong>{points[hoverIdx].kg.toFixed(1)} kg</strong>
          <span>{fmtTooltip(points[hoverIdx].date)}</span>
        </div>
      )}
    </div>
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
