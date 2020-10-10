import React, { FunctionComponent, ReactNode } from 'react';

import CountUp from 'react-countup';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';

import { Skeleton } from '@material-ui/lab';

export interface CounterCardProps {
  title?: string;
  value?: number;
  placeholder?: ReactNode;
}

const CounterCard: FunctionComponent<CounterCardProps> = ({
  title,
  value,
  placeholder = <Skeleton variant="text" width={96} />,
}) => (
  <Card>
    {title && <CardHeader title={title} />}
    <CardContent>
      <Typography variant="h1" align="center">
        {typeof value === 'number' ? (
          <CountUp end={value} />
        ) : (
          <Box margin="0 auto" clone>
            {placeholder}
          </Box>
        )}
      </Typography>
    </CardContent>
  </Card>
);

export default CounterCard;
