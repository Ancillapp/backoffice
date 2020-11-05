import React, { FunctionComponent } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';

import SessionsChart, { SessionsChartProps } from './SessionsChart';
import Loader from './Loader';

export interface SessionsChartCardProps extends CardProps {
  data?: SessionsChartProps['data'];
}

const useStyles = makeStyles(() => ({
  cardContent: {
    height: 240,
  },
}));

const SessionsChartCard: FunctionComponent<SessionsChartCardProps> = ({
  data,
  ...props
}) => {
  const classes = useStyles();

  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const displayedData = data?.slice(0, isDesktop ? 14 : 7);

  return (
    <Card {...props}>
      <CardHeader
        title="Sessioni"
        subheader={isDesktop ? 'Ultime due settimane' : 'Ultima settimana'}
      />
      <CardContent className={classes.cardContent}>
        {displayedData ? (
          <SessionsChart data={displayedData} />
        ) : (
          <Loader variant="linear" />
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsChartCard;
