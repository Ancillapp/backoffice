import React, { FunctionComponent, useCallback, useState } from 'react';

import { AccordionProps } from '@material-ui/core';

import Loader from '../../components/common/Loader';
import { useTimetables } from '../../providers/ApiProvider';

import FraternityTimetable from './FraternityTimetable';

const HolyMassTimetables: FunctionComponent = () => {
  const { loading, data, error, refetch } = useTimetables();

  const [expandedFraternity, setExpandedFraternity] = useState<
    string | undefined
  >();

  const handleChange = useCallback(
    (fraternityId: string): NonNullable<AccordionProps['onChange']> => (
      _,
      expanded,
    ) => {
      setExpandedFraternity(expanded ? fraternityId : undefined);
    },
    [],
  );

  if (error) {
    return <span>{error.message}</span>;
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      {data?.map((timetable) => (
        <FraternityTimetable
          key={timetable.fraternityId}
          timetable={timetable}
          expanded={expandedFraternity === timetable.fraternityId}
          onChange={handleChange(timetable.fraternityId)}
          onUpdate={refetch}
        />
      ))}
    </>
  );
};

export default HolyMassTimetables;
