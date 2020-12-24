import React, { FunctionComponent, useCallback } from 'react';

import {
  Chip,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import DaySelect, { DaySelectOption, formatDay } from './DaySelect';
import AddTimeButton from './AddTimeButton';
import Loader from '../common/Loader';

export interface TimetableRowChangeEventData {
  day?: string;
  times?: string[];
}

export interface TimetableRowProps {
  editMode?: boolean;
  daySelectOptions: DaySelectOption[];
  day?: string;
  times?: string[];
  loading?: boolean;
  disabled?: boolean;
  onChange?(data: TimetableRowChangeEventData): any;
  onCancelUpdateClick?(): any;
  onAcceptUpdateClick?(): any;
  onDeleteClick?(): any;
  onEditClick?(): any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 70,
  },
  actionsColumn: {
    width: 96,
    textAlign: 'center',
  },
  chip: {
    margin: theme.spacing(0.5, 0.5, 0.5, 0),
    maxWidth: `calc(100% - ${theme.spacing(0.5)})`,
  },
}));

// TODO: split this component into two separate components for view mode and edit mode
const TimetableRow: FunctionComponent<TimetableRowProps> = ({
  editMode,
  daySelectOptions,
  day,
  times = [],
  loading,
  disabled,
  onChange,
  onCancelUpdateClick,
  onAcceptUpdateClick,
  onDeleteClick,
  onEditClick,
}) => {
  const classes = useStyles();

  const updateDay = useCallback(
    (newDay: string) => {
      onChange?.({ day: newDay, times });
    },
    [onChange, times],
  );

  const removeTime = useCallback(
    (time: string) => () => {
      onChange?.({
        day,
        times: times.filter((t) => t !== time),
      });
    },
    [day, onChange, times],
  );

  const addTime = useCallback(
    (time: string) => {
      onChange?.({
        day,
        times: [...times, time].sort((a, b) =>
          a.padStart(5, '0') < b.padStart(5, '0') ? -1 : 1,
        ),
      });
    },
    [day, onChange, times],
  );

  const handleCancelUpdateClick = useCallback(() => {
    onCancelUpdateClick?.();
  }, [onCancelUpdateClick]);

  const handleAcceptUpdateClick = useCallback(() => {
    onAcceptUpdateClick?.();
  }, [onAcceptUpdateClick]);

  const handleDeleteClick = useCallback(() => {
    onDeleteClick?.();
  }, [onDeleteClick]);

  const handleEditClick = useCallback(() => {
    onEditClick?.();
  }, [onEditClick]);

  return (
    <TableRow className={classes.root}>
      <TableCell width={188}>
        {editMode ? (
          <DaySelect
            options={daySelectOptions}
            value={day}
            onChange={updateDay}
          />
        ) : (
          formatDay(day)
        )}
      </TableCell>
      <TableCell>
        {editMode ? (
          <>
            {times.map((time) => (
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
          times.join(' - ')
        )}
      </TableCell>
      <TableCell width={96} align="center">
        {editMode ? (
          <>
            <IconButton
              size="small"
              aria-label="annulla"
              type="reset"
              form="edit-time-form"
              key="cancel-editing-time-button"
              onClick={handleCancelUpdateClick}
              disabled={loading}
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
              onClick={handleAcceptUpdateClick}
              disabled={loading}
            >
              {loading && <Loader size={18} />}
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              size="small"
              aria-label="elimina"
              onClick={handleDeleteClick}
              disabled={disabled}
              key="delete-time-button"
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              size="small"
              edge="end"
              aria-label="modifica"
              onClick={handleEditClick}
              disabled={disabled}
              key="edit-time-button"
            >
              <EditIcon />
            </IconButton>
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default TimetableRow;
