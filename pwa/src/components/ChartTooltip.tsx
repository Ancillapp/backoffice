import React from 'react';

import { makeStyles } from '@material-ui/core';

import { PointTooltip } from '@nivo/line';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 1),
  },
}));

const ChartTooltip: PointTooltip = ({
  point: {
    data: { xFormatted, yFormatted },
  },
}) => {
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <strong>{xFormatted}:</strong> {yFormatted}
    </span>
  );
};

export default ChartTooltip;
