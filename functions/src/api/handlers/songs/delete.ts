import { remove, SongIdFields } from '../../../services/song';
import { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const deleteSong: RequestHandler<SongIdFields, Song> = async (
  { params: { language, category, number } },
  res,
) => {
  const deletedSong = await remove({ language, category, number });

  if (!deletedSong) {
    res.status(404).send();
    return;
  }

  res.json(deletedSong);
};
