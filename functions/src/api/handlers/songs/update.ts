import { mongoDb } from '../../../helpers/mongo';
import { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const updateSong: RequestHandler = async (
  { params: { number }, body: { number: newNumber, title, content } },
  res,
) => {
  const db = await mongoDb;
  const songsCollection = db.collection<Song>('songs');

  if (!newNumber && !title && !content) {
    res.status(400).send();
    return;
  }

  const response = await songsCollection.findOneAndUpdate(
    { number },
    {
      $set: {
        ...(newNumber && { number: newNumber }),
        ...(title && { title }),
        ...(content && { content }),
      },
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
