import { get } from '../../../services/song';
import type { Song, SongCategory, SongLanguage } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export interface GetSongParams extends Record<string, string> {
  language: SongLanguage;
  category: SongCategory;
  number: string;
}

export const getSong: RequestHandler<GetSongParams, Song> = async (
  { params: { language, category, number } },
  res,
) => {
  const song = await get({ language, category, number: Number(number) });

  if (!song) {
    res.status(404).send();
    return;
  }

  res.json(song);
};
