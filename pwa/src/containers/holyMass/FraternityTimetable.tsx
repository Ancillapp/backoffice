import React, { FunctionComponent, useCallback } from 'react';

import {
  Accordion,
  AccordionDetails,
  AccordionProps,
  AccordionSummary,
  Typography,
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import HolyMassesTimetable, {
  HolyMassesTimetableProps,
} from '../../components/holyMass/HolyMassesTimetable';
import { Timetable, useTimetableUpdate } from '../../providers/ApiProvider';

export interface FraternityTimetableProps
  extends Omit<AccordionProps, 'children'> {
  data: Timetable;
  onUpdate?(updatedMasses: Timetable['masses']): any;
}

const isDefaultOrWeekDay = (
  day: string,
): day is Exclude<keyof Timetable['masses'], 'overrides'> =>
  !/\d{2}-\d{2}/.test(day);

const FraternityTimetable: FunctionComponent<FraternityTimetableProps> = ({
  data,
  onUpdate,
  ...accordionProps
}) => {
  const [updateTimetable] = useTimetableUpdate(data.fraternityId);

  const handleRowUpdate = useCallback(
    ({
      masses,
    }: Timetable): NonNullable<
      HolyMassesTimetableProps['onRowUpdate']
    > => async (id, day, times) => {
      let strippedMasses: Timetable['masses'];

      if (isDefaultOrWeekDay(id)) {
        const { [id]: _, ...stripped } = masses;
        strippedMasses = stripped;
      } else {
        const {
          overrides: { [id]: _, ...strippedOverrides } = {},
          ...rest
        } = masses;
        strippedMasses = {
          ...rest,
          overrides: strippedOverrides,
        };
      }

      const newMasses: Timetable['masses'] = {
        ...strippedMasses,
        ...(isDefaultOrWeekDay(day)
          ? {
              [day]: times,
            }
          : {
              overrides: {
                ...strippedMasses.overrides,
                [day]: times,
              },
            }),
      };

      await updateTimetable(newMasses);
      await onUpdate?.(newMasses);
    },
    [onUpdate, updateTimetable],
  );

  const handleRowCreate = useCallback(
    ({
      masses,
    }: Timetable): NonNullable<
      HolyMassesTimetableProps['onRowCreate']
    > => async (day, times) => {
      const newMasses: Timetable['masses'] = {
        ...masses,
        ...(isDefaultOrWeekDay(day)
          ? {
              [day]: times,
            }
          : {
              overrides: {
                ...masses.overrides,
                [day]: times,
              },
            }),
      };

      await updateTimetable(newMasses);
      await onUpdate?.(newMasses);
    },
    [onUpdate, updateTimetable],
  );

  const handleRowDelete = useCallback(
    ({
      masses,
    }: Timetable): NonNullable<
      HolyMassesTimetableProps['onRowDelete']
    > => async (id) => {
      let strippedMasses: Timetable['masses'];

      if (isDefaultOrWeekDay(id)) {
        const { [id]: _, ...stripped } = masses;
        strippedMasses = stripped;
      } else {
        const {
          overrides: { [id]: _, ...strippedOverrides } = {},
          ...rest
        } = masses;
        strippedMasses = {
          ...rest,
          overrides: strippedOverrides,
        };
      }

      await updateTimetable(strippedMasses);
      await onUpdate?.(strippedMasses);
    },
    [onUpdate, updateTimetable],
  );

  return (
    <Accordion {...accordionProps}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{data.location}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <HolyMassesTimetable
          fraternityId={data.fraternityId}
          masses={data.masses}
          onRowUpdate={handleRowUpdate(data)}
          onRowCreate={handleRowCreate(data)}
          onRowDelete={handleRowDelete(data)}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default FraternityTimetable;
