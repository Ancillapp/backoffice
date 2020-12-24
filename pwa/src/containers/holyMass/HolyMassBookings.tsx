import React, { FunctionComponent, useState } from 'react';

import { Typography } from '@material-ui/core';

import CenteredLayout from '../../components/common/CenteredLayout';
import Loader from '../../components/common/Loader';
import HolyMassBookingsHeader from '../../components/holyMass/HolyMassBookingsHeader';
import HolyMassBookingsTable, {
  HolyMassBookingsTableProps,
} from '../../components/holyMass/HolyMassBookingsTable';

import { useNextDaysHolyMassesBookings } from '../../providers/ApiProvider';

const HolyMassBookings: FunctionComponent = () => {
  const [days, setDays] = useState(3);

  const { loading, data, error } = useNextDaysHolyMassesBookings(days, true);

  const [expandedHolyMass, setExpandedHolyMass] = useState<
    string | undefined
  >();

  const handleChange = (
    holyMassId: string,
  ): NonNullable<HolyMassBookingsTableProps['onChange']> => (_, expanded) => {
    setExpandedHolyMass(expanded ? holyMassId : undefined);
  };

  if (error) {
    return <span>{error.message}</span>;
  }

  return (
    <CenteredLayout size="sm">
      <HolyMassBookingsHeader value={days} onChange={setDays} />
      {loading ? (
        <Loader />
      ) : (data?.length || 0) > 0 ? (
        data?.map((bookings) => {
          const id = `${bookings.fraternity.id}-${bookings.date}`;

          return (
            <HolyMassBookingsTable
              key={id}
              data={bookings}
              expanded={expandedHolyMass === id}
              onChange={handleChange(id)}
            />
          );
        })
      ) : (
        <Typography variant="h6" align="center">
          Nessuna prenotazione
        </Typography>
      )}
    </CenteredLayout>
  );
};

export default HolyMassBookings;
