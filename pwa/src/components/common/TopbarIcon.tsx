import React, { FunctionComponent } from 'react';

import { Box, BoxProps, useTheme } from '@material-ui/core';

const TopbarIcon: FunctionComponent<BoxProps> = ({ sx, ...props }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        color:
          theme.palette.mode === 'dark'
            ? 'text.primary'
            : 'primary.contrastText',
        ...sx,
      }}
      clone
      {...props}
    />
  );
};

export default TopbarIcon;
