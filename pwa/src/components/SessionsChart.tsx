import React, { FunctionComponent } from 'react';

import { ResponsiveLine } from '@nivo/line';

import { useMediaQuery, useTheme } from '@material-ui/core';

import { SessionsReportRecord } from '../providers/ApiProvider';

import ChartTooltip from './ChartTooltip';

export interface SessionsChartProps {
  data: SessionsReportRecord[];
}

const dateFormatter = new Intl.DateTimeFormat('it', {
  month: 'short',
  day: 'numeric',
});

const SessionsChart: FunctionComponent<SessionsChartProps> = ({ data }) => {
  const theme = useTheme();

  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const displayedData = data.slice(0, isDesktop ? 14 : 7);

  return (
    <ResponsiveLine
      theme={{
        textColor: theme.palette.text.primary,
        tooltip: {
          container: {
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
          },
        },
        grid: {
          line: {
            stroke: theme.palette.divider,
          },
        },
        crosshair: {
          line: {
            stroke: theme.palette.text.primary,
          },
        },
      }}
      colors={theme.palette.primary.main}
      data={[
        {
          id: 'Sessioni',
          data: displayedData.map(({ date: x, sessions: y }) => ({ x, y })),
        },
      ]}
      tooltip={ChartTooltip}
      gridXValues={displayedData.length}
      gridYValues={5}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        precision: 'day',
      }}
      xFormat={(value) => dateFormatter.format(value as Date)}
      yScale={{
        type: 'linear',
        stacked: false,
      }}
      axisBottom={{
        format: (value) => dateFormatter.format(value as Date),
        tickValues: displayedData
          .filter((_, index) => index % 2 === 0)
          .map(({ date }) => new Date(date)),
      }}
      axisLeft={{ tickValues: 5 }}
      curve="linear"
      useMesh
      margin={{ top: 5, right: 20, bottom: 20, left: 35 }}
    />
  );
};

export default SessionsChart;
