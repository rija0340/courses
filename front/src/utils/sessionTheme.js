const THEME_KEY = 'ui.theme.session';

export function getSessionTheme() {
  try {
    const v = sessionStorage.getItem(THEME_KEY);
    return v === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function setSessionTheme(theme) {
  const next = theme === 'dark' ? 'dark' : 'light';
  try {
    sessionStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
  applyThemeClass(next);
  return next;
}

export function toggleSessionTheme() {
  return setSessionTheme(getSessionTheme() === 'dark' ? 'light' : 'dark');
}

export function applyThemeClass(theme = getSessionTheme()) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function initSessionTheme() {
  applyThemeClass(getSessionTheme());
}
