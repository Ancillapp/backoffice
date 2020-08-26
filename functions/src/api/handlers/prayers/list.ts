import { mongoDb } from '../../../helpers/mongo';

import type { RequestHandler } from 'express';

export const getPrayers: RequestHandler = async (
  { query: { fullData } },
  res,
) => {
  res.set(
    'Cache-Control',
    'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
  );

  const db = await mongoDb;
  const prayersCollection = db.collection('prayers');

  const prayers = await prayersCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          slug: 1,
          title: 1,
          image: 1,
          ...(typeof fullData !== 'undefined' && {
            content: 1,
          }),
        },
      },
    )
    .toArray();

  res.json(prayers);
};
