import React, { FunctionComponent } from 'react';

import { Box, BoxProps, useTheme } from '@material-ui/core';

const TopbarIcon: FunctionComponent<BoxProps> = (props) => {
  const theme = useTheme();

  return (
    <Box
      color={
        theme.palette.type === 'dark' ? 'text.primary' : 'primary.contrastText'
      }
      clone
      {...props}
    />
  );
};

export default TopbarIcon;
