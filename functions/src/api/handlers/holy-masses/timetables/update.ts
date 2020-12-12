import type { RequestHandler } from 'express';

import { mongoDb, ObjectId } from '../../../../helpers/mongo';
import type { Fraternity } from '../../../../models/mongo';

export const updateTimetable: RequestHandler = async (
  { params: { fraternityId }, body },
  res,
) => {
  if (typeof body !== 'object' || body === null) {
    res.status(400).send();
  }

  // It isnt' really necessary to sort the days. However, it makes it much easier
  // to read and understand them even when observing them directly on the DB
  const {
    default: defaultTimetable,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    overrides,
  }: Fraternity['masses'] = body;

  const masses: Fraternity['masses'] = {
    ...(defaultTimetable && { default: defaultTimetable }),
    ...(monday && { monday }),
    ...(tuesday && { tuesday }),
    ...(wednesday && { wednesday }),
    ...(thursday && { thursday }),
    ...(friday && { friday }),
    ...(saturday && { saturday }),
    ...(sunday && { sunday }),
    ...(overrides && {
      overrides: Object.fromEntries(
        Object.entries(overrides).sort(([a], [b]) =>
          a.padStart(10, '0') < b.padStart(10, '0') ? -1 : 1,
        ),
      ),
    }),
  };

  const db = await mongoDb;
  const fraternitiesCollection = db.collection<Fraternity>('fraternities');

  const response = await fraternitiesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(fraternityId),
    },
    {
      $set: { masses },
    },
    {
      returnOriginal: false,
    },
  );

  if (!response.value) {
    res.status(404).send();
    return;
  }

  res.json(response.value);
};
