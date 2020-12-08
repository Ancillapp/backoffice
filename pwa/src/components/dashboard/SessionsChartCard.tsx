import React, { FunctionComponent } from 'react';

import ContentLoader from 'react-content-loader';

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
          <ContentLoader
            speed={2}
            viewBox="0 0 500 200"
            backgroundColor="rgba(255, 255, 255, 0.13)"
            foregroundColor="rgba(255, 255, 255, 0.13)"
            backgroundOpacity={0.5}
            foregroundOpacity={1}
          >
            <path d="M 0 100 l 50 -10 l 50 -30 l 100 20 l 50 -10 l 50 20 l 50 -30 l 50 20 l 50 -10 l 50 20 v 2 l -50 -20 l -50 10 l -50 -20 l -50 30 l -50 -20 l -50 10 l -100 -20 l -50 30 l -50 10" />
          </ContentLoader>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionsChartCard;
