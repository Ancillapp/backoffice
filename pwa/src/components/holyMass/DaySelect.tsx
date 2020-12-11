import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import clsx from 'clsx';

import {
  Button,
  ListSubheader,
  makeStyles,
  MenuItem,
  Popover,
  TextField,
} from '@material-ui/core';

import { StaticDatePicker } from '@material-ui/lab';

import { toIsoDate } from '../../helpers/dates';

export type DaySelectOption =
  | 'default'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday'
  | 'recurring'
  | 'specific';

export interface DaySelectProps {
  options: DaySelectOption[];
  value?: string;
  onChange?(newValue: string): void;
}

const shortDateFormatter = new Intl.DateTimeFormat('it', {
  month: 'short',
  day: 'numeric',
});

const fullDateFormatter = new Intl.DateTimeFormat('it', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const daysTranslationMap: Record<
  Exclude<DaySelectOption, 'recurring' | 'specific'>,
  string
> = {
  default: 'Default',
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

export const formatDay = (day: string) => {
  if (day in daysTranslationMap) {
    return daysTranslationMap[
      day as Exclude<DaySelectOption, 'recurring' | 'specific'>
    ];
  }

  if (/^\d{2}-\d{2}$/.test(day)) {
    return shortDateFormatter.format(
      new Date(`${new Date().getFullYear()}-${day}`),
    );
  }

  return fullDateFormatter.format(new Date(day));
};

const useStyles = makeStyles((theme) => ({
  select: {
    cursor: 'pointer',
  },
  actions: {
    width: 320,
    padding: theme.spacing(0, 1, 1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // FIXME: there are huge hacks, but I couldn't find a better way to remove the year label and fix the broken button colors
  datePicker: {
    '& [class*="MuiPickersMonth"]': {
      color: theme.palette.text.primary,
      background: theme.palette.background.paper,
      border: 'none',

      '&.Mui-selected': {
        color: theme.palette.primary.main,
      },
    },
  },
  shortDatePicker: {
    '& [class*="MuiPickersCalendarHeader"] > div[role="presentation"] > div:nth-child(2)': {
      display: 'none',
    },
  },
}));

const mapValueToOption = (value: string): DaySelectOption => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return 'specific';
  }

  if (/^\d{2}-\d{2}$/.test(value)) {
    return 'recurring';
  }

  return value as DaySelectOption;
};

const mapValueToDate = (value: string): Date => {
  if (value === 'default' || value === 'recurring' || value === 'specific') {
    return new Date();
  }

  if (/^\d{2}-\d{2}$/.test(value)) {
    return new Date(`${new Date().getFullYear()}-${value}`);
  }

  return new Date(value);
};

const DaySelect: FunctionComponent<DaySelectProps> = ({
  options,
  value = 'default',
  onChange,
}) => {
  const classes = useStyles();

  const weekdays = useMemo(
    () =>
      options.filter(
        (option) =>
          option !== 'default' &&
          option !== 'recurring' &&
          option !== 'specific',
      ) as Exclude<DaySelectOption, 'default' | 'recurring' | 'specific'>[],
    [options],
  );

  const textFieldRef = useRef<HTMLInputElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(mapValueToOption(value));
  const [selectedDate, setSelectedDate] = useState(mapValueToDate(value));

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setSelectedOption(mapValueToOption(value));
    setSelectedDate(mapValueToDate(value));
  }, [value]);

  const handleOptionClick = useCallback(
    (option: DaySelectOption) => () => {
      setSelectedOption(option);
    },
    [],
  );

  const handleDateChange = useCallback((value: Date | null) => {
    setSelectedDate(value || new Date());
  }, []);

  const confirmUpdate = useCallback(() => {
    if (selectedOption === 'recurring') {
      onChange?.(toIsoDate(selectedDate).slice(5));
    } else if (selectedOption === 'specific') {
      onChange?.(toIsoDate(selectedDate));
    } else {
      onChange?.(selectedOption);
    }

    setMenuOpen(false);
  }, [onChange, selectedDate, selectedOption]);

  return (
    <>
      <TextField
        ref={textFieldRef}
        variant="outlined"
        size="small"
        InputProps={{ readOnly: true }}
        inputProps={{ className: classes.select }}
        value={formatDay(value)}
        onClick={openMenu}
      />

      <Popover
        open={menuOpen}
        anchorEl={textFieldRef.current}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {options.includes('default') && (
          <MenuItem
            value="default"
            selected={selectedOption === 'default'}
            onClick={handleOptionClick('default')}
          >
            Default
          </MenuItem>
        )}
        {weekdays.length > 0 && (
          <ListSubheader>Giorni della settimana</ListSubheader>
        )}
        {weekdays.map((weekday) => (
          <MenuItem
            key={weekday}
            value={weekday}
            selected={selectedOption === weekday}
            onClick={handleOptionClick(weekday)}
          >
            {daysTranslationMap[weekday]}
          </MenuItem>
        ))}
        <ListSubheader>Festività/Solennità</ListSubheader>
        <MenuItem
          value="recurring"
          selected={selectedOption === 'recurring'}
          onClick={handleOptionClick('recurring')}
        >
          Ricorrente
        </MenuItem>
        <MenuItem
          value="specific"
          selected={selectedOption === 'specific'}
          onClick={handleOptionClick('specific')}
        >
          Specifica
        </MenuItem>
        {(selectedOption === 'recurring' || selectedOption === 'specific') && (
          <StaticDatePicker
            className={clsx(
              classes.datePicker,
              selectedOption === 'recurring' && classes.shortDatePicker,
            )}
            displayStaticWrapperAs="desktop"
            views={
              selectedOption === 'specific'
                ? ['year', 'month', 'date']
                : ['month', 'date']
            }
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={() => null as any}
          />
        )}
        <div className={classes.actions}>
          <Button color="secondary" onClick={closeMenu}>
            Annulla
          </Button>
          <Button color="inherit" onClick={confirmUpdate}>
            Conferma
          </Button>
        </div>
      </Popover>
    </>
  );
};

export default DaySelect;
