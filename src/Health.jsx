import React, { useMemo, useState } from 'react';
import {
  TODAY, PET_PROFILE, PET_NUTRITION, PET_INSIGHTS,
  INITIAL_WEIGHTS, INITIAL_VACCINES, INITIAL_MEDICATIONS,
  parseDate, daysBetween,
} from './data.js';
import {
  Plus, ChevronRight, ClockIcon, CalendarIcon,
  HeartPulse, DocIcon, Shield, Pill, Bowl, InfoIcon, Sun,
  Sparkle, Scale, Shoe,
  CheckCircle, AlertCircle, QuestionMark,
} from './icons.jsx';

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtFullDate  = (d) => `${MONTH[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
const fmtMonthDay  = (d) => `${MONTH[d.getMonth()]} ${d.getDate()}`;

function fmtRelativeDate(d) {
  const diff = daysBetween(TODAY, d);
  if (diff === 0)  return `Today, ${fmtMonthDay(d)}`;
  if (diff === 1)  return `Tomorrow, ${fmtMonthDay(d)}`;
  if (diff === -1) return `Yesterday, ${fmtMonthDay(d)}`;
  return fmtFullDate(d);
}

const STATUS_LABEL = {
  ok:       'Up to date',
  soon:     null, // shown as "In N days" instead
  overdue:  'Overdue',
  unknown:  'No record',
};

const VAX_ACTION = {
  overdue: 'Schedule',
  soon:    'Remind me',
  ok:      'View record',
  unknown: 'Add record',
};

const TONE = {
  overdue: 'red',
  soon:    'amber',
  ok:      'green',
  unknown: 'gray',
};

const TAB_DAYS = { '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365, All: null };
const TABS = Object.keys(TAB_DAYS);

function vaxIcon(status) {
  if (status === 'overdue') return <AlertCircle size={16} />;
  if (status === 'soon')    return <Sun size={16} />;
  if (status === 'ok')      return <Shield size={16} />;
  return <QuestionMark size={16} />;
}

function classifyVaccines(vaccines) {
  const list = vaccines.map((v) => {
    if (!v.lastDate) return { ...v, status: 'unknown', diff: null };
    const diff = daysBetween(TODAY, parseDate(v.nextDate));
    let status;
    if (diff < 0)        status = 'overdue';
    else if (diff <= 30) status = 'soon';
    else                 status = 'ok';
    return { ...v, status, diff };
  });
  const order = { overdue: 0, soon: 1, ok: 2, unknown: 3 };
  list.sort((a, b) => order[a.status] - order[b.status]);
  return list;
}

export default function Health() {
  const vaccines = useMemo(() => classifyVaccines(INITIAL_VACCINES), []);
  const activeMeds = useMemo(() => INITIAL_MEDICATIONS.filter((m) => !m.endDate), []);

  const counts = useMemo(() => {
    const c = { overdue: 0, soon: 0, ok: 0, unknown: 0 };
    vaccines.forEach((v) => c[v.status]++);
    activeMeds.forEach((m) => {
      const diff = daysBetween(TODAY, parseDate(m.nextDose));
      if (diff > 0) c.ok++;
    });
    return c;
  }, [vaccines, activeMeds]);

  const needsAttention = useMemo(() => {
    const items = [];
    vaccines.filter((v) => v.status === 'overdue').forEach((v) => {
      items.push({
        key: `v-${v.id}`,
        kind: 'vaccine',
        tone: 'red',
        name: `${v.name} vaccine`,
        sub: v.description,
        dateLabel: 'Was due',
        dateValue: fmtFullDate(parseDate(v.nextDate)),
        valueTone: 'red',
        actionLabel: 'Schedule',
      });
    });
    activeMeds.filter((m) => daysBetween(TODAY, parseDate(m.nextDose)) <= 0).forEach((m) => {
      items.push({
        key: `m-${m.id}`,
        kind: 'med',
        tone: 'amber',
        name: m.name,
        sub: m.type,
        dateLabel: 'Next dose',
        dateValue: fmtRelativeDate(parseDate(m.nextDose)),
        valueTone: 'red',
        actionLabel: 'Give dose',
      });
    });
    return items;
  }, [vaccines, activeMeds]);

  return (
    <section className="health-card">
      <header className="health-main-head">
        <h2 className="health-main-title">Health</h2>
        <button className="btn-secondary card-action" type="button">
          <DocIcon size={14} /> Health report
        </button>
      </header>

      <div className="status-summary">
        <StatusCard status="overdue" count={counts.overdue} label="Overdue"    sub="Needs attention"     icon={<AlertCircle size={16} />} />
        <StatusCard status="soon"    count={counts.soon}    label="Due soon"   sub="In the next 30 days" icon={<ClockIcon size={16} />} />
        <StatusCard status="ok"      count={counts.ok}      label="Up to date" sub="All good"            icon={<CheckCircle size={16} />} />
        <StatusCard status="unknown" count={counts.unknown} label="Missing"    sub="No record"           icon={<QuestionMark size={16} />} />
      </div>

      {needsAttention.length > 0 && <NeedsAttentionBlock items={needsAttention} />}

      <div className="health-row">
        <MedicationsBlock meds={activeMeds} />
        <VaccinesBlock vaccines={vaccines} />
      </div>

      <div className="health-row">
        <NutritionBlock nutrition={PET_NUTRITION} />
        <WeightBlock />
      </div>

      <InsightsBlock />

      <Disclaimer />
    </section>
  );
}

/* ---------- Status summary card ---------- */

function StatusCard({ status, count, label, sub, icon }) {
  return (
    <button className={'status-card status-card-' + status} type="button">
      <span className="status-card-badge">{icon}</span>
      <div className="status-card-text">
        <strong>{count}</strong>
        <span className="status-card-label">{label}</span>
        <span className="status-card-sub">{sub}</span>
      </div>
      <ChevronRight size={14} className="status-card-chev" />
    </button>
  );
}

/* ---------- Needs attention ---------- */

function NeedsAttentionBlock({ items }) {
  return (
    <div className="health-block health-block-needs">
      <header className="block-head needs-head">
        <h3 className="block-title">Needs attention</h3>
        <span className="needs-count">{items.length}</span>
        <button className="block-link-inline" type="button">View all</button>
      </header>
      <ul className="block-list">
        {items.map((item) => (
          <li key={item.key} className="block-row needs-row">
            <span className={'item-icon item-icon-' + item.tone}>
              {item.kind === 'vaccine' ? <Shield size={14} /> : <Pill size={14} />}
            </span>
            <div className="item-main">
              <p className="item-name">{item.name}</p>
              <p className="item-sub">{item.sub}</p>
            </div>
            <div className="item-info">
              <p className="item-info-label">{item.dateLabel}</p>
              <p className={'item-info-value tone-' + item.valueTone}>{item.dateValue}</p>
            </div>
            <button className={'item-action item-action-filled item-action-' + item.tone} type="button">
              {item.actionLabel}
            </button>
            <button className="item-chev" type="button" aria-label="Details">
              <ChevronRight size={14} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Medications ---------- */

function MedicationsBlock({ meds }) {
  return (
    <div className="health-block health-block-meds">
      <header className="block-head">
        <span className="block-icon block-icon-amber"><Pill size={14} /></span>
        <h3 className="block-title">Medications</h3>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add medication
        </button>
      </header>
      <ul className="block-list">
        {meds.map((m) => {
          const nextDoseDate = parseDate(m.nextDose);
          const diff = daysBetween(TODAY, nextDoseDate);
          const valueTone = diff <= 0 ? 'red' : '';
          return (
            <li key={m.id} className="block-row med-row">
              <span className="item-icon item-icon-amber"><Pill size={14} /></span>
              <div className="item-main">
                <p className="item-name">{m.name}</p>
                <p className="item-sub">{m.type} · {m.dose}, {m.frequency.toLowerCase()}</p>
              </div>
              <div className="item-info">
                <p className="item-info-label">Next dose</p>
                <p className={'item-info-value tone-' + valueTone}>{fmtRelativeDate(nextDoseDate)}</p>
              </div>
              <button className="item-action item-action-amber" type="button">Give dose</button>
            </li>
          );
        })}
      </ul>
      <button className="block-link block-link-amber" type="button">
        <span>View all medications</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ---------- Vaccines ---------- */

function vaxStatusInfo(v) {
  if (!v.lastDate) {
    return { topText: 'No record', topTone: 'gray', dateText: null };
  }
  if (v.status === 'overdue') {
    return { topText: 'Overdue', topTone: 'red', dateText: fmtFullDate(parseDate(v.nextDate)) };
  }
  if (v.status === 'soon') {
    return {
      topText: v.diff === 1 ? 'In 1 day' : `In ${v.diff} days`,
      topTone: 'amber',
      dateText: fmtFullDate(parseDate(v.nextDate)),
    };
  }
  return {
    topText: 'Up to date',
    topTone: 'green',
    dateText: fmtFullDate(parseDate(v.nextDate)),
  };
}

function VaccinesBlock({ vaccines }) {
  return (
    <div className="health-block health-block-vax">
      <header className="block-head">
        <span className="block-icon block-icon-green"><Shield size={14} /></span>
        <h3 className="block-title">Vaccines</h3>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add vaccine
        </button>
      </header>
      <ul className="block-list">
        {vaccines.map((v) => {
          const tone = TONE[v.status];
          const info = vaxStatusInfo(v);
          return (
            <li key={v.id} className="block-row vax-row">
              <span className={'item-icon item-icon-' + tone}>{vaxIcon(v.status)}</span>
              <div className="item-main">
                <p className="item-name">{v.name}</p>
                <p className="item-sub">{v.description}</p>
              </div>
              <div className="vax-status-info">
                <p className={'vax-status-top tone-' + info.topTone}>{info.topText}</p>
                {info.dateText && <p className="vax-status-date">{info.dateText}</p>}
              </div>
              <button className={'item-action item-action-' + tone} type="button">
                {VAX_ACTION[v.status]}
              </button>
              <button className="item-chev" type="button" aria-label="Details">
                <ChevronRight size={14} />
              </button>
            </li>
          );
        })}
      </ul>
      <button className="block-link block-link-green" type="button">
        <span><CalendarIcon size={14} /> View vaccine calendar</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ---------- Nutrition ---------- */

function NutritionBlock({ nutrition }) {
  return (
    <div className="health-block health-block-nutrition">
      <header className="block-head">
        <span className="block-icon block-icon-green"><Bowl size={14} /></span>
        <h3 className="block-title">Nutrition</h3>
        <button className="btn-secondary card-action" type="button">Edit</button>
      </header>
      <div className="nutrition-grid">
        <div>
          <p className="nutrition-label">Food type</p>
          <p className="nutrition-value">{nutrition.foodType}</p>
        </div>
        <div>
          <p className="nutrition-label">Amount</p>
          <p className="nutrition-value">{nutrition.amount}</p>
        </div>
        <div>
          <p className="nutrition-label">Treats</p>
          <p className="nutrition-value">{nutrition.treats}</p>
        </div>
      </div>
      <button className="block-link block-link-amber nutrition-link" type="button">
        <span>View feeding history</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

/* ---------- Weight ---------- */

function WeightBlock() {
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

  return (
    <div className="health-block health-block-weight">
      <header className="block-head">
        <span className="block-icon block-icon-green"><CalendarIcon size={14} /></span>
        <h3 className="block-title">Weight</h3>
        <button className="btn-secondary card-action" type="button">
          <Plus size={13} /> Add weight
        </button>
      </header>
      <div className="weight-content">
        <div className="weight-stats">
          <div>
            <span className="weight-big">{latest.kg.toFixed(1)}</span>
            <span className="weight-big-unit">kg</span>
          </div>
          {prev && (
            <div className="weight-delta-block">
              <span className={'weight-delta ' + (delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat')}>
                {delta > 0 ? '↗' : delta < 0 ? '↘' : '→'} {Math.abs(delta).toFixed(1)} kg
              </span>
              <span className="weight-delta-meta">vs {deltaWeeks} {deltaWeeks === 1 ? 'week' : 'weeks'} ago</span>
            </div>
          )}
          <div className="weight-range-info">
            <span className="status-dot tone-green" />
            <strong>Healthy range</strong>
          </div>
          <p className="weight-range-meta">{PET_PROFILE.weightRange.min}–{PET_PROFILE.weightRange.max} kg</p>
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
    </div>
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

  const W = 500, H = 140;
  const padL = 26, padR = 30, padT = 12, padB = 22;

  const n = entries.length;
  if (n === 0) {
    return <div className="weight-chart-wrap weight-chart-empty"><p>No entries.</p></div>;
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

  const bandTop    = Math.max(padT, y(range.max));
  const bandBottom = Math.min(H - padB, y(range.min));
  const showBand   = bandBottom > bandTop;

  const monthTicks = [];
  let prevM = -1;
  points.forEach((p) => {
    const mn = p.date.getMonth();
    if (mn !== prevM) { monthTicks.push({ t: p.t, label: MONTH[mn] }); prevM = mn; }
  });

  const last = n - 1;

  return (
    <div className="weight-chart-wrap">
      <svg className="weight-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
           onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id="wgrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#10b981" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {showBand && (
          <rect x={padL} y={bandTop} width={W - padL - padR}
                height={bandBottom - bandTop} fill="#10b981" opacity="0.08" />
        )}
        {showBand && (
          <>
            <line x1={padL} x2={W - padR} y1={bandTop}    y2={bandTop}
                  stroke="#10b981" strokeDasharray="3 3" strokeOpacity="0.55" />
            <line x1={padL} x2={W - padR} y1={bandBottom} y2={bandBottom}
                  stroke="#10b981" strokeDasharray="3 3" strokeOpacity="0.55" />
          </>
        )}

        {yTicks.map((v) => (
          <text key={v} x={padL - 6} y={y(v) + 3.5}
                fontSize="9" fill="#9aa0a8" textAnchor="end">{v}</text>
        ))}

        {n > 1 && <path d={areaPath} fill="url(#wgrad)" />}
        {n > 1 && (
          <path d={linePath} fill="none" stroke="#111418" strokeWidth="2"
                strokeLinejoin="round" strokeLinecap="round" />
        )}

        {points.map((p, i) => (
          <circle key={i} cx={xs[i]} cy={ys[i]} r={i === last ? 4 : 2.2}
                  fill="#111418" stroke={i === last ? '#fff' : 'none'}
                  strokeWidth={i === last ? 2 : 0} />
        ))}

        <text x={xs[last] + 7} y={ys[last] + 4} fontSize="11" fontWeight="700"
              fill="#111418" textAnchor="start">
          {points[last].kg.toFixed(1)}
        </text>

        {monthTicks.map((tick, i) => (
          <text key={i} x={x(tick.t)} y={H - 6} fontSize="9" fill="#9aa0a8"
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
            <circle cx={xs[hoverIdx]} cy={ys[hoverIdx]} r="5"
                    fill="#111418" stroke="#fff" strokeWidth="2.5" />
          </g>
        )}
      </svg>

      {hoverIdx !== null && (
        <div className="weight-tooltip" style={{ left: `${(xs[hoverIdx] / W) * 100}%` }}>
          <strong>{points[hoverIdx].kg.toFixed(1)} kg</strong>
          <span>{fmtFullDate(points[hoverIdx].date)}</span>
        </div>
      )}
    </div>
  );
}

/* ---------- Insights ---------- */

function InsightsBlock() {
  return (
    <div className="health-block health-block-insights">
      <header className="block-head">
        <span className="block-icon block-icon-indigo"><Sparkle size={14} /></span>
        <h3 className="block-title">Insights</h3>
      </header>
      <div className="insights-summary">
        <span className="insights-summary-icon"><Sparkle size={14} /></span>
        <p>{PET_INSIGHTS.summary}</p>
      </div>
      <div className="insights-grid">
        <div className="insights-item">
          <span className="insights-icon insights-icon-slate"><Scale size={16} /></span>
          <div>
            <p className="insights-item-title">Weight trend</p>
            <p className="insights-item-status">{PET_INSIGHTS.weight.status}</p>
            <p className="insights-item-sub">{PET_INSIGHTS.weight.sub}</p>
          </div>
        </div>
        <div className="insights-item">
          <span className="insights-icon insights-icon-mint"><Shoe size={16} /></span>
          <div>
            <p className="insights-item-title">Activity</p>
            <p className="insights-item-status">{PET_INSIGHTS.activity.status}</p>
            <p className="insights-item-sub">{PET_INSIGHTS.activity.sub}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Disclaimer ---------- */

function Disclaimer() {
  return (
    <>
      <div className="health-disclaimer-block">
        <span className="disclaimer-info"><InfoIcon size={14} /></span>
        <p className="disclaimer-main">
          Regular check-ups, vaccinations, proper nutrition, and exercise are key to a long, healthy life.
        </p>
        <span className="disclaimer-emoji" aria-hidden="true">🐶 🐱</span>
      </div>
      <p className="health-disclaimer-fine">
        This information is for reference only. Always consult your veterinarian.
      </p>
    </>
  );
}
