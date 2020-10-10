import { useEffect, useState } from 'react';

const initialTheme = window.matchMedia('(prefers-color-scheme: dark)')?.matches
  ? 'dark'
  : 'light';

export const useThemeName = () => {
  const [themeName, setThemeName] = useState(initialTheme);

  useEffect(() => {
    const listener = (e: MediaQueryListEvent) =>
      setThemeName(e.matches ? 'dark' : 'light');

    const mql = window.matchMedia('(prefers-color-scheme: dark)');

    mql.addEventListener('change', listener);

    return () => mql.removeEventListener('change', listener);
  }, []);

  return themeName;
};
