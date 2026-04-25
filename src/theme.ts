import { createSignal } from 'solid-js';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'nv.theme';

function initialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const [theme, setThemeSignal] = createSignal<Theme>(initialTheme());
export { theme };

export function applyTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
}

export function setTheme(t: Theme) {
  setThemeSignal(t);
  localStorage.setItem(STORAGE_KEY, t);
  applyTheme(t);
}

export function toggleTheme() {
  setTheme(theme() === 'dark' ? 'light' : 'dark');
}
