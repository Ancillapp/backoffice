import { createMuiTheme } from '@material-ui/core';

import { itIT } from '@material-ui/core/locale';

const darkTheme = createMuiTheme(
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

export default darkTheme;
