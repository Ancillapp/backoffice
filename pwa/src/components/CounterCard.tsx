import React, { FunctionComponent, ReactNode } from 'react';

import CountUp from 'react-countup';

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';

import Loader from './Loader';

export interface CounterCardProps {
  title?: string;
  value?: number;
  placeholder?: ReactNode;
}

const CounterCard: FunctionComponent<CounterCardProps> = ({
  title,
  value,
  placeholder = <Loader />,
}) => {
  return (
    <Card>
      {title && <CardHeader title={title} />}
      <CardContent>
        {typeof value === 'number' ? (
          <Typography variant="h1" align="center">
            <CountUp end={value} />
          </Typography>
        ) : (
          placeholder
        )}
      </CardContent>
    </Card>
  );
};

export default CounterCard;
