import { chunk } from '../../../helpers/utils';

const CHUNK_SIZE = 4;

export const getDateRange = (days: number, ...metrics: string[]) =>
  chunk(
    Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (index + 1));

      return date.toISOString().slice(0, 10);
    }),
    CHUNK_SIZE,
  ).map((datesChunk) => ({
    metrics: metrics.map((metric) => ({ name: metric })),
    dateRanges: datesChunk.map((date) => ({
      name: date,
      startDate: date,
      endDate: date,
    })),
  }));
