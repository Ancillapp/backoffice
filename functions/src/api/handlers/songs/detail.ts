import { get, SongIdFields } from '../../../services/song';
import type { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const getSong: RequestHandler<SongIdFields, Song> = async (
  { params: { language, category, number } },
  res,
) => {
  const song = await get({ language, category, number });

  if (!song) {
    res.status(404).send();
    return;
  }

  res.json(song);
};
