import React, { FunctionComponent } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardProps,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';

import { DailyHolyMassBookings } from '../../providers/ApiProvider';
import { dateTimeFormatter, toLocalTimeZone } from '../../helpers/dates';

export interface SessionsChartCardProps extends CardProps {
  data?: DailyHolyMassBookings[];
}

const HolyMassBookingsCard: FunctionComponent<SessionsChartCardProps> = ({
  data,
  ...props
}) => (
  <Card {...props}>
    <CardHeader
      title="Prenotazioni Santa Messa"
      subheader="Prossimi tre giorni"
    />
    <CardContent>
      <List>
        {data &&
          (data.length > 0 ? (
            data.map(({ date, fraternity, bookings }) => (
              <ListItem key={`${fraternity.id}-${date}`}>
                <ListItemText
                  primary={fraternity.location}
                  secondary={dateTimeFormatter.format(
                    toLocalTimeZone(new Date(date)),
                  )}
                />
                <ListItemSecondaryAction>
                  <Typography variant="h5">
                    {bookings}/{fraternity.seats}
                  </Typography>
                </ListItemSecondaryAction>
              </ListItem>
            ))
          ) : (
            <Typography variant="h6" align="center">
              Nessuna prenotazione
            </Typography>
          ))}
        {!data &&
          Array.from({ length: 3 }, (_, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={<Skeleton variant="text" width={72} />}
                secondary={<Skeleton variant="text" width={54} />}
              />
              <ListItemSecondaryAction>
                <Typography variant="h5">
                  <Skeleton variant="text" width={40} />
                </Typography>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>
    </CardContent>
  </Card>
);

export default HolyMassBookingsCard;
