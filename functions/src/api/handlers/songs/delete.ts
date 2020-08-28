import { mongoDb } from '../../../helpers/mongo';
import { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const deleteSong: RequestHandler = async (
  { params: { number } },
  res,
) => {
  const db = await mongoDb;
  const songsCollection = db.collection<Song>('songs');

  const response = await songsCollection.findOneAndDelete({ number });

  if (!response.value) {
    res.status(404).send();
    return;
  }

  res.json(response.value);
};
