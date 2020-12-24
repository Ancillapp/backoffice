import React, { FunctionComponent } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  makeStyles,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { FullDataDailyHolyMassBookings } from '../../providers/ApiProvider';
import { dateTimeFormatter, toLocalTimeZone } from '../../helpers/dates';

export interface HolyMassBookingsTableProps
  extends Omit<AccordionProps, 'children'> {
  data: FullDataDailyHolyMassBookings;
}

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  subheader: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
  },
}));

const HolyMassBookingsTable: FunctionComponent<HolyMassBookingsTableProps> = ({
  data: {
    fraternity: { location },
    bookings,
    date,
  },
  ...accordionProps
}) => {
  const classes = useStyles();

  return (
    <Accordion {...accordionProps}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className={classes.header}>
          <Typography>{location}</Typography>
          <Typography className={classes.subheader}>
            {dateTimeFormatter.format(toLocalTimeZone(new Date(date)))}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Utente</TableCell>
              <TableCell align="right" width={96}>
                Posti
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(({ user: { id, email }, seats }) => (
              <TableRow key={id}>
                <TableCell>{email}</TableCell>
                <TableCell align="right" width={96}>
                  {seats}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
};

export default HolyMassBookingsTable;
