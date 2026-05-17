// Sticky header chip reveal
const header = document.getElementById('siteHeader');
const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Timeline filters
document.querySelectorAll('.filter').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.t-item').forEach((item) => {
      const types = (item.dataset.type || '').split(/\s+/);
      item.classList.toggle('is-hidden', !(f === 'all' || types.includes(f)));
    });
  });
});

// ---------- Calendar + tasks ----------
const TODAY = new Date(2026, 4, 17); // 2026-05-17

const TYPE_META = {
  vaccine:    { label: 'Vaccine',    color: 'var(--accent)' },
  medication: { label: 'Medication', color: '#7da06a' },
  grooming:   { label: 'Grooming',   color: '#6a8ab0' },
  checkup:    { label: 'Checkup',    color: '#b08968' },
};

const TASKS = [
  { date: '2026-05-17', title: 'Walk · 5 km',       type: 'checkup',    done: false },
  { date: '2026-05-20', title: 'Bath & brush',      type: 'grooming',   done: false },
  { date: '2026-05-22', title: 'Vet follow-up',     type: 'checkup',    done: false },
  { date: '2026-05-28', title: 'NexGard dose',      type: 'medication', done: false },
  { date: '2026-05-29', title: 'Nail trim',         type: 'grooming',   done: false },
  { date: '2026-06-01', title: 'Rabies booster',    type: 'vaccine',    done: false },
  { date: '2026-06-05', title: 'Grooming session',  type: 'grooming',   done: false },
  { date: '2026-06-10', title: 'Weigh-in',          type: 'checkup',    done: false },
  { date: '2026-06-22', title: 'NexGard dose',      type: 'medication', done: false },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmtKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function sameDay(a, b) {
  return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
}

let viewMonth = TODAY.getMonth();
let viewYear  = TODAY.getFullYear();
let selectedDate = new Date(TODAY);

const calTitle = document.getElementById('calTitle');
const calGrid  = document.getElementById('calGrid');
const dayTitle = document.getElementById('dayTitle');
const dayLabel = document.getElementById('dayLabel');
const dayList  = document.getElementById('dayList');

function tasksFor(date) {
  const key = fmtKey(date);
  return TASKS.filter((t) => t.date === key);
}
function typesFor(date) {
  return [...new Set(tasksFor(date).map((t) => t.type))];
}

function renderCalendar() {
  calTitle.textContent = `${MONTHS[viewMonth]} ${viewYear}`;
  calGrid.innerHTML = '';

  const first = new Date(viewYear, viewMonth, 1);
  // Monday-first: 0..6 where Monday=0
  let offset = (first.getDay() + 6) % 7;
  const start = new Date(viewYear, viewMonth, 1 - offset);

  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    const btn = document.createElement('button');
    btn.className = 'cal-day';
    btn.type = 'button';
    btn.textContent = d.getDate();

    if (d.getMonth() !== viewMonth) btn.classList.add('is-out');
    if (sameDay(d, TODAY)) btn.classList.add('is-today');
    if (sameDay(d, selectedDate)) btn.classList.add('is-selected');

    const types = typesFor(d);
    if (types.length) {
      const dots = document.createElement('span');
      dots.className = 'cal-dots';
      types.slice(0, 3).forEach((t) => {
        const dot = document.createElement('i');
        dot.style.background = TYPE_META[t].color;
        dots.appendChild(dot);
      });
      btn.appendChild(dots);
    }

    btn.addEventListener('click', () => {
      selectedDate = d;
      if (d.getMonth() !== viewMonth) {
        viewMonth = d.getMonth();
        viewYear  = d.getFullYear();
      }
      renderCalendar();
      renderDay();
    });

    calGrid.appendChild(btn);
  }
}

function renderDay() {
  const isToday = sameDay(selectedDate, TODAY);
  const tomorrow = new Date(TODAY); tomorrow.setDate(TODAY.getDate()+1);
  const isTomorrow = sameDay(selectedDate, tomorrow);

  dayLabel.textContent = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : 'Selected day';
  dayTitle.textContent = `${MONTHS[selectedDate.getMonth()].slice(0,3)} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`;

  dayList.innerHTML = '';
  const items = tasksFor(selectedDate);

  if (!items.length) {
    const empty = document.createElement('li');
    empty.className = 'day-empty';
    empty.textContent = 'Nothing scheduled.';
    dayList.appendChild(empty);
    return;
  }

  items.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'd-task' + (task.done ? ' is-done' : '');

    const check = document.createElement('span');
    check.className = 'd-check';

    const body = document.createElement('span');
    body.className = 'd-body';
    const title = document.createElement('span');
    title.className = 'd-title';
    title.textContent = task.title;
    const meta = document.createElement('span');
    meta.className = 'd-meta';
    meta.textContent = TYPE_META[task.type].label;
    body.appendChild(title);
    body.appendChild(meta);

    const tag = document.createElement('span');
    tag.className = `d-tag tag-${task.type}`;
    tag.textContent = TYPE_META[task.type].label;

    li.appendChild(check);
    li.appendChild(body);
    li.appendChild(tag);

    li.addEventListener('click', () => {
      task.done = !task.done;
      renderDay();
    });

    dayList.appendChild(li);
  });
}

document.getElementById('calPrev').addEventListener('click', () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});
document.getElementById('calNext').addEventListener('click', () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

renderCalendar();
renderDay();
