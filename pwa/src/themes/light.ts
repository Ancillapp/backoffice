import { createTheme, Theme } from '@mui/material';

import { itIT } from '@mui/material/locale';

const lightTheme = createTheme(
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
      mode: 'light',
      primary: {
        main: '#557892',
      },
      secondary: {
        main: '#d50000',
      },
    },
    components: {
      MuiLink: {
        defaultProps: {
          underline: 'hover',
        },
      },
    },
  },
  itIT,
);

declare module '@mui/styles' {
  interface DefaultTheme extends Theme {}
}

export default lightTheme;
