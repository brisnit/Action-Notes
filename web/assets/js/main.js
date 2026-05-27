/* Action Notes — shared client behavior */

// Fade-in on scroll
(function () {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach((el) => io.observe(el));
})();

// Mobile nav toggle
(function () {
  const btn = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('hidden') === false;
    btn.setAttribute('aria-expanded', String(open));
  });
})();

// Password show/hide
document.querySelectorAll('[data-toggle-password]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = document.querySelector(btn.getAttribute('data-toggle-password'));
    if (!target) return;
    const isPwd = target.type === 'password';
    target.type = isPwd ? 'text' : 'password';
    btn.querySelector('[data-eye-open]')?.classList.toggle('hidden', !isPwd);
    btn.querySelector('[data-eye-closed]')?.classList.toggle('hidden', isPwd);
  });
});

// Multi-step form navigation (used by Create Organization & Onboarding)
(function () {
  const wraps = document.querySelectorAll('[data-multistep]');
  wraps.forEach((wrap) => {
    const steps = Array.from(wrap.querySelectorAll('[data-step]'));
    const indicators = Array.from(wrap.querySelectorAll('[data-step-indicator]'));
    let i = 0;

    const render = () => {
      steps.forEach((s, idx) => s.classList.toggle('hidden', idx !== i));
      indicators.forEach((ind, idx) => {
        ind.classList.remove('active', 'complete');
        if (idx < i) ind.classList.add('complete');
        else if (idx === i) ind.classList.add('active');
      });
      const progress = wrap.querySelector('[data-progress-bar]');
      if (progress) {
        const pct = Math.round(((i + 1) / steps.length) * 100);
        progress.style.width = pct + '%';
      }
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    wrap.addEventListener('click', (e) => {
      const t = e.target.closest('[data-next], [data-prev], [data-goto]');
      if (!t) return;
      if (t.hasAttribute('data-next')) i = Math.min(i + 1, steps.length - 1);
      if (t.hasAttribute('data-prev')) i = Math.max(i - 1, 0);
      if (t.hasAttribute('data-goto')) i = Math.min(parseInt(t.getAttribute('data-goto')), steps.length - 1);
      render();
    });

    render();
  });
})();

// Tab switcher (Join Organization: invite / code / search)
document.querySelectorAll('[data-tabs]').forEach((wrap) => {
  const tabs = Array.from(wrap.querySelectorAll('[data-tab]'));
  const panels = Array.from(wrap.querySelectorAll('[data-tab-panel]'));
  const setActive = (name) => {
    tabs.forEach((t) => {
      const active = t.dataset.tab === name;
      t.classList.toggle('bg-white', active);
      t.classList.toggle('shadow', active);
      t.classList.toggle('text-[color:var(--navy)]', active);
      t.classList.toggle('text-[color:var(--gray)]', !active);
    });
    panels.forEach((p) => p.classList.toggle('hidden', p.dataset.tabPanel !== name));
  };
  tabs.forEach((t) => t.addEventListener('click', () => setActive(t.dataset.tab)));
  if (tabs[0]) setActive(tabs[0].dataset.tab);
});

// Tiny "search org" mock for the Join flow
(function () {
  const input = document.querySelector('[data-org-search]');
  const list = document.querySelector('[data-org-search-results]');
  if (!input || !list) return;
  const orgs = [
    { name: 'Cornerstone Community Church', kind: 'Church', members: '2,400' },
    { name: 'The Daily Habit Podcast', kind: 'Podcast', members: '8,120' },
    { name: 'North Ridge Coaching', kind: 'Coaching Program', members: '320' },
    { name: 'Linden Hill Academy', kind: 'School', members: '1,150' },
    { name: 'Summit Founders Conference', kind: 'Conference', members: '640' },
    { name: 'Mindful Mornings Cohort', kind: 'Educational Community', members: '210' }
  ];
  const items = list.querySelectorAll('[data-org-item]');
  const render = (q) => {
    const filter = q.trim().toLowerCase();
    items.forEach((el) => {
      const name = el.getAttribute('data-name').toLowerCase();
      el.classList.toggle('hidden', filter && !name.includes(filter));
    });
  };
  input.addEventListener('input', (e) => render(e.target.value));
})();

// Onboarding interest chip toggles
document.querySelectorAll('[data-chip-select]').forEach((wrap) => {
  wrap.addEventListener('click', (e) => {
    const t = e.target.closest('[data-chip]');
    if (!t) return;
    t.classList.toggle('chip-active');
  });
});

// Year in footer
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});
