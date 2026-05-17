// Sticky header shadow + pet chip reveal
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('is-scrolled', window.scrollY > 24);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Timeline filters
const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.timeline-item');
filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((b) => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    const filter = btn.dataset.filter;
    items.forEach((item) => {
      const types = (item.dataset.type || '').split(/\s+/);
      const show = filter === 'all' || types.includes(filter);
      item.classList.toggle('is-hidden', !show);
    });
  });
});

// Task completion: animate + move between lists
const upcoming = document.getElementById('taskListUpcoming');
const done = document.getElementById('taskListDone');

document.querySelectorAll('.task input[type="checkbox"]').forEach((cb) => {
  cb.addEventListener('change', (e) => {
    const li = e.target.closest('.task');
    if (!li) return;
    if (e.target.checked) {
      li.classList.add('is-done');
      done.prepend(li);
    } else {
      li.classList.remove('is-done');
      upcoming.appendChild(li);
    }
  });
});
