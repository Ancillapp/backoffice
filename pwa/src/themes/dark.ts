import { createTheme, Theme } from '@mui/material';

import { itIT } from '@mui/material/locale';

const darkTheme = createTheme(
  {
    typography: {
      fontFamily: "'Rosario', sans-serif",
      h1: { fontFamily: "'Vesper Libre', serif" },
      h2: { fontFamily: "'Vesper Libre', serif" },
      h3: { fontFamily: "'Vesper Libre', serif" },
      h4: { fontFamily: "'Vesper Libre', serif" },
      h5: { fontFamily: "'Vesper Libre', serif" },
      h6: { fontFamily: "'Vesper Libre', serif" },
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#73b5e6',
      },
      secondary: {
        main: '#ff8f82',
      },
    },
  },
  itIT,
);

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}

export default darkTheme;
