import type { RequestHandler } from 'express';

import { mongoDb } from '../../../../helpers/mongo';
import type { Fraternity } from '../../../../models/mongo';

export const getTimetables: RequestHandler = async (_, res) => {
  const db = await mongoDb;
  const fraternitiesCollection = db.collection<Fraternity>('fraternities');

  const fraternities = await fraternitiesCollection.find().toArray();

  res.json(
    fraternities.map(({ _id, seats, ...rest }) => ({
      fraternityId: _id.toHexString(),
      ...rest,
    })),
  );
};
