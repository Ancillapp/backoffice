import { createMuiTheme } from '@material-ui/core';

import { itIT } from '@material-ui/core/locale';

const lightTheme = createMuiTheme(
  {
    typography: {
      fontFamily: "'Rosario', sans-serif",
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
