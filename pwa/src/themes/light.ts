import { createMuiTheme } from '@material-ui/core';

import { itIT } from '@material-ui/core/locale';

const lightTheme = createMuiTheme(
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
      primary: {
        main: '#557892',
      },
      secondary: {
        main: '#d50000',
      },
    },
  },
  itIT,
);

export default lightTheme;
