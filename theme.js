/**
 * Theme Toggle Logic
 * Supports: manual toggle (persisted in localStorage),
 *           system default (prefers-color-scheme)
 */
(function () {
  const STORAGE_KEY = 'theme-preference';
  const root = document.documentElement;
  const btn = document.querySelector('.theme-toggle');
  const sun = btn ? btn.querySelector('.icon-sun') : null;
  const moon = btn ? btn.querySelector('.icon-moon') : null;

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStored(v) {
    try { v ? localStorage.setItem(STORAGE_KEY, v) : localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }
  function getSystem() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getEffective() {
    const s = getStored();
    if (s === 'dark' || s === 'light') return s;
    return getSystem();
  }
  function apply(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    if (sun && moon) {
      sun.style.display = theme === 'dark' ? 'inline-block' : 'none';
      moon.style.display = theme === 'dark' ? 'none' : 'inline-block';
    }
  }
  function toggle() {
    const next = getEffective() === 'dark' ? 'light' : 'dark';
    setStored(next);
    apply(next);
  }

  // Initialize
  apply(getEffective());
  if (btn) btn.addEventListener('click', toggle);

  // Follow system changes when no manual override exists
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStored()) apply(e.matches ? 'dark' : 'light');
  });
})();
