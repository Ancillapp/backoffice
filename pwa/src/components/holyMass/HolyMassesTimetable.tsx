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
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { Timetable } from '../../providers/ApiProvider';

import Loader from '../common/Loader';

export interface HolyMassesTimetableProps {
  fraternityId: string;
  masses: Timetable['masses'];
}

const daysTranslationMap: Record<string, string> = {
  default: 'Default',
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

const shortDateFormatter = new Intl.DateTimeFormat('it', {
  month: 'short',
  day: 'numeric',
});

const fullDateFormatter = new Intl.DateTimeFormat('it', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const formatDay = (day: string) => {
  if (day in daysTranslationMap) {
    return daysTranslationMap[day];
  }

  if (/^\d{2}-\d{2}$/.test(day)) {
    return shortDateFormatter.format(
      new Date(`${new Date().getFullYear()}-${day}`),
    );
  }

  return fullDateFormatter.format(new Date(day));
};

const useStyles = makeStyles(() => ({
  actions: {
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

  const [editingRow, setEditingRow] = useState<{
    id: string;
    times: string[];
  }>();

  const toggleEditMode = useCallback(
    (id: string, times: string[]) => () => {
      setEditingRow({ id, times });
    },
    [],
  );

  const cancelEditing = useCallback(() => {
    setEditingRow(undefined);
  }, []);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Giorno</TableCell>
          <TableCell>Orari</TableCell>
          <TableCell className={classes.actions}>Azioni</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(flattenedMasses).map(([day, timetable]) => {
          const rowId = `${fraternityId}-${day}`;

          return (
            <TableRow key={rowId}>
              <TableCell>{formatDay(day)}</TableCell>
              <TableCell>
                {editingRow?.id === rowId ? (
                  <>
                    {timetable.map((time) => (
                      <Chip
                        style={{
                          marginRight: 4,
                          maxWidth: 'calc(100% - 4px)',
                        }}
                        key={time}
                        label={time}
                        size="small"
                        onDelete={console.log}
                      />
                    ))}

                    <IconButton size="small">
                      <AddCircleIcon style={{ fontSize: 16 }} />
                    </IconButton>
                  </>
                ) : (
                  timetable.join(' - ')
                )}
              </TableCell>
              <TableCell className={classes.actions}>
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
                    onClick={toggleEditMode(rowId, timetable)}
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
