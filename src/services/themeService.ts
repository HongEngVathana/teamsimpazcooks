export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'our_kitchen_theme_v1';

export class ThemeService {
  public static getStoredTheme(): Theme {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (e) {
      console.warn('Failed to load theme', e);
    }
    return 'light';
  }

  public static applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  }

  public static toggleTheme(): Theme {
    const current = this.getStoredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
    return next;
  }
}
