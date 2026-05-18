import React, { useMemo, useState } from 'react';
import {
  TODAY, PET_PROFILE,
  INITIAL_WEIGHTS, INITIAL_VACCINES, INITIAL_MEDICATIONS,
  parseDate, daysBetween,
} from './data.js';
import {
  Plus, ChevronDown, Dots,
  Heart, Shield, Pill,
  Star, Bulb, CheckCircle, AlertCircle, Activity, Bowl,
} from './icons.jsx';
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

const TAB_DAYS = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, All: null };
const TABS = Object.keys(TAB_DAYS);

const PILL_LABEL = {
  ok:    'Healthy weight',
  warn:  'Watch trend',
  alert: 'Outside range',
};

function getInsightMessage(verdict, latest) {
  if (verdict.status === 'ok') {
    return `Great job! ${PET_PROFILE.name}'s weight is within the healthy range. Keep up the good work!`;
  }
  if (verdict.status === 'warn') {
    return `${verdict.message}. Worth a closer look.`;
  }
  return `${PET_PROFILE.name}'s weight of ${latest.kg.toFixed(1)} kg is outside the typical range for ${PET_PROFILE.breed}.`;
}

function getRecommendation(verdict) {
  if (verdict.status === 'ok') {
    return 'To maintain a healthy weight, continue with regular exercise and a balanced diet.';
  }
  if (verdict.status === 'warn') {
    return 'Consider reviewing portion sizes and increasing daily activity. A vet check can help confirm.';
  }
  return 'A vet consultation is recommended to rule out medical causes and plan adjustments.';
}

export default function Health() {
  return (
    <>
      <div className="page-section-label">Health</div>
      <WeightCard />
      <VaccinesCard />
      <MedicationsCard />
    </>
  );
}

/* ---------- Weight ---------- */

function WeightCard() {
  const [tab, setTab] = useState('6M');

  const weights = useMemo(
    () => [...INITIAL_WEIGHTS].sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  const filtered = useMemo(() => {
    const days = TAB_DAYS[tab];
    if (!days) return weights;
    const cutoff = TODAY.getTime() - days * 86_400_000;
    return weights.filter((w) => parseDate(w.date).getTime() >= cutoff);
  }, [weights, tab]);

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

  const PillIcon = verdict.status === 'ok' ? CheckCircle : AlertCircle;
  const insight = getInsightMessage(verdict, latest);
  const recommendation = getRecommendation(verdict);

  return (
    <section className="health-card weight-card">
      <header className="card-head">
        <span className="card-icon card-icon-green"><Heart size={16} /></span>
        <h2 className="card-title">Weight</h2>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add weight
        </button>
      </header>

      <div className="weight-panel">
        <div className="weight-stats">
          <div className="weight-big-wrap">
            <span className="weight-big">{latest.kg.toFixed(1)}<small>kg</small></span>
          </div>

          {prev && (
            <div className="weight-delta-block">
              <span className={'weight-delta ' + (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat')}>
                {delta > 0 ? '↑' : delta < 0 ? '↓' : '→'} {Math.abs(delta).toFixed(1)} kg
              </span>
              <span className="weight-delta-meta">vs {deltaWeeks} {deltaWeeks === 1 ? 'week' : 'weeks'} ago</span>
            </div>
          )}

          <span className={'weight-pill weight-pill-' + verdict.status}>
            <PillIcon size={14} />
            {PILL_LABEL[verdict.status]}
          </span>
        </div>

        <div className="weight-chart-col">
          <WeightChart entries={filtered} range={PET_PROFILE.weightRange} />
          <div className="range-tabs">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                className={'range-tab' + (t === tab ? ' is-active' : '')}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="ai-row">
        <div className="ai-card ai-card-insight">
          <span className="ai-badge ai-badge-green"><Star size={16} /></span>
          <div className="ai-text">
            <p className="ai-label">AI Insight</p>
            <p className="ai-msg">{insight}</p>
          </div>
          <div className="ai-pet-wrap">
            <img className="ai-pet" src={PET_PROFILE.photo} alt="" />
            <span className="ai-pet-heart" aria-hidden="true">♥</span>
          </div>
        </div>

        <div className="ai-card ai-card-rec">
          <span className="ai-badge ai-badge-orange"><Bulb size={16} /></span>
          <div className="ai-text">
            <p className="ai-label ai-label-orange">Recommendation</p>
            <p className="ai-msg">{recommendation}</p>
            <div className="ai-actions">
              <button className="ai-action" type="button">
                <Activity size={13} /> View activity ideas
              </button>
              <button className="ai-action ai-action-filled" type="button">
                <Bowl size={13} /> Adjust food plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Weight chart ---------- */

function niceStep(raw) {
  for (const s of [0.5, 1, 2, 4, 5, 10, 20]) if (s >= raw) return s;
  return Math.ceil(raw / 10) * 10;
}

function computeYAxis(dataMin, dataMax, range) {
  const lo = Math.min(dataMin, range.min) - 3;
  const hi = Math.max(dataMax, range.max);
  const niceMin = Math.floor(lo / 2) * 2;
  const niceMax = Math.ceil(hi / 2) * 2;
  const step    = niceStep((niceMax - niceMin) / 3);
  const finalMax = niceMin + step * 3;
  const ticks = [0, 1, 2, 3].map((i) => niceMin + step * i);
  return { minY: niceMin, maxY: finalMax, ticks };
}

function WeightChart({ entries, range }) {
  const [hoverIdx, setHoverIdx] = useState(null);

  const W = 600, H = 200;
  const padL = 32, padR = 32, padT = 18, padB = 28;

  const n = entries.length;

  if (n === 0) {
    return (
      <div className="weight-chart-wrap weight-chart-empty">
        <p>No weight entries in this period.</p>
      </div>
    );
  }

  const points = entries.map((e) => ({
    t: parseDate(e.date).getTime(),
    kg: e.kg,
    date: parseDate(e.date),
  }));
  const minT = points[0].t;
  const maxT = points[n - 1].t;
  const span = Math.max(1, maxT - minT);

  const dataMin = Math.min(...points.map((p) => p.kg));
  const dataMax = Math.max(...points.map((p) => p.kg));
  const { minY, maxY, ticks: yTicks } = computeYAxis(dataMin, dataMax, range);

  const x = (t)  => n === 1 ? (W / 2) : padL + ((t - minT) / span) * (W - padL - padR);
  const y = (kg) => padT + (1 - (kg - minY) / (maxY - minY)) * (H - padT - padB);

  const xs = points.map((p) => x(p.t));
  const ys = points.map((p) => y(p.kg));

  let linePath = '';
  let areaPath = '';
  if (n > 1) {
    const m = [];
    for (let i = 0; i < n - 1; i++) m.push((ys[i+1] - ys[i]) / (xs[i+1] - xs[i]));
    const d = new Array(n);
    d[0] = m[0];
    d[n-1] = m[n-2];
    for (let i = 1; i < n - 1; i++) {
      d[i] = m[i-1] * m[i] <= 0 ? 0 : (m[i-1] + m[i]) / 2;
    }

    linePath = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
      const dx = (xs[i+1] - xs[i]) / 3;
      linePath += ` C ${(xs[i]+dx).toFixed(1)} ${(ys[i]+d[i]*dx).toFixed(1)}, ${(xs[i+1]-dx).toFixed(1)} ${(ys[i+1]-d[i+1]*dx).toFixed(1)}, ${xs[i+1].toFixed(1)} ${ys[i+1].toFixed(1)}`;
    }
    areaPath = `${linePath} L ${xs[n-1].toFixed(1)} ${H - padB} L ${xs[0].toFixed(1)} ${H - padB} Z`;
  }

  // Healthy band
  const bandTop    = Math.max(padT, y(range.max));
  const bandBottom = Math.min(H - padB, y(range.min));
  const showBand   = bandBottom > bandTop;

  // Month ticks
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
            <stop offset="0%"   stopColor="#111418" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#111418" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Healthy range band */}
        {showBand && (
          <rect
            x={padL} y={bandTop}
            width={W - padL - padR} height={bandBottom - bandTop}
            fill="#10b981" opacity="0.08"
          />
        )}
        {showBand && (
          <>
            <line x1={padL} x2={W - padR} y1={bandTop}    y2={bandTop}
                  stroke="#10b981" strokeDasharray="3 3" strokeOpacity="0.6" />
            <line x1={padL} x2={W - padR} y1={bandBottom} y2={bandBottom}
                  stroke="#10b981" strokeDasharray="3 3" strokeOpacity="0.6" />
            <text x={W - padR + 3} y={bandTop + 3.5}
                  fontSize="10" fill="#10b981">{range.max}</text>
            <text x={W - padR + 3} y={bandBottom + 3.5}
                  fontSize="10" fill="#10b981">{range.min}</text>
          </>
        )}

        {/* Y gridlines + labels */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={padL} x2={W - padR} y1={y(v)} y2={y(v)}
                  stroke="#eceef2" strokeWidth="1" />
            <text x={padL - 6} y={y(v) + 3.5}
                  fontSize="10" fill="#9aa0a8" textAnchor="end">{v}</text>
          </g>
        ))}
        <text x={padL - 6} y={padT - 6}
              fontSize="10" fill="#9aa0a8" textAnchor="end">kg</text>

        {/* Area + line */}
        {n > 1 && <path d={areaPath} fill="url(#wgrad)" />}
        {n > 1 && (
          <path d={linePath} fill="none" stroke="#111418" strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round" />
        )}

        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]}
                  r={i === last ? 4.5 : 2.5}
                  fill="#111418"
                  stroke={i === last ? '#fff' : 'none'}
                  strokeWidth={i === last ? 2 : 0} />
        ))}

        {/* Last value label */}
        <text x={xs[last]} y={ys[last] - 12} fontSize="11" fontWeight="700"
              fill="#111418" textAnchor="middle">
          {points[last].kg.toFixed(1)}
        </text>

        {/* X axis labels */}
        {monthTicks.map((tick, i) => (
          <text key={i} x={x(tick.t)} y={H - 8} fontSize="10" fill="#9aa0a8"
                textAnchor={i === 0 ? 'start' : i === monthTicks.length - 1 ? 'end' : 'middle'}>
            {tick.label}
          </text>
        ))}

        {/* Hit areas */}
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

/* ---------- Vaccines ---------- */

function VaccinesCard() {
  const enriched = INITIAL_VACCINES.map((v) => {
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
    <section className="health-card">
      <header className="card-head">
        <span className="card-icon card-icon-blue"><Shield size={16} /></span>
        <h2 className="card-title">Vaccines</h2>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add vaccine
        </button>
      </header>

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
    </section>
  );
}

/* ---------- Medications ---------- */

function MedicationsCard() {
  const [showPast, setShowPast] = useState(false);
  const active = INITIAL_MEDICATIONS.filter((m) => !m.endDate);
  const past   = INITIAL_MEDICATIONS.filter((m) =>  m.endDate);

  return (
    <section className="health-card">
      <header className="card-head">
        <span className="card-icon card-icon-amber"><Pill size={16} /></span>
        <h2 className="card-title">Medications</h2>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add medication
        </button>
      </header>

      <ul className="med-rows">
        {active.map((m) => <MedRow key={m.id} m={m} />)}
      </ul>

      {past.length > 0 && (
        <div className="med-past">
          <button className="completed-toggle" type="button" onClick={() => setShowPast((v) => !v)}>
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
    </section>
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
