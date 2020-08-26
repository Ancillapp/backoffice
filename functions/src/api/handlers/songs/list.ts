import { mongoDb } from '../../../helpers/mongo';
import { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const getSongs: RequestHandler = async (
  { query: { fullData } },
  res,
) => {
  res.set(
    'Cache-Control',
    'public, max-age=1800, s-maxage=3600, stale-while-revalidate=3600',
  );

  const db = await mongoDb;
  const songsCollection = db.collection<Song>('songs');

  const songs = (await songsCollection
    .find(
      {},
      {
        projection: {
          _id: 0,
          number: 1,
          title: 1,
          language: 1,
          ...(typeof fullData !== 'undefined' && {
            content: 1,
          }),
        },
      },
    )
    .toArray()) as Song[];

  res.json(
    songs.sort(({ number: a }, { number: b }) => {
      const normalizedA = a.slice(2).replace('bis', '').padStart(4, '0');
      const normalizedB = b.slice(2).replace('bis', '').padStart(4, '0');

      if (normalizedA === normalizedB) {
        return b.endsWith('bis') ? -1 : 1;
      }

      return normalizedA < normalizedB ? -1 : 1;
    }),
  );
};
