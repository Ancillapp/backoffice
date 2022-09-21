import { update, SongIdFields } from '../../../services/song';
import type { Song } from '../../../models/mongo';

import type { RequestHandler } from 'express';

export const updateSong: RequestHandler<
  SongIdFields,
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
    { language, category, number },
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
