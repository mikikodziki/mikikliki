(() => {
  const root = document.documentElement;
  root.classList.add('js');

  // ---------- Light / dark mode ----------
  const toggle = document.querySelector('.mode');
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const current = () => root.dataset.theme || (media.matches ? 'dark' : 'light');

  const paint = () => {
    toggle.querySelectorAll('.mode-opt').forEach((opt) => {
      opt.classList.toggle('is-on', opt.dataset.opt === current());
    });
  };

  toggle.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
    paint();
  });
  media.addEventListener('change', paint);
  paint();

  // ---------- Tile reveal on scroll ----------
  const tiles = document.querySelectorAll('.tile');
  if (!('IntersectionObserver' in window)) {
    tiles.forEach((t) => t.classList.add('tile--in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('tile--in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  // Stagger tiles that enter together (e.g. the hero bento).
  let batch = 0;
  tiles.forEach((t) => {
    t.style.transitionDelay = `${(batch++ % 6) * 60}ms`;
    t.addEventListener('transitionend', () => { t.style.transitionDelay = ''; }, { once: true });
    io.observe(t);
  });
})();
