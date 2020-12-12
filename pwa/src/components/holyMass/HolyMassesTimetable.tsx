import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Chip,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { Timetable } from '../../providers/ApiProvider';

import Loader from '../common/Loader';

import DaySelect, { DaySelectOption, formatDay } from './DaySelect';
import AddTimeButton from './AddTimeButton';

export interface HolyMassesTimetableProps {
  fraternityId: string;
  masses: Timetable['masses'];
}

const weekdays: Exclude<
  keyof HolyMassesTimetableProps['masses'],
  'default' | 'overrides'
>[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const useStyles = makeStyles((theme) => ({
  chip: {
    margin: theme.spacing(0.5, 0.5, 0.5, 0),
    maxWidth: 'calc(100% - 4px)',
  },
  row: {
    height: 70,
  },
  dayColumn: {
    width: 188,
  },
  actionsColumn: {
    width: 96,
    textAlign: 'center',
  },
}));

const HolyMassesTimetable: FunctionComponent<HolyMassesTimetableProps> = ({
  fraternityId,
  masses: {
    default: defaultTimetable,
    overrides,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  },
}) => {
  const classes = useStyles();

  const flattenedMasses = useMemo(
    () => ({
      ...(defaultTimetable && { default: defaultTimetable }),
      ...(monday && { monday }),
      ...(tuesday && { tuesday }),
      ...(wednesday && { wednesday }),
      ...(thursday && { thursday }),
      ...(friday && { friday }),
      ...(saturday && { saturday }),
      ...(sunday && { sunday }),
      ...overrides,
    }),
    [
      defaultTimetable,
      friday,
      monday,
      overrides,
      saturday,
      sunday,
      thursday,
      tuesday,
      wednesday,
    ],
  );

  const [editingRow, setEditingRow] = useState<
    | {
        id: string;
        day: string;
        times: string[];
      }
    | undefined
  >();

  const toggleEditMode = useCallback(
    (id: string, day: string, times: string[]) => () => {
      setEditingRow({ id, day, times });
    },
    [],
  );

  const cancelEditing = useCallback(() => {
    setEditingRow(undefined);
  }, []);

  const removeTime = useCallback(
    (time: string) => () => {
      setEditingRow(({ id, day, times } = { id: '', day: '', times: [] }) => ({
        id,
        day,
        times: times.filter((t) => t !== time),
      }));
    },
    [],
  );

  const addTime = useCallback((time: string) => {
    setEditingRow(({ id, day, times } = { id: '', day: '', times: [] }) => ({
      id,
      day,
      times: [...times, time].sort((a, b) => (a < b ? -1 : 1)),
    }));
  }, []);

  const updateDay = useCallback((day: string) => {
    setEditingRow((previousEditingRow = { id: '', day: '', times: [] }) => ({
      ...previousEditingRow,
      day,
    }));
  }, []);

  const missingWeekdays = weekdays.filter(
    (weekday) => !(weekday in flattenedMasses),
  );

  return (
    <Table>
      <TableHead>
        <TableRow className={classes.row}>
          <TableCell className={classes.dayColumn}>Giorno</TableCell>
          <TableCell>Orari</TableCell>
          <TableCell className={classes.actionsColumn}>Azioni</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(flattenedMasses).map(([day, timetable]) => {
          const rowId = `${fraternityId}-${day}`;

          return (
            <TableRow key={rowId} className={classes.row}>
              <TableCell className={classes.dayColumn}>
                {editingRow?.id === rowId ? (
                  <DaySelect
                    options={
                      [
                        ...(flattenedMasses.default ? [] : ['default']),
                        ...missingWeekdays,
                        'recurring',
                        'specific',
                      ] as DaySelectOption[]
                    }
                    value={editingRow.day}
                    onChange={updateDay}
                  />
                ) : (
                  formatDay(day)
                )}
              </TableCell>
              <TableCell>
                {editingRow?.id === rowId ? (
                  <>
                    {editingRow.times.map((time) => (
                      <Chip
                        className={classes.chip}
                        key={time}
                        label={time}
                        size="small"
                        onDelete={removeTime(time)}
                      />
                    ))}
                    <AddTimeButton onConfirm={addTime} />
                  </>
                ) : (
                  timetable.join(' - ')
                )}
              </TableCell>
              <TableCell className={classes.actionsColumn}>
                {editingRow?.id === rowId ? (
                  <>
                    <IconButton
                      size="small"
                      aria-label="annulla"
                      type="reset"
                      form="edit-time-form"
                      key="cancel-editing-time-button"
                      onClick={cancelEditing}
                      disabled={/* updatingTimetable */ false}
                    >
                      <CloseIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      edge="end"
                      aria-label="conferma"
                      type="submit"
                      form="edit-time-form"
                      key="save-time-button"
                      disabled={/* updatingTimetable */ false}
                    >
                      {/* updatingTimetable */ false && <Loader size={24} />}
                      <DoneIcon />
                    </IconButton>
                  </>
                ) : (
                  <IconButton
                    size="small"
                    edge="end"
                    aria-label="modifica"
                    onClick={toggleEditMode(rowId, day, timetable)}
                    disabled={Boolean(editingRow)}
                    key="edit-time-button"
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default HolyMassesTimetable;
