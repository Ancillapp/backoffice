import type { RequestHandler } from 'express';

import { mongoDb } from '../../../helpers/mongo';
import type { HolyMass } from '../../../models/mongo';

export const getNextDaysBookings: RequestHandler = async (
  { query: { days = '3' } },
  res,
) => {
  const db = await mongoDb;
  const holyMassesCollection = db.collection<HolyMass>('holyMasses');

  const startDate = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }),
  );
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + Number(days));

  const result = await holyMassesCollection
    .aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: 1,
          fraternity: 1,
          filteredParticipants: {
            $filter: {
              input: '$participants',
              as: 'participant',
              cond: {
                $ne: ['$$participant.deleted', true],
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          fraternity: {
            $first: '$fraternity',
          },
          bookings: {
            $sum: {
              $size: '$filteredParticipants',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          fraternity: 1,
          bookings: 1,
        },
      },
    ])
    .toArray();

  res.json(result);
};
