import React, { FunctionComponent } from 'react';

import ReactMasonry from 'react-masonry-css';

import { makeStyles, Theme, useTheme } from '@material-ui/core';

export interface MasonryProps {
  columns?: number | 'auto';
  spacing?: number;
}

const useStyles = makeStyles<Theme, MasonryProps>((theme) => ({
  root: ({ spacing = 0 }) => ({
    display: 'flex',
    marginLeft: theme.spacing(-spacing),
    width: 'auto',
  }),
  column: ({ spacing = 0 }) => ({
    paddingLeft: theme.spacing(spacing),
    backgroundClip: 'padding-box',

    '& > *': {
      marginBottom: theme.spacing(spacing),
    },
  }),
}));

const Masonry: FunctionComponent<MasonryProps> = ({
  columns = 'auto',
  spacing,
  children,
}) => {
  const theme = useTheme();
  const classes = useStyles({ columns, spacing });

  return (
    <ReactMasonry
      breakpointCols={
        columns === 'auto'
          ? {
              default: 4,
              [theme.breakpoints.width('xl')]: 3,
              [theme.breakpoints.width('lg')]: 2,
              [theme.breakpoints.width('md')]: 1,
            }
          : {
              default: columns,
            }
      }
      className={classes.root}
      columnClassName={classes.column}
    >
      {children}
    </ReactMasonry>
  );
};

export default Masonry;
