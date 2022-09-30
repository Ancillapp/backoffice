import { update } from '../../../services/song';
import type { Song, SongCategory, SongLanguage } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export interface UpdateSongParams extends Record<string, string> {
  language: SongLanguage;
  category: SongCategory;
  number: string;
}

export const updateSong: RequestHandler<
  UpdateSongParams,
  Song,
  Partial<Song>
> = async (
  {
    params: { language, category, number },
    body: {
      language: newLanguage,
      category: newCategory,
      number: newNumber,
      title,
      content,
    },
  },
  res,
) => {
  if (!newLanguage && !newCategory && !newNumber && !title && !content) {
    res.status(400).send();
    return;
  }

  const updatedSong = await update(
    { language, category, number: Number(number) },
    {
      language: newLanguage,
      category: newCategory,
      number: newNumber,
      title,
      content,
    },
  );

  if (!updatedSong) {
    res.status(404).send();
    return;
  }

  res.json(updatedSong);
};
