import React, { FunctionComponent } from 'react';

import {
  Divider,
  makeStyles,
  MenuItem,
  Select,
  SelectProps,
  Typography,
} from '@material-ui/core';

export interface HolyMassBookingsHeaderProps {
  value?: number;
  onChange?(value: number): void;
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 16,

    [theme.breakpoints.up('md')]: {
      marginTop: 0,
    },
  },
  select: {
    width: 54,
    height: 32,
    fontSize: '1.5rem',

    '& > div': {
      paddingTop: 0,
      paddingBottom: 8,
    },
  },
  divider: {
    marginBottom: 16,
  },
}));

const HolyMassBookingsHeader: FunctionComponent<HolyMassBookingsHeaderProps> = ({
  value = 3,
  onChange,
}) => {
  const classes = useStyles();

  const handleChange: SelectProps['onChange'] = (event) => {
    onChange?.(event.target.value as number);
  };

  return (
    <>
      <Typography variant="h5" className={classes.root}>
        Visualizza le prenotazioni dei prossimi{' '}
        <Select
          className={classes.select}
          variant="outlined"
          required
          value={value}
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>{' '}
        giorni
      </Typography>
      <Divider className={classes.divider} />
    </>
  );
};

export default HolyMassBookingsHeader;
