import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  Button,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { Timetable } from '../../providers/ApiProvider';

import Loader from '../common/Loader';

import { DaySelectOption, formatDay } from './DaySelect';
import TimetableRow, { TimetableRowProps } from './TimetableRow';

export interface HolyMassesTimetableProps {
  fraternityId: string;
  masses: Timetable['masses'];
  onRowUpdate?(id: string, day: string, times: string[]): any;
  onRowCreate?(day: string, times: string[]): any;
  onRowDelete?(id: string): any;
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
  add: {
    textAlign: 'center',
  },
  deletionConfirmationRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deletionConfirmationActions: {
    textAlign: 'right',
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
  onRowUpdate,
  onRowCreate,
  onRowDelete,
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

  const [deletingRow, setDeletingRow] = useState<string | undefined>();

  const [editingRow, setEditingRow] = useState<
    | {
        id: string;
        day?: string;
        times?: string[];
      }
    | undefined
  >();

  const [isUpdating, setIsUpdating] = useState(false);

  const handleRowChange = useCallback<
    NonNullable<TimetableRowProps['onChange']>
  >(({ day = '', times = [] }) => {
    setEditingRow(({ id } = { id: '', day: '', times: [] }) => ({
      id,
      day,
      times,
    }));
  }, []);

  const showDeleteConfirmation = useCallback(
    (id: string) => () => {
      setDeletingRow(id);
    },
    [],
  );

  const toggleEditMode = useCallback(
    (id: string, day: string, times: string[]) => () => {
      setEditingRow({ id, day, times });
    },
    [],
  );

  const cancelDeletion = useCallback(() => {
    setDeletingRow(undefined);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingRow(undefined);
  }, []);

  const deleteRow = useCallback(async () => {
    if (!deletingRow) {
      return;
    }

    setIsUpdating(true);

    await onRowDelete?.(deletingRow);

    setIsUpdating(false);
    setDeletingRow(undefined);
  }, [deletingRow, onRowDelete]);

  const updateRow = useCallback(async () => {
    if (!editingRow) {
      return;
    }

    setIsUpdating(true);

    const { id, day = '', times = [] } = editingRow;

    await onRowUpdate?.(id, day, times);

    setIsUpdating(false);
    setEditingRow(undefined);
  }, [editingRow, onRowUpdate]);

  const createRow = useCallback(async () => {
    if (!editingRow) {
      return;
    }

    setIsUpdating(true);

    const { day = '', times = [] } = editingRow;

    await onRowCreate?.(day, times);

    setIsUpdating(false);
    setEditingRow(undefined);
  }, [editingRow, onRowCreate]);

  const addRow = useCallback(() => {
    setEditingRow({ id: 'new' });
  }, []);

  const missingWeekdays = weekdays.filter(
    (weekday) => !(weekday in flattenedMasses),
  );

  const daySelectOptions = [
    ...(flattenedMasses.default ? [] : ['default']),
    ...missingWeekdays,
    'recurring',
    'specific',
  ] as DaySelectOption[];

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
        {Object.entries(flattenedMasses).map(([day, timetable]) =>
          deletingRow === day ? (
            <TableRow key={`${fraternityId}-${day}`} className={classes.row}>
              <TableCell colSpan={3}>
                <div className={classes.deletionConfirmationRow}>
                  <Typography>
                    Eliminare gli orari per la messa
                    {/^\d{2}-\d{2}$/.test(day) ? ' del giorno ' : ' di '}
                    <strong>{formatDay(day)}</strong>?
                  </Typography>
                  <div className={classes.deletionConfirmationActions}>
                    <Button
                      size="small"
                      color="inherit"
                      onClick={cancelDeletion}
                      disabled={isUpdating}
                    >
                      Annulla
                    </Button>
                    <Button
                      size="small"
                      color="secondary"
                      onClick={deleteRow}
                      disabled={isUpdating}
                    >
                      Elimina
                      {isUpdating && <Loader size={18} />}
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TimetableRow
              key={`${fraternityId}-${day}`}
              editMode={editingRow?.id === day}
              daySelectOptions={daySelectOptions}
              day={editingRow?.id === day ? editingRow.day : day}
              times={editingRow?.id === day ? editingRow.times : timetable}
              loading={isUpdating}
              disabled={Boolean(editingRow) || Boolean(deletingRow)}
              onChange={handleRowChange}
              onCancelUpdateClick={cancelEditing}
              onAcceptUpdateClick={updateRow}
              onDeleteClick={showDeleteConfirmation(day)}
              onEditClick={toggleEditMode(day, day, timetable)}
            />
          ),
        )}
        {editingRow?.id === 'new' ? (
          <TimetableRow
            editMode
            daySelectOptions={daySelectOptions}
            day={editingRow?.id === 'new' ? editingRow.day : undefined}
            times={editingRow?.id === 'new' ? editingRow.times : undefined}
            loading={isUpdating}
            onChange={handleRowChange}
            onCancelUpdateClick={cancelEditing}
            onAcceptUpdateClick={createRow}
          />
        ) : (
          <TableRow className={classes.row}>
            <TableCell colSpan={3} className={classes.add}>
              <Button
                color="inherit"
                startIcon={<AddIcon />}
                onClick={addRow}
                disabled={Boolean(editingRow) || Boolean(deletingRow)}
              >
                Aggiungi
              </Button>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default HolyMassesTimetable;
