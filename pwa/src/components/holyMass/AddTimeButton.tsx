import React, { FunctionComponent, useCallback, useRef, useState } from 'react';

import { Button, IconButton, Popover } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { StaticTimePicker } from '@mui/x-date-pickers';

import { AddCircle as AddCircleIcon } from '@mui/icons-material';

export interface AddTimeButtonProps {
  onConfirm?(value: string): void;
}

const useStyles = makeStyles(theme => ({
  button: {
    fontSize: 16,
  },
  actions: {
    padding: theme.spacing(0, 1, 1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}));

const AddTimeButton: FunctionComponent<AddTimeButtonProps> = ({
  onConfirm,
}) => {
  const classes = useStyles();

  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const openTimePicker = useCallback(() => {
    setTimePickerOpen(true);
  }, []);

  const closeTimePicker = useCallback(() => {
    setTimePickerOpen(false);
    setSelectedTime(null);
  }, []);

  const handleTimeChange = useCallback((value: Date | null) => {
    setSelectedTime(value);
  }, []);

  const confirmTime = useCallback(() => {
    if (!selectedTime) {
      return;
    }

    onConfirm?.(
      `${selectedTime.getHours()}:${`${selectedTime.getMinutes()}`.padStart(
        2,
        '0',
      )}`,
    );
    setTimePickerOpen(false);
  }, [onConfirm, selectedTime]);

  return (
    <>
      <IconButton ref={buttonRef} size="small" onClick={openTimePicker}>
        <AddCircleIcon className={classes.button} />
      </IconButton>

      <Popover
        open={timePickerOpen}
        anchorEl={buttonRef.current}
        onClose={closeTimePicker}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <StaticTimePicker
          displayStaticWrapperAs="desktop"
          renderInput={() => null as any}
          value={selectedTime}
          onChange={handleTimeChange}
          minutesStep={5}
        />
        <div className={classes.actions}>
          <Button color="secondary" onClick={closeTimePicker}>
            Annulla
          </Button>
          <Button color="inherit" onClick={confirmTime}>
            Conferma
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default AddTimeButton;
