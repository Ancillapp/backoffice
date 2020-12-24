import type { RequestHandler } from 'express';

import { mongoDb, ObjectId } from '../../../helpers/mongo';
import { firebase } from '../../../helpers/firebase';
import type { HolyMass } from '../../../models/mongo';

export const getNextDaysBookings: RequestHandler = async (
  { query: { days = '3', fullData } },
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
    .aggregate<{
      date: Date;
      fraternity: {
        id: ObjectId;
        location: string;
        seats: number;
      };
      bookings: {
        userId: string;
        seats: number;
        bookingId: string;
      }[];
    }>([
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
          unflattenedBookings: {
            $push: '$filteredParticipants',
          },
        },
      },
      {
        $addFields: {
          bookings: {
            $reduce: {
              input: '$unflattenedBookings',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
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
      {
        $sort: {
          date: 1,
        },
      },
    ])
    .toArray();

  const response =
    typeof fullData === 'undefined'
      ? result.map(({ bookings, ...rest }) => ({
          bookings: bookings.reduce((sum, { seats }) => sum + seats, 0),
          ...rest,
        }))
      : await Promise.all(
          result.map(async ({ bookings, ...rest }) => {
            const { users } = await firebase
              .auth()
              .getUsers(bookings.map(({ userId }) => ({ uid: userId })));

            return {
              bookings: bookings.map(({ seats }, index) => ({
                user: {
                  id: users[index].uid,
                  email: users[index].email,
                },
                seats,
              })),
              ...rest,
            };
          }),
        );

  res.json(response);
};
