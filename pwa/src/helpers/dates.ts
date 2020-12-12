export const dateFormatter = new Intl.DateTimeFormat('it', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export const timeFormatter = new Intl.DateTimeFormat('it', {
  hour: 'numeric',
  minute: '2-digit',
});

export const dateTimeFormatter = new Intl.DateTimeFormat('it', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
});

export const toLocalTimeZone = (date: Date) => {
  const todayInCurrentTimeZone = new Date();

  const dateInCurrentTimeZone = new Date(date);

  dateInCurrentTimeZone.setHours(
    dateInCurrentTimeZone.getHours() +
      todayInCurrentTimeZone.getTimezoneOffset() / 60,
  );

  return dateInCurrentTimeZone;
};

export const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
    2,
    '0',
  )}-${`${date.getDate()}`.padStart(2, '0')}`;
