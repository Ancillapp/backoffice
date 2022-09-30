import { remove } from '../../../services/song';
import { Song, SongCategory, SongLanguage } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export interface DeleteSongParams extends Record<string, string> {
  language: SongLanguage;
  category: SongCategory;
  number: string;
}

export const deleteSong: RequestHandler<DeleteSongParams, Song> = async (
  { params: { language, category, number } },
  res,
) => {
  const deletedSong = await remove({
    language,
    category,
    number: Number(number),
  });

  if (!deletedSong) {
    res.status(404).send();
    return;
  }

  res.json(deletedSong);
};
