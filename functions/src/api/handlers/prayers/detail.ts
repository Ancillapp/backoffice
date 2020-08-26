import { mongoDb } from '../../../helpers/mongo';

import type { RequestHandler } from 'express';

export const getPrayer: RequestHandler = async ({ params: { slug } }, res) => {
  res.set(
    'Cache-Control',
    'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
  );

  const db = await mongoDb;
  const prayersCollection = db.collection('prayers');

  const prayer = await prayersCollection.findOne(
    { slug },
    {
      projection: {
        _id: 0,
      },
    },
  );

  if (!prayer) {
    res.status(404).send();
    return;
  }

  res.json(prayer);
};
