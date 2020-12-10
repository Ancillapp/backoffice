import React, { FunctionComponent, ReactNode } from 'react';

import CountUp from 'react-countup';

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardProps,
  Typography,
  Skeleton,
} from '@material-ui/core';

export interface CounterCardProps
  extends Omit<CardProps, 'title' | 'placeholder'> {
  title?: ReactNode;
  subtitle?: ReactNode;
  value?: number;
  placeholder?: ReactNode;
}

const CounterCard: FunctionComponent<CounterCardProps> = ({
  title,
  subtitle,
  value,
  placeholder = <Skeleton variant="text" width={96} />,
  ...props
}) => (
  <Card {...props}>
    {title && <CardHeader title={title} subheader={subtitle} />}
    <CardContent>
      <Typography variant="h2" align="center">
        {typeof value === 'number' ? (
          <CountUp end={value} />
        ) : (
          <Box sx={{ margin: '0 auto' }} clone>
            {placeholder}
          </Box>
        )}
      </Typography>
    </CardContent>
  </Card>
);

export default CounterCard;
