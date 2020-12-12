import React, { FunctionComponent, useCallback } from 'react';

import {
  Chip,
  IconButton,
  makeStyles,
  TableCell,
  TableRow,
} from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import DaySelect, { DaySelectOption, formatDay } from './DaySelect';
import AddTimeButton from './AddTimeButton';
import Loader from '../common/Loader';

export interface TimetableRowProps {
  editMode?: boolean;
  daySelectOptions: DaySelectOption[];
  day: string;
  times: string[];
  loading?: boolean;
  disabled?: boolean;
  onChange?(day: string, times: string[]): any;
  onCancelUpdateClick?(): any;
  onAcceptUpdateClick?(): any;
  onEditClick?(): any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: 70,
  },
  dayColumn: {
    width: 188,
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

const TimetableRow: FunctionComponent<TimetableRowProps> = ({
  editMode,
  daySelectOptions,
  day,
  times,
  loading,
  disabled,
  onChange,
  onCancelUpdateClick,
  onAcceptUpdateClick,
  onEditClick,
}) => {
  const classes = useStyles();

  const updateDay = useCallback(
    (newDay: string) => {
      onChange?.(newDay, times);
    },
    [onChange, times],
  );

  const removeTime = useCallback(
    (time: string) => () => {
      onChange?.(
        day,
        times.filter((t) => t !== time),
      );
    },
    [day, onChange, times],
  );

  const addTime = useCallback(
    (time: string) => {
      onChange?.(
        day,
        [...times, time].sort((a, b) =>
          a.padStart(5, '0') < b.padStart(5, '0') ? -1 : 1,
        ),
      );
    },
    [day, onChange, times],
  );

  const handleCancelUpdateClick = useCallback(() => {
    onCancelUpdateClick?.();
  }, [onCancelUpdateClick]);

  const handleAcceptUpdateClick = useCallback(() => {
    onAcceptUpdateClick?.();
  }, [onAcceptUpdateClick]);

  const handleEditClick = useCallback(() => {
    onEditClick?.();
  }, [onEditClick]);

  return (
    <TableRow className={classes.root}>
      <TableCell className={classes.dayColumn}>
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
      <TableCell className={classes.actionsColumn}>
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
              {loading && <Loader size={24} />}
              <DoneIcon />
            </IconButton>
          </>
        ) : (
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
        )}
      </TableCell>
    </TableRow>
  );
};

export default TimetableRow;
